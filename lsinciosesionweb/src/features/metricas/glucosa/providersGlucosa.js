/* iconos en Glucosa */
import icoVerde from "../presion-arterial/icoAlertVerde.svg"
import icoAmarillo from "../presion-arterial/icoAlertAmarillo.svg"
import icoRojo from "../presion-arterial/icoAlertRojo.svg"
import icoAlertaTriangulo from "./icoAlertaTriangulo.svg"
import icoGlucosa from "./icoGluco.svg"

/* Selección de estados */
export const estadosGlucosa = [
  "Ayuno", "Después de comer"
];

/* Textos base */
export const textosGenerales = {
  header:"Glucosa en Sangre",
  base:["Ayuno", "Despues de comer"],
  unidad:"mg/dL",
  mensaje:{
    r1:"La glucosa es la principal fuente de energía del cuerpo, obtenida a través de los alimentos. Mantener niveles adecuados es fundamental para prevenir complicaciones a largo plazo en órganos vitales.",
    r2:"Es importante mencionar que factores como la alimentación, la actividad física, el estrés o el uso de ciertos medicamentos influyen directamente en estos niveles. Se mide comúnmente con un glucómetro o mediante un sensor de monitoreo continuo.",
    r3:"* mg/dL: miligramos por decilitro (unidad para medir la concentración de azúcar)"
  },
  condiciones:[
    {bg:"#00B7C8", condicion:"Hipoglucemia",},
    {bg:"#3FAD58", condicion:"Normal en ayuno",},
    {bg:"#F8A737", condicion:"Prediabetes",},
    {bg:"#C72611", condicion:"Hiperglucemia",},
  ],
};

/* Textos Niveles Glucosa */
export const CompNivelesGlucosa = {
  titulo:"Niveles de Glucosa",
  base:["Ayuno", "Despues de comer"],
  txact:"Última actualización",
};

/* Textos Modal */
export const ModalCaptura = {
  tit:"Ingresa tus datos",
  fcha:"Fecha y hora",


  label: "Glucosa en sangre",
  unidad: "mg/dL", 
  estado: "¿Esta medición es en ayunas?",
  recomendaciones: "Recomendaciones:",
  sub: "Antes de medir tu SpO₂ manualmente:",
  pasos: [
    {paso:"<strong>Preparación:</strong> Asegúrese de tener el glucómetro, tiras reactivas y lancetas listas en un espacio cómodo."},
    {paso:"<strong>Higiene:</strong> Lave sus manos con agua y jabón. Evite el alcohol si es posible, ya que puede resecar la piel, pero si lo usa, asegúrese de que se evapore completamente antes de pinchar."},
    {paso:"<strong>Técnica de punción:</strong> Pinche en la parte lateral de la yema del dedo, ya que es menos doloroso que el centro."},
    {paso:"<strong>Rotación:</strong> No utilice siempre el mismo dedo para evitar callos o dolor."},
    {paso:"<strong>Muestra de sangre:</strong> Aplique la gota de sangre en el borde de la tira reactiva, no encima."},
    {paso:"<strong>Registro:</strong> Anote siempre la fecha, hora y el resultado de la medición, asi como si fue en ayunas o después de comer, para compartirlo con su médico."},
  ]
};



export const opcionesGlucosa = [
  { label: "Ayuno", value: "ayuno" },
  { label: "Después de comer", value: "postprandial" },
  { label: "Preprandial", value: "preprandial" },
  { label: "Antes de dormir", value: "antesDormir" },
  { label: "Durante síntomas", value: "sintomas" },
  { label: "No especificado", value: "noEspecificado" }
];

export const opcionesGlucometro = [
  { label: "Glucómetro capilar", value: "capilar" },
  { label: "Sensor continuo (CGM)", value: "cgm" },
  { label: "Laboratorio", value: "lab" },
]

export const opcionesActividad = [
  { label: "Reposo", value: "reposo" },
  { label: "Actividad física reciente", value: "actividad" },
  { label: "No especificado", value: "desconocido" },
]




/* Textos Valores Glucosa */
export const CompValoresGlucosa = {
    tit: "Valores de glucosa",
    unidad: "mg/dL", 
    valoresAyuno: [
      "< 69",
      "70 - 99",
      "100 - 125",
      "> 126",
    ],
    valoresPostpandrial: [
      "< 70",
      "< 140",
      "140 - 199",
      "> 200",
    ],
};

/* Textos Último valor */
export const CompUltimoValor = {
  tit: "Último valor de glucosa",
  ultimo: "Último valor",
  anterior: "Valor anterior",
}

/* Textos Alerta */
export const CompAlertas = {
  verde: {
    icono: icoVerde,
    mensaje: [
      "Tu Glucosa en sangre ha estado dentro de los rangos normales por más de 7 días.",
      "Buen trabajo, estás cuidando bien tu salud."
    ]
  },
  amarillo: {
    icono: icoAmarillo,
    mensaje: [
      "Tu Glucosa en sangre esta fuera de los rangos normales si esto persiste consulta a tu médico",
    ]
  },
  rojo: {
    icono: icoRojo,
    mensaje: [
      "Tu Glucosa en sangre ha estado fuera de los rangos normales por más de 7 días, te sugerimos consultar a tu médico",
    ]
  },
}

export const CopmConfirmacionRegistro = {
  icono:icoGlucosa,
  boton: "Aceptar",
  registro: {
    mensaje: "Actualizaste tu registro de Glucosa en sangre correctamente",
    fecha: "19/11/2025 - 03:46pm",
  },
  fueraRango: {
    icono: icoAlertaTriangulo,
    alto:"Registraste una lectura de Glucosa alta. Considera repetir la medición y si estos números se mantienen, agenda una revisión médica.",
    bajo:"Registraste una lectura de glucosa Baja. Considera repetir la medición y si estos números se mantienen, agenda una revisión médica.",
  },
}

export const CompGraficaProm = {
  tit: "Promedio Glucosa",
  unidad: "mg/dL",
  botones:[
    "Semana",
    "Mes",
    "Anio",
  ],
  labelX:[
    {semana:"Días",},
    {mes:"Días",},
    {anio:"Meses",},
  ],
  labelY: "mg/dL",
  ticksX:[
    {semana:["Lun","Mar","Mie","Jue","Vie","Sab","Dom",]},
    {mes:["5","10","15","20","25","30",]},
    {anio:["Ene","Feb","Mar","Abr","May","Jun","Jul","Ago","Sep","Oct","Nov","Dic",]}
  ],
  
}
