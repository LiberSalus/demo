// src/components/Reporte/metricas.js

export const METRIC_GLUCO_AYUNAS = {
  titulo: "Glucosa en sangre (Ayunas)",
  unidad: "mg/dL",
  lecturaLabel: "Nivel",
  columns: [
    { key: "fecha", label: "Fecha", w: 100 },
    { key: "hora", label: "Hora", w: 100 },
    { key: "<60", label: "<60", w: 80 },
    { key: "70-100", label: "70-100", w: 80 },
    { key: "100-125", label: "100-125", w: 80 },
    { key: ">126", label: ">126", w: 80 },
    { key: "lectura", label: "Lectura", w: 100 },
    { key: "estado", label: "Estado", w: 100 },
  ],
  rangos: [
    { key: "<60", label: "<60", test: (v) => v < 60 },
    { key: "70-100", label: "70-100", test: (v) => v >= 70 && v <= 100 },
    { key: "100-125", label: "100-125", test: (v) => v > 100 && v <= 125 },
    { key: ">126", label: ">126", test: (v) => v >= 126 },
  ],
};

export const METRIC_GLUCO_COMIDA = {
  titulo: "Glucosa en sangre (Después de comer)",
  unidad: "mg/dL",
  lecturaLabel: "Nivel",
  columns: [
    { key: "fecha", label: "Fecha", w: 100 },
    { key: "hora", label: "Hora", w: 100 },
    { key: "<60", label: "<60", w: 80 },
    { key: "70-140", label: "70-140", w: 80 },
    { key: "140-199", label: "140-199", w: 80 },
    { key: ">200", label: ">200", w: 80 },
    { key: "lectura", label: "Lectura", w: 100 },
    { key: "estado", label: "Estado", w: 100 },
  ],
  rangos: [
    { key: "<60", label: "<60", test: (v) => v < 60 },
    { key: "70-140", label: "70-140", test: (v) => v >= 70 && v <= 140 },
    { key: "140-199", label: "140-199", test: (v) => v > 140 && v <= 199 },
    { key: ">200", label: ">200", test: (v) => v >= 200 },
  ],
};

export const METRIC_OXIGENACION = {
  titulo: "Oxigenación en sangre",
  unidad: "%",
  lecturaLabel: "Nivel",
  columns: [
    { key: "fecha", label: "Fecha", w: 100 },
    { key: "hora", label: "Hora", w: 100 },
    { key: "<85", label: "<85", w: 80 },
    { key: "86-89", label: "86-89", w: 80 },
    { key: "90-94", label: "90-94", w: 80 },
    { key: "95-100", label: "95-100", w: 80 },
    { key: "lectura", label: "Nivel", w: 100 },
    { key: "estado", label: "Estado", w: 100 },
  ],
  rangos: [
    { key: "<85", label: "<85", test: (v) => v < 85 },
    { key: "86-89", label: "86-89", test: (v) => v >= 86 && v <= 89 },
    { key: "90-94", label: "90-94", test: (v) => v >= 90 && v <= 94 },
    { key: "95-100", label: "95-100", test: (v) => v >= 95 && v <= 100 },
  ],
};

export const METRIC_FRECUENCIA = {
  titulo: "Frecuencia cardiaca",
  unidad: "ppm",
  lecturaLabel: "Nivel",
  columns: [
    { key: "fecha", label: "Fecha", w: 100 },
    { key: "hora", label: "Hora", w: 100 },
    { key: "<80", label: "<80", w: 95 },
    { key: "80-100", label: "80-100", w: 95 },
    { key: ">100", label: ">100", w: 95 },
    { key: "lectura", label: "Nivel", w: 100 },
    { key: "estado", label: "Estado", w: 100 },
  ],
  rangos: [
    { key: "<80", label: "<80", test: (v) => v < 80 },
    { key: "80-100", label: "80-100", test: (v) => v >= 80 && v <= 100 },
    { key: ">100", label: ">100", test: (v) => v > 100 },
  ],
};

export const METRIC_PRESION = {
  titulo: "Presión arterial",
  unidad: "mmHg",
  lecturaLabel: "Presión",
  columns: [
    { key: "fecha", label: "Fecha", w: 100 },
    { key: "hora", label: "Hora", w: 100 },
    { key: "<120", label: "<120", w: 95 },
    { key: "120-129", label: "120-129", w: 95 },
    { key: "130-139", label: "130-139", w: 95 },
    { key: ">=140", label: "≥140", w: 95 },
    { key: "lectura", label: "Presión", w: 120 },
    { key: "estado", label: "Estado", w: 100 },
  ],
  rangos: [
    { key: "<120", label: "<120", test: (v) => v < 120 },
    { key: "120-129", label: "120-129", test: (v) => v >= 120 && v <= 129 },
    { key: "130-139", label: "130-139", test: (v) => v >= 130 && v <= 139 },
    { key: ">=140", label: "≥140", test: (v) => v >= 140 },
  ],
};
