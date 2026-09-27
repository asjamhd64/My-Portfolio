import { useRef, useMemo, useEffect, useState, Suspense } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { Float, MeshDistortMaterial } from '@react-three/drei'
import * as THREE from 'three'

function MouseParallax({ children, strength = 0.35 }) {
  const group = useRef()
  const target = useRef({ x: 0, y: 0 })
  useEffect(() => {
    const onMove = (e) => {
      const w = window.innerWidth || 1
      const h = window.innerHeight || 1
      target.current.x = (e.clientX / w) * 2 - 1
      target.current.y = (e.clientY / h) * 2 - 1
    }
    const onLeave = () => {
      target.current.x = 0
      target.current.y = 0
    }
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    return () => {
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  useFrame(() => {
    if (!group.current) return
    group.current.rotation.y += (target.current.x * strength - group.current.rotation.y) * 0.05
    group.current.rotation.x += (-target.current.y * strength * 0.5 - group.current.rotation.x) * 0.05
  })

  return <group ref={group}>{children}</group>
}

function FloatingOrb({ position, color, scale = 1, speed = 1, distort = 0.3 }) {
  const mesh = useRef()
  useFrame((state) => {
    if (!mesh.current) return
    mesh.current.rotation.x = state.clock.elapsedTime * 0.15 * speed
    mesh.current.rotation.y = state.clock.elapsedTime * 0.22 * speed
  })
  return (
    <Float speed={1.4 * speed} rotationIntensity={0.4} floatIntensity={0.6}>
      <mesh ref={mesh} position={position} scale={scale}>
        <icosahedronGeometry args={[1, 4]} />
        <MeshDistortMaterial
          color={color}
          metalness={0.55}
          roughness={0.2}
          distort={distort}
          speed={2}
          emissive={color}
          emissiveIntensity={0.18}
        />
      </mesh>
    </Float>
  )
}

function Ring({ position, color, scale = 1 }) {
  const ref = useRef()
  useFrame((s) => {
    if (ref.current) {
      ref.current.rotation.x = s.clock.elapsedTime * 0.25
      ref.current.rotation.z = s.clock.elapsedTime * 0.18
    }
  })
  return (
    <mesh ref={ref} position={position} scale={scale}>
      <torusGeometry args={[1.1, 0.025, 12, 80]} />
      <meshStandardMaterial
        color={color}
        metalness={0.7}
        roughness={0.25}
        emissive={color}
        emissiveIntensity={0.35}
      />
    </mesh>
  )
}

function GridFloor() {
  const points = useMemo(() => {
    const pts = []
    const size = 8
    const step = 0.5
    for (let i = -size; i <= size; i += step) {
      pts.push(new THREE.Vector3(-size, 0, i), new THREE.Vector3(size, 0, i))
      pts.push(new THREE.Vector3(i, 0, -size), new THREE.Vector3(i, 0, size))
    }
    return pts
  }, [])
  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry().setFromPoints(points)
    return g
  }, [points])
  return (
    <lineSegments geometry={geo} position={[0, -1.6, 0]} rotation={[0, 0, 0]}>
      <lineBasicMaterial color="#00D9FF" transparent opacity={0.12} />
    </lineSegments>
  )
}

function Particles({ count = 48 }) {
  const ref = useRef()
  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3)
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 8
      arr[i * 3 + 1] = (Math.random() - 0.5) * 6
      arr[i * 3 + 2] = (Math.random() - 0.5) * 6
    }
    return arr
  }, [count])

  useFrame((s) => {
    if (ref.current) ref.current.rotation.y = s.clock.elapsedTime * 0.03
  })

  const geo = useMemo(() => {
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    return g
  }, [positions])

  return (
    <points ref={ref} geometry={geo}>
      <pointsMaterial
        size={0.03}
        color="#00D9FF"
        transparent
        opacity={0.55}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  )
}

function SceneContent({ reducedMotion }) {
  return (
    <>
      <color attach="background" args={['#0B1117']} />
      <fog attach="fog" args={['#0B1117', 5, 14]} />
      <ambientLight intensity={0.3} />
      <directionalLight position={[4, 5, 2]} intensity={1.0} color="#e8f7ff" />
      <pointLight position={[-3, 2, -1]} intensity={0.7} color="#7C3AED" />
      <pointLight position={[2, -1, 3]} intensity={0.5} color="#00D9FF" />
      <spotLight position={[0, 6, 2]} angle={0.4} penumbra={0.7} intensity={0.55} />

      <MouseParallax strength={reducedMotion ? 0 : 0.32}>
        <FloatingOrb position={[0.15, 0.2, 0]} color="#00D9FF" scale={0.85} speed={1} distort={0.35} />
        <FloatingOrb position={[-1.35, 0.7, -0.8]} color="#7C3AED" scale={0.38} speed={1.4} distort={0.4} />
        <FloatingOrb position={[1.4, -0.5, -0.6]} color="#5eead4" scale={0.28} speed={0.9} distort={0.25} />
        <Ring position={[0.15, 0.2, 0]} color="#00D9FF" scale={1.05} />
        <Ring position={[0.15, 0.2, 0]} color="#7C3AED" scale={0.72} />
        {!reducedMotion && <Particles count={40} />}
        <GridFloor />
      </MouseParallax>
    </>
  )
}

function supportsWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch {
    return false
  }
}

export default function HeroScene({ reducedMotion = false }) {
  const [webgl, setWebgl] = useState(true)
  useEffect(() => {
    setWebgl(supportsWebGL())
  }, [])

  if (!webgl || reducedMotion) {
    return (
      <div className="hero-3d-fallback" aria-hidden="true">
        <div className="hero-3d-fallback-orb" />
        <div className="hero-3d-fallback-ring" />
      </div>
    )
  }

  return (
    <div className="hero-canvas-wrap">
      <Canvas
        camera={{ position: [0, 0.3, 4.5], fov: 42, near: 0.1, far: 30 }}
        dpr={[1, Math.min(typeof window !== 'undefined' ? window.devicePixelRatio : 1, 1.5)]}
        gl={{ antialias: true, alpha: false, powerPreference: 'high-performance' }}
      >
        <Suspense fallback={null}>
          <SceneContent reducedMotion={false} />
        </Suspense>
      </Canvas>
    </div>
  )
}
