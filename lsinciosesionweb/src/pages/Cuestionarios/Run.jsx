// src/pages/Cuestionarios/Run.jsx
import React, { useEffect, useState } from "react";
import { useParams, Navigate } from "react-router-dom";
import Principal from "@/Layout/Principal";

// ⬇️ Ajusta la ruta real
import PlantillaQs from "@/pages/Cuestionarios/PlantillaQs";

import { findArea, findQuestionnaire } from "@/config/cuestionarios.config";

export default function CuestionarioRun() {
  const { area, key } = useParams();
  const areaData = findArea(area);
  const qMeta = areaData ? findQuestionnaire(area, key) : null;

  const [schema, setSchema] = useState(null);

  useEffect(() => {
    let ok = true;
    (async () => {
      if (qMeta?.file) {
        const mod = await qMeta.file();
        if (!ok) return;
        setSchema(mod.default || mod);
      }
    })();
    return () => {
      ok = false;
    };
  }, [qMeta]);

  if (!areaData || !qMeta) return <Navigate to="/cuestionarios" replace />;
  if (!schema)
    return (
      <Principal>
        <div style={{ padding: 16 }}>Cargando cuestionario…</div>
      </Principal>
    );

  return (
    <Principal>
      <PlantillaQs cuestionario={schema} forceArea={areaData.area3D} />
    </Principal>
  );
}
