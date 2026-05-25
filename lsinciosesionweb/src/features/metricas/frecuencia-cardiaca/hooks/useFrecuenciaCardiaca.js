import { useCallback, useEffect, useMemo, useState } from "react";

import { registrosFrecuenciaDiariaMock } from "../mocks/registrosFrecuenciaDiaria.mock";
import { registrosFrecuenciaHistorialMock } from "../mocks/registrosFrecuenciaHistorial.mock";
import {
  construirOpcionesFiltroPromedio,
  construirSeriePromedio,
  PERIODOS_PROMEDIO,
} from "../utils/promedioFrecuencias.utils";
import { PERIODOS_REPOSO_ACTIVIDAD } from "../utils/reposoActividad.utils";
import {
  construirSeriePorHora,
  crearRegistroFrecuencia,
  filtrarRegistrosPorDia,
  formatearFechaHora,
  normalizarLecturaPromedio,
  obtenerClaveDiaLocal,
  obtenerRangoDiario,
  obtenerValorDestacado,
} from "../frecuenciaCardiaca.utils";

const CLAVE_STORAGE_REGISTROS_DIA = "frecuencia_cardiaca_registros_dia_v1";
const PPM_ALTA_SEMANA_ANTERIOR_MOCK = 80;
const PPM_BAJA_SEMANA_ANTERIOR_MOCK = 89;

// Integra las capturas actuales al historico temporal evitando duplicar el dia vigente.
function combinarHistorialConDiaActual(registrosHistoricos, registrosDia, claveDia) {
  const historicoSinDiaActual = registrosHistoricos.filter(
    (registro) => obtenerClaveDiaLocal(registro.fechaHoraISO) !== claveDia
  );

  return [...historicoSinDiaActual, ...registrosDia];
}

// Recupera registros diarios temporales desde localStorage o vuelve al mock del dia.
function leerEstadoPersistido(claveDiaActual) {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_REGISTROS_DIA);
    if (!textoGuardado) {
      return {
        claveDiaRegistros: claveDiaActual,
        registrosDelDia: filtrarRegistrosPorDia(
          registrosFrecuenciaDiariaMock,
          claveDiaActual
        ),
      };
    }

    const estadoGuardado = JSON.parse(textoGuardado);
    if (
      estadoGuardado?.claveDiaRegistros === claveDiaActual &&
      Array.isArray(estadoGuardado?.registrosDelDia)
    ) {
      return {
        claveDiaRegistros: claveDiaActual,
        registrosDelDia: estadoGuardado.registrosDelDia,
      };
    }
  } catch {
    // Si hay error de parseo o acceso al storage, usamos fallback local.
  }

  return {
    claveDiaRegistros: claveDiaActual,
    registrosDelDia: filtrarRegistrosPorDia(
      registrosFrecuenciaDiariaMock,
      claveDiaActual
    ),
  };
}

// Agrupa estado, calculos y acciones temporales de la metrica frecuencia cardiaca.
export function useFrecuenciaCardiaca() {
  const estadoInicialPersistido = useMemo(() => {
    const claveDiaActual = obtenerClaveDiaLocal(new Date());
    return leerEstadoPersistido(claveDiaActual);
  }, []);

  const [claveDiaRegistros, setClaveDiaRegistros] = useState(
    estadoInicialPersistido.claveDiaRegistros
  );
  const [registrosDelDia, setRegistrosDelDia] = useState(
    estadoInicialPersistido.registrosDelDia
  );
  const [horaActiva, setHoraActiva] = useState(15);
  const [modalCapturaAbierto, setModalCapturaAbierto] = useState(false);
  const [fechaHoraCapturaISO, setFechaHoraCapturaISO] = useState("");
  const [ppmCaptura, setPpmCaptura] = useState("69");
  const [fueActividad, setFueActividad] = useState(false);
  const [mensajeErrorCaptura, setMensajeErrorCaptura] = useState("");
  const [modalConfirmacionAbierto, setModalConfirmacionAbierto] =
    useState(false);
  const [fechaHoraConfirmacionTexto, setFechaHoraConfirmacionTexto] =
    useState("--");
  const [periodoPromedioSeleccionado, setPeriodoPromedioSeleccionado] =
    useState(PERIODOS_PROMEDIO.SEMANA);
  const [
    indiceLecturaPromedioSeleccionada,
    setIndiceLecturaPromedioSeleccionada,
  ] = useState(null);
  const [periodoComparativaSeleccionado, setPeriodoComparativaSeleccionado] =
    useState(PERIODOS_REPOSO_ACTIVIDAD.MES);
  const [valorFiltroComparativa, setValorFiltroComparativa] = useState("");

  const registrosPromedio = useMemo(
    () =>
      combinarHistorialConDiaActual(
        registrosFrecuenciaHistorialMock,
        registrosDelDia,
        claveDiaRegistros
      ),
    [claveDiaRegistros, registrosDelDia]
  );

  const opcionesFiltroPromedio = useMemo(
    () => construirOpcionesFiltroPromedio(registrosPromedio),
    [registrosPromedio]
  );

  const [valorFiltroPromedio, setValorFiltroPromedio] = useState(
    () => opcionesFiltroPromedio[PERIODOS_PROMEDIO.SEMANA]?.[0]?.valor ?? ""
  );

  // Resetea estado visual y registros cuando cambia el dia del sistema.
  const reiniciarDia = useCallback((nuevaClaveDia) => {
    setRegistrosDelDia([]);
    setHoraActiva(0);
    setFechaHoraCapturaISO("");
    setPpmCaptura("69");
    setFueActividad(false);
    setMensajeErrorCaptura("");
    setModalCapturaAbierto(false);
    setModalConfirmacionAbierto(false);
    setFechaHoraConfirmacionTexto("--");
    setClaveDiaRegistros(nuevaClaveDia);
  }, []);

  // Verifica cambio de dia para mantener solo registros del dia vigente.
  const verificarCambioDeDia = useCallback(() => {
    const claveDiaActual = obtenerClaveDiaLocal(new Date());
    if (claveDiaActual !== claveDiaRegistros) {
      reiniciarDia(claveDiaActual);
      return true;
    }
    return false;
  }, [claveDiaRegistros, reiniciarDia]);

  const { minDia, maxDia } = useMemo(
    () => obtenerRangoDiario(registrosDelDia),
    [registrosDelDia]
  );

  const serieGraficaDiaria = useMemo(
    () => construirSeriePorHora(registrosDelDia),
    [registrosDelDia]
  );

  const valorDestacado = useMemo(
    () => obtenerValorDestacado(serieGraficaDiaria, horaActiva),
    [horaActiva, serieGraficaDiaria]
  );

  // Resume el rango diario para alimentar la columna actual de comparacion semanal.
  const comparacionSemanal = useMemo(
    () => ({
      alta: {
        actual: maxDia,
        anterior: PPM_ALTA_SEMANA_ANTERIOR_MOCK,
      },
      baja: {
        actual: minDia,
        anterior: PPM_BAJA_SEMANA_ANTERIOR_MOCK,
      },
    }),
    [maxDia, minDia]
  );

  const fechaActualizacionTexto = useMemo(() => {
    const ultimoRegistro = registrosDelDia[registrosDelDia.length - 1];
    if (!ultimoRegistro) return "--";
    return formatearFechaHora(ultimoRegistro.fechaHoraISO);
  }, [registrosDelDia]);

  // Abre el modal con fecha/hora actual y valores base de captura.
  const manejarClickAgregar = () => {
    verificarCambioDeDia();
    setFechaHoraCapturaISO(new Date().toISOString());
    setPpmCaptura("69");
    setFueActividad(false);
    setMensajeErrorCaptura("");
    setModalCapturaAbierto(true);
  };

  // Actualiza el periodo activo para la grafica de promedios.
  const manejarCambioPeriodoPromedio = (periodo) => {
    setPeriodoPromedioSeleccionado(periodo);
  };

  // Cierra el modal de captura limpiando cualquier error visible.
  const cerrarModalCaptura = () => {
    setMensajeErrorCaptura("");
    setModalCapturaAbierto(false);
  };

  // Cierra el modal de confirmacion posterior al registro.
  const cerrarModalConfirmacion = () => {
    setModalConfirmacionAbierto(false);
  };

  // Valida la captura, agrega el registro diario y muestra confirmacion.
  const aceptarModalCaptura = () => {
    if (verificarCambioDeDia()) return;

    const ppmNumero = Number(ppmCaptura);
    if (!Number.isFinite(ppmNumero)) {
      setMensajeErrorCaptura("Ingresa un valor numerico para las pulsaciones.");
      return;
    }
    if (ppmNumero < 30 || ppmNumero > 220) {
      setMensajeErrorCaptura("El valor de ppm debe estar entre 30 y 220.");
      return;
    }

    const fechaRegistroISO = fechaHoraCapturaISO || new Date().toISOString();
    const nuevoRegistro = crearRegistroFrecuencia({
      fechaHoraISO: fechaRegistroISO,
      ppm: ppmNumero,
      fueActividad,
    });

    setRegistrosDelDia((registrosActuales) => {
      const siguientesRegistros = [...registrosActuales, nuevoRegistro];
      siguientesRegistros.sort(
        (actual, siguiente) =>
          new Date(actual.fechaHoraISO).getTime() -
          new Date(siguiente.fechaHoraISO).getTime()
      );
      return siguientesRegistros;
    });

    setHoraActiva(new Date(fechaRegistroISO).getHours());
    setFechaHoraConfirmacionTexto(formatearFechaHora(fechaRegistroISO));
    setMensajeErrorCaptura("");
    setModalCapturaAbierto(false);
    setModalConfirmacionAbierto(true);
  };

  useEffect(() => {
    const intervaloCambioDia = setInterval(() => {
      verificarCambioDeDia();
    }, 60_000);

    return () => clearInterval(intervaloCambioDia);
  }, [verificarCambioDeDia]);

  useEffect(() => {
    const opcionesPeriodoActual =
      opcionesFiltroPromedio[periodoPromedioSeleccionado] ?? [];

    const filtroExiste = opcionesPeriodoActual.some(
      (opcion) => opcion.valor === valorFiltroPromedio
    );

    if (!filtroExiste) {
      setValorFiltroPromedio(opcionesPeriodoActual[0]?.valor ?? "");
    }
  }, [
    opcionesFiltroPromedio,
    periodoPromedioSeleccionado,
    valorFiltroPromedio,
  ]);

  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_STORAGE_REGISTROS_DIA,
        JSON.stringify({
          claveDiaRegistros,
          registrosDelDia,
        })
      );
      window.dispatchEvent(new CustomEvent("metricas_resumen_actualizado"));
    } catch {
      // Si localStorage no esta disponible, ignoramos sin romper el flujo.
    }
  }, [claveDiaRegistros, registrosDelDia]);

  const opcionesFiltroActualPromedio =
    opcionesFiltroPromedio[periodoPromedioSeleccionado] ?? [];

  const seriePromedioFrecuencia = useMemo(
    () =>
      construirSeriePromedio({
        registros: registrosPromedio,
        periodo: periodoPromedioSeleccionado,
        valorFiltro: valorFiltroPromedio,
      }),
    [periodoPromedioSeleccionado, registrosPromedio, valorFiltroPromedio]
  );

  const lecturaPromedioSeleccionada = useMemo(() => {
    if (!seriePromedioFrecuencia.length) return null;

    const lecturaActual = normalizarLecturaPromedio(
      seriePromedioFrecuencia[indiceLecturaPromedioSeleccionada]
    );
    if (lecturaActual) return lecturaActual;

    const primeraLecturaValida = seriePromedioFrecuencia.find((lectura) =>
      normalizarLecturaPromedio(lectura)
    );

    return normalizarLecturaPromedio(primeraLecturaValida);
  }, [indiceLecturaPromedioSeleccionada, seriePromedioFrecuencia]);

  // Decide si la capsula usa la seleccion historica o el rango vivo del dia actual.
  const lecturaCapsulaSeleccionada = useMemo(() => {
    if (lecturaPromedioSeleccionada?.claveDia === claveDiaRegistros) {
      return {
        min: minDia,
        max: maxDia,
      };
    }

    return lecturaPromedioSeleccionada;
  }, [claveDiaRegistros, lecturaPromedioSeleccionada, maxDia, minDia]);

  useEffect(() => {
    const indiceValido = seriePromedioFrecuencia.findIndex((lectura) =>
      normalizarLecturaPromedio(lectura)
    );

    setIndiceLecturaPromedioSeleccionada(
      indiceValido >= 0 ? indiceValido : null
    );
  }, [seriePromedioFrecuencia]);

  return {
    minDia,
    maxDia,
    comparacionSemanal,
    serieGraficaDiaria,
    valorDestacado,
    fechaActualizacionTexto,
    modalCapturaAbierto,
    fechaHoraCapturaISO,
    ppmCaptura,
    fueActividad,
    mensajeErrorCaptura,
    modalConfirmacionAbierto,
    fechaHoraConfirmacionTexto,
    opcionesFiltroActualPromedio,
    valorFiltroPromedio,
    seriePromedioFrecuencia,
    indiceLecturaPromedioSeleccionada,
    lecturaPromedioSeleccionada,
    lecturaCapsulaSeleccionada,
    periodoPromedioSeleccionado,
    periodoComparativaSeleccionado,
    valorFiltroComparativa,
    setHoraActiva,
    setPpmCaptura,
    setFueActividad,
    setValorFiltroPromedio,
    setIndiceLecturaPromedioSeleccionada,
    setPeriodoComparativaSeleccionado,
    setValorFiltroComparativa,
    manejarClickAgregar,
    manejarCambioPeriodoPromedio,
    cerrarModalCaptura,
    cerrarModalConfirmacion,
    aceptarModalCaptura,
  };
}
