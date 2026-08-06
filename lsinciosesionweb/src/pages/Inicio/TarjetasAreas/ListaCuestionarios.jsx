import React, { useEffect, useState } from "react";
import styles from "./ListaCuestionarios.module.css";

import BotonesQs from "./TarjetasEstadosQs/BotonesQs";
import TarjetaBsEdoQs from "./TarjetasEstadosQs/TarjetaBsEdoQs";

// Listado reutilizable de cuestionarios para los tabs del Inicio.
// Recibe items normalizados:
//   { key, titulo, descripcion, edoQs, av, n_items, n_responses, href? }
// Renderiza la lista en columna con scroll vertical (scrollbar delgado) y
// el detalle de la tarjeta seleccionada a la derecha.
const ListaCuestionarios = ({ items = [] }) => {
  const [activo, setActivo] = useState(0);

  // Si la lista cambia (carga async o cambio de perfil), mantiene la
  // seleccion dentro de rango.
  useEffect(() => {
    setActivo((actual) => (actual >= items.length ? Math.max(0, items.length - 1) : actual));
  }, [items.length]);

  const tarjeta = items[activo];

  if (!items.length) {
    return (
      <p className={styles.vacio}>
        Aún no hay cuestionarios disponibles para tu perfil.
      </p>
    );
  }

  return (
    <div className={styles.cntDin}>
      <div className={styles.cntCmp}>
        {items.map((item, i) => (
          <BotonesQs
            key={item.key}
            titulo={item.titulo}
            edoQs={item.edoQs}
            av={item.av}
            activo={activo === i}
            onClick={() => setActivo(i)}
          />
        ))}
      </div>
      <div className={styles.cntStd}>
        {tarjeta && (
          <TarjetaBsEdoQs
            titQs={tarjeta.titulo}
            desQs={tarjeta.descripcion}
            edoQs={tarjeta.edoQs}
            n_items={tarjeta.n_items}
            n_responses={tarjeta.n_responses}
            href={tarjeta.href}
          />
        )}
      </div>
    </div>
  );
};

export default ListaCuestionarios;
