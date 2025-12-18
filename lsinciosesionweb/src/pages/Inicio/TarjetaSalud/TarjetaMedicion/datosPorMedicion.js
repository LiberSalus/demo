import peso        from './icoPeso.svg';
import tipo        from './icoSangre.svg';
import pasos       from './icoPasos.svg';
import ciclo       from './icoCiclo.svg';
import depre       from './icoEdoDepre.svg';
import feliz       from './icoEdoFeliz.svg';
import estres      from './icoEstres.svg';
import triste      from './icoEdoTriste.svg';
import estado      from './icoEdoFeliz.svg'
import energia     from './icoEnergia.svg';
import oxigeno     from './icoOxigenacion.svg';
import presion     from './icoPresion.svg';
import neutral     from './icoEdoNeutral.svg';
import calorias    from './icoCalorias.svg';
import descanso    from './icoDescanso.svg';
import contento    from './icoEdoContento.svg';
import frecuencia  from './icoFrecuencia.svg';
import hidratacion from './icoHidratacion.svg';
import consumidas  from './icoConsumidas.svg';

export const datosPorMedicion = {
  "Peso": {icono: peso,unidad: "kg"},
  "SpO2": {icono: oxigeno,unidad: "%"},
  "Pasos": {icono: pasos,unidad: "pasos"},
  "Feliz": {icono: feliz,unidad: ""},
  "Estrés": {icono: estres,unidad: "%"},
  "Triste": {icono: triste,unidad: ""},
  "Energía": {icono: energia,unidad: "%"},
  "Neutral": {icono: neutral,unidad: ""},
  "Calorías": {icono: calorias, unidad: "kcal"},
  "Descanso": {icono: descanso,unidad: "hrs"},
  "Contento": {icono: contento,unidad: ""},
  "Depresión": {icono: depre,unidad: ""},
  "Hidratación": {icono: hidratacion,unidad: "ml"},
  "Estado de ánimo": {icono: estado, unidad: ""},
  "Ciclo menstrual": {icono: ciclo,unidad: "semanas"},
  "Presión arterial": {icono: presion,unidad: "mmHg"},
  "Glucosa en sangre": {icono: tipo,unidad: "mg/dL"},
  "Frecuencia cardiaca": {icono: frecuencia,unidad: "ppm"},
  "kCal quemadas": {icono: calorias,unidad: "ppm"},
  "kCal consumidas": {icono: consumidas,unidad: "ppm"},
};