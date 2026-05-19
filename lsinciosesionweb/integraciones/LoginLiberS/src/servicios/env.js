export const DEV_AUTH_BRIDGE = import.meta.env.VITE_DEV_AUTH_BRIDGE === '1'

export function obtenerDashboardBaseUrl() {
  return import.meta.env.VITE_DASHBOARD_URL?.trim() || '/panel/inicio'
}

