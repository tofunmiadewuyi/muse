export const useSpotifyAuth = () => {
  const clientId = useRuntimeConfig().public.clientId;
  const redirectUri = useRuntimeConfig().public.redirectURL;

  const cookie = useCookie("accessToken");
  const route = useRoute();

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

  const base64urlencode = (a: any) => {
    const uint8Array = new Uint8Array(a);
    const byteArray = Array.from(uint8Array);
    return btoa(String.fromCharCode.apply(null, byteArray))
      .replace(/\+/g, "-")
      .replace(/\//g, "_")
      .replace(/=+$/, "");
  };

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
      scope: "user-read-private user-read-email",
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
        const token = await $fetch<{
          access_token: string;
        }>("https://accounts.spotify.com/api/token", {
          method: "POST",
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          body: body,
        });

        if (token && token.access_token) {
          cookie.value = token.access_token;
        } else {
          console.error("Failed to get access token");
        }
      } catch (error) {
        console.error("Error getting access token:", error);
      }
    }
  };

  return {
    login,
    handleCallback,
  };
};
