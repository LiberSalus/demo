// src/components/Escena/AreaModel.jsx
import React, { Suspense, useMemo, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";

// Util: arma URL segura para dev/prod respetando basename (/panel)
const base = import.meta.env.BASE_URL || "/"; // en dev suele ser "/"
const urlFromPublic = (path) => `${base}${path.replace(/^\//, "")}`;

// --- Mapa de área -> modelo disponible en /public/models
// Usa los que realmente tienes; si luego agregas más, solo cambia aquí.
const MODEL_MAP = {
  "Físico":      urlFromPublic("models/Lee.glb"),
  "Mental":      urlFromPublic("models/Lee.glb"),           // placeholder
  "Social":      urlFromPublic("models/Lee.glb"),           // placeholder
  "Nutricional": urlFromPublic("models/Lee.glb"),           // placeholder
};

// --- Velocidades por área (sutiles)
const ROT_SPEED = {
  "Físico": 0.005,
  "Mental": 0.004,
  "Social": 0.006,
  "Nutricional": 0.0045,
};

// --- Modelo GLB genérico
function GLBModel({ url, rotate = true, speed = 0.005 }) {
  const { scene } = useGLTF(url, true);
  const ref = useRef();
  useFrame((_, delta) => {
    if (rotate && ref.current) {
      ref.current.rotation.y += speed * (delta * 60);
    }
  });
  return <primitive ref={ref} object={scene} position={[0, -0.2, 0]} />;
}

// --- Frame container con hover para pausar
function ModelFrame({ area }) {
  const url = MODEL_MAP[area] || MODEL_MAP["Físico"];
  const speed = ROT_SPEED[area] ?? 0.005;
  const [paused, setPaused] = useState(false);

  // Responsive DPR
  const dpr = useMemo(
    () => (window.devicePixelRatio ? [1, Math.min(2, window.devicePixelRatio)] : [1, 2]),
    []
  );

  return (
    <div
      style={{ width: "100%", height: "100%" }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      aria-label={`Modelo 3D área ${area}`}
    >
      <Canvas dpr={dpr} camera={{ position: [0.6, 0.6, 1.2], fov: 45 }}>
        <ambientLight intensity={0.9} />
        <directionalLight position={[2, 2, 2]} intensity={0.8} />
        <Suspense fallback={null}>
          <GLBModel url={url} rotate={!paused} speed={speed} />
        </Suspense>
        <OrbitControls
          enablePan={false}
          enableZoom={false}
          enableRotate={true}
          minPolarAngle={Math.PI / 3}
          maxPolarAngle={(Math.PI / 3) * 2}
        />
      </Canvas>
    </div>
  );
}

const AreaModel = ({ area = "Físico" }) => {
  return <ModelFrame area={area} />;
};

export default AreaModel;

// Preloads (usa las mismas URLs calculadas arriba)
useGLTF.preload(MODEL_MAP["Físico"]);
useGLTF.preload(MODEL_MAP["Mental"]);
useGLTF.preload(MODEL_MAP["Social"]);
useGLTF.preload(MODEL_MAP["Nutricional"]);
