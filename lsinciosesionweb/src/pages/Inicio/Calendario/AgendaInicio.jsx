import React, { useEffect, useState } from "react";
import dayjs from "dayjs";

import styles from "../inicio.module.css";
import CalendarioInicio from "./CalendarioInicio";
import TarjetasMedicamentosIco from "../TarjetaMedicamento/TarjetasMedicamentosIco";
import TarjetasCitas from "../TarjetasCitas/TarjetasCitas";
import AgendaCarrusel from "./AgendaCarrusel";
import useAgendaAlerts from "./useAgendaAlerts";
import useAgendaCarousel from "./useAgendaCarousel";
import { loadCitasPorFecha, saveCitasPorFecha } from "./storageCitas";

const CITAS_INICIALES = {
  "2025-11-19": [
    {
      id: 1,
      medico: "Dra. Regina Bustos Díaz",
      especialidad: "Cardiología",
      horario: "10:30 am - 11:00 am",
      tipo: "presencial",
      lugar: "Hospital San Ángel Inn, Torre Mitikah piso 17",
      notas: "Llevar resultados de laboratorio.",
    },
  ],
};

export default function AgendaInicio() {
  const [medicamentos, setMedicamentos] = useState(() => {
    try {
      const datosGuardados = localStorage.getItem("ls_medicamentos_rules");
      return datosGuardados ? JSON.parse(datosGuardados) : [];
    } catch {
      return [];
    }
  });
  const [idMedicamentoSeleccionado, setIdMedicamentoSeleccionado] = useState(null);
  const [seccionActivaAgenda, setSeccionActivaAgenda] = useState("citas");
  const [modalAgendaAbierto, setModalAgendaAbierto] = useState(false);
  const [diaAgendaSeleccionado, setDiaAgendaSeleccionado] = useState(dayjs());
  const [citasPorFecha, setCitasPorFecha] = useState(() =>
    loadCitasPorFecha(CITAS_INICIALES)
  );

  const {
    refScrollMedicamentos,
    refScrollCitas,
    estadoScroll,
    desplazarTarjetas,
  } = useAgendaCarousel([medicamentos, citasPorFecha, diaAgendaSeleccionado]);

  useAgendaAlerts(citasPorFecha, medicamentos);

  useEffect(() => {
    try {
      localStorage.setItem("ls_medicamentos_rules", JSON.stringify(medicamentos));
    } catch {
      null;
    }
  }, [medicamentos]);

  useEffect(() => {
    saveCitasPorFecha(citasPorFecha);
  }, [citasPorFecha]);

  const abrirModalMedicamentos = ({ day, medId } = {}) => {
    setSeccionActivaAgenda("medicamento");

    if (day?.$d) setDiaAgendaSeleccionado(day);
    if (typeof day === "number") setDiaAgendaSeleccionado(dayjs(day));
    if (medId != null) setIdMedicamentoSeleccionado(medId);

    setModalAgendaAbierto(true);
  };

  const abrirModalCitas = (cita) => {
    setDiaAgendaSeleccionado(dayjs(cita._ts));
    setSeccionActivaAgenda("citas");
    setModalAgendaAbierto(true);
  };

  const manejarCambioColorMedicamento = ({ medId, color }) => {
    setMedicamentos((medicamentosPrevios) =>
      (medicamentosPrevios || []).map((medicamento) =>
        String(medicamento?.id) === String(medId)
          ? { ...medicamento, colorBarra: color }
          : medicamento
      )
    );
  };

  const manejarScroll = (direccion, clave) => {
    const ref = clave === "citas" ? refScrollCitas : refScrollMedicamentos;
    desplazarTarjetas(ref, direccion, clave);
  };

  return (
    <div className={styles.cntAgenda}>
      <div className={styles.agenda}>
        <CalendarioInicio
          compact
          citasPorFecha={citasPorFecha}
          setCitasPorFecha={setCitasPorFecha}
          externalSelectedDate={diaAgendaSeleccionado}
          externalOpen={modalAgendaAbierto}
          onExternalClose={() => setModalAgendaAbierto(false)}
          onExternalDateChange={setDiaAgendaSeleccionado}
          medicamentos={medicamentos}
          setMedicamentos={setMedicamentos}
          selectedMedId={idMedicamentoSeleccionado}
          setSelectedMedId={setIdMedicamentoSeleccionado}
          focusSection={seccionActivaAgenda}
        />
      </div>

      <hr className={styles.hr} />

      <div className={styles.cntTarjetasAlertas}>
        <AgendaCarrusel
          titulo="Mis medicamentos"
          claveScroll="medicamentos"
          claseViewport={styles.viewportMedicamentos}
          refScroll={refScrollMedicamentos}
          estadoScroll={estadoScroll}
          alDesplazar={manejarScroll}
        >
          <TarjetasMedicamentosIco
            medicamentos={medicamentos}
            day={diaAgendaSeleccionado}
            onOpenMedicamento={(payload) => abrirModalMedicamentos(payload || {})}
            onChangeMedicamentoColor={manejarCambioColorMedicamento}
          />
        </AgendaCarrusel>

        <AgendaCarrusel
          titulo="Mis citas"
          claveScroll="citas"
          claseViewport={styles.viewportCitas}
          refScroll={refScrollCitas}
          estadoScroll={estadoScroll}
          alDesplazar={manejarScroll}
        >
          <TarjetasCitas
            citasPorFecha={citasPorFecha}
            day={diaAgendaSeleccionado}
            onOpenCita={abrirModalCitas}
          />
        </AgendaCarrusel>
      </div>
    </div>
  );
}
