import type { CookieRef } from "#app";
import type { UseFetchOptions } from "#app";
import { merge } from "lodash";
import type { Token } from "~/types/assets";

export const useFetchExtended = async <T>(
  url: string,
  options?: UseFetchOptions<T>
) => {
  const baseURL = useRuntimeConfig().public.baseURL;

  const accessToken = useCookie("accessToken");
  const expiresToken: CookieRef<Token["expires_in"]> = useCookie("tokenExpire");

  const defaults = {
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  };

  const isTokenExpired = (expiresAt: number): boolean => {
    return Date.now() < expiresAt - 300000; // if it expires in the next 5mins
  };

  const res = useFetch(`${baseURL}${url}`, merge(defaults, options));

  if (isTokenExpired(expiresToken.value)) {
    // await getFreshToken();
  }

  return res;
};

const getFreshToken = async () => {
  const clientId = useRuntimeConfig().public.clientId;

  const refreshToken: CookieRef<Token["refresh_token"]> =
    useCookie("refreshToken");
  const accessToken = useCookie("accessToken");
  const expiresToken: CookieRef<Token["expires_in"]> = useCookie("tokenExpire");

  const body = new URLSearchParams({
    grant_type: "refresh_token",
    refresh_token: refreshToken.value ?? "",
    client_id: clientId,
  });

  const { data } = await useFetch<Token>(
    "https://accounts.spotify.com/api/token",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: body,
    }
  );

  if (data.value) {
    console.log("fresh token set");
    accessToken.value = data.value.access_token;
    refreshToken.value = data.value.refresh_token;
    expiresToken.value = Date.now() + data.value?.expires_in * 1000;
  }
};
