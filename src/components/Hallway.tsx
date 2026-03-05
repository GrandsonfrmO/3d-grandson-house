import { Text, Html } from '@react-three/drei';
import { Suspense } from 'react';

export function Hallway({ onBack, onEnterBedroom, onEnterBathroom }: { onBack: () => void, onEnterBedroom: () => void, onEnterBathroom: () => void }) {
  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#aa0000" roughness={0.9} />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2, -4]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      <mesh position={[0, 2, 4]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      <mesh position={[-4, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>
      <mesh position={[4, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[8, 8]} />
        <meshStandardMaterial color="#f5f5dc" />
      </mesh>

      {/* Door back to Gaming Room (Front Wall) */}
      <group 
        position={[0, 0, 3.9]} 
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
            GAMING ROOM
          </Text>
        </Suspense>
      </group>

      {/* Door to Bedroom (Back Wall, Opposite Entrance) */}
      <group 
        position={[0, 0, -3.9]} 
        rotation={[0, 0, 0]} 
        onClick={onEnterBedroom}
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
            BEDROOM
          </Text>
        </Suspense>
      </group>

      {/* Door to Bathroom (Right Wall) */}
      <group 
        position={[3.9, 0, 0]} 
        rotation={[0, -Math.PI / 2, 0]} 
        onClick={onEnterBathroom}
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
            BATHROOM
          </Text>
        </Suspense>
      </group>
      
      {/* Simple ceiling light */}
      <mesh position={[0, 5.9, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.1]} />
        <meshBasicMaterial color="#ffffff" />
      </mesh>
    </group>
  );
}
