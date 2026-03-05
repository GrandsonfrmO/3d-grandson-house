import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Suspense } from 'react';
import * as THREE from 'three';

export function House({ onEnterGaming, onEnterStudio }: { onEnterGaming: () => void, onEnterStudio: () => void }) {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group 
      ref={groupRef} 
    >
      {/* Platform/Yard */}
      <mesh position={[0, -1.6, 0]} receiveShadow>
        <boxGeometry args={[12, 0.2, 10]} />
        <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
      </mesh>

      {/* Pathway to Gaming Room */}
      <mesh position={[2, -1.49, 3]} receiveShadow>
        <boxGeometry args={[1.5, 0.05, 2]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>

      {/* Pathway to Studio */}
      <mesh position={[-2, -1.49, 3]} receiveShadow>
        <boxGeometry args={[1.5, 0.05, 2]} />
        <meshStandardMaterial color="#444444" roughness={0.8} />
      </mesh>

      {/* Main Ground Floor (White Concrete) */}
      <mesh position={[0, -0.4, 0]} castShadow receiveShadow>
        <boxGeometry args={[8, 2.2, 4]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.9} />
      </mesh>

      {/* Simple Orange Roof */}
      <mesh position={[0, 1.95, 0]} scale={[8.5 / Math.SQRT2, 2.5, 4.5 / Math.SQRT2]} castShadow receiveShadow>
        <coneGeometry args={[1, 1, 4, 1, false, Math.PI / 4]} />
        <meshStandardMaterial color="#ff6600" roughness={0.8} />
      </mesh>

      {/* Full Glass Window between doors */}
      <mesh position={[0, -0.7, 2.01]}>
        <boxGeometry args={[2.8, 1.6, 0.05]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.3} roughness={0.1} metalness={0.8} />
      </mesh>

      {/* Front Door: Gaming Room */}
      <group 
        position={[2, -0.7, 2.01]}
        onClick={onEnterGaming}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh>
          <boxGeometry args={[1.2, 1.6, 0.05]} />
          <meshStandardMaterial color="#3A2210" roughness={0.8} />
        </mesh>
        {/* Door Handle */}
        <mesh position={[0.4, 0, 0.04]}>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
        </mesh>
        <Suspense fallback={null}>
          <Text position={[0, 1.0, 0.05]} fontSize={0.2} color="black" fontWeight="bold" outlineWidth={0.01} outlineColor="white">
            GAMING ROOM
          </Text>
        </Suspense>
      </group>

      {/* Front Door: Studio */}
      <group 
        position={[-2, -0.7, 2.01]}
        onClick={onEnterStudio}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh>
          <boxGeometry args={[1.2, 1.6, 0.05]} />
          <meshStandardMaterial color="#3A2210" roughness={0.8} />
        </mesh>
        {/* Door Handle */}
        <mesh position={[0.4, 0, 0.04]}>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
        </mesh>
        <Suspense fallback={null}>
          <Text position={[0, 1.0, 0.05]} fontSize={0.2} color="black" fontWeight="bold" outlineWidth={0.01} outlineColor="white">
            STUDIO
          </Text>
        </Suspense>
      </group>

      {/* Neon Accent Strips */}
      <mesh position={[0, 0.7, 2.01]}>
        <boxGeometry args={[8, 0.05, 0.05]} />
        <meshBasicMaterial color="#00ffcc" />
      </mesh>

      {/* BMW E46 (Low Poly) parked in front */}
      <group position={[0, -1.2, 6]} rotation={[0, Math.PI / 4, 0]}>
        {/* Car Body Lower */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 0.4, 4]} />
          <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Car Cabin */}
        <mesh position={[0, 0.4, -0.2]} castShadow>
          <boxGeometry args={[1.4, 0.5, 2]} />
          <meshStandardMaterial color="#050505" metalness={0.8} roughness={0.2} />
        </mesh>
        {/* Windows */}
        <mesh position={[0, 0.4, 0.81]}>
          <planeGeometry args={[1.2, 0.4]} />
          <meshStandardMaterial color="#111111" roughness={0.1} />
        </mesh>
        <mesh position={[0, 0.4, -1.21]} rotation={[0, Math.PI, 0]}>
          <planeGeometry args={[1.2, 0.4]} />
          <meshStandardMaterial color="#111111" roughness={0.1} />
        </mesh>
        {/* Wheels */}
        <mesh position={[-0.9, -0.2, 1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0.9, -0.2, 1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[-0.9, -0.2, -1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        <mesh position={[0.9, -0.2, -1.2]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.3, 0.3, 0.2, 16]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
        {/* Kidney Grille */}
        <mesh position={[-0.2, 0.1, 2.01]}>
          <boxGeometry args={[0.25, 0.15, 0.05]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} />
        </mesh>
        <mesh position={[0.2, 0.1, 2.01]}>
          <boxGeometry args={[0.25, 0.15, 0.05]} />
          <meshStandardMaterial color="#cccccc" metalness={0.9} />
        </mesh>
        {/* Headlights */}
        <mesh position={[-0.6, 0.1, 2.01]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.6, 0.1, 2.01]}>
          <boxGeometry args={[0.3, 0.15, 0.05]} />
          <meshStandardMaterial color="#ffffff" emissive="#ffffff" emissiveIntensity={0.5} />
        </mesh>
        {/* Taillights */}
        <mesh position={[-0.6, 0.1, -2.01]}>
          <boxGeometry args={[0.4, 0.15, 0.05]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
        <mesh position={[0.6, 0.1, -2.01]}>
          <boxGeometry args={[0.4, 0.15, 0.05]} />
          <meshStandardMaterial color="#ff0000" emissive="#ff0000" emissiveIntensity={0.5} />
        </mesh>
      </group>

      {/* Character (Grandson) */}
      <group position={[1.5, -0.6, 8.5]} rotation={[0, -Math.PI / 6, 0]}>
        {/* Body (T-shirt) */}
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[0.7, 1, 0.4]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* T-shirt Text */}
        <Suspense fallback={null}>
          <Text position={[0, 0.2, 0.21]} fontSize={0.12} color="black" fontWeight="bold">
            GRANDSON
          </Text>
        </Suspense>
        {/* Head */}
        <mesh position={[0, 0.75, 0]} castShadow>
          <boxGeometry args={[0.45, 0.45, 0.45]} />
          <meshStandardMaterial color="#ffccaa" />
        </mesh>
        {/* Hair */}
        <mesh position={[0, 1.0, 0]} castShadow>
          <boxGeometry args={[0.5, 0.15, 0.5]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Arms */}
        <mesh position={[-0.45, 0.1, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#ffccaa" />
        </mesh>
        <mesh position={[0.45, 0.1, 0]} castShadow>
          <boxGeometry args={[0.2, 0.8, 0.2]} />
          <meshStandardMaterial color="#ffccaa" />
        </mesh>
        {/* Legs (Pants) */}
        <mesh position={[-0.18, -0.75, 0]} castShadow>
          <boxGeometry args={[0.25, 0.5, 0.25]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        <mesh position={[0.18, -0.75, 0]} castShadow>
          <boxGeometry args={[0.25, 0.5, 0.25]} />
          <meshStandardMaterial color="#333333" />
        </mesh>
        {/* Shoes */}
        <mesh position={[-0.18, -1.05, 0.05]} castShadow>
          <boxGeometry args={[0.28, 0.15, 0.35]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0.18, -1.05, 0.05]} castShadow>
          <boxGeometry args={[0.28, 0.15, 0.35]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>

        {/* Speech Bubble */}
        <group position={[0, 2.0, 0]}>
          <mesh position={[0, 0, -0.05]}>
            <planeGeometry args={[3.2, 0.8]} />
            <meshBasicMaterial color="#ffffff" />
          </mesh>
          <Suspense fallback={null}>
            <Text position={[0, 0, 0]} fontSize={0.2} color="black" maxWidth={3} textAlign="center" fontWeight="bold">
              Hello c'est Grandson
              bienvenue chez moi
            </Text>
          </Suspense>
        </group>
      </group>

      {/* Black Cat */}
      <group position={[2.5, -1.3, 8.2]} rotation={[0, -Math.PI / 3, 0]}>
        {/* Body */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[0.4, 0.3, 0.2]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Head */}
        <mesh position={[0.2, 0.3, 0]} castShadow>
          <boxGeometry args={[0.2, 0.2, 0.2]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Ears */}
        <mesh position={[0.25, 0.45, 0.05]} castShadow>
          <coneGeometry args={[0.05, 0.1, 4]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0.25, 0.45, -0.05]} castShadow>
          <coneGeometry args={[0.05, 0.1, 4]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        {/* Tail */}
        <mesh position={[-0.25, 0.2, 0]} rotation={[0, 0, -0.5]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.3]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
      </group>
    </group>
  );
}
