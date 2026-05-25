import icoAlertRojo from "./icoAlertRojo.svg";
import icoAlertVerde from "./icoAlertVerde.svg";
import icoRecordatorio from './icoRecordatorio.svg'

export const textosGenerales = {
  encabezado: "Oxigenación SpO2",
  unidad: "SpO2",
  abreviatura: "%",
  mensaje: {
    r1: "Es importante mencionar que hay factores como la edad, el tabaquismo o la altura sobre el nivel del mar que influyen en los niveles de saturación.",
    r2: "Es un parámetro vital para definir el contenido en oxígeno de la sangre y el lanzamiento del oxígeno. Se mide con un oxímetro de pulso.",
    r3: "* SpO2: saturación periférica de oxígeno",
  },
};

export const graficaDiaria = {
  titulo: "Oxigenación SpO2 diaria",
  boton: "Añadir",
};

export const modalCaptura = {
  titulo: "Ingresa tus datos",
  fecha: "Fecha y hora:",
  etiquetaSpO2: "Oxigenación en sangre SpO₂:",
  etiquetaContexto: "Contexto de medición:",
  etiquetaSentir: "¿Cómo te sientes?",
  boton: "Aceptar",
  recomendacionesTitulo: "Recomendaciones:",
  recomendaciones: [
    "<strong>Mantén las manos limpias y calientes:</strong> El frío o la suciedad pueden afectar la circulación y alterar la lectura",
    "<strong>Quita esmalte de uñas o uñas postizas:</strong> Los colores oscuros o materiales artificiales interfieren con la luz del oxímetro.",
    "<strong>Evita el movimiento:</strong> Muévete lo menos posible durante la medición; el movimiento puede generar lecturas inexactas.",
  ],
  nota: "Descansa al menos 5 minutos antes de tomar la lectura.",
};

export const opcionesContexto = [
  { label: "No especificado", value: "noEspecificado" },
  { label: "En reposo", value: "reposo" },
  { label: "Después de actividad", value: "actividad" },
];

export const opcionesSentir = [
  { label: "Excelente", value: "excelente", icono: "☺" },
  { label: "Bien", value: "bien", icono: "☺" },
  { label: "Neutral", value: "neutral", icono: "😐" },
  { label: "Mal", value: "mal", icono: "☹" },
  { label: "Muy mal", value: "muyMal", icono: "☹" },
];

export const tarjetaRango = {
  titulo: "Rango de frecuencia cardiaca",
  unidad: "ppm",
};

export const valoresReferencia = {
  titulo: "Valores de oxigenación SpO2",
  items: [
    { color: "#3FAD58", nombre: "Excelente", rango: "94 - 100%" },
    { color: "#53B96B", nombre: "Aceptable", rango: "92 - 93%" },
    { color: "#F8A737", nombre: "Vigilar", rango: "90 - 91%" },
    { color: "#FF6A39", nombre: "Bajo", rango: "87 - 89%" },
    { color: "#FF4040", nombre: "Muy bajo", rango: "83 - 86%" },
    { color: "#FF1F3D", nombre: "Crítico", rango: "< 83%" },
  ],
};

export const ultimoValor = {
  titulo: "Último valor de Oxigenación",
  etiquetas: {
    ultimo: "Último valor",
    anterior: "Valor anterior",
  },
};

export const graficaPromedio = {
  titulo: "Promedio Oxigenación SpO2",
  botones: ["Semana", "Mes", "Año"],
};

export const histograma = {
  titulo: "Histograma de distribución",
  descripcion:
    "Distribución de mediciones por rangos para identificar concentraciones y variaciones en la oxigenación en sangre.",
};

export const alerta = {
  verde: {
    icono: icoAlertVerde,
    alt: "Oxigenación dentro de los rangos normales",
    mensaje: [
      "Tu Oxigenación SpO2 se encuentra dentro de los rangos normales.",
      "Buen trabajo, estás cuidando bien tu salud.",
    ],
  },
  rojo: {
    icono: icoAlertRojo,
    alt: "Oxigenación fuera de los rangos normales",
    mensaje: [
      "Tu Oxigenación SpO2 está fuera de los rangos normales.",
      "Si esto persiste, consulta a tu médico.",
    ],
  },
};

export const contexto = {
  titulo: "¿Qué es la saturación de oxígeno?",
  icono: icoRecordatorio
};

export const confirmacionRegistro = {
  exito: {
    mensaje: "Actualizaste tu oxigenación en sangre correctamente",
  },
  alerta: {
    mensaje:
      "Registraste tu oxigenación en sangre baja. Respira, descansa y vuelve a medir. Si estos números se mantienen, considera una revisión médica.",
  },
  boton: "Aceptar",
};
