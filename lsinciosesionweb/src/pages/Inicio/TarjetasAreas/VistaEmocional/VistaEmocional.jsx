import React, { useEffect, useState } from 'react'
import styles from './VistaEmocional.module.css'

import ListaCuestionarios from "../ListaCuestionarios";
import { findArea } from "@/config/cuestionarios.config";
import { getCurrentProfile } from "@/utils/profile";
import { getProgressSummary, progressState } from "@/utils/progreso";

// Traduce el estado de progreso real al codigo de tarjeta (edo1..edo4).
function estadoParaTarjeta(percent) {
  const estado = progressState(percent);
  if (estado === "completado") return "edo1";
  if (estado === "progreso") return "edo2";
  return "edo3";
}

// Tab "Bienestar Emocional" del Inicio: lista los instrumentos reales del area
// (cuestionarios.config.js) con su progreso guardado y navega al runner.
const VistaEmocional = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    let ok = true;
    (async () => {
      const area = findArea("emocional");
      const profile = getCurrentProfile();

      const base = await Promise.all(
        (area?.questionnaires || [])
          .filter((q) => !q.profiles || q.profiles.includes(profile)) // gating por perfil
          .map(async (meta) => {
            let desc = meta.description;
            try {
              const mod = await meta.file();
              const schema = mod.default || mod;
              if (schema?.description) desc = schema.description;
            } catch { /* se queda con la descripcion del catalogo */ }

            const { percent, answeredCount, visiblesCount } =
              getProgressSummary(meta.key);

            return {
              key: meta.key,
              titulo: meta.name,
              descripcion: desc,
              edoQs: estadoParaTarjeta(percent),
              av: percent,
              n_items: visiblesCount,
              n_responses: answeredCount,
              href: `/cuestionarios/emocional/${meta.key}`,
            };
          })
      );

      if (!ok) return;
      setItems(base);
    })();
    return () => { ok = false; };
  }, []);

  return (
    <div className={styles.VistaEmocional}>
      <h3>Mis Cuestionarios</h3>
      <p>
        Tu bienestar emocional también importa. Estos cuestionarios te ayudan
        a reconocer cómo te sientes, manejar el estrés y mantenerte en
        equilibrio contigo mismo.
      </p>
      <ListaCuestionarios items={items} />
    </div>
  )
}

export default VistaEmocional
