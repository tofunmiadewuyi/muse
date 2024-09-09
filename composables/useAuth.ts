import type { CookieRef } from "#app";
import type { Token } from "~/types/assets";

export const logOut = () => {
  const router = useRouter();
  const userCookie = useCookie("user");
  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");
  const expiresAt = useCookie("tokenExpire");
  const deviceId = useCookie("deviceId");

  userCookie.value = null;
  accessToken.value = null;
  refreshToken.value = null;
  expiresAt.value = null;

  router.push("/");
};

export const getFreshToken = async () => {
  const clientId = useRuntimeConfig().public.clientId;

  const accessToken: CookieRef<Token["access_token"]> =
    useCookie("accessToken");
  const refreshToken: CookieRef<Token["refresh_token"]> =
    useCookie("refreshToken");
  const expiresToken: CookieRef<Token["expires_in"]> = useCookie("tokenExpire");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken.value,
    client_id: clientId,
  });

  const data = await $fetch<Token>("https://accounts.spotify.com/api/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: body,
  });

  if (data) {
    console.log("fresh token set");
    accessToken.value = data.access_token;
    refreshToken.value = data.refresh_token;
    expiresToken.value = Date.now() + data.expires_in * 1000;
    return "success";
  }
};
