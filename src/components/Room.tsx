import { Text, Html } from '@react-three/drei';
import { useRef, Suspense } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Room({ onPcClick, onDoorClick, onExitClick, screens, posters, isNeonMode, onToggleNeon }: { onPcClick: () => void, onDoorClick: () => void, onExitClick: () => void, screens: any, posters: any[], isNeonMode?: boolean, onToggleNeon?: () => void }) {
  return (
    <group>
      {/* Ceiling LED Strips (Neon Mode) */}
      {isNeonMode && (
        <group position={[0, 5.9, 0]}>
          {/* Front */}
          <mesh position={[0, 0, 6.9]}>
            <boxGeometry args={[13.8, 0.1, 0.1]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
          {/* Back */}
          <mesh position={[0, 0, -6.9]}>
            <boxGeometry args={[13.8, 0.1, 0.1]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
          {/* Left */}
          <mesh position={[-6.9, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 13.8]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
          {/* Right */}
          <mesh position={[6.9, 0, 0]}>
            <boxGeometry args={[0.1, 0.1, 13.8]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
        </group>
      )}

      {/* Red Carpet Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#aa0000" roughness={0.9} />
      </mesh>
      
      {/* Floor Glow (Neon Mode) */}
      {isNeonMode && (
        <pointLight position={[0, -1.8, 0]} intensity={0.5} distance={10} color="#4400ff" />
      )}
      
      {/* White Walls */}
      <mesh position={[0, 2, -7]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Front Wall (Facing the desk) */}
      <mesh position={[0, 2, 7]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#ffffff" roughness={0.5} />
      </mesh>

      {/* Exit Door (Front Wall) */}
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

      {/* Light Switch */}
      <group 
        position={[-1.8, 0.5, 6.9]} 
        rotation={[0, Math.PI, 0]}
        onClick={onToggleNeon}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh castShadow>
          <boxGeometry args={[0.2, 0.4, 0.05]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        <mesh position={[0, isNeonMode ? -0.1 : 0.1, 0.03]}>
          <boxGeometry args={[0.1, 0.15, 0.05]} />
          <meshStandardMaterial color={isNeonMode ? "#ff0055" : "#ffffff"} />
        </mesh>
      </group>

      {/* Welcome Mat */}
      <group position={[0, -1.98, 5.5]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[3, 1.5]} />
          <meshStandardMaterial color="#333333" roughness={0.9} />
        </mesh>
        <Text position={[0, 0, 0.01]} fontSize={0.4} color="white">
          WELCOME
        </Text>
      </group>

      {/* Trash Can */}
      <group position={[-6.5, -1.5, 6.5]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.4, 0.3, 1, 16]} />
          <meshStandardMaterial color="#444444" roughness={0.6} metalness={0.2} />
        </mesh>
        <mesh position={[0, 0.5, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.4, 0.05, 16, 32]} />
          <meshStandardMaterial color="#222222" />
        </mesh>
      </group>

      {/* Black Cat (Moved between trash can and welcome mat) */}
      <Cat position={[-3.0, -1.8, 6.0]} rotation={[0, Math.PI, 0]} />

      {/* Cat Food Bowl (Against front wall) */}
      <group position={[-2.2, -1.95, 6.6]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.15, 0.2, 0.1, 16]} />
          <meshStandardMaterial color="#ff0055" />
        </mesh>
        <mesh position={[0, 0.05, 0]}>
          <cylinderGeometry args={[0.13, 0.13, 0.02, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
      </group>

      {/* Cat House (Against front wall) */}
      <group position={[-4.0, -1.5, 6.4]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow position={[0, 0, 0]}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#4A2F1D" />
        </mesh>
        <mesh castShadow position={[0, 0.7, 0]} rotation={[0, Math.PI / 4, 0]}>
          <coneGeometry args={[0.9, 0.6, 4]} />
          <meshStandardMaterial color="#8B0000" />
        </mesh>
        <mesh position={[0, -0.1, 0.51]}>
          <circleGeometry args={[0.3, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* Cat Litter Box (Against front wall) */}
      <group position={[-5.2, -1.9, 6.4]} rotation={[0, Math.PI, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.2, 0.2, 0.8]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
        <mesh position={[0, 0.1, 0]}>
          <boxGeometry args={[1.1, 0.05, 0.7]} />
          <meshStandardMaterial color="#d2b48c" roughness={0.9} />
        </mesh>
      </group>

      {/* Basketball Posters (Left of the exit door) */}
      <group position={[3.5, 2.5, 6.9]} rotation={[0, Math.PI, 0]}>
        <Poster position={[-1.2, 0.8, 0]} color="#ff6600" text="JORDAN" size={[1, 1.5]} />
        <Poster position={[0, 0.8, 0]} color="#0000ff" text="KOBE" size={[1, 1.5]} />
        <Poster position={[1.2, 0.8, 0]} color="#ff0000" text="BULLS" size={[1, 1.5]} />
        <Poster position={[-1.2, -0.8, 0]} color="#00ff00" text="DUNK" size={[1, 1.2]} />
        <Poster position={[0, -0.8, 0]} color="#ff00ff" text="MVP" size={[1, 1.2]} />
        <Poster position={[1.2, -0.8, 0]} color="#ffff00" text="HOOPS" size={[1, 1.2]} />
        <Poster position={[-1.2, -2.2, 0]} color="#ff00aa" text="SLAM" size={[1, 1.2]} />
        <Poster position={[0, -2.2, 0]} color="#00aaff" text="COURT" size={[1, 1.2]} />
        <Poster position={[1.2, -2.2, 0]} color="#aaff00" text="SWISH" size={[1, 1.2]} />
        <Poster position={[-1.2, -3.6, 0]} color="#aa00ff" text="BALL" size={[1, 1.2]} />
        <Poster position={[0, -3.6, 0]} color="#ffaa00" text="GAME" size={[1, 1.2]} />
        <Poster position={[1.2, -3.6, 0]} color="#00ffaa" text="RING" size={[1, 1.2]} />
      </group>

      {/* Basketball Rug */}
      <group position={[3.5, -1.98, 5]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <circleGeometry args={[1.5, 32]} />
          <meshStandardMaterial color="#ff6600" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <ringGeometry args={[1.4, 1.5, 32]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[0.05, 3]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
        <mesh position={[0, 0, 0.01]} rotation={[0, 0, Math.PI/2]}>
          <planeGeometry args={[0.05, 3]} />
          <meshBasicMaterial color="#000000" />
        </mesh>
      </group>

      {/* Dollar Rug (In front of TV) */}
      <group position={[3.5, -1.98, 1]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh receiveShadow>
          <planeGeometry args={[3, 2]} />
          <meshStandardMaterial color="#228B22" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[2.8, 1.8]} />
          <meshBasicMaterial color="#1a6b1a" />
        </mesh>
        <Text position={[0, 0, 0.02]} fontSize={1.5} color="#ffffff" rotation={[0, 0, 0]}>
          $
        </Text>
      </group>

      {/* Gamepad Rug */}
      <group position={[-2, -1.98, 2]} rotation={[-Math.PI / 2, 0, 0]}>
        <mesh position={[-1, 0, 0]} receiveShadow>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        <mesh position={[1, 0, 0]} receiveShadow>
          <circleGeometry args={[1, 32]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        <mesh position={[0, 0, 0]} receiveShadow>
          <planeGeometry args={[2, 2]} />
          <meshStandardMaterial color="#1a1a1a" roughness={0.9} />
        </mesh>
        {/* D-pad */}
        <mesh position={[-1, 0, 0.01]}>
          <boxGeometry args={[0.6, 0.2, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        <mesh position={[-1, 0, 0.01]}>
          <boxGeometry args={[0.2, 0.6, 0.01]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Buttons */}
        <mesh position={[1, 0.4, 0.01]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#ff0055" />
        </mesh>
        <mesh position={[1, -0.4, 0.01]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#00ffcc" />
        </mesh>
        <mesh position={[0.6, 0, 0.01]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#ffff00" />
        </mesh>
        <mesh position={[1.4, 0, 0.01]}>
          <circleGeometry args={[0.15, 16]} />
          <meshBasicMaterial color="#0088ff" />
        </mesh>
      </group>

      {/* Desk */}
      <group position={[3.5, -0.5, -5]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[6, 0.2, 2.5]} />
          <meshStandardMaterial color="#8B4513" roughness={0.6} />
        </mesh>
        <mesh position={[0, 0, 1.26]}>
          <boxGeometry args={[6, 0.05, 0.05]} />
          <meshBasicMaterial color={isNeonMode ? "#00ffcc" : "#00ffcc"} />
        </mesh>
        {isNeonMode && (
          <mesh position={[0, -0.15, 0]}>
            <boxGeometry args={[5.8, 0.05, 2.3]} />
            <meshBasicMaterial color="#00ffcc" />
            <pointLight distance={3} intensity={1.5} color="#00ffcc" position={[0, -0.5, 0]} />
          </mesh>
        )}
        <mesh position={[-2.8, -0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.5, 2.3]} />
          <meshStandardMaterial color="#5C3A21" />
        </mesh>
        <mesh position={[2.8, -0.75, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.2, 1.5, 2.3]} />
          <meshStandardMaterial color="#5C3A21" />
        </mesh>
      </group>

      {/* Gaming Chair */}
      <group position={[3.5, -1.2, -2.5]} rotation={[0, Math.PI, 0]}>
        <mesh position={[0, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 0.2, 1.2]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 0.8, -0.5]} rotation={[0.1, 0, 0]} castShadow>
          <boxGeometry args={[1.2, 1.8, 0.2]} />
          <meshStandardMaterial color="#111111" />
        </mesh>
        <mesh position={[0, 0.8, -0.4]} rotation={[0.1, 0, 0]}>
          <boxGeometry args={[0.8, 1.5, 0.05]} />
          <meshStandardMaterial color="#00ffcc" />
        </mesh>
        <mesh position={[0, -0.4, 0]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 0.8]} />
          <meshStandardMaterial color="#cccccc" />
        </mesh>
        <mesh position={[0, -0.7, 0]} castShadow>
          <cylinderGeometry args={[0.6, 0.6, 0.1]} />
          <meshStandardMaterial color="#888888" />
        </mesh>
      </group>

      {/* Red Armchair */}
      <group position={[-1.5, -2, -5]} rotation={[0, 0, 0]} scale={[1.3, 1.3, 1.3]}>
        {/* LED Underglow */}
        {isNeonMode && (
          <pointLight distance={2.5} intensity={1.5} color="#ff0055" position={[0, 0.2, 0]} />
        )}
        {/* Seat */}
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[1.5, 0.5, 1.5]} />
          <meshStandardMaterial color="#cc0000" roughness={0.7} />
        </mesh>
        {/* Backrest */}
        <mesh castShadow position={[0, 1.2, -0.6]}>
          <boxGeometry args={[1.5, 1.4, 0.4]} />
          <meshStandardMaterial color="#cc0000" roughness={0.7} />
        </mesh>
        {/* Armrests */}
        <mesh castShadow position={[-0.65, 0.9, 0]}>
          <boxGeometry args={[0.3, 0.6, 1.4]} />
          <meshStandardMaterial color="#aa0000" roughness={0.7} />
        </mesh>
        <mesh castShadow position={[0.65, 0.9, 0]}>
          <boxGeometry args={[0.3, 0.6, 1.4]} />
          <meshStandardMaterial color="#aa0000" roughness={0.7} />
        </mesh>
        {/* Legs */}
        <mesh castShadow position={[-0.6, 0.1, 0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh castShadow position={[0.6, 0.1, 0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh castShadow position={[-0.6, 0.1, -0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh castShadow position={[0.6, 0.1, -0.6]}>
          <cylinderGeometry args={[0.05, 0.05, 0.2]} />
          <meshStandardMaterial color="#111" />
        </mesh>
      </group>

      {/* Posters above Armchair */}
      <Poster position={[-1.5, 3.5, -6.9]} color="#ffff00" text="RELAX" size={[1.2, 1.8]} isNeonMode={isNeonMode} />
      <Poster position={[-3.5, 3.5, -6.9]} color="#00ffcc" text="CHILL" size={[1.5, 1]} isNeonMode={isNeonMode} />

      {/* PC Setup (Clickable) */}
      <group 
        position={[3.5, 0.5, -5.2]} 
        onClick={onPcClick} 
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        {/* Monitor 1 (Left) */}
        <group position={[-1.4, 0, 0.2]} rotation={[0, 0.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.6, 1, 0.1]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 0, 0.051]} key={`pcLeft-${screens.pcLeft}`}>
            <planeGeometry args={[1.5, 0.9]} />
            <meshBasicMaterial color="#000" />
            <Html transform position={[0, 0, 0.001]} distanceFactor={1.5} zIndexRange={[10, 0]}>
              <div style={{ width: '400px', height: '240px', overflow: 'hidden', background: '#000', pointerEvents: 'none' }}>
                {screens.pcLeft ? (
                  <img key={screens.pcLeft} src={screens.pcLeft} alt="PC Left" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img key="default-pcleft" src="https://picsum.photos/seed/pcleft/400/300" alt="PC Left Default" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
            </Html>
          </mesh>
          <mesh position={[0, -0.6, -0.1]}>
            <boxGeometry args={[0.2, 0.6, 0.1]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[0.6, 0.05, 0.4]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </group>
        
        {/* Monitor 2 (Main) */}
        <group position={[0.4, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.8, 1.1, 0.1]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 0, 0.051]} key={`pcMain-${screens.pcMain}`}>
            <planeGeometry args={[1.7, 1.0]} />
            <meshBasicMaterial color="#000" />
            <Html transform position={[0, 0, 0.001]} distanceFactor={1.7} zIndexRange={[10, 0]}>
              <div style={{ width: '400px', height: '235px', overflow: 'hidden', background: '#000', pointerEvents: 'none' }}>
                {screens.pcMain ? (
                  <img key={screens.pcMain} src={screens.pcMain} alt="PC Main" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                ) : (
                  <img key="default-pcmain" src="https://picsum.photos/seed/pcmain/800/600" alt="PC Main Default" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                )}
              </div>
            </Html>
          </mesh>
          <mesh position={[0, -0.7, -0.1]}>
            <boxGeometry args={[0.2, 0.6, 0.1]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0, -0.9, 0]}>
            <boxGeometry args={[0.8, 0.05, 0.5]} />
            <meshStandardMaterial color="#222" />
          </mesh>
        </group>

        {/* Speakers */}
        <group position={[-2.6, -0.6, 0.4]} rotation={[0, 0.4, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.8, 0.4]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 0.1, 0.21]}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
          <mesh position={[0, -0.2, 0.21]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
        </group>
        <group position={[1.8, -0.6, 0.2]} rotation={[0, -0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.8, 0.4]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          <mesh position={[0, 0.1, 0.21]}>
            <circleGeometry args={[0.12, 16]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
          <mesh position={[0, -0.2, 0.21]}>
            <circleGeometry args={[0.08, 16]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
        </group>

        {/* Mousepad */}
        <mesh position={[0.6, -0.94, 1.4]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[2.2, 0.8]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* Mousepad Glow */}
        <mesh position={[0.6, -0.93, 1.4]} rotation={[-Math.PI / 2, 0, 0]}>
          <planeGeometry args={[2.25, 0.85]} />
          <meshBasicMaterial color="#00ffcc" transparent opacity={0.5} />
        </mesh>

        {/* Keyboard */}
        <mesh position={[0, -0.9, 1.4]} rotation={[-0.05, 0, 0]} castShadow>
          <boxGeometry args={[1.5, 0.05, 0.5]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[0, -0.87, 1.4]} rotation={[-0.05, 0, 0]}>
          <planeGeometry args={[1.4, 0.4]} />
          <meshBasicMaterial color="#ff00ff" />
        </mesh>

        {/* Mouse */}
        <mesh position={[1.2, -0.9, 1.4]} castShadow>
          <boxGeometry args={[0.2, 0.08, 0.3]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[1.2, -0.87, 1.4]}>
          <planeGeometry args={[0.1, 0.2]} />
          <meshBasicMaterial color="#00ffcc" />
        </mesh>

        {/* Gamepad */}
        <group position={[-1.2, -0.88, 1.4]} rotation={[0, 0.3, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.4, 0.06, 0.25]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.1, 0.04, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.1, 0.04, 0]}>
            <cylinderGeometry args={[0.05, 0.05, 0.02]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* D-pad */}
          <mesh position={[-0.1, 0.04, -0.06]}>
            <boxGeometry args={[0.08, 0.02, 0.08]} />
            <meshStandardMaterial color="#ff0055" />
          </mesh>
        </group>

        {/* Gaming Mic */}
        <group position={[-1.0, -0.5, 0.8]} rotation={[0, 0.5, 0]}>
          {/* Base */}
          <mesh castShadow position={[0, -0.4, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 0.05, 32]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Stand */}
          <mesh castShadow position={[0, -0.1, 0]}>
            <cylinderGeometry args={[0.02, 0.02, 0.6]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* Mic Body */}
          <mesh castShadow position={[0, 0.3, 0]} rotation={[0.2, 0, 0]}>
            <cylinderGeometry args={[0.06, 0.06, 0.2, 16]} />
            <meshStandardMaterial color="#333" />
          </mesh>
          {/* Pop Filter */}
          <mesh position={[0, 0.3, 0.1]} rotation={[0.2, 0, 0]}>
            <circleGeometry args={[0.08, 32]} />
            <meshBasicMaterial color="#000" transparent opacity={0.8} />
          </mesh>
          {/* RGB Ring */}
          <mesh position={[0, 0.2, 0]} rotation={[0.2, 0, 0]}>
            <torusGeometry args={[0.06, 0.01, 16, 32]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
        </group>

        {/* Headset */}
        <group position={[1.6, -0.7, 1.2]} rotation={[0, -0.5, 0]}>
          {/* Headband */}
          <mesh position={[0, 0.2, 0]} castShadow>
            <torusGeometry args={[0.15, 0.03, 16, 32, Math.PI]} />
            <meshStandardMaterial color="#111" />
          </mesh>
          {/* Earcups */}
          <mesh position={[-0.15, 0.05, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.05]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[0.15, 0.05, 0]} rotation={[0, Math.PI/2, 0]} castShadow>
            <cylinderGeometry args={[0.08, 0.08, 0.05]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          {/* RGB Rings */}
          <mesh position={[-0.18, 0.05, 0]} rotation={[0, Math.PI/2, 0]}>
            <ringGeometry args={[0.06, 0.08, 16]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
          <mesh position={[0.18, 0.05, 0]} rotation={[0, Math.PI/2, 0]}>
            <ringGeometry args={[0.06, 0.08, 16]} />
            <meshBasicMaterial color="#ff00ff" />
          </mesh>
        </group>

        {/* PC Tower */}
        <group position={[2.8, -0.2, 0]}>
          <mesh castShadow>
            <boxGeometry args={[1.2, 2, 2]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[-0.61, 0, 0]} rotation={[0, -Math.PI/2, 0]}>
            <planeGeometry args={[1.8, 1.8]} />
            <meshBasicMaterial color="#ffffff" transparent opacity={0.3} />
          </mesh>
          <mesh position={[-0.5, 0.5, -0.5]}>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshBasicMaterial color="#ff0055" />
          </mesh>
          <mesh position={[-0.5, 0, 0.5]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
          <mesh position={[-0.5, -0.6, 0.5]}>
            <cylinderGeometry args={[0.3, 0.3, 0.1]} />
            <meshBasicMaterial color="#00ffcc" />
          </mesh>
        </group>

        {/* Hover Text */}
        <Text position={[0, 1.8, 0]} fontSize={0.5} color="#ffffff" outlineWidth={0.03} outlineColor="#ff00ff">
          ENTER SHOP
        </Text>
      </group>

      {/* Large Freezer (Right, next to TV, slightly increased height) */}
      <group position={[5.9, 0.75, 5]} rotation={[0, -Math.PI/2, 0]}>
        <mesh castShadow>
          <boxGeometry args={[1.8, 5.5, 1.8]} />
          <meshStandardMaterial color="#eeeeee" metalness={0.2} roughness={0.3} />
        </mesh>
        {/* Freezer Door Line */}
        <mesh position={[0, 0, 0.91]}>
          <boxGeometry args={[1.7, 5.4, 0.01]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        {/* Handle */}
        <mesh position={[-0.6, 0, 0.95]}>
          <boxGeometry args={[0.05, 1.5, 0.1]} />
          <meshStandardMaterial color="#aaaaaa" />
        </mesh>
        {/* Neon Contours */}
        {isNeonMode && (
          <group position={[0, 0, 0.92]}>
            <mesh position={[0, 2.7, 0]}>
              <boxGeometry args={[1.8, 0.05, 0.05]} />
              <meshBasicMaterial color="#ff00ff" />
            </mesh>
            <mesh position={[0, -2.7, 0]}>
              <boxGeometry args={[1.8, 0.05, 0.05]} />
              <meshBasicMaterial color="#ff00ff" />
            </mesh>
            <mesh position={[-0.9, 0, 0]}>
              <boxGeometry args={[0.05, 5.4, 0.05]} />
              <meshBasicMaterial color="#ff00ff" />
            </mesh>
            <mesh position={[0.9, 0, 0]}>
              <boxGeometry args={[0.05, 5.4, 0.05]} />
              <meshBasicMaterial color="#ff00ff" />
            </mesh>
            <pointLight distance={4} intensity={1.5} color="#ff00ff" position={[0, 0, 0.5]} />
          </group>
        )}
      </group>

      {/* TV Table & Large TV (Right) */}
      <group position={[6, -1.5, 1]} rotation={[0, -Math.PI/2, 0]}>
        {/* LED Underglow */}
        {isNeonMode && (
          <pointLight distance={3} intensity={1.5} color="#aa00ff" position={[0, 0.2, 0]} />
        )}
        {/* Table */}
        <mesh castShadow position={[0, 0.4, 0]}>
          <boxGeometry args={[4, 0.8, 1]} />
          <meshStandardMaterial color="#222" />
        </mesh>
        {/* Console (PS5 style) */}
        <group position={[1.2, 1.0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[0.3, 0.8, 0.6]} />
            <meshStandardMaterial color="#ffffff" />
          </mesh>
          <mesh position={[0, 0, 0.01]}>
            <boxGeometry args={[0.2, 0.7, 0.62]} />
            <meshStandardMaterial color="#000000" />
          </mesh>
          {/* Console Glow */}
          <mesh position={[0, 0.35, 0.32]}>
            <planeGeometry args={[0.2, 0.05]} />
            <meshBasicMaterial color="#0088ff" />
          </mesh>
        </group>
        {/* Large TV */}
        <mesh castShadow position={[0, 2.2, 0.4]}>
          <boxGeometry args={[3.6, 2, 0.1]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        {/* TV Screen (Turned On, facing the room) */}
        <mesh position={[0, 2.2, 0.46]} key={`tv-${screens.tv}`}>
          <planeGeometry args={[3.5, 1.9]} />
          <meshBasicMaterial color="#000" />
          <Html transform position={[0, 0, 0.01]} distanceFactor={3.5} zIndexRange={[10, 0]}>
            <div style={{ width: '400px', height: '217px', overflow: 'hidden', background: '#000', pointerEvents: 'none' }}>
              {screens.tv ? (
                <img key={screens.tv} src={screens.tv} alt="TV" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <img key="default-tv" src="https://media.giphy.com/media/3o7TKSjRrfIPjeiVyM/giphy.gif" alt="TV Default" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>
          </Html>
        </mesh>
        
        {/* Weapons above TV */}
        <group position={[0, 4.2, 0.05]}>
          {/* M4A1 */}
          <group position={[0, 0.5, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[2, 0.15, 0.05]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[0.2, -0.2, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.15, 0.4, 0.05]} />
              <meshStandardMaterial color="#222" />
            </mesh>
            <mesh position={[-0.2, -0.2, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.1, 0.3, 0.05]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[-0.8, -0.05, 0]}>
              <boxGeometry args={[0.4, 0.2, 0.05]} />
              <meshStandardMaterial color="#111" />
            </mesh>
            <mesh position={[0, 0.15, 0]}>
              <boxGeometry args={[0.3, 0.1, 0.05]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          </group>

          {/* Pistol */}
          <group position={[0, -0.2, 0]}>
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[0.6, 0.12, 0.05]} />
              <meshStandardMaterial color="#333" />
            </mesh>
            <mesh position={[-0.2, -0.15, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.15, 0.3, 0.05]} />
              <meshStandardMaterial color="#111" />
            </mesh>
          </group>
        </group>
      </group>

      {/* Yellow Sofa (Left) */}
      <group position={[-5.8, -1.5, -2]} rotation={[0, Math.PI/2, 0]} scale={[1.2, 1.2, 1.2]}>
        {/* Base */}
        <mesh castShadow position={[0, 0.3, 0]}>
          <boxGeometry args={[4, 0.6, 1.6]} />
          <meshStandardMaterial color="#ffcc00" roughness={0.8} />
        </mesh>
        {/* Backrest */}
        <mesh castShadow position={[0, 1.0, -0.6]}>
          <boxGeometry args={[4, 1.4, 0.4]} />
          <meshStandardMaterial color="#ffcc00" roughness={0.8} />
        </mesh>
        {/* Armrests */}
        <mesh castShadow position={[-1.85, 0.7, 0]}>
          <boxGeometry args={[0.4, 0.9, 1.6]} />
          <meshStandardMaterial color="#ffcc00" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[1.85, 0.7, 0]}>
          <boxGeometry args={[0.4, 0.9, 1.6]} />
          <meshStandardMaterial color="#ffcc00" roughness={0.8} />
        </mesh>
      </group>

      {/* Door to Bedroom (Left, next to sofa) */}
      <group 
        position={[-6.9, 0, 3]} 
        rotation={[0, Math.PI / 2, 0]} 
        onClick={onDoorClick}
        onPointerOver={() => document.body.style.cursor = 'pointer'}
        onPointerOut={() => document.body.style.cursor = 'auto'}
      >
        <mesh castShadow>
          <boxGeometry args={[2.5, 4, 0.1]} />
          <meshStandardMaterial color="#4A2F1D" />
        </mesh>
        {/* Door handle */}
        <mesh position={[-1, 0, 0.1]}>
          <sphereGeometry args={[0.1]} />
          <meshStandardMaterial color="#ffd700" />
        </mesh>
        <Text position={[0, 2.5, 0]} fontSize={0.3} color="black" outlineWidth={0.01} outlineColor="white">
          HALLWAY
        </Text>
      </group>

      {/* Potted Plant */}
      <group position={[-5.5, -2, -6]}>
        {/* Pot */}
        <mesh castShadow position={[0, 0.4, 0]}>
          <cylinderGeometry args={[0.4, 0.3, 0.8]} />
          <meshStandardMaterial color="#ffffff" roughness={0.5} />
        </mesh>
        {/* Leaves */}
        <mesh castShadow position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.6, 16, 16]} />
          <meshStandardMaterial color="#00ff55" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[-0.4, 1.0, 0.3]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#00dd44" roughness={0.8} />
        </mesh>
        <mesh castShadow position={[0.4, 1.1, -0.2]}>
          <sphereGeometry args={[0.5, 16, 16]} />
          <meshStandardMaterial color="#00ee44" roughness={0.8} />
        </mesh>
      </group>

      {/* Posters */}
      <Poster key={`gamingMainLeft-${posters?.find(p => p.id === 'gamingMainLeft')?.image}`} position={[1.8, 2.2, -6.9]} color="#ff0055" text="GRANDSON" size={[1.2, 1.8]} image={posters?.find(p => p.id === 'gamingMainLeft')?.image} isNeonMode={isNeonMode} />
      <Poster key={`gamingMainRight-${posters?.find(p => p.id === 'gamingMainRight')?.image}`} position={[5.2, 2.2, -6.9]} color="#00ffcc" text="GAMING" size={[1.2, 1.8]} image={posters?.find(p => p.id === 'gamingMainRight')?.image} isNeonMode={isNeonMode} />
      
      {/* Katanas above the desk (Rack of 6) */}
      <group position={[3.5, 4.5, -6.9]}>
        {isNeonMode && (
          <spotLight 
            position={[0, 2, 2]} 
            angle={0.5} 
            penumbra={0.5} 
            intensity={5} 
            color="#ffffff" 
            target-position={[0, 0, 0]} 
          />
        )}
        {/* Rack structure */}
        <mesh position={[-1, 0, 0.02]}>
          <boxGeometry args={[0.05, 2.5, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        <mesh position={[1, 0, 0.02]}>
          <boxGeometry args={[0.05, 2.5, 0.05]} />
          <meshStandardMaterial color="#111" />
        </mesh>
        
        {/* 6 Katanas */}
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={`katana-${i}`} position={[0, 1 - i * 0.4, 0.05]}>
            {/* Blade/Sheath */}
            <mesh position={[0, 0, 0]}>
              <boxGeometry args={[3, 0.06, 0.06]} />
              <meshStandardMaterial color={i % 2 === 0 ? "#1a1a1a" : "#8B0000"} />
            </mesh>
            {/* Handle */}
            <mesh position={[-1.5, 0, 0]}>
              <boxGeometry args={[0.8, 0.08, 0.08]} />
              <meshStandardMaterial color="#111111" />
            </mesh>
            {/* Tsuba (Guard) */}
            <mesh position={[-1.1, 0, 0]}>
              <boxGeometry args={[0.05, 0.2, 0.2]} />
              <meshStandardMaterial color="#ffd700" />
            </mesh>
            {/* Handle Wrap detail */}
            <mesh position={[-1.5, 0, 0.01]}>
              <boxGeometry args={[0.7, 0.09, 0.09]} />
              <meshStandardMaterial color="#333333" wireframe />
            </mesh>
          </group>
        ))}
      </group>

      {/* Posters left of TV (Right Wall) */}
      <group position={[6.9, 2.5, -2]} rotation={[0, -Math.PI/2, 0]}>
        <Poster position={[-0.8, 0.5, 0]} color="#ff0055" text="ANIME" size={[1, 1.5]} isNeonMode={isNeonMode} />
        <Poster position={[0.8, 0, 0]} color="#00ffcc" text="GAME" size={[1, 1.5]} isNeonMode={isNeonMode} />
        <Poster position={[-0.8, -1.2, 0]} color="#ffff00" text="PLAY" size={[1, 1]} isNeonMode={isNeonMode} />
      </group>

      {/* Posters above Sofa (Left Wall) */}
      <group position={[-6.9, 3, -2]} rotation={[0, Math.PI/2, 0]}>
        <Poster position={[-1, 0.5, 0]} color="#ff00ff" text="CHILL" size={[1.5, 1]} isNeonMode={isNeonMode} />
        <Poster position={[1, 0.5, 0]} color="#00ffff" text="VIBE" size={[1.5, 1]} isNeonMode={isNeonMode} />
        <Poster position={[0, -0.8, 0]} color="#ffaa00" text="ART" size={[2, 1]} isNeonMode={isNeonMode} />
      </group>

      {/* Flashy points in Neon Mode */}
      {isNeonMode && (
        <group>
          {/* Near the door */}
          <pointLight position={[-2, 4, 6]} intensity={1} distance={5} color="#00ffcc" />
          {/* Near the sofa */}
          <pointLight position={[-5, 4, -2]} intensity={1} distance={5} color="#ff00ff" />
          {/* Near the TV */}
          <pointLight position={[5, 4, 2]} intensity={1} distance={5} color="#ff0055" />
        </group>
      )}
    </group>
  );
}

function Cat({ position = [-2.5, -0.2, -4.5], rotation = [0, 0.5, 0] }: any) {
  const tailRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (tailRef.current) {
      tailRef.current.rotation.z = Math.sin(state.clock.elapsedTime * 2) * 0.2;
    }
  });

  return (
    <group position={position} rotation={rotation}>
      {/* Body */}
      <mesh position={[0, 0, 0]} castShadow>
        <sphereGeometry args={[0.2, 32, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.8} />
      </mesh>
      {/* Head */}
      <mesh position={[0.15, 0.15, 0]} castShadow>
        <sphereGeometry args={[0.15, 32, 32]} />
        <meshStandardMaterial color="#050505" roughness={0.8} />
      </mesh>
      {/* Ears */}
      <mesh position={[0.2, 0.28, 0.08]} rotation={[0, 0, -0.2]} castShadow>
        <coneGeometry args={[0.05, 0.15, 16]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      <mesh position={[0.2, 0.28, -0.08]} rotation={[0, 0, -0.2]} castShadow>
        <coneGeometry args={[0.05, 0.15, 16]} />
        <meshStandardMaterial color="#050505" />
      </mesh>
      {/* Eyes */}
      <mesh position={[0.28, 0.18, 0.06]} rotation={[0, 0, -Math.PI/2]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      <mesh position={[0.28, 0.18, -0.06]} rotation={[0, 0, -Math.PI/2]}>
        <sphereGeometry args={[0.02, 16, 16]} />
        <meshBasicMaterial color="#00ff00" />
      </mesh>
      {/* Tail */}
      <group position={[-0.15, 0, 0]}>
        <mesh ref={tailRef} position={[-0.1, 0.1, 0]} rotation={[0, 0, 0.5]} castShadow>
          <cylinderGeometry args={[0.02, 0.03, 0.3]} />
          <meshStandardMaterial color="#050505" />
        </mesh>
      </group>
    </group>
  );
}

function Poster({ position, rotation = [0, 0, 0], color, text, size = [1.5, 2], image, isNeonMode }: any) {
  return (
    <group position={position} rotation={rotation}>
      {isNeonMode && (
        <mesh position={[0, 0, -0.02]}>
          <planeGeometry args={[size[0] + 0.4, size[1] + 0.4]} />
          <meshBasicMaterial color={color || "#00ffcc"} transparent opacity={0.3} />
        </mesh>
      )}
      <mesh>
        <planeGeometry args={size} />
        <meshStandardMaterial color="#111" />
      </mesh>
      {image ? (
        <mesh position={[0, 0, 0.01]}>
          <planeGeometry args={[size[0] + 0.1, size[1] + 0.1]} />
          <meshBasicMaterial color="#000" />
          <Html transform position={[0, 0, 0.01]} distanceFactor={3} zIndexRange={[10, 0]}>
            <div style={{ width: `${size[0] * 100}px`, height: `${size[1] * 100}px`, overflow: 'hidden', pointerEvents: 'none' }}>
              <img src={image} alt={text} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          </Html>
        </mesh>
      ) : (
        <>
          <mesh position={[0, 0, -0.01]}>
            <planeGeometry args={[size[0] + 0.1, size[1] + 0.1]} />
            <meshBasicMaterial color={color} />
          </mesh>
          <Suspense fallback={null}>
            <Text position={[0, 0, 0.01]} fontSize={0.25} color="white" maxWidth={size[0] - 0.2} textAlign="center">
              {text}
            </Text>
          </Suspense>
        </>
      )}
    </group>
  );
}