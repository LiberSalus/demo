// src/components/Glucosa/RegistrosGlucosa.jsx
import React from "react";
import styles from "./RegistroGlucosa.module.css";

import abajoRojo from "./icoRojoAbajo.svg";
import arribaRojo from "./icoRojoArriba.svg";
import palomaVerde from "./icoVerdePaloma.svg";
import liber from './Logo.svg'
import pdf from './icoPDF.svg'


const MOCK_REGISTROS = [
  {
    fecha: "01 Dic 2025",
    hora: "07:18 am",
    valor: 95,
    estado: "Normal",
  },
  {
    fecha: "01 Dic 2025",
    hora: "07:28 pm",
    valor: 80,
    estado: "Normal",
  },
  {
    fecha: "05 Dic 2025",
    hora: "09:45 pm",
    valor: 115,
    estado: "Alta",
  },
  {
    fecha: "11 Dic 2025",
    hora: "12:15 am",
    valor: 57,
    estado: "Baja",
  },
];

const RegistrosGlucosa = ({ modo = "ayunas", periodo, fecha }) => {
  const tituloModo =
    modo === "ayunas"
      ? "Glucosa en sangre (en ayunas)"
      : "Glucosa en sangre (después de comer)";

  const descripcionPeriodo =
    periodo === "3m"
      ? "Últimos 3 meses"
      : periodo === "6m"
      ? "Últimos 6 meses"
      : `A partir de: ${fecha || "—"}`;

  return (
    <div className={styles.RegistrosGlucosa}>
      <header className={styles.encabezado}>
        <div className={styles.breadcrumb}>
          <span>Glucosa en sangre</span>
          <span>›</span>
          <span>Registros</span>
        </div>

        <button className={styles.btnPdf} type="button">
          Descargar PDF <img src={pdf} alt="descarga pdf"></img>
        </button>
      </header>

      <div className={styles.folio}>

        <div className={styles.cntIco}>
          <img className={styles.ico} src={liber}></img>
        </div>
        <div className={styles.cabeceraPaciente}>
          <div>
            <p>
              <strong>Nombre:</strong> Alex Velázquez
            </p>
            <p>
              <strong>Usuario:</strong> AL210691
            </p>
          </div>
          <div>
            <p>
              <strong>Fecha de generación:</strong> 05 - diciembre - 2025
            </p>
            <p>
              <strong>Periodo:</strong> {descripcionPeriodo}
            </p>
          </div>
        </div>

        <h3 className={styles.tituloTabla}>{tituloModo}</h3>

        <table className={styles.tabla}>
          <thead>
            <tr>
              <th>Fecha</th>
              <th>Hora</th>
              <th>&lt; 60</th>
              <th>70 - 100</th>
              <th>100 - 125</th>
              <th>&gt; 126</th>
              <th>Lectura</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody>
            {MOCK_REGISTROS.map((reg, index) => {
              let colMarca = "";
              if (reg.valor < 60) colMarca = "<60";
              else if (reg.valor >= 70 && reg.valor <= 100) colMarca = "70-100";
              else if (reg.valor >= 100 && reg.valor <= 125)
                colMarca = "100-125";
              else if (reg.valor >= 126) colMarca = ">126";

              const isNormal = reg.estado === "Normal";
              const isAlta = reg.estado === "Alta";
              const isBaja = reg.estado === "Baja";

              const iconoCelda = (rango) => {
                if (colMarca !== rango) return null;

                if (isNormal) {
                  return (
                    <img
                      src={palomaVerde}
                      alt="Normal"
                      className={styles.ico}
                    />
                  );
                }

                if (isBaja) {
                  return (
                    <img src={abajoRojo} alt="Baja" className={styles.ico} />
                  );
                }

                if (isAlta) {
                  return (
                    <img src={arribaRojo} alt="Alta" className={styles.ico} />
                  );
                }

                return null;
              };

              return (
                <tr key={index}>
                  <td>{reg.fecha}</td>
                  <td>{reg.hora}</td>
                  <td>{iconoCelda("<60")}</td>
                  <td>{iconoCelda("70-100")}</td>
                  <td>{iconoCelda("100-125")}</td>
                  <td>{iconoCelda(">126")}</td>
                  <td>{reg.valor} mg/dL</td>
                  <td
                    className={
                      isNormal
                        ? styles.estadoNormal
                        : isAlta
                        ? styles.estadoAlta
                        : styles.estadoBaja
                    }
                  >
                    {reg.estado}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={styles.paginacion}>
          <button>{"<"}</button>
          <button className={styles.activo}>1</button>
          <button>2</button>
          <button>3</button>
          <button>{">"}</button>
        </div>
      </div>
    </div>
  );
};

export default RegistrosGlucosa;
