import { Text, Html } from '@react-three/drei';
import { Suspense } from 'react';

export function Bathroom({ onBack }: { onBack: () => void }) {
  return (
    <group>
      {/* Tile Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[10, 10]} />
        <meshStandardMaterial color="#aaddff" roughness={0.1} metalness={0.1} />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2, -5]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#eef8ff" />
      </mesh>
      <mesh position={[0, 2, 5]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#eef8ff" />
      </mesh>
      <mesh position={[-5, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#eef8ff" />
      </mesh>
      <mesh position={[5, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[10, 8]} />
        <meshStandardMaterial color="#eef8ff" />
      </mesh>

      {/* Door back to Hallway (Front Wall) */}
      <group 
        position={[0, 0, 4.9]} 
        rotation={[0, Math.PI, 0]} 
        onClick={onBack}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh castShadow>
          <boxGeometry args={[2.5, 4, 0.1]} />
          <meshStandardMaterial color="#4A2F1D" />
        </mesh>
        <mesh position={[-1, 0, 0.1]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        <Suspense fallback={null}>
          <Text position={[0, 2.5, 0]} fontSize={0.25} color="black" outlineWidth={0.02} outlineColor="white">
            HALLWAY
          </Text>
        </Suspense>
      </group>

      {/* Shower Area (Right Back Corner, reduced size) */}
      <group position={[3.75, 0.5, -3.75]}>
        {/* Shower Base */}
        <mesh position={[0, -2.4, 0]} receiveShadow>
          <boxGeometry args={[2.5, 0.2, 2.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Glass Walls */}
        <mesh position={[-1.25, 0, 0]} castShadow>
          <boxGeometry args={[0.1, 5, 2.5]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        <mesh position={[0, 0, 1.25]} castShadow>
          <boxGeometry args={[2.5, 5, 0.1]} />
          <meshStandardMaterial color="#88ccff" transparent opacity={0.3} roughness={0.1} />
        </mesh>
        {/* Shower Head */}
        <mesh position={[0, 2, -1.0]} rotation={[0.5, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.2, 0.4]} />
          <meshStandardMaterial color="#cccccc" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>

      {/* Toilet (Left Wall, facing Sink) */}
      <group position={[-3.5, -1.5, 0]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 1, 1.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        <mesh position={[0, 1, -0.5]} castShadow>
          <boxGeometry args={[1.2, 1.5, 0.5]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Sink & Mirror (Right Wall) */}
      <group position={[4.5, 0, 0]} rotation={[0, -Math.PI / 2, 0]}>
        {/* Sink counter */}
        <mesh position={[0, -0.5, 0]} castShadow>
          <boxGeometry args={[2, 0.2, 1]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        {/* Sink bowl */}
        <mesh position={[0, -0.4, 0]} castShadow>
          <boxGeometry args={[1.2, 0.1, 0.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Mirror */}
        <mesh position={[0, 1.5, -0.45]}>
          <planeGeometry args={[1.5, 2]} />
          <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
        </mesh>
      </group>
    </group>
  );
}
