import styles from "./PresionArterial.module.css";
import GraficaDiariaPresionArterial from "./GraficaDiariaPresionArterial";
import MedidorPresionArterial from "./MedidorPresionArterial.jsx";
import ModalPresionDiaria from "./ModalPresionDiaria.jsx";
import ModalResultadoPresion from "./ModalResultadoPresion.jsx";
import ModalRecordatoriosPresion from "./ModalRecordatoriosPresion.jsx";
import GraficaPromediosPresion from "./GraficaPromediosPresion";
import GraficaDistribucionPresion from "./GraficaDistribucionPresion.jsx";
import TarjetaUltimoRegistroPresion from "./TarjetaUltimoRegistroPresion.jsx";
import TarjetaAlertasPresion from "./TarjetaAlertasPresion.jsx";
import TarjetaValoresReferenciaPresion from "./TarjetaValoresReferenciaPresion.jsx";
import AlertaPromedioPresion from "./AlertaPromedioPresion.jsx";
import ContextoPresionArterial from "./ContextoPresionArterial.jsx";
import usePresionArterialDashboard from "./usePresionArterialDashboard";
import {
  VALORES_REFERENCIA_PRESION,
  formatearFechaTexto,
  formatearHoraTexto,
  obtenerEstadoPresion,
} from "./presionArterial.utils";

const PresionArterialDashboard = () => {
  const dashboard = usePresionArterialDashboard();

  return (
    <div className={styles.PresionArterial}>
      <div className={styles.arriba}>
        <GraficaDiariaPresionArterial
          serieGrafica={dashboard.serieGraficaDiaria}
          fechaActualizacionTexto={dashboard.fechaActualizacionTexto}
        />

        <MedidorPresionArterial
          sistolica={dashboard.lecturaActual.sistolica}
          diastolica={dashboard.lecturaActual.diastolica}
          frecuencia={dashboard.ultimoRegistroFrecuencia?.ppm ?? null}
          horaTexto={formatearHoraTexto(dashboard.lecturaActual.fechaHoraISO)}
          fechaTexto={formatearFechaTexto(dashboard.lecturaActual.fechaHoraISO)}
          onAdd={dashboard.abrirModalCaptura}
          beatId={dashboard.beatId}
        />
      </div>

      <div className={styles.centro}>
        <TarjetaUltimoRegistroPresion
          estadoUltimoRegistro={dashboard.estadoUltimoRegistro}
          ultimoRegistro={dashboard.ultimoRegistro}
          ultimoRegistroFrecuencia={dashboard.ultimoRegistroFrecuencia}
          valorDiaAnterior={dashboard.valorDiaAnterior}
          obtenerEstadoPresion={obtenerEstadoPresion}
        />

        <TarjetaAlertasPresion
          ultimoRegistro={dashboard.ultimoRegistro}
          fechaActualizacionTexto={dashboard.fechaActualizacionTexto}
          onAdministrarRecordatorios={dashboard.abrirModalRecordatorios}
          resumenRecordatorio={dashboard.resumenRecordatorioPresion}
        />

        <TarjetaValoresReferenciaPresion
          valoresReferencia={VALORES_REFERENCIA_PRESION}
        />
      </div>

      <div className={styles.abajo}>
        <GraficaPromediosPresion
          periodoSeleccionado={dashboard.periodoPromedioSeleccionado}
          opcionesFiltro={dashboard.opcionesFiltroActualPromedio}
          valorFiltro={dashboard.valorFiltroPromedio}
          serie={dashboard.seriePromedioPresion}
          indiceSeleccionado={dashboard.indiceLecturaPromedioSeleccionada}
          onPeriodoChange={dashboard.setPeriodoPromedioSeleccionado}
          onFiltroChange={dashboard.setValorFiltroPromedio}
          onLecturaSelect={dashboard.setIndiceLecturaPromedioSeleccionada}
        />

        <GraficaDistribucionPresion
          registros={dashboard.registrosDistribucionPresion}
        />
      </div>

      <div className={styles.masAbajo}>
        <div className={styles.tarjetaAlertaPromedio}>
          <AlertaPromedioPresion promAct={dashboard.promAct} />
        </div>

        <ContextoPresionArterial />
      </div>

      {dashboard.modalAbierto && (
        <ModalPresionDiaria
          defaultDate={new Date()}
          onClose={dashboard.cerrarModalCaptura}
          onConfirm={dashboard.confirmarCaptura}
        />
      )}

      {dashboard.modalRecordatoriosAbierto && (
        <ModalRecordatoriosPresion
          recordatorios={dashboard.recordatoriosPresion}
          onClose={dashboard.cerrarModalRecordatorios}
          onSave={dashboard.guardarRecordatorioPresion}
          onDelete={dashboard.eliminarRecordatorioPresion}
          onToggle={dashboard.alternarRecordatorioPresion}
        />
      )}

      <ModalResultadoPresion
        abierto={dashboard.resultadoCaptura.abierto}
        variante={dashboard.resultadoCaptura.variante}
        fechaHoraTexto={dashboard.resultadoCaptura.fechaHoraTexto}
        onCerrar={dashboard.cerrarModalResultado}
      />
    </div>
  );
};

export default PresionArterialDashboard;
