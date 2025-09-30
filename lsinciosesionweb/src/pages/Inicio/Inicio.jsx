import React, { useEffect, useState } from "react";
import Principal from "@/Layout/Principal";
import styles from "./inicio.module.css"; // opcional

export default function Inicio() {
  const [nombre, setNombre] = useState("Usuario");

  useEffect(() => {
    try {
      const raw = localStorage.getItem("perfil_min");
      if (raw) {
        const p = JSON.parse(raw);
        if (p?.nombre) setNombre(p.nombre);
      }
    } catch {}
  }, []);

  return (
    <Principal>
      <div className={styles?.wrap || ""} style={{ padding: "24px" }}>
        <h2 style={{ marginBottom: 8 }}>¡Hola, {nombre}!</h2>
        <p>Bienvenido a tu panel. Aquí verás tu resumen y accesos rápidos.</p>

        {/* aquí luego pones tus tarjetas: progreso global, accesos, etc. */}
      </div>
    </Principal>
  );
}
