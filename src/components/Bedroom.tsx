import { Text, Html } from '@react-three/drei';
import { Suspense } from 'react';

export function Bedroom({ onBack, posters, isNeonMode, onToggleNeon }: { onBack: () => void, posters: any[], isNeonMode?: boolean, onToggleNeon?: () => void }) {
  return (
    <group>
      {/* Ceiling LED Strips (Neon Mode) */}
      {isNeonMode && (
        <group position={[0, 5.9, 0]}>
          <mesh position={[0, 0, -6.9]}>
            <boxGeometry args={[13.8, 0.1, 0.1]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[0, 0, 6.9]}>
            <boxGeometry args={[13.8, 0.1, 0.1]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[-6.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[13.8, 0.1, 0.1]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
          <mesh position={[6.9, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
            <boxGeometry args={[13.8, 0.1, 0.1]} />
            <meshBasicMaterial color="#00ffff" />
          </mesh>
        </group>
      )}

      {/* Light Switch */}
      <group 
        position={[2.5, 0.5, -6.9]} 
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
          <meshStandardMaterial color={isNeonMode ? "#ff4444" : "#ffffff"} />
        </mesh>
      </group>

      {/* Red Carpet Floor */}
      <mesh position={[0, -2, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[14, 14]} />
        <meshStandardMaterial color="#aa0000" roughness={0.9} />
      </mesh>
      
      {/* White Walls */}
      {/* Back Wall (Behind Bed) */}
      <mesh position={[0, 2, -7]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Left Wall */}
      <mesh position={[-7, 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Right Wall */}
      <mesh position={[7, 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>
      {/* Front Wall (Facing the bed) */}
      <mesh position={[0, 2, 7]} rotation={[0, Math.PI, 0]} receiveShadow>
        <planeGeometry args={[14, 8]} />
        <meshStandardMaterial color="#ffffff" />
      </mesh>

      {/* Bed */}
      <group position={[-2.5, -1.5, -4]}>
        {/* Wooden Headboard */}
        <mesh position={[0, 1.5, -2.4]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 3, 0.2]} />
          <meshStandardMaterial color="#5c3a21" roughness={0.9} />
        </mesh>
        {/* Headboard Neon */}
        {isNeonMode && (
          <mesh position={[0, 1.5, -2.45]}>
            <boxGeometry args={[4.4, 3.2, 0.1]} />
            <meshBasicMaterial color="#ff00ff" />
            <pointLight distance={3} intensity={1.5} color="#ff00ff" position={[0, 0, 0.5]} />
          </mesh>
        )}
        {/* Bed Frame */}
        <mesh castShadow receiveShadow>
          <boxGeometry args={[4, 0.5, 5]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>
        {/* Under Bed Neon */}
        {isNeonMode && (
          <mesh position={[0, -0.2, 0]}>
            <boxGeometry args={[3.8, 0.1, 4.8]} />
            <meshBasicMaterial color="#ff00ff" />
            <pointLight distance={4} intensity={1.5} color="#ff00ff" position={[0, -0.5, 0]} />
          </mesh>
        )}
        {/* Mattress */}
        <mesh position={[0, 0.5, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.8, 0.5, 4.8]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Pillows */}
        <mesh position={[-1, 0.8, -1.8]} castShadow>
          <boxGeometry args={[1.2, 0.2, 0.8]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
        <mesh position={[1, 0.8, -1.8]} castShadow>
          <boxGeometry args={[1.2, 0.2, 0.8]} />
          <meshStandardMaterial color="#dddddd" />
        </mesh>
      </group>

      {/* Above Bed Decor */}
      <group position={[-4.0, 2.5, -6.9]}>
        <Poster position={[0, 0, 0]} color="#00ccff" text="HOOPS" size={[1, 1.5]} image={posters?.find(p => p.id === 3)?.image} />
      </group>
      <group position={[-1.0, 2.5, -6.9]}>
        <Poster position={[0, 0, 0]} color="#ff00cc" text="JORDAN" size={[1, 1.5]} />
      </group>

      {/* Shoe Boxes Gallery on Wall */}
      <group position={[-2.5, 3.8, -6.8]}>
        <NikeBox position={[-1.2, 0, 0]} rotation={[0.2, 0, 0]} />
        <NikeBox position={[0, 0.2, 0]} rotation={[-0.1, 0, 0]} />
        <NikeBox position={[1.2, -0.1, 0]} rotation={[0.15, 0, 0]} />
        <NikeBox position={[-0.6, -0.6, 0]} rotation={[-0.2, 0, 0]} />
        <NikeBox position={[0.6, -0.5, 0]} rotation={[0.1, 0, 0]} />
      </group>

      {/* Vertical Caps (Right of bed) */}
      <group position={[0.5, 3.5, -6.9]}>
        {Array.from({ length: 6 }).map((_, i) => (
          <group key={`cap-${i}`} position={[0, -i * 0.8, 0.15]}>
            <mesh castShadow>
              <sphereGeometry args={[0.2, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
              <meshStandardMaterial color={['#ff0000', '#0000ff', '#00ff00', '#ffff00', '#ff00ff', '#00ffff'][i]} />
            </mesh>
            <mesh position={[0, -0.05, 0.15]} rotation={[-0.2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.2, 0.05, 16]} />
              <meshStandardMaterial color={['#cc0000', '#0000cc', '#00cc00', '#cccc00', '#cc00cc', '#00cccc'][i]} />
            </mesh>
          </group>
        ))}
      </group>

      {/* Door back to Gaming Room (Back wall, right of the bed) */}
      <group 
        position={[4, 0, -6.9]} 
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
          <Text position={[0, 2.5, 0]} fontSize={0.25} color="white" outlineWidth={0.02} outlineColor="black">
            HALLWAY
          </Text>
        </Suspense>
      </group>

      {/* Basketball Hoop (Above the door) */}
      <group position={[4, 3, -6.8]}>
        {/* Backboard */}
        <mesh castShadow>
          <boxGeometry args={[1.8, 1.2, 0.05]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
        {/* Red Square on Backboard */}
        <mesh position={[0, -0.2, 0.03]}>
          <planeGeometry args={[0.6, 0.4]} />
          <meshBasicMaterial color="#ff0000" />
        </mesh>
        {/* Inner White Square */}
        <mesh position={[0, -0.2, 0.04]}>
          <planeGeometry args={[0.5, 0.3]} />
          <meshBasicMaterial color="#ffffff" />
        </mesh>
        {/* Hoop Ring */}
        <mesh position={[0, -0.4, 0.3]} rotation={[Math.PI/2, 0, 0]} castShadow>
          <torusGeometry args={[0.3, 0.03, 16, 32]} />
          <meshStandardMaterial color="#ff4400" />
        </mesh>
        {/* Net (simplified) */}
        <mesh position={[0, -0.7, 0.3]} castShadow>
          <cylinderGeometry args={[0.3, 0.2, 0.6, 16]} />
          <meshStandardMaterial color="#ffffff" transparent opacity={0.5} wireframe />
        </mesh>
      </group>

      {/* Front Wall: Black Display & Wardrobe (Left side) */}
      <group position={[-3.5, 1.5, 6.8]} rotation={[0, Math.PI, 0]}>
        {/* Main Black Frame */}
        <mesh castShadow>
          <boxGeometry args={[6, 7, 1]} />
          <meshStandardMaterial color="#111111" roughness={0.8} />
        </mesh>
        
        {/* Top Display Shelves */}
        {Array.from({ length: 2 }).map((_, row) => (
          <group key={`front-shelf-top-${row}`} position={[0, 1.5 + row * 1.5, 0.2]}>
            <mesh castShadow>
              <boxGeometry args={[5.8, 0.1, 0.8]} />
              <meshStandardMaterial color="#222222" />
            </mesh>
            {/* Display items (shoes) */}
            {Array.from({ length: 4 }).map((_, col) => (
              <group key={`front-shoes-${row}-${col}`} position={[-2.1 + col * 1.4, 0.2, 0]}>
                <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[0.4, 0.15, 0.6]} /><meshStandardMaterial color="#fff" /></mesh>
                <mesh castShadow position={[0, 0.15, -0.1]}><boxGeometry args={[0.3, 0.15, 0.4]} /><meshStandardMaterial color={['#ff0055', '#00ffcc', '#ffcc00', '#3a0ca3'][(row + col) % 4]} /></mesh>
              </group>
            ))}
          </group>
        ))}

        {/* Bottom Wardrobe Section */}
        <group position={[0, -1, 0.2]}>
          {/* Hanging Rod */}
          <mesh position={[0, 1.5, 0]} rotation={[0, 0, Math.PI/2]} castShadow>
            <cylinderGeometry args={[0.05, 0.05, 5.8, 8]} />
            <meshStandardMaterial color="#cccccc" metalness={0.8} />
          </mesh>
          {/* Hanging Clothes */}
          {Array.from({ length: 12 }).map((_, i) => (
            <group key={`front-wardrobe-${i}`} position={[-2.5 + i * 0.45, -0.2, 0]}>
              <mesh castShadow position={[0, 1.6, 0]}><boxGeometry args={[0.05, 0.2, 0.4]} /><meshStandardMaterial color="#333" /></mesh>
              <mesh castShadow><boxGeometry args={[0.35, 3.0, 0.6]} /><meshStandardMaterial color={['#ff0000', '#0000ff', '#ffffff', '#222222', '#ffcc00'][i % 5]} /></mesh>
            </group>
          ))}
        </group>
      </group>

      {/* Double Clothing Rack (Right side of front wall) */}
      <group position={[3.5, 1.5, 6.5]} rotation={[0, Math.PI, 0]}>
        {/* Frame */}
        <mesh position={[-2.5, 0, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 6, 8]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
        <mesh position={[2.5, 0, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 6, 8]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
        <mesh position={[0, -2.9, 0]} castShadow><boxGeometry args={[5.2, 0.1, 1]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
        
        {/* Top Bar */}
        <mesh position={[0, 2.8, 0]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.05, 0.05, 5, 8]} /><meshStandardMaterial color="#ccc" metalness={0.9} /></mesh>
        {/* Bottom Bar */}
        <mesh position={[0, 0, 0]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.05, 0.05, 5, 8]} /><meshStandardMaterial color="#ccc" metalness={0.9} /></mesh>

        {/* Clothes on Top Bar */}
        {Array.from({ length: 12 }).map((_, i) => (
          <group key={`top-rack-${i}`} position={[-2.2 + i * 0.4, 2.0, 0]}>
            <mesh castShadow position={[0, 0.8, 0]}><boxGeometry args={[0.05, 0.2, 0.4]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh castShadow><boxGeometry args={[0.3, 1.4, 0.6]} /><meshStandardMaterial color={['#ff0000', '#0000ff', '#ffffff', '#222222', '#ffcc00'][i % 5]} /></mesh>
          </group>
        ))}

        {/* Clothes on Bottom Bar */}
        {Array.from({ length: 12 }).map((_, i) => (
          <group key={`bot-rack-${i}`} position={[-2.2 + i * 0.4, -0.8, 0]}>
            <mesh castShadow position={[0, 0.8, 0]}><boxGeometry args={[0.05, 0.2, 0.4]} /><meshStandardMaterial color="#111" /></mesh>
            <mesh castShadow><boxGeometry args={[0.3, 1.4, 0.6]} /><meshStandardMaterial color={['#00ff00', '#ff00ff', '#00ffff', '#888888', '#ff8800'][i % 5]} /></mesh>
          </group>
        ))}
      </group>

      {/* Floor Decor: Rugs Right of the Bed */}
      <group position={[2.5, -1.9, -2]}>
        {/* Silver Rug */}
        <mesh position={[0, 0, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <planeGeometry args={[3, 4]} />
          <meshStandardMaterial color="#c0c0c0" roughness={0.4} metalness={0.6} />
        </mesh>
        {/* Gamepad Rug */}
        <group position={[0, 0.01, -1]}>
          <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <planeGeometry args={[2, 1.2]} />
            <meshStandardMaterial color="#222" />
          </mesh>
          <mesh position={[-0.5, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.25, 16]} />
            <meshStandardMaterial color="#444" />
          </mesh>
          <mesh position={[0.5, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.25, 16]} />
            <meshStandardMaterial color="#444" />
          </mesh>
        </group>
        {/* Sunflower Rug */}
        <group position={[0, 0.02, 1]}>
          <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.8, 32]} />
            <meshStandardMaterial color="#ffcc00" />
          </mesh>
          <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
            <circleGeometry args={[0.4, 32]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
        </group>
        {/* Basketball */}
        <mesh position={[1.5, 0.3, 1]} castShadow>
          <sphereGeometry args={[0.3, 32, 32]} />
          <meshStandardMaterial color="#ff6600" roughness={0.6} />
        </mesh>
      </group>

      {/* Floor Decor: Sneaker Rug In Front of the Bed */}
      <group position={[-2.5, -1.9, 1.5]}>
        <mesh rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          {/* A simple capsule shape for sneaker rug */}
          <capsuleGeometry args={[0.6, 1.5, 4, 16]} />
          <meshStandardMaterial color="#ff0055" />
        </mesh>
        <mesh position={[0, 0.01, 0]} rotation={[-Math.PI/2, 0, 0]} receiveShadow>
          <capsuleGeometry args={[0.4, 1.2, 4, 16]} />
          <meshStandardMaterial color="#ffffff" />
        </mesh>
      </group>

      {/* Right Wall: Two Shoe Shelves + Mirror + New Sneaker Zone */}
      <group position={[6.8, 1.5, 0]} rotation={[0, -Math.PI/2, 0]}>
        
        {/* Existing Elements (Shifted Right) */}
        <group position={[2, 0, 0]}>
          {/* Mirror in the middle */}
          <mesh position={[0, -0.5, 0]} castShadow>
            <boxGeometry args={[3, 6, 0.1]} />
            <meshStandardMaterial color="#cccccc" />
          </mesh>
          {isNeonMode && (
            <mesh position={[0, -0.5, -0.05]}>
              <boxGeometry args={[3.2, 6.2, 0.1]} />
              <meshBasicMaterial color="#00ffff" />
              <pointLight distance={4} intensity={1.5} color="#00ffff" position={[0, 0, 0.5]} />
            </mesh>
          )}
          <mesh position={[0, -0.5, 0.06]}>
            <planeGeometry args={[2.8, 5.8]} />
            <meshStandardMaterial color="#ffffff" metalness={1} roughness={0} />
          </mesh>

          {/* Nike boxes above mirror */}
          <NikeBox position={[-0.4, 2.8, 0.2]} />
          <NikeBox position={[0.4, 2.8, 0.2]} rotation={[0, 0.2, 0]} />

          {/* Left Shoe Shelf */}
          <group position={[-2.5, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2, 7, 1]} />
              <meshStandardMaterial color="#eeeeee" />
            </mesh>
            {Array.from({ length: 5 }).map((_, row) => (
              <group key={`r-shelf1-${row}`} position={[0, -2.8 + row * 1.2, 0.2]}>
                <mesh castShadow>
                  <boxGeometry args={[1.8, 0.1, 0.8]} />
                  <meshStandardMaterial color="#dddddd" />
                </mesh>
                <mesh position={[-0.4, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.4, 0.3, 0.6]} />
                  <meshStandardMaterial color="#ff4444" />
                </mesh>
                <mesh position={[0.4, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.4, 0.3, 0.6]} />
                  <meshStandardMaterial color="#4444ff" />
                </mesh>
              </group>
            ))}
          </group>

          {/* Right Shoe Shelf */}
          <group position={[2.5, 0, 0]}>
            <mesh castShadow>
              <boxGeometry args={[2, 7, 1]} />
              <meshStandardMaterial color="#eeeeee" />
            </mesh>
            {Array.from({ length: 5 }).map((_, row) => (
              <group key={`r-shelf2-${row}`} position={[0, -2.8 + row * 1.2, 0.2]}>
                <mesh castShadow>
                  <boxGeometry args={[1.8, 0.1, 0.8]} />
                  <meshStandardMaterial color="#dddddd" />
                </mesh>
                <mesh position={[-0.4, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.4, 0.3, 0.6]} />
                  <meshStandardMaterial color="#22ff22" />
                </mesh>
                <mesh position={[0.4, 0.2, 0]} castShadow>
                  <boxGeometry args={[0.4, 0.3, 0.6]} />
                  <meshStandardMaterial color="#ffff22" />
                </mesh>
              </group>
            ))}
          </group>
        </group>

        {/* New Sneaker Zone (Left side) */}
        <group position={[-4, 0, 0]}>
          {/* Low Shoe Shelf */}
          <mesh position={[0, -2.5, 0]} castShadow>
            <boxGeometry args={[3, 2, 1]} />
            <meshStandardMaterial color="#333333" />
          </mesh>
          {Array.from({ length: 2 }).map((_, row) => (
            <group key={`new-low-shelf-${row}`} position={[0, -3 + row * 1, 0.2]}>
              <mesh castShadow>
                <boxGeometry args={[2.8, 0.1, 0.8]} />
                <meshStandardMaterial color="#555555" />
              </mesh>
              {/* Shoes on shelf */}
              <group position={[-0.8, 0.2, 0]}>
                <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[0.4, 0.15, 0.6]} /><meshStandardMaterial color="#fff" /></mesh>
                <mesh castShadow position={[0, 0.15, -0.1]}><boxGeometry args={[0.3, 0.15, 0.4]} /><meshStandardMaterial color={['#ff00ff', '#00ffff'][row]} /></mesh>
              </group>
              <group position={[0.8, 0.2, 0]}>
                <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[0.4, 0.15, 0.6]} /><meshStandardMaterial color="#111" /></mesh>
                <mesh castShadow position={[0, 0.15, -0.1]}><boxGeometry args={[0.3, 0.15, 0.4]} /><meshStandardMaterial color={['#fff', '#ff0'][row]} /></mesh>
              </group>
            </group>
          ))}

          {/* Column of Shoe Boxes to Ceiling */}
          <group position={[0, -1.5, 0.2]}>
            {Array.from({ length: 15 }).map((_, i) => (
              <NikeBox 
                key={`new-col-box-${i}`} 
                position={[(i%2===0?0.1:-0.1), i * 0.32, 0]} 
                rotation={[0, (i%2===0?0.1:-0.1), 0]} 
              />
            ))}
          </group>
        </group>

      </group>

      {/* Left Wall: Collection Zone & Storage */}
      <group position={[-6.8, 1.5, 0]} rotation={[0, Math.PI/2, 0]}>
        
        {/* Corner: Shoe Box Column & Low Shelf (Far left, near front wall) */}
        <group position={[-5.5, 0, 0]}>
          {/* Low Shelf */}
          <mesh position={[0, -3, 0]} castShadow>
            <boxGeometry args={[2.5, 1, 1]} />
            <meshStandardMaterial color="#222222" />
          </mesh>
          {isNeonMode && (
            <mesh position={[0, -3.5, 0]}>
              <boxGeometry args={[2.3, 0.1, 0.8]} />
              <meshBasicMaterial color="#00ffff" />
              <pointLight distance={3} intensity={1.5} color="#00ffff" position={[0, -0.5, 0]} />
            </mesh>
          )}
          {/* Shoes on Low Shelf */}
          {Array.from({ length: 2 }).map((_, col) => (
            <group key={`low-shoes-${col}`} position={[-0.6 + col * 1.2, -2.4, 0.2]}>
              <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[0.4, 0.15, 0.6]} /><meshStandardMaterial color="#fff" /></mesh>
              <mesh castShadow position={[0, 0.15, -0.1]}><boxGeometry args={[0.3, 0.15, 0.4]} /><meshStandardMaterial color={['#ff00ff', '#00ffff'][col]} /></mesh>
            </group>
          ))}

          {/* Column of Shoe Boxes to Ceiling */}
          <group position={[0, -2.5, 0.2]}>
            {Array.from({ length: 18 }).map((_, i) => (
              <NikeBox 
                key={`col-box-${i}`} 
                position={[(i%2===0?0.1:-0.1), i * 0.32, 0]} 
                rotation={[0, (i%2===0?0.1:-0.1), 0]} 
              />
            ))}
          </group>
        </group>

        {/* Clothing Rack (Shifted right) */}
        <group position={[-2.0, -0.5, 0.5]}>
          {/* Frame */}
          <mesh position={[-1.2, 0, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 4, 8]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
          <mesh position={[1.2, 0, 0]} castShadow><cylinderGeometry args={[0.05, 0.05, 4, 8]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
          <mesh position={[0, -1.9, 0]} castShadow><boxGeometry args={[2.5, 0.1, 0.8]} /><meshStandardMaterial color="#333" metalness={0.8} /></mesh>
          <mesh position={[0, 1.9, 0]} rotation={[0, 0, Math.PI/2]} castShadow><cylinderGeometry args={[0.05, 0.05, 2.5, 8]} /><meshStandardMaterial color="#ccc" metalness={0.9} /></mesh>

          {/* Hanging Clothes */}
          {Array.from({ length: 6 }).map((_, i) => (
            <group key={`rack-cloth-${i}`} position={[-0.9 + i * 0.35, 1.1, 0]}>
              <mesh castShadow position={[0, 0.8, 0]}><boxGeometry args={[0.05, 0.2, 0.4]} /><meshStandardMaterial color="#111" /></mesh>
              <mesh castShadow><boxGeometry args={[0.25, 1.4, 0.5]} /><meshStandardMaterial color={['#ffaaaa', '#aaffaa', '#aaaaff', '#ffffaa', '#ffaaff', '#aaffff'][i]} /></mesh>
            </group>
          ))}

          {/* Shoe Boxes at bottom */}
          <NikeBox position={[-0.6, -1.7, 0]} />
          <NikeBox position={[0.6, -1.7, 0]} rotation={[0, 0.2, 0]} />
          <NikeBox position={[0, -1.4, 0]} rotation={[0, -0.1, 0]} />
        </group>

        {/* Wooden Shelf (Shifted right) */}
        <group position={[1.5, 0, 0]}>
          <mesh castShadow>
            <boxGeometry args={[2.5, 7, 1]} />
            <meshStandardMaterial color="#8B4513" />
          </mesh>
          {Array.from({ length: 5 }).map((_, row) => (
            <group key={`l-shelf-${row}`} position={[0, -2.8 + row * 1.3, 0.2]}>
              <mesh castShadow>
                <boxGeometry args={[2.3, 0.1, 0.8]} />
                <meshStandardMaterial color="#654321" />
              </mesh>
              {/* Improved Shoes */}
              <group position={[-0.6, 0.2, 0]}>
                <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[0.4, 0.15, 0.6]} /><meshStandardMaterial color="#fff" /></mesh>
                <mesh castShadow position={[0, 0.15, -0.1]}><boxGeometry args={[0.3, 0.15, 0.4]} /><meshStandardMaterial color={['#ff0000', '#00ff00', '#0000ff', '#ff00ff', '#00ffff'][row]} /></mesh>
              </group>
              <group position={[0.6, 0.2, 0]}>
                <mesh castShadow position={[0, 0, 0]}><boxGeometry args={[0.4, 0.15, 0.6]} /><meshStandardMaterial color="#111" /></mesh>
                <mesh castShadow position={[0, 0.15, -0.1]}><boxGeometry args={[0.3, 0.15, 0.4]} /><meshStandardMaterial color={['#fff', '#ff0', '#0ff', '#f0f', '#f00'][row]} /></mesh>
              </group>
            </group>
          ))}
        </group>

        {/* Collection Zone (Shifted right, towards back wall / bed) */}
        <group position={[4.5, 0, 0]}>
          {/* Shoe Boxes Pile */}
          <group position={[0, -3.2, 0.5]}>
            {Array.from({ length: 15 }).map((_, i) => (
              <NikeBox 
                key={`pile-${i}`} 
                position={[(Math.random() - 0.5) * 1.5, (i * 0.3) % 1.5, (Math.random() - 0.5) * 0.8]} 
                rotation={[0, Math.random() * Math.PI, 0]} 
              />
            ))}
            {/* Shoes on top of boxes */}
            <mesh position={[0, 1.6, 0]} castShadow><boxGeometry args={[0.4, 0.2, 0.6]} /><meshStandardMaterial color="#ff0000" /></mesh>
            <mesh position={[0.6, 1.3, 0.2]} castShadow><boxGeometry args={[0.4, 0.2, 0.6]} /><meshStandardMaterial color="#0000ff" /></mesh>
            <mesh position={[-0.6, 1.0, -0.2]} castShadow><boxGeometry args={[0.4, 0.2, 0.6]} /><meshStandardMaterial color="#00ff00" /></mesh>
          </group>

          {/* Basketball Jerseys on Wall */}
          {Array.from({ length: 5 }).map((_, i) => (
            <group key={`jersey-${i}`} position={[-1.0 + (i%3)*1.0, 2.5 - Math.floor(i/3)*2, 0.05]}>
              <mesh castShadow>
                <planeGeometry args={[0.9, 1.2]} />
                <meshStandardMaterial color={['#ffcc00', '#ff0000', '#0000ff', '#000000', '#ffffff'][i]} />
              </mesh>
              {isNeonMode && (
                <mesh position={[0, 0, -0.02]}>
                  <planeGeometry args={[1.0, 1.3]} />
                  <meshBasicMaterial color="#ff00ff" />
                  <pointLight distance={2} intensity={1} color="#ff00ff" position={[0, 0, 0.2]} />
                </mesh>
              )}
              <Text position={[0, 0.2, 0.01]} fontSize={0.15} color={i === 4 ? 'black' : 'white'} fontWeight="bold">
                GRANDSON
              </Text>
              <Text position={[0, -0.15, 0.01]} fontSize={0.3} color={i === 4 ? 'black' : 'white'} fontWeight="bold">
                {[23, 24, 8, 30, 1][i]}
              </Text>
            </group>
          ))}
        </group>

      </group>

      {/* Flashy points in Neon Mode */}
      {isNeonMode && (
        <group>
          {/* Near the door */}
          <pointLight position={[2, 4, -5]} intensity={1} distance={5} color="#00ffcc" />
          {/* Near the wardrobe */}
          <pointLight position={[-3, 4, 5]} intensity={1} distance={5} color="#ff00ff" />
          {/* Near the mirror */}
          <pointLight position={[5, 4, 0]} intensity={1} distance={5} color="#ff0055" />
        </group>
      )}
    </group>
  );
}

function NikeBox({ position, rotation = [0, 0, 0] }: any) {
  return (
    <group position={position} rotation={rotation}>
      <mesh castShadow>
        <boxGeometry args={[0.6, 0.3, 0.4]} />
        <meshStandardMaterial color="#ff4400" />
      </mesh>
      <Text position={[0, 0, 0.21]} fontSize={0.1} color="white" fontWeight="bold">
        NIKE
      </Text>
    </group>
  );
}

function Poster({ position, rotation = [0, 0, 0], color, text, size = [1.5, 2], image }: any) {
  return (
    <group position={position} rotation={rotation}>
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
