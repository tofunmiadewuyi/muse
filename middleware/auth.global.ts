import type { CookieRef } from "#app";
import { useAuth } from "~/composables/useAuth";

export default defineNuxtRouteMiddleware(async (to) => {
  const { logOut } = useAuth();
  const accessToken = useCookie("accessToken");

  if (accessToken.value) {
    if (to.path === "/") return navigateTo("/dashboard");
    return;
  } else {
    if (to.path === "/callback" || to.path === "/logout") return;

    if (to.path !== "/") logOut();
    return;
  }
});
