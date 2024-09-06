import type { FetchOptions } from "ofetch";
import { defu } from "defu";
import type { UseFetchOptions } from "#app";

export const useFetchExtended = <T>(
  url: string,
  options?: UseFetchOptions<T>
) => {
  const config = useRuntimeConfig();

  const accessToken = useCookie("accessToken");

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.baseURL,
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  };

  return useFetch(url, defu(options, defaults));
};
