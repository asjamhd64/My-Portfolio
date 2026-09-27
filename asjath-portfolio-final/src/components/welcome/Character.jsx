import { useRef, useMemo, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

/**
 * Stylized procedural humanoid — clearly visible on dark background.
 * Phases: 'idle' | 'wave' | 'hold'
 */
export default function Character({ phase = 'idle', reducedMotion = false }) {
  const group = useRef()
  const leftArm = useRef()
  const rightArm = useRef()
  const torso = useRef()
  const head = useRef()
  const waveStart = useRef(null)
  const elapsed = useRef(0)

  const materials = useMemo(
    () => ({
      body: new THREE.MeshStandardMaterial({
        color: '#2a3a52',
        metalness: 0.25,
        roughness: 0.5,
      }),
      accent: new THREE.MeshStandardMaterial({
        color: '#6D28D9',
        metalness: 0.5,
        roughness: 0.25,
        emissive: '#6D28D9',
        emissiveIntensity: 0.25,
      }),
      accent2: new THREE.MeshStandardMaterial({
        color: '#C0C0C0',
        metalness: 0.4,
        roughness: 0.3,
        emissive: '#C0C0C0',
        emissiveIntensity: 0.2,
      }),
      skin: new THREE.MeshStandardMaterial({
        color: '#d4b896',
        metalness: 0.05,
        roughness: 0.65,
      }),
    }),
    []
  )

  useEffect(() => {
    if (phase === 'wave') waveStart.current = null
  }, [phase])

  useFrame((_, delta) => {
    if (reducedMotion) return
    elapsed.current += delta
    const t = elapsed.current

    if (group.current) {
      group.current.rotation.y = Math.sin(t * 0.5) * 0.1
      group.current.position.y = Math.sin(t * 1.15) * 0.025
    }
    if (torso.current) {
      const s = 1 + Math.sin(t * 1.5) * 0.012
      torso.current.scale.set(1, s, 1)
    }
    if (head.current) {
      head.current.rotation.y = Math.sin(t * 0.65) * 0.1
      head.current.rotation.x = Math.sin(t * 0.85) * 0.04
    }

    if (phase === 'idle') {
      if (leftArm.current) {
        leftArm.current.rotation.z = 0.28 + Math.sin(t * 1.05) * 0.05
        leftArm.current.rotation.x = Math.sin(t * 0.75) * 0.06
      }
      if (rightArm.current) {
        rightArm.current.rotation.z = -0.28 + Math.sin(t * 1.0 + 1) * 0.05
        rightArm.current.rotation.x = Math.sin(t * 0.8 + 0.4) * 0.06
      }
    }

    if (phase === 'wave' || phase === 'hold') {
      if (waveStart.current == null) waveStart.current = t
      const wt = t - waveStart.current
      if (rightArm.current) {
        const raise = Math.min(1, wt / 0.4)
        // Raise arm up for a clear wave
        rightArm.current.rotation.z = THREE.MathUtils.lerp(-0.28, -2.15, raise)
        rightArm.current.rotation.x = THREE.MathUtils.lerp(0, 0.35, raise)
        if (wt > 0.4) {
          const waveT = wt - 0.4
          rightArm.current.rotation.z = -2.15 + Math.sin(waveT * 8) * 0.42
        }
      }
      if (leftArm.current) {
        leftArm.current.rotation.z = 0.4
        leftArm.current.rotation.x = 0
      }
      if (group.current) {
        group.current.rotation.x = -0.04
      }
    }
  })

  return (
    <group ref={group} position={[0, -1.05, 0]} scale={1.2}>
      {/* Legs */}
      <mesh position={[-0.22, 0.45, 0]} material={materials.body} castShadow>
        <capsuleGeometry args={[0.12, 0.55, 6, 12]} />
      </mesh>
      <mesh position={[0.22, 0.45, 0]} material={materials.body} castShadow>
        <capsuleGeometry args={[0.12, 0.55, 6, 12]} />
      </mesh>

      {/* Torso */}
      <mesh ref={torso} position={[0, 1.15, 0]} material={materials.body} castShadow>
        <capsuleGeometry args={[0.34, 0.55, 8, 16]} />
      </mesh>

      <mesh position={[0, 1.28, 0.3]} material={materials.accent}>
        <boxGeometry args={[0.38, 0.09, 0.06]} />
      </mesh>

      {/* Head */}
      <group ref={head} position={[0, 1.88, 0]}>
        <mesh material={materials.skin} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
        </mesh>
        <mesh position={[-0.1, 0.05, 0.26]} material={materials.accent}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>
        <mesh position={[0.1, 0.05, 0.26]} material={materials.accent}>
          <sphereGeometry args={[0.04, 12, 12]} />
        </mesh>
        <mesh position={[0, 0, -0.04]} material={materials.accent2}>
          <torusGeometry args={[0.36, 0.018, 8, 48]} />
        </mesh>
      </group>

      {/* Left arm */}
      <group ref={leftArm} position={[-0.44, 1.48, 0]} rotation={[0, 0, 0.28]}>
        <mesh position={[0, -0.36, 0]} material={materials.body} castShadow>
          <capsuleGeometry args={[0.095, 0.52, 6, 12]} />
        </mesh>
        <mesh position={[0, -0.74, 0]} material={materials.skin} castShadow>
          <sphereGeometry args={[0.105, 16, 16]} />
        </mesh>
      </group>

      {/* Right arm (wave) */}
      <group ref={rightArm} position={[0.44, 1.48, 0]} rotation={[0, 0, -0.28]}>
        <mesh position={[0, -0.36, 0]} material={materials.body} castShadow>
          <capsuleGeometry args={[0.095, 0.52, 6, 12]} />
        </mesh>
        <mesh position={[0, -0.74, 0]} material={materials.skin} castShadow>
          <sphereGeometry args={[0.105, 16, 16]} />
        </mesh>
      </group>

      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
        <circleGeometry args={[1.5, 48]} />
        <meshStandardMaterial color="#0a1018" transparent opacity={0.9} roughness={0.9} />
      </mesh>
    </group>
  )
}
