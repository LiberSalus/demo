// mesat/src/components/PresionArterial/PresionArterial.jsx
import { useState } from "react";
import MedidorPresionArterial from "./MedidorPresionArterial";
import ModalPresionDiaria from "./ModalPresionDiaria";
import UltimosRegistros from "./UltimosRegistros";
import styles from "./PresionArterial.module.css";

import RangoPresionArterial from "./RangoPresionArterial";
import GraficaPresionArterial from "./GraficaPresionArterial";
import TabMedicamento from "./TabMedicamento";
import Adver from "./Adver";

const PresionArterial = () => {
  const [mostrarModal, setMostrarModal] = useState(false);
  const [lectura, setLectura] = useState(null);
  const [beatId, setBeatId] = useState(0);
  const [historial, setHistorial] = useState([]);
  const [ultimoEstado, setUltimoEstado] = useState("normal");

  const calcularEstado = (sistolica, diastolica) => {
    // aquí luego afinamos rangos clínicos, por ahora demo:
    if (sistolica < 120 && diastolica < 80) return "normal";
    if (sistolica < 140 && diastolica < 90) return "alerta";
    return "cuidado";
  };

  const horaTexto = lectura
    ? lectura.ts.toLocaleTimeString("es-MX", {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "—";

  const fechaTexto = lectura
    ? lectura.ts.toLocaleDateString("es-MX", {
        day: "2-digit",
        month: "short",
      })
    : "—";

  return (
    <div className={styles.PresionArterial}>
      <div className={styles.izq}>
        <RangoPresionArterial
          sistolica={lectura?.sistolica ?? null}
          diastolica={lectura?.diastolica ?? null}
        />

        <GraficaPresionArterial />
      </div>

      <div className={styles.cen}>
        <MedidorPresionArterial
          sistolica={lectura?.sistolica ?? 120}
          diastolica={lectura?.diastolica ?? 80}
          frecuencia={78}
          horaTexto={horaTexto}
          fechaTexto={fechaTexto}
          onAdd={() => setMostrarModal(true)}
          beatId={beatId}
        />
        <TabMedicamento />
      </div>

      <div className={styles.der}>
        <Adver estado={ultimoEstado} />
        <UltimosRegistros registros={historial} />

        {mostrarModal && (
          <ModalPresionDiaria
            defaultDate={new Date()}
            onClose={() => setMostrarModal(false)}
            onConfirm={(nuevaLectura) => {
              const estado = calcularEstado(
                nuevaLectura.sistolica,
                nuevaLectura.diastolica
              );

              const registro = {
                id: crypto.randomUUID?.() ?? Date.now(),
                ...nuevaLectura,
                estado,
                medicamento: "Enalapril", // luego vendrá de otro lado
              };

              setLectura(nuevaLectura);
              setHistorial((prev) => [...prev, registro]);
              setUltimoEstado(estado);
              setBeatId((prev) => prev + 1);
              setMostrarModal(false);
            }}
          />
        )}
      </div>
    </div>
  );
};

export default PresionArterial;
