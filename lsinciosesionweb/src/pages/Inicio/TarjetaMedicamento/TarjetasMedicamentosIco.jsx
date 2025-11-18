// mesat/src/components/TarjetaMedicamento/TarjetasMedicamentosIco.jsx
import React from "react";
import TarjetaMedicamentoIco from "./TarjetaMedicamentoIco";
import { medicamentos } from "./datosMedicamentos.js";
import styles from "./TarjetasMedicamentos.module.css";
import "./animaIcoMedicamentos.css";

// Importamos SVG como componentes React con ?react
import JarabeIcon from "./icoJarabe.svg?react";
import TabletaIcon from "./icoTableta.svg?react";
import CapsulaIcon from "./icoCapsula.svg?react";
import InyeccionIcon from "./icoInyeccion.svg?react";

const iconos = {
  jarabe: JarabeIcon,
  tableta: TabletaIcon,
  inyeccion: InyeccionIcon,
  capsula: CapsulaIcon,
};

const TarjetasMedicamentosIco = () => {
  return (
    <>
        
      <div className={styles.cntTarjetasMedicamentos}>

        {medicamentos.map((medicamento) => {
          const nombreIcono = medicamento.icono
            ?.toLowerCase()
            .replace(/\d/g, "")
            .trim(); // "1 inyeccion" -> "inyeccion", "Jarabe" -> "jarabe"

          const IconComp = iconos[nombreIcono] || TabletaIcon;

          return (
            <TarjetaMedicamentoIco
              key={medicamento.id}
              {...medicamento}
              // 👇 pasamos un ELEMENTO React ya instanciado
              icono={<IconComp />}
              tipoIcono={nombreIcono || "tableta"}
            />
          );
        })}
      </div>
    </>
  );
};

export default TarjetasMedicamentosIco;
