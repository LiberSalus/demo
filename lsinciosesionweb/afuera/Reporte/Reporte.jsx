// src/components/Reporte/Reporte.jsx
import React, { useMemo } from "react";
import styles from "./Reporte.module.css";

import logo from "./Logo.svg";

// Íconos (los mismos que ya tienes)
import paloma from "./icoVerdePaloma.svg";
import rojoAbajo from "./icoRojoAbajo.svg";
import rojoArriba from "./icoRojoArriba.svg";
import doradoArriba from "./icoDoradoArriba.svg";
import doradoAbajo from "./icoDoradoAbajo.svg";
import naranjaAbajo from "./icoNaranjaAbajo.svg";

const ICONOS = {
  ok: paloma,
  low_red: rojoAbajo,
  high_red: rojoArriba,
  high_gold: doradoArriba,
  low_gold: doradoAbajo,
  low_orange: naranjaAbajo,
};

const formatearFechaReporte = (date = new Date()) => {
  return new Intl.DateTimeFormat("es-MX", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(date);
};

const formatearHoraReporte = (date = new Date()) => {
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }).format(date);
};

// Decide qué ícono usar para el estado (tu tabla actual usa Normal/Alta/Baja)
const iconKeyPorEstado = (estado) => {
  if (estado === "Normal") return "ok";
  if (estado === "Baja") return "low_red";
  if (estado === "Alta") return "high_red";
  return null;
};

// Qué columna de rango se marca según el valor
const resolverMarcaPorValor = (valor, metric) => {
  const rango = metric?.rangos?.find((r) => r.test(valor));
  return rango?.key ?? null;
};

const Reporte = ({
  perfil,
  metric,
  rows = [],
  fechaGeneracion = new Date(),
  showToolbar = true,
}) => {
  const fechaTxt = useMemo(
    () => formatearFechaReporte(fechaGeneracion),
    [fechaGeneracion]
  );
  const horaTxt = useMemo(
    () => formatearHoraReporte(fechaGeneracion),
    [fechaGeneracion]
  );

  return (
    <div className={styles.Reporte}>
      {/* Barra superior (botones solo pantalla) */}
      {/* <div className={styles.toolbar}>
        <button
          type="button"
          className={styles.btn}
          onClick={() => window.print()}
        >
          Imprimir / Guardar PDF
        </button>
      </div> */}

      {showToolbar && (
        <div className={styles.toolbar}>
          <button
            type="button"
            className={styles.btn}
            onClick={() => window.print()}
          >
            Imprimir / Guardar PDF
          </button>
        </div>
      )}

      {/* Logo */}
      <img src={logo} alt="LiberSalus" className={styles.logo} />

      {/* Header */}
      <div className={styles.header}>
        <div className={styles.col}>
          <div className={styles.labels}>
            <p>Nombre:</p>
            <p>Sexo:</p>
            <p>Edad:</p>
            <p>Usuario:</p>
          </div>
          <div className={styles.values}>
            <p>{perfil?.nombre ?? "—"}</p>
            <p>{perfil?.sexo ?? "—"}</p>
            <p>{perfil?.edad != null ? `${perfil.edad} años` : "—"}</p>
            <p>{perfil?.usuario ?? "—"}</p>
          </div>
        </div>

        <div className={styles.col}>
          <div className={styles.labels}>
            <p>Fecha:</p>
            <p>Hora:</p>
            <p>Padecimiento:</p>
          </div>
          <div className={styles.values}>
            <p>{fechaTxt}</p>
            <p>{horaTxt}</p>
            <p>{perfil?.padecimiento ?? "—"}</p>
          </div>
        </div>
      </div>

      {/* Título de la métrica (una sola por reporte) */}
      <div className={styles.tipoReporte}>
        <p>{metric?.titulo ?? "Reporte"}</p>
      </div>

      {/* Tabla (estable para impresión) */}
      <table className={styles.tabla}>
        <thead>
          <tr className={styles.trHead}>
            <th>Fecha</th>
            <th>Hora</th>

            {metric?.rangos?.map((r) => (
              <th key={r.key}>{r.label}</th>
            ))}

            <th>{metric?.lecturaLabel ?? "Lectura"}</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {rows.map((reg, idx) => {
            const marca = resolverMarcaPorValor(reg.valor, metric);
            const iconKey = iconKeyPorEstado(reg.estado);
            const iconSrc = iconKey ? ICONOS[iconKey] : null;

            const clsEstado =
              reg.estado === "Normal"
                ? styles.estadoNormal
                : reg.estado === "Alta"
                ? styles.estadoAlta
                : styles.estadoBaja;

            return (
              <tr key={idx} className={styles.trRow}>
                <td>{reg.fecha}</td>
                <td>{reg.hora}</td>

                {metric?.rangos?.map((r) => (
                  <td key={r.key} className={styles.tdIcon}>
                    {marca === r.key && iconSrc ? (
                      <img
                        className={styles.ico}
                        src={iconSrc}
                        alt={reg.estado}
                      />
                    ) : null}
                  </td>
                ))}

                <td>{reg.lectura ?? `${reg.valor} ${metric?.unidad ?? ""}`}</td>

                <td className={clsEstado}>{reg.estado}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Pie */}
      <div className={styles.pie}>
        <p>
          El original de este documento se encuentra en los archivos de Liber
          Salus S.A. de C.V. Por lo que el mal uso del mismo es responsabilidad
          del paciente.
        </p>
      </div>
    </div>
  );
};

export default Reporte;
