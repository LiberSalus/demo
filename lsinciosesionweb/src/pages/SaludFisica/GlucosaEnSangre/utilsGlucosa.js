// utilsGlucosa.js

export function getEstadoGlucosa(valor, tipo) {
  if (!valor && valor !== 0) return null;

  const estados = {
    hipo:  { estado: "Hipoglucemia", color: "#3DCDF5" },
    normal:{ estado: "Niveles normales", color: "#98DBD3" },
    pre:   { estado: "Prediabetes", color: "#F6E68B" },
    dia:   { estado: "Diabetes", color: "#FD8D8D" },
  };

  if (tipo === "ayunas") {
    if (valor < 70) return estados.hipo;
    if (valor >= 70 && valor <= 110) return estados.normal;
    if (valor >= 110 && valor <= 125) return estados.pre;
    if (valor >= 126) return estados.dia;
  }

  if (tipo === "comida") {
    if (valor < 60) return estados.hipo;
    if (valor >= 70 && valor <= 140) return estados.normal;
    if (valor >= 140 && valor <= 199) return estados.pre;
    if (valor >= 200) return estados.dia;
  }

  return null;
}

// utilsGlucosa.js

// Mapea un valor de glucosa a un ángulo entre -90° y 90°
export function getAnguloPorGlucosa(valor, tipo) {
  if (valor === null || valor === undefined) return 0;

  // Rango visible aproximado del medidor
  // lo puedes ajustar a tu gusto
  const minValor = 40;
  const maxValor = tipo === "ayunas" ? 260 : 260;

  const vClamped = Math.min(Math.max(valor, minValor), maxValor);

  const minAngulo = -140;
  const maxAngulo = 200;

  const t = (vClamped - minValor) / (maxValor - minValor);
  return minAngulo + t * (maxAngulo - minAngulo);
}

