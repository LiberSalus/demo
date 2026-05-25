import React, { useState, useRef, useEffect } from 'react'
import styles from './inputs.module.css'
import icoChevron from './icoChevron.svg'

const InpSelect = ({
  opciones = [],
  value,
  onChange,
  placeholder = 'selecciona',
  estilos = {},
  maxVisibleHeight = 200 // altura máxima visible en px
}) => {
  const [expanded, setExpanded] = useState(false);
  const panelRef = useRef(null);
  const [panelHeight, setPanelHeight] = useState(0);

  useEffect(() => {
    if (panelRef.current) {
      setPanelHeight(panelRef.current.scrollHeight);
    }
  }, [opciones]);

  return (
    <div className={`${styles.InpSelect} ${estilos.contenedor || ''}`}>
      <button
        className={`${styles.botonMain} ${expanded ? styles.expandedBtn : ''} ${estilos.botonMain || ''}`}
        onClick={() => setExpanded(!expanded)}
        aria-haspopup="listbox"
        aria-expanded={expanded}
      >
        {opciones.find(o => o.value === value)?.label || placeholder}
        <img className={styles.iconoFlecha} src={icoChevron} alt="Chevron" />
      </button>

      <div
        ref={panelRef}
        role="listbox"
        className={`${styles.panelOpciones} ${estilos.panelOpciones || ''}`}
        style={{
          maxHeight: expanded ? `${Math.min(panelHeight, maxVisibleHeight)}px` : '0',
          opacity: expanded ? 1 : 0,
          overflowY: panelHeight > maxVisibleHeight ? 'auto' : 'hidden',
          transition: 'max-height 0.4s ease, opacity 0.3s ease'
        }}
      >
        {opciones.map((opcion, idx) => (
          <button
            key={idx}
            role="option"
            aria-selected={value === opcion.value}
            className={`${styles.opcion} ${estilos.opcion || ''}`}
            onClick={() => {
              onChange(opcion.value);
              setExpanded(false);
            }}
          >
            {opcion.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default InpSelect;
