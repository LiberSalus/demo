export const DEV_AUTH_BRIDGE = import.meta.env.VITE_DEV_AUTH_BRIDGE === "1";
const DEV_LOGOUT_PARAM = "dev_logout";

export function getLoginUrl() {
  const loginUrl = import.meta.env.VITE_LOGIN_URL?.trim() || "/panel/login";

  if (!DEV_AUTH_BRIDGE || typeof window === "undefined") {
    return loginUrl;
  }

  const url = new URL(loginUrl, window.location.origin);
  url.searchParams.set(DEV_LOGOUT_PARAM, "1");

  return url.toString();
}
