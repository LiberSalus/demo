export function getLoginUrl() {
  return import.meta.env.VITE_LOGIN_URL?.trim() || "/panel/login";
}
