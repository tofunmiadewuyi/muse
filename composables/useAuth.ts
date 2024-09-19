import type { CookieRef } from "#app";
import type { Token } from "~/types/assets";

export const useAuth = () => {
  const config = useRuntimeConfig();
  const router = useRouter();
  const userCookie = useCookie("user");
  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");
  const expiresToken = useCookie<Token["expires_in"] | null>("tokenExpire");

  const logOut = () => {
    userCookie.value = null;
    accessToken.value = null;
    refreshToken.value = null;
    expiresToken.value = null;

    router.push("/");
  };

  const getFreshToken = async () => {
    const body = new URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken.value as Token["refresh_token"],
      client_id: config.public.clientId,
    });

    const data = await $fetch<Token>("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    });

    if (data) {
      accessToken.value = data.access_token;
      refreshToken.value = data.refresh_token;
      expiresToken.value = Date.now() + data.expires_in * 1000;
      console.log("fresh token set");
      return "success";
    }
  };

  return {
    logOut,
    getFreshToken,
  };
};
