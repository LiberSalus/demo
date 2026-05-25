import styles from "./ModalResultadoPresion.module.css"
import icoPresion from "./icoPresion.svg"
import icoAlertaTriangulo from "./icoAlertaTriangulo.svg"

const MENSAJES_ALERTA = {
  alta:
    "Registraste una presión arterial alta. Respira, descansa y vuelve a medir. Si estos números se mantienen, considera una revisión médica.",
  baja:
    "Registraste una presión arterial baja. Respira, descansa y vuelve a medir. Si estos números se mantienen, considera una revisión médica.",
}

const ModalResultadoPresion = ({
  abierto,
  variante = "normal",
  fechaHoraTexto = "--",
  onCerrar,
}) => {
  if (!abierto) return null

  const esAlerta = variante !== "normal"
  const mensajeAlerta = variante === "baja" ? MENSAJES_ALERTA.baja : MENSAJES_ALERTA.alta

  return (
    <div className={styles.overlay} role="presentation" onClick={onCerrar}>
      <div
        className={`${styles.modal} ${esAlerta ? styles.modalAlerta : styles.modalConfirmacion}`}
        role="dialog"
        aria-modal="true"
        aria-label={esAlerta ? "Resultado de lectura de presion arterial" : "Confirmacion de lectura de presion arterial"}
        onClick={(evento) => evento.stopPropagation()}
      >
        {esAlerta ? (
          <div className={styles.alertaContenido}>
            <img
              className={styles.iconoAlerta}
              src={icoAlertaTriangulo}
              alt="Lectura de presion arterial fuera de rango normal"
            />
            <p className={styles.mensajeAlerta}>{mensajeAlerta}</p>
          </div>
        ) : (
          <>
            <img
              className={styles.iconoConfirmacion}
              src={icoPresion}
              alt="Lectura de presion arterial registrada correctamente"
            />
            <p className={styles.tituloConfirmacion}>
              Actualizaste tu presión arterial correctamente
            </p>
            <p className={styles.fecha}>{fechaHoraTexto}</p>
          </>
        )}

        <button type="button" className={styles.botonAceptar} onClick={onCerrar}>
          Aceptar
        </button>
      </div>
    </div>
  )
}

export default ModalResultadoPresion
