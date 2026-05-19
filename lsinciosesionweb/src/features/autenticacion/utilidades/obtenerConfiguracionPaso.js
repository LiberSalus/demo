export function obtenerConfiguracionPaso(pasos, pasoActual) {
  return pasos[pasoActual] ?? pasos.registroCuenta
}
