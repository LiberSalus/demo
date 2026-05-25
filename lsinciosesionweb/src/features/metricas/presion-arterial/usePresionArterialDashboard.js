import { useEffect, useMemo, useState } from "react";
import {
  CLAVE_STORAGE_PRESION_DIA,
  PERIODOS_PROMEDIO_PRESION,
  construirOpcionesFiltroPromedioPresion,
  construirSeriePorHora,
  construirSeriePromedioPresion,
  crearRecordatorioPresionVacio,
  crearLecturaVacia,
  formatearFechaHora,
  formatearCuentaRegresivaRecordatorio,
  formatearDiasRecordatorio,
  formatearHoraRecordatorio,
  guardarRecordatoriosPresion,
  obtenerClaveDiaLocal,
  obtenerEstadoPresion,
  obtenerProximoRecordatorioPresion,
  obtenerRegistrosPresionHistorial,
  leerRecordatoriosPresion,
  obtenerUltimaFrecuenciaCardiaca,
  obtenerUltimosRegistros,
  leerEstadoPersistido,
  normalizarRegistroPresion,
  normalizarRecordatorioPresion,
  ordenarRegistrosCronologicamente,
} from "./presionArterial.utils";

const ESTADO_RESULTADO_INICIAL = {
  abierto: false,
  variante: "normal",
  fechaHoraTexto: "--",
};

// Orquesta el estado de la vista nueva de presion arterial traida desde BorradorDos.
export const usePresionArterialDashboard = () => {
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
  const [modalAbierto, setModalAbierto] = useState(false);
  const [beatId, setBeatId] = useState(0);
  const [ultimoRegistroFrecuencia, setUltimoRegistroFrecuencia] = useState(
    () => obtenerUltimaFrecuenciaCardiaca()
  );
  const [periodoPromedioSeleccionado, setPeriodoPromedioSeleccionado] =
    useState(PERIODOS_PROMEDIO_PRESION.SEMANA);
  const [
    indiceLecturaPromedioSeleccionada,
    setIndiceLecturaPromedioSeleccionada,
  ] = useState(null);
  const [resultadoCaptura, setResultadoCaptura] = useState(
    ESTADO_RESULTADO_INICIAL
  );
  const [modalRecordatoriosAbierto, setModalRecordatoriosAbierto] =
    useState(false);
  const [recordatoriosPresion, setRecordatoriosPresion] = useState(() =>
    leerRecordatoriosPresion()
  );

  // Limpia capturas y modales cuando cambia el dia local del usuario.
  const reiniciarDia = (nuevaClaveDia) => {
    setRegistrosDelDia([]);
    setClaveDiaRegistros(nuevaClaveDia);
    setModalAbierto(false);
    setResultadoCaptura(ESTADO_RESULTADO_INICIAL);
  };

  // Valida si ya cambio el dia para evitar mezclar lecturas de fechas distintas.
  const verificarCambioDeDia = () => {
    const claveDiaActual = obtenerClaveDiaLocal(new Date());
    if (claveDiaActual !== claveDiaRegistros) {
      reiniciarDia(claveDiaActual);
      return true;
    }
    return false;
  };

  const { registrosOrdenados, ultimoRegistro, valorDiaAnterior } = useMemo(
    () => obtenerUltimosRegistros(registrosDelDia),
    [registrosDelDia]
  );

  const registrosPromedio = useMemo(
    () =>
      ordenarRegistrosCronologicamente([
        ...obtenerRegistrosPresionHistorial(),
        ...registrosDelDia,
      ]),
    [registrosDelDia]
  );

  const opcionesFiltroPromedio = useMemo(
    () => construirOpcionesFiltroPromedioPresion(registrosPromedio),
    [registrosPromedio]
  );

  const [valorFiltroPromedio, setValorFiltroPromedio] = useState(
    () =>
      opcionesFiltroPromedio[PERIODOS_PROMEDIO_PRESION.SEMANA]?.[0]?.valor ?? ""
  );

  const lecturaActual = ultimoRegistro ?? crearLecturaVacia();
  const serieGraficaDiaria = useMemo(
    () => construirSeriePorHora(registrosOrdenados),
    [registrosOrdenados]
  );
  const seriePromedioPresion = useMemo(
    () =>
      construirSeriePromedioPresion({
        registros: registrosPromedio,
        periodo: periodoPromedioSeleccionado,
        valorFiltro: valorFiltroPromedio,
      }),
    [registrosPromedio, periodoPromedioSeleccionado, valorFiltroPromedio]
  );

  const promAct = useMemo(() => {
    const lecturasValidas = seriePromedioPresion.filter(
      (lectura) =>
        Number.isFinite(Number(lectura?.sistolica)) &&
        Number.isFinite(Number(lectura?.diastolica))
    );

    if (!lecturasValidas.length) {
      return {
        sistolica: null,
        diastolica: null,
        estado: null,
      };
    }

    const promedioSistolica = Math.round(
      lecturasValidas.reduce(
        (acumulado, lectura) => acumulado + Number(lectura.sistolica),
        0
      ) / lecturasValidas.length
    );

    const promedioDiastolica = Math.round(
      lecturasValidas.reduce(
        (acumulado, lectura) => acumulado + Number(lectura.diastolica),
        0
      ) / lecturasValidas.length
    );

    return {
      sistolica: promedioSistolica,
      diastolica: promedioDiastolica,
      estado: obtenerEstadoPresion(promedioSistolica, promedioDiastolica),
    };
  }, [seriePromedioPresion]);

  const estadoUltimoRegistro = ultimoRegistro
    ? obtenerEstadoPresion(ultimoRegistro.sistolica, ultimoRegistro.diastolica)
    : { texto: "--", color: "#64748b" };

  const fechaActualizacionTexto = ultimoRegistro
    ? formatearFechaHora(ultimoRegistro.fechaHoraISO)
    : "--";

  const opcionesFiltroActualPromedio =
    opcionesFiltroPromedio[periodoPromedioSeleccionado] ?? [];
  const proximoRecordatorioPresion = useMemo(
    () => obtenerProximoRecordatorioPresion(recordatoriosPresion),
    [recordatoriosPresion]
  );
  const resumenRecordatorioPresion = useMemo(() => {
    const primerRecordatorioActivo = recordatoriosPresion.find(
      (recordatorio) => recordatorio.enabled
    );

    if (!primerRecordatorioActivo) {
      return {
        hora: "--",
        dias: "Sin recordatorios activos",
        cuentaRegresiva: "--",
      };
    }

    return {
      hora: formatearHoraRecordatorio(primerRecordatorioActivo),
      dias: formatearDiasRecordatorio(primerRecordatorioActivo),
      cuentaRegresiva:
        formatearCuentaRegresivaRecordatorio(proximoRecordatorioPresion),
    };
  }, [proximoRecordatorioPresion, recordatoriosPresion]);

  // Abre el modal de captura despues de verificar que la fecha siga vigente.
  const abrirModalCaptura = () => {
    verificarCambioDeDia();
    setModalAbierto(true);
  };

  // Cierra el modal de captura sin modificar los registros existentes.
  const cerrarModalCaptura = () => {
    setModalAbierto(false);
  };

  // Oculta el modal de resultado conservando la informacion de la captura.
  const cerrarModalResultado = () => {
    setResultadoCaptura((estadoActual) => ({
      ...estadoActual,
      abierto: false,
    }));
  };

  // Muestra el panel para administrar recordatorios de presion arterial.
  const abrirModalRecordatorios = () => {
    setModalRecordatoriosAbierto(true);
  };

  // Cierra el panel de recordatorios sin alterar su estado guardado.
  const cerrarModalRecordatorios = () => {
    setModalRecordatoriosAbierto(false);
  };

  // Guarda o actualiza un recordatorio de presion arterial normalizado.
  const guardarRecordatorioPresion = (recordatorio) => {
    const recordatorioNormalizado = normalizarRecordatorioPresion(recordatorio);

    setRecordatoriosPresion((recordatoriosActuales) => {
      const indiceExistente = recordatoriosActuales.findIndex(
        (item) => item.id === recordatorioNormalizado.id
      );

      if (indiceExistente < 0) {
        return [...recordatoriosActuales, recordatorioNormalizado];
      }

      return recordatoriosActuales.map((item, indice) =>
        indice === indiceExistente ? recordatorioNormalizado : item
      );
    });
  };

  // Elimina un recordatorio de presion arterial por identificador.
  const eliminarRecordatorioPresion = (recordatorioId) => {
    setRecordatoriosPresion((recordatoriosActuales) =>
      recordatoriosActuales.filter(
        (recordatorio) => recordatorio.id !== recordatorioId
      )
    );
  };

  // Activa o desactiva un recordatorio de presion arterial existente.
  const alternarRecordatorioPresion = (recordatorioId) => {
    setRecordatoriosPresion((recordatoriosActuales) =>
      recordatoriosActuales.map((recordatorio) =>
        recordatorio.id === recordatorioId
          ? { ...recordatorio, enabled: !recordatorio.enabled }
          : recordatorio
      )
    );
  };

  // Registra una nueva lectura de presion y prepara el resultado visual.
  const confirmarCaptura = ({ sistolica, diastolica, medicamento, ts }) => {
    if (verificarCambioDeDia()) return;

    setRegistrosDelDia((registrosActuales) => {
      const createdAtMsAnterior = registrosActuales.reduce((maximo, registro) => {
        const createdAtRegistro = Number(registro?.createdAtMs);
        return Number.isFinite(createdAtRegistro)
          ? Math.max(maximo, createdAtRegistro)
          : maximo;
      }, 0);

      const nuevoRegistro = {
        id: `pa-${Date.now()}`,
        fechaHoraISO: ts.toISOString(),
        createdAtMs: Math.max(Date.now(), createdAtMsAnterior + 1),
        sistolica,
        diastolica,
        medicamento,
      };

      return ordenarRegistrosCronologicamente([
        ...registrosActuales,
        normalizarRegistroPresion(nuevoRegistro),
      ]);
    });

    setBeatId((valorActual) => valorActual + 1);
    setModalAbierto(false);
    setResultadoCaptura({
      abierto: true,
      variante:
        sistolica < 90 || diastolica < 60
          ? "baja"
          : obtenerEstadoPresion(sistolica, diastolica).texto === "Normal"
            ? "normal"
            : "alta",
      fechaHoraTexto: formatearFechaHora(ts.toISOString()),
    });
  };

  useEffect(() => {
    const intervaloCambioDia = setInterval(() => {
      verificarCambioDeDia();
    }, 60_000);

    return () => clearInterval(intervaloCambioDia);
  }, [claveDiaRegistros]);

  useEffect(() => {
    const sincronizarFrecuencia = () => {
      setUltimoRegistroFrecuencia(obtenerUltimaFrecuenciaCardiaca());
    };

    sincronizarFrecuencia();
    window.addEventListener("focus", sincronizarFrecuencia);
    window.addEventListener("storage", sincronizarFrecuencia);
    window.addEventListener(
      "metricas_resumen_actualizado",
      sincronizarFrecuencia
    );

    return () => {
      window.removeEventListener("focus", sincronizarFrecuencia);
      window.removeEventListener("storage", sincronizarFrecuencia);
      window.removeEventListener(
        "metricas_resumen_actualizado",
        sincronizarFrecuencia
      );
    };
  }, []);

  useEffect(() => {
    const opcionesPeriodoActual =
      opcionesFiltroPromedio[periodoPromedioSeleccionado] ?? [];
    const filtroExiste = opcionesPeriodoActual.some(
      (opcion) => String(opcion.valor) === String(valorFiltroPromedio)
    );

    if (!filtroExiste) {
      setValorFiltroPromedio(opcionesPeriodoActual[0]?.valor ?? "");
    }
  }, [opcionesFiltroPromedio, periodoPromedioSeleccionado, valorFiltroPromedio]);

  useEffect(() => {
    const indiceValido = seriePromedioPresion.findIndex(
      (lectura) =>
        Number.isFinite(Number(lectura?.sistolica)) &&
        Number.isFinite(Number(lectura?.diastolica))
    );

    setIndiceLecturaPromedioSeleccionada(indiceValido >= 0 ? indiceValido : null);
  }, [seriePromedioPresion]);

  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_STORAGE_PRESION_DIA,
        JSON.stringify({
          claveDiaRegistros,
          registrosDelDia,
        })
      );
      window.dispatchEvent(new CustomEvent("metricas_resumen_actualizado"));
    } catch {
      // Si localStorage no está disponible, seguimos sin persistencia.
    }
  }, [claveDiaRegistros, registrosDelDia]);

  useEffect(() => {
    guardarRecordatoriosPresion(recordatoriosPresion);
  }, [recordatoriosPresion]);

  return {
    beatId,
    abrirModalRecordatorios,
    cerrarModalRecordatorios,
    crearRecordatorioPresionVacio,
    eliminarRecordatorioPresion,
    estadoUltimoRegistro,
    fechaActualizacionTexto,
    guardarRecordatorioPresion,
    indiceLecturaPromedioSeleccionada,
    lecturaActual,
    modalAbierto,
    modalRecordatoriosAbierto,
    opcionesFiltroActualPromedio,
    periodoPromedioSeleccionado,
    promAct,
    proximoRecordatorioPresion,
    registrosDistribucionPresion: registrosPromedio,
    registrosOrdenados,
    recordatoriosPresion,
    resultadoCaptura,
    resumenRecordatorioPresion,
    serieGraficaDiaria,
    seriePromedioPresion,
    alternarRecordatorioPresion,
    ultimoRegistro,
    ultimoRegistroFrecuencia,
    valorDiaAnterior,
    valorFiltroPromedio,
    abrirModalCaptura,
    cerrarModalCaptura,
    cerrarModalResultado,
    confirmarCaptura,
    setIndiceLecturaPromedioSeleccionada,
    setPeriodoPromedioSeleccionado,
    setValorFiltroPromedio,
  };
};

export default usePresionArterialDashboard;
