import React from "react";
import GraficaFrecuenciaCardiacaDiaria from "./components/GraficaFrecuenciaCardiacaDiaria";
import GraficaPromedioFrecuencia from "./components/GraficaPropemidoFrecuencia";
import ModalCapturaFrecuencia from "./components/ModalCapturaFrecuencia";
import ModalConfirmacionFrecuencia from "./components/ModalConfirmacionFrecuencia";
import styles from "./FrecuenciaCardiaca.module.css";
import MarcoTarjeta from "./components/MarcoTarjeta";
import { useFrecuenciaCardiaca } from "./hooks/useFrecuenciaCardiaca";

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
  const {
    minDia,
    maxDia,
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
  } = useFrecuenciaCardiaca();

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
