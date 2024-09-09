import type { CookieRef } from "#app";
import type { Token } from "~/types/assets";

export default defineNuxtRouteMiddleware(async (to) => {
  const accessToken = useCookie("accessToken");
  const expires = useCookie<number>("tokenExpire");

  const tokenExpired = (expiresAt: number): boolean => {
    return Date.now() > expiresAt - 300000; // if it expires in the next 5mins
  };

  if (accessToken.value) {
    // if (tokenExpired(expires.value)) {
    //   await getFreshToken();
    // }
    if (to.path === "/") return navigateTo("/dashboard");
    return;
  } else {
    if (to.path === "/callback" || to.path === "/logout") return;

    if (to.path !== "/") logOut();
    return;
  }
});
