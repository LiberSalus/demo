
// components/Modelo3D.jsx
import React, { Suspense, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'


const URL = './models/male_full_body_ecorche.glb'

export default function Modelo3D() {
  const { scene } = useGLTF(URL) // Asegúrate de tener este archivo en /public
  const [hovered, setHovered] = useState(false);

  useFrame((_, delta) => {
    if (!hovered && scene) {
      scene.rotation.y += delta * 0.03 // velocidad (ajustable)
    }
  })

  return (
    <Suspense fallback={null}>
      <primitive 
      object={scene} 
      scale={.01} 
      position={[0, 0.12, 0]}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      />
    </Suspense>
  )
}
