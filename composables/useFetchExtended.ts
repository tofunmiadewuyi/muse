import type { FetchError } from "ofetch";
import { defu } from "defu";
import type { UseFetchOptions, AsyncData } from "#app";
import { useAuth } from "./useAuth";
interface QueuedRequest<T> {
  url: string;
  options: any;
  resolve: (value: UseFetchReturn<T> | PromiseLike<UseFetchReturn<T>>) => void;
  reject: (reason?: any) => void;
}

type UseFetchReturn<T> = AsyncData<T | null, FetchError | null>;

const isRefreshing: Ref<boolean> = ref(false);
const requestQueue: QueuedRequest<any>[] = [];

async function processQueue() {
  const queue = [...requestQueue];
  requestQueue.length = 0;

  for (const request of queue) {
    try {
      const response = await useFetch(request.url, request.options);
      request.resolve(response as UseFetchReturn<any>);
    } catch (error) {
      request.reject(error);
    }
  }
}

export const useFetchExtended = async <T>(
  url: string,
  options?: UseFetchOptions<T>
): Promise<UseFetchReturn<T>> => {
  const config = useRuntimeConfig();
  const accessToken = useCookie("accessToken");
  const expires = useCookie<number>("tokenExpire");

  const defaults: UseFetchOptions<T> = {
    baseURL: config.public.baseURL,

    retryDelay: 500,

    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },

    onRequestError: ({ error }) => {
      if (import.meta.client) {
        if (navigator.onLine) {
          useToast(error.message);
        } else {
          useToast("You are offline.");
        }
      }
    },
  };

  const reqOptions = defu(options, defaults);

  const { getFreshToken } = useAuth();

  async function handle401Error() {
    const res = await getFreshToken();
    if (res === "success") {
      isRefreshing.value = false;
      await processQueue();
    } else {
      throw new Error("Token refresh failed");
    }
  }

  const tokenExpired = (expiresAt: number): boolean => {
    return Date.now() > expiresAt - 300000; // if it expires in the next 5mins
  };

  if (accessToken.value) {
    if (tokenExpired(expires.value)) {
      await getFreshToken();
    }
  }

  if (isRefreshing.value) {
    return new Promise((resolve, reject) => {
      requestQueue.push({
        url,
        options: reqOptions,
        resolve,
        reject,
      });
    });
  }

  return new Promise((resolve, reject) => {
    useFetch<T>(url, reqOptions as any)
      .then((reqRes) => {
        if (reqRes.error.value?.statusCode === 401) {
          isRefreshing.value = true;
          requestQueue.push({ url, options: reqOptions, resolve, reject });
          handle401Error().catch(reject);
        } else {
          resolve(reqRes as UseFetchReturn<T>);
        }
      })
      .catch(reject);
  });
};
