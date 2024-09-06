export const logOut = () => {
  const userCookie = useCookie("user");
  const accessToken = useCookie("accessToken");
  const refreshToken = useCookie("refreshToken");
  const expiresAt = useCookie("tokenExpire");
  const deviceId = useCookie("deviceId");

  userCookie.value = null;
  accessToken.value = null;
  refreshToken.value = null;
  expiresAt.value = null;

  navigateTo("/");
};
