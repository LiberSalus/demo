import React, { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF } from "@react-three/drei";
import { Box3, Vector3, AxesHelper } from "three";


function Modelo3D() {
  // Carga tu archivo GLB (ajusta la ruta según tu proyecto)
  const url = `${import.meta.env.BASE_URL}mona.glb`
  const { scene } = useGLTF(url);

  // Calcular bounding box y centro
  const box = new Box3().setFromObject(scene);
  const center = new Vector3();
  box.getCenter(center);

  return <primitive object={scene} scale={1} position={[0, -0.55, 0]} />;
}

export default function App() {
  return (
    <Canvas
      style={{
        height: "100%",
        width:  "100%",
        /* border: "2px dashed red" */
        
      }}
      camera={{
        position: [-2, 0, 5],
        fov: 35,
      }}
>
      {/* Ejes */}
      {/* <axesHelper args={[0.8]} position={[0, 0, 0]} /> */}
      
      {/* Luz ambiental */}
      <ambientLight intensity={1.5} color="white"/>
      
      {/* Luz direccional */}
      <directionalLight position={[3, 5, 3]} intensity={2.5} distance={5} castShadow/>
      
      {/* Tu modelo */}
      <Suspense fallback={null}>
        <Modelo3D />
      </Suspense>
      
      {/* Controles para rotar/zoom */}
      {/* <OrbitControls 
           enablePan={true}
          enableZoom={true}
        enableRotate={true}
      /> */}

        {/* ---ejemplos de movimiento--- */}

        {/* OrbitControls: orbitar alrededor del objeto */}
      <OrbitControls
        target={[0,0,0]}
        enableRotate={true}
        enablePan={true}
        enableZoom={true}
        minDistance={2}
        maxDistance={3}
        rotateSpeed={0.3}
      />

      {/* TrackballControls: movimiento libre tipo esfera */}
      {/* <TrackballControls
        rotateSpeed={1.5}
        zoomSpeed={1.2}
        panSpeed={0.8}
      /> */}

      {/* FlyControls: vuelo estilo videojuego */}
      {/* <FlyControls
        movementSpeed={10}
        rollSpeed={0.5}
        dragToLook={true}
      /> */}



    </Canvas>
  );
}