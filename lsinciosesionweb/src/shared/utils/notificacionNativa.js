export function notificar(titulo, opciones = {}) {
  if (!("Notification" in window)) return
  if (Notification.permission === "granted") {
    new Notification(titulo, opciones)
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then((permiso) => {
      if (permiso === "granted") new Notification(titulo, opciones)
    })
  }
}

export function pedirPermisoNotificaciones() {
  if (!("Notification" in window)) return Promise.resolve(false)
  if (Notification.permission === "granted") return Promise.resolve(true)
  if (Notification.permission === "denied") return Promise.resolve(false)
  return Notification.requestPermission().then((p) => p === "granted")
}
