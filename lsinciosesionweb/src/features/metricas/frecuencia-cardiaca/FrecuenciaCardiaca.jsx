//mesat\src\components\BorradorDos\FrecuenciaCardiaca\FrecuenciaCardiaca.jsx
import React, { useCallback, useEffect, useMemo, useState } from "react";
import GraficaFrecuenciaCardiacaDiaria from "./components/GraficaFrecuenciaCardiacaDiaria";
import GraficaPromedioFrecuencia from "./components/GraficaPropemidoFrecuencia";
import ModalCapturaFrecuencia from "./components/ModalCapturaFrecuencia";
import ModalConfirmacionFrecuencia from "./components/ModalConfirmacionFrecuencia";
import styles from "./FrecuenciaCardiaca.module.css";
import MarcoTarjeta from "./components/MarcoTarjeta";
import { registrosFrecuenciaDiariaMock } from "./mocks/registrosFrecuenciaDiaria.mock";
import { registrosFrecuenciaHistorialMock } from "./mocks/registrosFrecuenciaHistorial.mock";
import {
  construirOpcionesFiltroPromedio,
  construirSeriePromedio,
  PERIODOS_PROMEDIO,
} from "./utils/promedioFrecuencias.utils";

import Capsula from "./components/Capsula";

import arribaAlert from "./assets/icoArribaAlert.svg";
import verdeArriba from "./assets/icoTrianVerdeArriba.svg";
import verdeAbajo from "./assets/icoTrianVerdeAbajo.svg";
import amariArriba from "./assets/icoTrianAmarArriba.svg";
import amariAbajo from "./assets/icoTrianAmarAbajo.svg";
import rojoArriba from "./assets/icoTrianRojoArriba.svg";
import rojoAbajo from "./assets/icoTrianRojoAbajo.svg";
import paloma from "./assets/icoPaloma.svg";
import IconFrecuencia from "./assets/icoFrecuencia.svg?react";
import alertRojo from "./assets/icoAlertRojo.svg";
import alertVerde from "./assets/icoAlertVerde.svg";
import alertAmarillo from "./assets/icoAlertAmarillo.svg";
import recordatorio from "./assets/icoRecordatorio.svg";

import GraficaReposoActividad from "./components/GraficaReposoActividad";
import GraficaDistribucion from "./components/GraficaDistribucion";
import { PERIODOS_REPOSO_ACTIVIDAD } from "./utils/reposoActividad.utils";

const CLAVE_STORAGE_REGISTROS_DIA = "frecuencia_cardiaca_registros_dia_v1";

// Transforma registros diarios a escala continua de tiempo (hora + minuto).
const construirSeriePorHora = (registrosDelDia) => {
  if (!registrosDelDia.length) {
    return [
      { hora: 0, ppm: null },
      { hora: 24, ppm: null },
    ];
  }

  return [...registrosDelDia]
    .sort(
      (a, b) =>
        new Date(a.fechaHoraISO).getTime() - new Date(b.fechaHoraISO).getTime(),
    )
    .map((registro) => {
      const fecha = new Date(registro.fechaHoraISO);
      const horaDecimal =
        fecha.getHours() + fecha.getMinutes() / 60 + fecha.getSeconds() / 3600;

      return {
        hora: horaDecimal,
        ppm: registro.ppm,
        fechaHoraISO: registro.fechaHoraISO,
      };
    });
};

// Formatea fecha y hora para mostrar "dd-mm-yyyy hh:mm".
const formatearFechaHora = (fechaHoraISO) => {
  const fecha = new Date(fechaHoraISO);
  const dia = String(fecha.getDate()).padStart(2, "0");
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const anio = fecha.getFullYear();
  const hora = String(fecha.getHours()).padStart(2, "0");
  const minuto = String(fecha.getMinutes()).padStart(2, "0");
  return `${dia}-${mes}-${anio} ${hora}:${minuto}`;
};

// Obtiene clave de dia local en formato YYYY-MM-DD.
const obtenerClaveDiaLocal = (fechaEntrada) => {
  const fecha =
    fechaEntrada instanceof Date ? fechaEntrada : new Date(fechaEntrada);
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
};

// Filtra solo registros que pertenecen a la clave de dia indicada.
const filtrarRegistrosPorDia = (registros, claveDia) =>
  registros.filter(
    (registro) => obtenerClaveDiaLocal(registro.fechaHoraISO) === claveDia,
  );

const normalizarLecturaPromedio = (lectura) => {
  const minimo = Number(lectura?.minimo);
  const maximo = Number(lectura?.maximo);

  if (!Number.isFinite(minimo) || !Number.isFinite(maximo)) {
    return null;
  }

  return {
    min: Math.min(minimo, maximo),
    max: Math.max(minimo, maximo),
  };
};

const leerEstadoPersistido = (claveDiaActual) => {
  try {
    const textoGuardado = localStorage.getItem(CLAVE_STORAGE_REGISTROS_DIA);
    if (!textoGuardado) {
      return {
        claveDiaRegistros: claveDiaActual,
        registrosDelDia: filtrarRegistrosPorDia(
          registrosFrecuenciaDiariaMock,
          claveDiaActual,
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
      claveDiaActual,
    ),
  };
};

//tarjeta rango frecuencias

export function RangoFrecuencias({ minDia, maxDia }) {
  const formatRango = () => {
    if (typeof minDia !== "number" || typeof maxDia !== "number") {
      return (
        <>
          -- -- <span>ppm</span>
        </>
      );
    }
    return (
      <>
        {minDia} - {maxDia} <span>ppm</span>
      </>
    );
  };

  return (
    <div className={styles.RangoFrecuencias}>
      <div className={styles.txt}>
        <p>
          Rango de <br /> frecuencia cardiaca
        </p>
        <p>{formatRango()}</p>
      </div>

      <div className={styles.icon}>
        <IconFrecuencia />
      </div>
    </div>
  );
}

//tarjeta valores de referencia
const ValoresReferencia = () => {
  return (
    <div className={styles.ValoresReferencia}>
      <p>Valores de referencia</p>

      <div className={styles.referencias}>
        <div className={styles.valores}>
          <p>Mayor a 120</p>
          <p>101 - 120</p>
          <p>60 - 100</p>
          <p>Menor a 60</p>
        </div>
        <div className={styles.nombres}>
          <p>Taquicardia (Severa)</p>
          <p>Taquicardia (Leve)</p>
          <p>Frecuencia cardiaca normal</p>
          <p>Bradicardia</p>
        </div>
        <div className={styles.iconos}>
          <div className={styles.roja}></div>
          <div className={styles.amarilla}></div>
          <div className={styles.verde}></div>
          <div className={styles.roja}></div>
        </div>
      </div>
    </div>
  );
};

//Tarjeta Comparacion semanal
const ComparaciónSemanal = ({ promAct, promAnt }) => {
  let diferenciaPromedio = (promAnt - promAct) * -1;
  /* let valorPresente = promAnt - diferenciaPromedio; */

  let triangulo; /*  */
  switch (true) {
    case promAct > 121 && diferenciaPromedio > 0:
      triangulo = rojoArriba;
      break;
    case promAct > 121 && diferenciaPromedio < 0:
      triangulo = rojoAbajo;
      break;
    case promAct >= 101 && promAct <= 120 && diferenciaPromedio > 0:
      triangulo = amariArriba;
      break;
    case promAct >= 101 && promAct <= 120 && diferenciaPromedio < 0:
      triangulo = amariAbajo;
      break;
    case promAct >= 60 && promAct <= 100 && diferenciaPromedio > 0:
      triangulo = verdeArriba;
      break;
    case promAct >= 60 && promAct <= 100 && diferenciaPromedio < 0:
      triangulo = verdeAbajo;
      break;
    case promAct < 60 && diferenciaPromedio > 0:
      triangulo = rojoArriba;
      break;
    case promAct < 60 && diferenciaPromedio < 0:
      triangulo = rojoAbajo;
      break;
    default:
      triangulo = paloma;
  }

  return (
    <div className={styles.ComparacionSemanal}>
      <p>
        Comparacion semanal <span>__{}</span>{" "}
      </p>
      <div>
        <p>Actual</p>
        <p>
          Senama <br />
          anterior
        </p>
      </div>
      <div className={styles.datos}>
        <p>PPM alta</p>
        <p>{promAct} ppm</p>
        <p>{promAnt} ppm</p>
        <img
          className={styles.icono}
          src={triangulo}
          alt="{Frecuencia cardiaca normal}"
        />
        <p>{diferenciaPromedio}</p>
      </div>
      <div className={styles.datos}>
        <p>PPM baja</p>
        <p>86 ppm</p>
        <p>89 ppm</p>
        <img className={styles.icono} src={arribaAlert} alt="{}" />
        <p>-3</p>
      </div>
    </div>
  );
};

// Alerta

const Alerta = ({ promAct }) => {
  const alertaContexto = {
    roja: {
      ico: alertRojo,
      alt: "Frecuencia cardiaca requiere atención",
      frase: "Tu Frecuencia cardiaca ha estado fuera de los rangos normales, te sugerimos consultar a tu medico",
      suger: "",
    },
    amarilla: {
      ico: alertAmarillo,
      alt: "Frecuencia cardiaca fuera de parametros",
      frase: "Tu Frecuencia cardiaca está fuera de los rango normales. Si esto persiste, cosulta a tu médico",
      suger: "",
    },
    verde: {
      ico: alertVerde,
      alt: "Frecuencia cardiaca dentro de parametros",
      frase: "Tu Frecuencia cardiaca se mantiene estable",
      suger: "Buen trabajo, estas cuidando bien tu salud",
    },
  };

  const tipoAlerta = promAct >= 121 || promAct <= 59 ? "roja" : promAct >= 60 && promAct <= 100 ? "verde" : "amarilla" ;
  const { ico, alt, frase, suger } = alertaContexto[tipoAlerta];

  return (
    <div className={styles.Alerta}>
      <img src={ico} alt={alt} />
      <p className={styles.frase}>{frase}</p>
      <p>{suger}</p>
    </div>
  );
};

// Pildora

const Pildora = () => {
  return (
    <div className={styles.cntPildora}>
      <p>0 ppm - 220 ppm </p>
      <div className={styles.pildora}></div>
      <p></p>
    </div>
  );
};

const FrecuenciaCardiaca = () => {
  const estadoInicialPersistido = useMemo(() => {
    const claveDiaActual = obtenerClaveDiaLocal(new Date());
    return leerEstadoPersistido(claveDiaActual);
  }, []);

  const [claveDiaRegistros, setClaveDiaRegistros] = useState(
    estadoInicialPersistido.claveDiaRegistros,
  );
  const [registrosDelDia, setRegistrosDelDia] = useState(
    estadoInicialPersistido.registrosDelDia,
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

  const opcionesFiltroPromedio = useMemo(
    () => construirOpcionesFiltroPromedio(registrosFrecuenciaHistorialMock),
    [],
  );

  const [valorFiltroPromedio, setValorFiltroPromedio] = useState(
    () => opcionesFiltroPromedio[PERIODOS_PROMEDIO.SEMANA]?.[0]?.valor ?? "",
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

  // Rango diario para la tarjeta "Rango de frecuencia cardiaca".
  const { minDia, maxDia } = useMemo(() => {
    const lecturasValidas = registrosDelDia
      .map((registro) => registro.ppm)
      .filter((ppm) => Number.isFinite(ppm));

    if (!lecturasValidas.length) {
      return { minDia: undefined, maxDia: undefined };
    }

    return {
      minDia: Math.min(...lecturasValidas),
      maxDia: Math.max(...lecturasValidas),
    };
  }, [registrosDelDia]);

  // Datos diarios de la grafica construidos desde el arreglo de registros.
  const serieGraficaDiaria = useMemo(
    () => construirSeriePorHora(registrosDelDia),
    [registrosDelDia],
  );

  // Valor principal mostrado arriba de la grafica.
  const valorDestacado = useMemo(() => {
    const registroActivo = serieGraficaDiaria.find(
      (item) => item.hora === horaActiva,
    );
    if (registroActivo?.ppm != null) return registroActivo.ppm;

    const ultimoConLectura = [...serieGraficaDiaria]
      .reverse()
      .find((item) => item.ppm != null);
    return ultimoConLectura?.ppm ?? null;
  }, [horaActiva, serieGraficaDiaria]);

  // Fecha/hora de ultima actualizacion basada en el ultimo registro del dia.
  const fechaActualizacionTexto = useMemo(() => {
    const ultimoRegistro = registrosDelDia[registrosDelDia.length - 1];
    if (!ultimoRegistro) return "--";
    return formatearFechaHora(ultimoRegistro.fechaHoraISO);
  }, [registrosDelDia]);

  const manejarClickAgregar = () => {
    verificarCambioDeDia();
    // Paso 3: abrir modal con fecha/hora del momento y valores base de captura.
    setFechaHoraCapturaISO(new Date().toISOString());
    setPpmCaptura("69");
    setFueActividad(false);
    setMensajeErrorCaptura("");
    setModalCapturaAbierto(true);
  };

  const manejarCambioPeriodoPromedio = (periodo) => {
    setPeriodoPromedioSeleccionado(periodo);
  };

  const cerrarModalCaptura = () => {
    setMensajeErrorCaptura("");
    setModalCapturaAbierto(false);
  };

  const cerrarModalConfirmacion = () => {
    setModalConfirmacionAbierto(false);
  };

  const aceptarModalCaptura = () => {
    if (verificarCambioDeDia()) return;
    // Paso 4: validar captura y agregar registro diario para repintar grafica.
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
    const nuevoRegistro = {
      id: `reg-${Date.now()}`,
      fechaHoraISO: fechaRegistroISO,
      ppm: Math.round(ppmNumero),
      tipoRegistro: fueActividad ? "actividad" : "reposo",
    };

    setRegistrosDelDia((registrosActuales) => {
      const siguientesRegistros = [...registrosActuales, nuevoRegistro];
      siguientesRegistros.sort(
        (a, b) =>
          new Date(a.fechaHoraISO).getTime() -
          new Date(b.fechaHoraISO).getTime(),
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

  // Mantiene un filtro valido al cambiar periodo o disponibilidad de datos.
  useEffect(() => {
    const opcionesPeriodoActual =
      opcionesFiltroPromedio[periodoPromedioSeleccionado] ?? [];

    const filtroExiste = opcionesPeriodoActual.some(
      (opcion) => opcion.valor === valorFiltroPromedio,
    );

    if (!filtroExiste) {
      setValorFiltroPromedio(opcionesPeriodoActual[0]?.valor ?? "");
    }
  }, [
    opcionesFiltroPromedio,
    periodoPromedioSeleccionado,
    valorFiltroPromedio,
  ]);

  // Persiste registros diarios para conservarlos al refrescar.
  useEffect(() => {
    try {
      localStorage.setItem(
        CLAVE_STORAGE_REGISTROS_DIA,
        JSON.stringify({
          claveDiaRegistros,
          registrosDelDia,
        }),
      );
    } catch {
      // Si localStorage no esta disponible, ignoramos sin romper el flujo.
    }
  }, [claveDiaRegistros, registrosDelDia]);

  const opcionesFiltroActualPromedio =
    opcionesFiltroPromedio[periodoPromedioSeleccionado] ?? [];

  const seriePromedioFrecuencia = useMemo(
    () =>
      construirSeriePromedio({
        registros: registrosFrecuenciaHistorialMock,
        periodo: periodoPromedioSeleccionado,
        valorFiltro: valorFiltroPromedio,
      }),
    [periodoPromedioSeleccionado, valorFiltroPromedio],
  );

  const lecturaPromedioSeleccionada = useMemo(() => {
    if (!seriePromedioFrecuencia.length) return null;

    const lecturaActual = normalizarLecturaPromedio(
      seriePromedioFrecuencia[indiceLecturaPromedioSeleccionada],
    );
    if (lecturaActual) return lecturaActual;

    const primeraLecturaValida = seriePromedioFrecuencia.find((lectura) =>
      normalizarLecturaPromedio(lectura),
    );

    return normalizarLecturaPromedio(primeraLecturaValida);
  }, [indiceLecturaPromedioSeleccionada, seriePromedioFrecuencia]);

  useEffect(() => {
    const indiceValido = seriePromedioFrecuencia.findIndex((lectura) =>
      normalizarLecturaPromedio(lectura),
    );

    setIndiceLecturaPromedioSeleccionada(
      indiceValido >= 0 ? indiceValido : null,
    );
  }, [seriePromedioFrecuencia]);

  return (
    <>
      <div className={styles.cntGraficaDiaria}>
        <GraficaFrecuenciaCardiacaDiaria
          serieGrafica={serieGraficaDiaria}
          valorDestacado={valorDestacado}
          fechaActualizacionTexto={fechaActualizacionTexto}
          onHoraActivaChange={setHoraActiva}
          onAgregarClick={manejarClickAgregar}
        />
        <ModalCapturaFrecuencia
          abierto={modalCapturaAbierto}
          fechaHoraISO={fechaHoraCapturaISO}
          ppmCaptura={ppmCaptura}
          fueActividad={fueActividad}
          mensajeError={mensajeErrorCaptura}
          onPpmChange={setPpmCaptura}
          onFueActividadChange={setFueActividad}
          onCerrar={cerrarModalCaptura}
          onAceptar={aceptarModalCaptura}
        />
        <ModalConfirmacionFrecuencia
          abierto={modalConfirmacionAbierto}
          fechaHoraTexto={fechaHoraConfirmacionTexto}
          onCerrar={cerrarModalConfirmacion}
        />

        <div className={styles.Tarjetas}>
          <MarcoTarjeta>
            <RangoFrecuencias minDia={minDia} maxDia={maxDia} />
          </MarcoTarjeta>

          <MarcoTarjeta>
            <ValoresReferencia />
          </MarcoTarjeta>

          <MarcoTarjeta>
            <ComparaciónSemanal promAct={65} promAnt={80} />
          </MarcoTarjeta>
        </div>
        <div className={styles.promedios}>
          <GraficaPromedioFrecuencia
            periodoSeleccionado={periodoPromedioSeleccionado}
            opcionesFiltro={opcionesFiltroActualPromedio}
            valorFiltro={valorFiltroPromedio}
            serie={seriePromedioFrecuencia}
            indiceSeleccionado={indiceLecturaPromedioSeleccionada}
            onPeriodoChange={manejarCambioPeriodoPromedio}
            onFiltroChange={setValorFiltroPromedio}
            onLecturaSelect={setIndiceLecturaPromedioSeleccionada}
          />

          <Capsula
            min={lecturaPromedioSeleccionada?.min}
            max={lecturaPromedioSeleccionada?.max}
          />

          <GraficaReposoActividad
            periodoSeleccionado={periodoComparativaSeleccionado}
            valorFiltro={valorFiltroComparativa}
            onPeriodoChange={setPeriodoComparativaSeleccionado}
            onFiltroChange={setValorFiltroComparativa}
          />
        </div>

        <div className={styles.alertas}>

          <GraficaDistribucion
            periodoSeleccionado={periodoComparativaSeleccionado}
            valorFiltro={valorFiltroComparativa}
          />
          
          <div className={styles.cntMsj}>
              <MarcoTarjeta>
                <Alerta promAct={60} />
              </MarcoTarjeta>

              <div className={styles.recordatorio}>
                <img src={recordatorio} alt="Recordatorio" />
                <p>
                  Recuerda que tu frecuencia cardiaca puede cambiar según tu
                  nivel de actividad, el estrés, el sueño o incluso si tomas
                  café o fumas. Es normal que varíe a lo largo del día. <br />
                  <br /> * PPM: Pulsaciones por minuto{" "}
                </p>
              </div>
          </div>
          
        </div>

      </div>
    </>
  );
};

export default FrecuenciaCardiaca;
