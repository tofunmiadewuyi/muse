export default defineNuxtRouteMiddleware(async (to) => {
  const cookie = useCookie("accessToken");

  if (cookie.value) {
    if (to.path === "/") return navigateTo("/dashboard");
    return;
  } else {
    if (to.path === "/callback" || to.path === "/logout") return;
    cookie.value = null;
    if (to.path !== "/") return navigateTo("/");
    return;
  }
});
