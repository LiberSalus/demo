import React, { useEffect } from "react";
import styles from "./ModalGlass.module.css";

/**
 * Modal con efecto glassmorfismo.
 * @param {boolean} abierto - Controla si el modal está visible
 * @param {function} onCerrar - Callback al cerrar (click en overlay o X)
 * @param {string} titulo - Título del modal
 * @param {React.ReactNode} children - Contenido del modal
 * @param {string} textoBotonConfirmar - Texto del botón de confirmar
 * @param {string} textoBotonCancelar - Texto del botón de cancelar
 * @param {function} onConfirmar - Callback al confirmar
 * @param {string} variante - 'peligro' | 'advertencia' | 'info' (cambia color del botón confirmar)
 */
const ModalGlass = ({
  abierto = false,
  onCerrar,
  titulo = "",
  children,
  textoBotonConfirmar = "Aceptar",
  textoBotonCancelar = "Cancelar",
  onConfirmar,
  variante = "info",
}) => {
  // Bloquear scroll del body cuando el modal está abierto
  useEffect(() => {
    if (abierto) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [abierto]);

  // Cerrar con Escape
  useEffect(() => {
    const manejarEscape = (e) => {
      if (e.key === "Escape" && abierto) {
        onCerrar?.();
      }
    };
    document.addEventListener("keydown", manejarEscape);
    return () => document.removeEventListener("keydown", manejarEscape);
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  const claseBotonConfirmar = `${styles.boton} ${styles.botonConfirmar} ${styles[`variante${variante.charAt(0).toUpperCase() + variante.slice(1)}`]}`;

  return (
    <div className={styles.overlay} onClick={onCerrar}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className={styles.cerrar}
          onClick={onCerrar}
          aria-label="Cerrar"
        >
          ×
        </button>

        {titulo && <h3 className={styles.titulo}>{titulo}</h3>}

        <div className={styles.contenido}>{children}</div>

        <div className={styles.acciones}>
          <button
            type="button"
            className={`${styles.boton} ${styles.botonCancelar}`}
            onClick={onCerrar}
          >
            {textoBotonCancelar}
          </button>
          {onConfirmar && (
            <button
              type="button"
              className={claseBotonConfirmar}
              onClick={onConfirmar}
            >
              {textoBotonConfirmar}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ModalGlass;
