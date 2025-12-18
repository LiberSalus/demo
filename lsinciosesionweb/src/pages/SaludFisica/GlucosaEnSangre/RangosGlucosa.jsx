import React from "react";
import styles from "./RangosGlucosa.module.css";
import gluco from "./icoGlucosa.svg";
import { getEstadoGlucosa } from "./utilsGlucosa";

const RangosGlucosa = ({ ayunas, comida }) => {
  const hayAyunas = ayunas !== null && ayunas !== undefined;
  const hayComida = comida !== null && comida !== undefined;

  const estadoAyunas = hayAyunas ? getEstadoGlucosa(ayunas, "ayunas") : null;
  const estadoComida = hayComida ? getEstadoGlucosa(comida, "comida") : null;

  return (
    <div className={styles.RangosGlucosa}>
      <div className={styles.info}>
        <p className={styles.titulo}>Rango de glucosa en sangre</p>

        {hayAyunas || hayComida ? (
          <div className={styles.datos}>
            {hayAyunas && (
              <div className={styles.bloque}>
                <span
                  className={styles.color}
                  style={{ background: estadoAyunas?.color }}
                />
                <div className={styles.txt}>
                  <p>En ayunas</p>
                  <p>{ayunas} mg/dL</p>
                  <p className={styles.estado} style={{ color: estadoAyunas?.color }}>{estadoAyunas?.estado}</p>
                </div>
              </div>
            )}

            {hayComida && (
              <div className={styles.bloque}>
                <span
                  className={styles.color}
                  style={{ background: estadoComida?.color }}
                />
                <div className={styles.txt}>
                  <p>Después de comer</p>
                  <p>{comida} mg/dL</p>
                  <p className={styles.estado} style={{ color: estadoComida?.color }} >{estadoComida?.estado}</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className={styles.sinRegistro}>Sin registro</p>
        )}
      </div>

      <div className={styles.cntIco}>
        <img className={styles.ico} src={gluco} alt="Glucosa" />
      </div>
    </div>
  );
};

export default RangosGlucosa;
