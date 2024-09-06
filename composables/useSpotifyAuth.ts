import type { CookieRef } from "#app";
import type { SpotifyUser, Token } from "~/types/assets";

const scopes = `user-read-private user-read-email user-read-recently-played user-read-currently-playing playlist-read-private playlist-read-collaborative streaming user-modify-playback-state user-read-playback-state user-read-currently-playing user-top-read playlist-modify-private playlist-modify-public 
`;

const scopesIMayNeed = `
ugc-image-upload
user-read-playback-state

user-follow-read
user-follow-modify
user-library-read
user-library-modify
`;

export const useSpotifyAuth = () => {
  const clientId = useRuntimeConfig().public.clientId;
  const redirectUri = useRuntimeConfig().public.redirectURL;
  const baseURL = useRuntimeConfig().public.baseURL;

  const accessToken: CookieRef<Token["access_token"]> =
    useCookie("accessToken");
  const refreshToken: CookieRef<Token["refresh_token"]> =
    useCookie("refreshToken");
  const expiresToken: CookieRef<Token["expires_in"]> = useCookie("tokenExpire");
  const route = useRoute();

  const login = async () => {
    const codeVerifier = generateCodeVerifier();
    const hashed = await sha256(codeVerifier);
    const codeChallenge = base64urlencode(hashed);

    localStorage.setItem("code_verifier", codeVerifier);

    const params = new URLSearchParams({
      client_id: clientId,
      response_type: "code",
      redirect_uri: redirectUri,
      code_challenge_method: "S256",
      code_challenge: codeChallenge,
      scope: scopes,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  const handleCallback = async () => {
    const code = route.query.code;
    if (code) {
      const codeVerifier = localStorage.getItem("code_verifier");
      const body = new URLSearchParams({
        grant_type: "authorization_code",
        code: code as string,
        redirect_uri: redirectUri,
        client_id: clientId,
        code_verifier: codeVerifier as string,
      });

      try {
        const token = await $fetch<Token>(
          "https://accounts.spotify.com/api/token",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/x-www-form-urlencoded",
            },
            body: body,
          }
        );

        if (token) {
          accessToken.value = token.access_token;
          refreshToken.value = token.refresh_token;
          expiresToken.value = Date.now() + token.expires_in * 1000;
          return "success";
        } else {
          console.error("Failed to get access token");
        }
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    }
  };

  const getUser = async () => {
    const user = await $fetch<SpotifyUser>(`${baseURL}/v1/me`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
    });

    const userCookie = useCookie("user");
    userCookie.value = JSON.stringify(user);
  };

  return {
    login,
    getUser,
    handleCallback,
  };
};

const base64urlencode = (a: any) => {
  const uint8Array = new Uint8Array(a);
  const byteArray = Array.from(uint8Array);
  return btoa(String.fromCharCode.apply(null, byteArray))
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
};

const generateCodeVerifier = () => {
  const array = new Uint32Array(56 / 2);
  window.crypto.getRandomValues(array);
  return Array.from(array, (dec) => ("0" + dec.toString(16)).substr(-2)).join(
    ""
  );
};

const sha256 = async (plain: any) => {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  return window.crypto.subtle.digest("SHA-256", data);
};
