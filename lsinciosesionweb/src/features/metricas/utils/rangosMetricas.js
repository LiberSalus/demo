// Calcula minimo y maximo ignorando valores no numericos.
export function obtenerMinMax(valores = []) {
  const valoresValidos = valores.filter((valor) => Number.isFinite(valor));

  if (!valoresValidos.length) {
    return { min: null, max: null };
  }

  return {
    min: Math.min(...valoresValidos),
    max: Math.max(...valoresValidos),
  };
}
