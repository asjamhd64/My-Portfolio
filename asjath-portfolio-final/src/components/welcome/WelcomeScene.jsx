import { Suspense, useState, useEffect } from 'react'
import { Canvas } from '@react-three/fiber'
import { ContactShadows, Float } from '@react-three/drei'
import Character from './Character'

function SceneContent({ phase, reducedMotion }) {
  return (
    <>
      <color attach="background" args={['#070b12']} />
      <fog attach="fog" args={['#070b12', 8, 18]} />

      <ambientLight intensity={0.55} />
      <directionalLight
        position={[3, 5, 4]}
        intensity={1.35}
        color="#ffffff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-3, 2, -1]} intensity={0.7} color="#6D28D9" />
      <pointLight position={[2, 1.5, 3]} intensity={0.65} color="#C0C0C0" />
      <spotLight
        position={[0, 6, 3]}
        angle={0.5}
        penumbra={0.55}
        intensity={0.85}
        color="#e8f4ff"
      />

      <Float
        speed={reducedMotion ? 0 : 1.15}
        rotationIntensity={reducedMotion ? 0 : 0.12}
        floatIntensity={reducedMotion ? 0 : 0.2}
      >
        <Character phase={phase} reducedMotion={reducedMotion} />
      </Float>

      <ContactShadows
        position={[0, -1.14, 0]}
        opacity={0.5}
        scale={9}
        blur={2.4}
        far={4}
      />
    </>
  )
}

function supportsWebGL() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  } catch {
    return false
  }
}

function FallbackVisual() {
  return (
    <div className="welcome-3d-fallback" aria-hidden="true">
      <div className="welcome-3d-fallback-figure">
        <div className="welcome-3d-fallback-head" />
        <div className="welcome-3d-fallback-body" />
        <div className="welcome-3d-fallback-arm welcome-3d-fallback-arm-r" />
      </div>
    </div>
  )
}

export default function WelcomeScene({ phase, reducedMotion }) {
  const [webgl, setWebgl] = useState(null) // null = checking

  useEffect(() => {
    setWebgl(supportsWebGL())
  }, [])

  if (webgl === false || reducedMotion) {
    return <FallbackVisual />
  }

  // While detecting, still show fallback so screen is never blank
  if (webgl === null) {
    return <FallbackVisual />
  }

  return (
    <div className="welcome-canvas-wrap" aria-hidden="true">
      <Canvas
        camera={{ position: [0, 0.55, 3.6], fov: 40, near: 0.1, far: 40 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.75)]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
        shadows
        onCreated={({ gl }) => {
          gl.setClearColor('#070b12')
        }}
      >
        <Suspense fallback={null}>
          <SceneContent phase={phase} reducedMotion={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
