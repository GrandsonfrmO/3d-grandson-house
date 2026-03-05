import { Text, Html } from '@react-three/drei';
import { Suspense, useMemo } from 'react';
import * as THREE from 'three';

export function Studio({ onExitClick }: { onExitClick: () => void }) {
  const debris = useMemo(() => {
    const fabrics = [...Array(25)].map(() => ({
      x: (Math.random() - 0.5) * 12,
      z: (Math.random() - 0.5) * 12,
      rot: Math.random() * Math.PI,
      w: 0.3 + Math.random() * 0.5,
      h: 0.3 + Math.random() * 0.5,
      color: ['#ff0055', '#00ffcc', '#333333', '#ffffff', '#ffff00'][Math.floor(Math.random() * 5)]
    }));
    const papers = [...Array(15)].map(() => ({
      x: (Math.random() - 0.5) * 10,
      z: (Math.random() - 0.5) * 10,
      rot: Math.random() * Math.PI,
      color: Math.random() > 0.5 ? "#ffffff" : "#dddddd"
    }));
    return { fabrics, papers };
  }, []);

  return (
    <group>
      {/* Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#333333" roughness={0.8} />
      </mesh>
      
      {/* Walls */}
      <mesh position={[0, 2, -7]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
      </mesh>
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
      </mesh>
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
      </mesh>

      {/* Front Wall with Exit Door */}
      <mesh position={[0, 2, 7]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#f0f0f0" roughness={0.5} />
      </mesh>

      <group 
        position={[0, 0, 6.9]} 
        rotation={[0, Math.PI, 0]} 
        onClick={onExitClick}
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
          <Text position={[0, 2.5, 0]} fontSize={0.3} color="black" outlineWidth={0.01} outlineColor="white">
            OUTSIDE
          </Text>
        </Suspense>
      </group>

      {/* Grandson Studio Text on Back Wall */}
      <Suspense fallback={null}>
        <Text position={[0, 4.5, -6.9]} fontSize={2} color="black" fontWeight="black" lineHeight={0.8} textAlign="center" outlineWidth={0.02} outlineColor="white">
          GRANDSON{"\n"}STUDIO
        </Text>
      </Suspense>

      {/* Work Table */}
      <group position={[0, -1, -2]}>
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[6, 0.2, 3]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Legs */}
        <mesh castShadow position={[-2.8, -0.4, -1.3]}>
          <boxGeometry args={[0.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh castShadow position={[2.8, -0.4, -1.3]}>
          <boxGeometry args={[0.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh castShadow position={[-2.8, -0.4, 1.3]}>
          <boxGeometry args={[0.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh castShadow position={[2.8, -0.4, 1.3]}>
          <boxGeometry args={[0.2, 1.4, 0.2]} />
          <meshStandardMaterial color="#222" />
        </mesh>

        {/* Design Tablet (Interactive) */}
        <group position={[0, 0.55, 0]} rotation={[0.1, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.5, 0.05, 1]} />
            <meshStandardMaterial color="#111111" />
          </mesh>
          <mesh position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <planeGeometry args={[1.4, 0.9]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
          <Suspense fallback={null}>
            <Text position={[0, 0.04, 0]} rotation={[-Math.PI / 2, 0, 0]} fontSize={0.15} color="black">
              DESIGN
            </Text>
          </Suspense>
        </group>

        {/* Heat Press */}
        <group position={[-1.5, 0.6, 0]}>
          {/* Base */}
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[1.2, 0.2, 1.5]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Lower Platen */}
          <mesh castShadow position={[0, 0.15, 0.2]}>
            <boxGeometry args={[0.8, 0.1, 0.8]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          {/* Upper Platen (Open) */}
          <mesh castShadow position={[0, 0.6, -0.2]} rotation={[0.5, 0, 0]}>
            <boxGeometry args={[0.8, 0.1, 0.8]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Handle */}
          <mesh castShadow position={[0, 0.8, 0.2]} rotation={[0.5, 0, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.8]} />
            <meshStandardMaterial color="#ff0055" />
          </mesh>
          <Suspense fallback={null}>
            <Text position={[0, 1.2, 0]} fontSize={0.2} color="white" outlineWidth={0.01} outlineColor="black">
              HEAT PRESS
            </Text>
          </Suspense>
        </group>

        {/* Textile Printer */}
        <group position={[1.5, 0.8, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[1.8, 0.6, 1.2]} />
            <meshStandardMaterial color="#eeeeee" />
          </mesh>
          <mesh castShadow position={[0, 0.3, 0.2]}>
            <boxGeometry args={[1.6, 0.1, 0.8]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.7, 0.35, 0.4]}>
            <boxGeometry args={[0.2, 0.05, 0.2]} />
            <meshStandardMaterial color="#00ffcc" />
          </mesh>
          <Suspense fallback={null}>
            <Text position={[0, 0.8, 0]} fontSize={0.2} color="white" outlineWidth={0.01} outlineColor="black">
              TEXTILE PRINTER
            </Text>
          </Suspense>
        </group>
      </group>

      {/* Wooden Wardrobe */}
      <group position={[-6, 0, -2]} rotation={[0, Math.PI / 2, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[3, 4, 1.5]} />
          <meshStandardMaterial color="#5C4033" roughness={0.9} />
        </mesh>
        {/* Doors */}
        <mesh position={[-0.75, 0, 0.76]}>
          <boxGeometry args={[1.4, 3.8, 0.05]} />
          <meshStandardMaterial color="#4A2F1D" />
        </mesh>
        <mesh position={[0.75, 0, 0.76]}>
          <boxGeometry args={[1.4, 3.8, 0.05]} />
          <meshStandardMaterial color="#4A2F1D" />
        </mesh>
        {/* Handles */}
        <mesh position={[-0.1, 0, 0.8]}>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh position={[0.1, 0, 0.8]}>
          <boxGeometry args={[0.05, 0.4, 0.05]} />
          <meshStandardMaterial color="#222" />
        </mesh>
      </group>

      {/* Posters Wall */}
      <group position={[-6.9, 2.5, -5]} rotation={[0, Math.PI / 2, 0]}>
        {[...Array(6)].map((_, i) => (
          <mesh key={i} position={[(i % 3) * 1.2 - 1.2, Math.floor(i / 3) * 1.5 - 0.75, 0]}>
            <planeGeometry args={[1, 1.4]} />
            <meshStandardMaterial color={['#ff0055', '#00ffcc', '#ffff00', '#ff00ff', '#00ffff', '#ffaa00'][i]} />
          </mesh>
        ))}
      </group>

      {/* Small Table with Heat Press */}
      <group position={[-5.5, -1, -5]}>
        {/* Table */}
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[2, 0.1, 1.5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Legs */}
        <mesh castShadow position={[-0.9, -0.4, -0.6]}>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh castShadow position={[0.9, -0.4, -0.6]}>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh castShadow position={[-0.9, -0.4, 0.6]}>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        <mesh castShadow position={[0.9, -0.4, 0.6]}>
          <boxGeometry args={[0.1, 1.4, 0.1]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        
        {/* Small Heat Press */}
        <group position={[0, 0.55, 0]} rotation={[0, Math.PI/4, 0]}>
          <mesh castShadow position={[0, 0, 0]}>
            <boxGeometry args={[0.8, 0.15, 1]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh castShadow position={[0, 0.1, 0.1]}>
            <boxGeometry args={[0.6, 0.05, 0.6]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          <mesh castShadow position={[0, 0.4, -0.1]} rotation={[0.4, 0, 0]}>
            <boxGeometry args={[0.6, 0.05, 0.6]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh castShadow position={[0, 0.5, 0.1]} rotation={[0.4, 0, 0]}>
            <cylinderGeometry args={[0.03, 0.03, 0.5]} />
            <meshStandardMaterial color="#ff0055" />
          </mesh>
        </group>
      </group>

      {/* T-Shirts Rack */}
      <group position={[5, 0, -5]}>
        <mesh castShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 4]} />
          <meshStandardMaterial color="#888" />
        </mesh>
        <mesh castShadow position={[-1, 2, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 2]} />
          <meshStandardMaterial color="#888" />
        </mesh>
        
        {/* Shirts */}
        {[0, 1, 2].map((i) => (
          <group key={i} position={[-1.5 + i * 0.5, 1.5, 0]}>
            <mesh castShadow>
              <boxGeometry args={[0.4, 0.6, 0.1]} />
              <meshStandardMaterial color={i === 0 ? "#ff0055" : i === 1 ? "#00ffcc" : "#ffffff"} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Floor Debris */}
      <group position={[0, -1.98, 0]}>
        {/* Fabric Scraps */}
        {debris.fabrics.map((f, i) => (
          <mesh key={`fabric-${i}`} position={[f.x, 0, f.z]} rotation={[-Math.PI / 2, 0, f.rot]}>
            <planeGeometry args={[f.w, f.h]} />
            <meshStandardMaterial color={f.color} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* Paper Scraps / Photos */}
        {debris.papers.map((p, i) => (
          <mesh key={`paper-${i}`} position={[p.x, 0.01, p.z]} rotation={[-Math.PI / 2, 0, p.rot]}>
            <planeGeometry args={[0.2, 0.3]} />
            <meshStandardMaterial color={p.color} side={THREE.DoubleSide} />
          </mesh>
        ))}
        {/* Scissors */}
        <group position={[1, 0.02, -1]} rotation={[-Math.PI / 2, 0, 0.5]}>
          <mesh position={[-0.1, 0, 0]} rotation={[0, 0, 0.2]}>
            <boxGeometry args={[0.4, 0.05, 0.02]} />
            <meshStandardMaterial color="#888" />
          </mesh>
          <mesh position={[0.1, 0, 0]} rotation={[0, 0, -0.2]}>
            <boxGeometry args={[0.4, 0.05, 0.02]} />
            <meshStandardMaterial color="#888" />
          </mesh>
          <mesh position={[-0.25, 0.05, 0]}>
            <torusGeometry args={[0.05, 0.02, 8, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0.25, 0.05, 0]}>
            <torusGeometry args={[0.05, 0.02, 8, 16]} />
            <meshStandardMaterial color="#111" />
          </mesh>
        </group>
      </group>

    </group>
  );
}
