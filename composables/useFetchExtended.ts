import type { FetchOptions, FetchResponse } from "ofetch";
import { defu } from "defu";
import type { UseFetchOptions } from "#app";
interface QueuedRequest {
  url: string;
  options: any;
}

const isRefreshing: Ref<boolean> = ref(false);
const requestQueue: QueuedRequest[] = [];

async function processQueue() {
  const queue = [...requestQueue];
  requestQueue.length = 0;

  for (const request of queue) {
    try {
      const response = await useFetch(request.url, request.options);
      return response;
    } catch (error) {
      console.error(error);
    }
  }
}

async function handle401Error() {
  const res = await getFreshToken();
  if (res === "success") {
    isRefreshing.value = false;
    return await processQueue();
  }
}

export const useFetchExtended = <T>(
  url: string,
  options?: UseFetchOptions<T>
) => {
  const config = useRuntimeConfig();
  const accessToken = useCookie("accessToken");

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.baseURL,

    retryDelay: 500,

    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
  };

  const reqOptions = defu(options, defaults);

  if (isRefreshing.value) {
    requestQueue.push({ url, options: reqOptions });
    return;
  }

  const reqRes = useFetch(url, reqOptions);

  if (reqRes.error.value?.statusCode === 401) {
    isRefreshing.value = true;
    requestQueue.push({ url, options: reqOptions });
    return handle401Error();
  }

  return reqRes;
};
