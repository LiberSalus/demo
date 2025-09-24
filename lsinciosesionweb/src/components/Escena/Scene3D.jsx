// components/Scene3D.jsx
import React from 'react'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Modelo3D from '../Modelo/Modelo3D'

export default function Scene3D() {
  return (
    <Canvas 
    style={{ width: '100%', height: '100%', position:'absolute' }}
    camera={{ position: [1.3, -1, 5], fov: 10 }}>
      <ambientLight intensity={0.7} />
      <directionalLight position={[2, 2, 2]} />
      <OrbitControls />
      <Modelo3D />
    </Canvas>
  )
}
