import React, { useEffect, useState } from "react";
import styles from "./inicio.module.css";

export default function Inicio() {
  const [nombre, setNombre] = useState("Usuario");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("perfil_min");
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.nombre) setNombre(p.nombre);
        // si guardas first/last_name:
        if (!p?.nombre && p?.first_name) {
          setNombre(`${p.first_name} ${p.last_name ?? ""}`.trim());
        }
      }
    } catch {}
  }, []);

  return (
    <div className={styles?.wrap || ""} style={{ padding: "24px" }}>
      <h2 style={{ marginBottom: 8 }}>¡Hola, {nombre}!</h2>
      <p>Bienvenido a tu panel. Aquí verás tu resumen y accesos rápidos.</p>
      {/* aquí tus tarjetas/widgets */}
    </div>
  );
}
