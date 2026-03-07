import React, { useState, Suspense, useEffect, Component, ReactNode, ErrorInfo } from 'react';
import { Canvas, useThree } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, PerspectiveCamera, Loader, AdaptiveDpr, AdaptiveEvents } from '@react-three/drei';
import * as THREE from 'three';
import { motion, AnimatePresence } from 'motion/react';
import { Joystick } from 'react-joystick-component';
import { useStore } from './store';
import { House } from './components/House';
import { Room } from './components/Room';
import { Bedroom } from './components/Bedroom';
import { Hallway } from './components/Hallway';
import { Bathroom } from './components/Bathroom';
import { Studio } from './components/Studio';
import { ShopUI } from './components/ShopUI';
import { ComputerUI } from './components/ComputerUI';
import { GamesUI } from './components/GamesUI';
import { Player } from './components/Player';
import { StudioGameUI, CatGameUI, BasketballGameUI } from './components/MiniGames';

type GameState = 'outside' | 'inside' | 'shop' | 'admin' | 'bedroom' | 'hallway' | 'bathroom' | 'studio' | 'computer' | 'games';

function CameraController({ gameState }: { gameState: GameState }) {
  const camera = useThree((state) => state.camera);
  const controls = useThree((state) => state.controls) as any;

  useEffect(() => {
    if (!controls || !camera) return;
    
    const target = new THREE.Vector3(0, 0, 0);
    const position = new THREE.Vector3();

    if (gameState === 'outside') {
      position.set(0, 5, 25);
      target.set(0, 0, 0);
    } else if (gameState === 'shop' || gameState === 'admin' || gameState === 'computer' || gameState === 'games') {
      position.set(0, 1, -2);
      target.set(0, 0.5, -5.2);
    } else if (gameState === 'inside') {
      position.set(0, 10, 16);
      target.set(0, 0, 0);
    } else if (gameState === 'studio') {
      position.set(0, 10, 16);
      target.set(0, 0, 0);
    } else if (gameState === 'bedroom') {
      position.set(0, 8, 12);
      target.set(0, 0, 0);
    } else if (gameState === 'bathroom') {
      position.set(0, 8, 12);
      target.set(0, 0, 0);
    } else if (gameState === 'hallway') {
      position.set(0, 8, 10);
      target.set(0, 0, 0);
    }

    camera.position.copy(position);
    if (controls.target) {
      controls.target.copy(target);
      controls.update();
    }
  }, [gameState, camera, controls]);

  return null;
}

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="absolute inset-0 bg-red-900 text-white p-8 overflow-auto z-50">
          <h1 className="text-2xl font-bold mb-4">Something went wrong.</h1>
          <pre className="text-sm bg-black p-4 rounded">{this.state.error?.toString()}</pre>
          <pre className="text-xs mt-4">{this.state.error?.stack}</pre>
        </div>
      );
    }

    return this.props.children;
  }
}

export default function App() {
  const gameState = useStore((state: any) => state.gameState);
  const setGameState = useStore((state: any) => state.setGameState);
  const navMode = useStore((state: any) => state.navMode);
  const setNavMode = useStore((state: any) => state.setNavMode);
  
  const setPlayerPosition = useStore((state: any) => state.setPlayerPosition);
  const setPlayerRotation = useStore((state: any) => state.setPlayerRotation);

  const canInteract = useStore((state: any) => state.canInteract);
  const interactionType = useStore((state: any) => state.interactionType);
  const interactionTarget = useStore((state: any) => state.interactionTarget);
  const interactionText = useStore((state: any) => state.interactionText);
  
  const setJoystickMove = useStore((state: any) => state.setJoystickMove);
  const setIsJumping = useStore((state: any) => state.setIsJumping);
  
  const isCustomizing = useStore((state: any) => state.isCustomizing);
  const setIsCustomizing = useStore((state: any) => state.setIsCustomizing);
  const isStudioGame = useStore((state: any) => state.isStudioGame);
  const setIsStudioGame = useStore((state: any) => state.setIsStudioGame);
  const isCatGame = useStore((state: any) => state.isCatGame);
  const setIsCatGame = useStore((state: any) => state.setIsCatGame);
  const isBasketballGame = useStore((state: any) => state.isBasketballGame);
  const setIsBasketballGame = useStore((state: any) => state.setIsBasketballGame);
  const setShirtColor = useStore((state: any) => state.setShirtColor);
  const setPantsColor = useStore((state: any) => state.setPantsColor);

  // Use store data directly
  const posters = useStore((state: any) => state.posters);
  const screens = useStore((state: any) => state.screens);

  const [isNeonMode, setIsNeonMode] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const handleAction = () => {
    if (!canInteract) return;
    
    if (interactionType === 'door' && interactionTarget) {
      setIsTransitioning(true);
      setTimeout(() => {
        let newPos: [number, number, number] = [0, 0, 0];
        let newRot = 0;

        if (interactionTarget === 'outside') {
          if (gameState === 'inside') {
            newPos = [2, 0, 3];
            newRot = 0;
          } else if (gameState === 'studio') {
            newPos = [-2, 0, 3];
            newRot = 0;
          }
        } else if (interactionTarget === 'inside') {
          if (gameState === 'outside') {
            newPos = [0, 0, 5];
            newRot = Math.PI;
          } else if (gameState === 'hallway') {
            newPos = [-5, 0, 3];
            newRot = Math.PI / 2;
          }
        } else if (interactionTarget === 'studio') {
          newPos = [0, 0, 5];
          newRot = Math.PI;
        } else if (interactionTarget === 'hallway') {
          if (gameState === 'inside') {
            newPos = [0, 0, 2];
            newRot = Math.PI;
          } else if (gameState === 'bedroom') {
            newPos = [0, 0, -2];
            newRot = 0;
          } else if (gameState === 'bathroom') {
            newPos = [2, 0, 0];
            newRot = -Math.PI / 2;
          }
        } else if (interactionTarget === 'bedroom') {
          newPos = [4, 0, -5];
          newRot = 0;
        } else if (interactionTarget === 'bathroom') {
          newPos = [0, 0, 3];
          newRot = Math.PI;
        }

        setPlayerPosition(newPos);
        setPlayerRotation(newRot);
        setGameState(interactionTarget as any);
        setTimeout(() => setIsTransitioning(false), 500);
      }, 500);
    } else if (interactionType === 'pc') {
      setGameState('computer');
    } else if (interactionType === 'clothes') {
      setIsCustomizing(true);
    } else if (interactionType === 'switch') {
      setIsNeonMode(!isNeonMode);
    } else if (interactionType === 'tablet') {
      setIsStudioGame(true);
    } else if (interactionType === 'cat') {
      setIsCatGame(true);
    } else if (interactionType === 'basketball') {
      setIsBasketballGame(true);
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans">
      {/* Transition Overlay */}
      <AnimatePresence>
        {isTransitioning && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute inset-0 bg-black z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Navigation Mode Toggle */}
      <div className="absolute top-4 right-4 z-50 flex gap-2">
        <button 
          onClick={() => setNavMode('explore')}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${navMode === 'explore' ? 'bg-white text-black' : 'bg-black/50 text-white border border-white/20'}`}
        >
          EXPLORER
        </button>
        <button 
          onClick={() => setNavMode('play')}
          className={`px-4 py-2 rounded-full font-bold text-sm transition-colors ${navMode === 'play' ? 'bg-cyan-400 text-black' : 'bg-black/50 text-white border border-white/20'}`}
        >
          JOUER
        </button>
      </div>

      {/* UI Overlay for instructions */}
      <AnimatePresence>
        {gameState === 'outside' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute top-12 left-0 w-full text-center z-10 pointer-events-none"
          >
            <h1 className="text-white text-4xl md:text-6xl font-black tracking-tighter drop-shadow-lg">
              GRANDSON 3D EXPERIENCE
            </h1>
            <p className="text-cyan-400 mt-4 text-xl font-mono animate-pulse">
              CLICK THE HOUSE TO ENTER
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mini-Games Overlays */}
      <AnimatePresence>
        {isStudioGame && <StudioGameUI />}
        {isCatGame && <CatGameUI />}
        {isBasketballGame && <BasketballGameUI />}
      </AnimatePresence>

      <ErrorBoundary>
        <Canvas 
          shadows 
          camera={{ position: [0, 5, 25], fov: 50 }}
          dpr={[1, 1.5]}
          performance={{ min: 0.5 }}
          gl={{ powerPreference: "high-performance", antialias: true }}
        >
          <AdaptiveDpr pixelated />
          <AdaptiveEvents />
          {navMode === 'explore' && <CameraController gameState={gameState} />}
          <color attach="background" args={[gameState === 'outside' ? '#87CEEB' : '#0a0a1a']} />
          
          <ambientLight intensity={gameState === 'outside' ? 0.5 : ((gameState === 'inside' || gameState === 'bedroom') && isNeonMode ? 0.1 : 0.8)} />
          <directionalLight 
            position={[10, 10, 5]} 
            intensity={gameState === 'outside' ? 1 : ((gameState === 'inside' || gameState === 'bedroom') && isNeonMode ? 0.1 : 0.8)} 
            castShadow 
          />
          
          {(gameState === 'inside' || gameState === 'bedroom') && !isNeonMode && (
            <group>
              <pointLight position={[0, 3, -2]} intensity={1.5} color="#ffffff" />
              <pointLight position={[-4, 3, -4]} intensity={1.5} color="#00ffff" />
              <pointLight position={[4, 3, -4]} intensity={1.5} color="#ff00ff" />
            </group>
          )}

          <Suspense fallback={null}>
            {gameState === 'outside' ? (
              <House 
                onEnterGaming={() => setGameState('inside')} 
                onEnterStudio={() => setGameState('studio')}
              />
            ) : gameState === 'hallway' ? (
              <Hallway 
                onBack={() => setGameState('inside')} 
                onEnterBedroom={() => setGameState('bedroom')} 
                onEnterBathroom={() => setGameState('bathroom')} 
              />
            ) : gameState === 'bedroom' ? (
              <Bedroom 
                onBack={() => setGameState('hallway')} 
                posters={posters} 
                isNeonMode={isNeonMode}
                onToggleNeon={() => setIsNeonMode(!isNeonMode)}
              />
            ) : gameState === 'bathroom' ? (
              <Bathroom onBack={() => setGameState('hallway')} />
            ) : gameState === 'studio' ? (
              <Studio onExitClick={() => setGameState('outside')} />
            ) : (
              <Room 
                onPcClick={() => setGameState('computer')} 
                onDoorClick={() => setGameState('hallway')} 
                onExitClick={() => setGameState('outside')}
                screens={screens}
                posters={posters}
                isNeonMode={isNeonMode}
                onToggleNeon={() => setIsNeonMode(!isNeonMode)}
              />
            )}
            <ContactShadows position={[0, -2, 0]} opacity={0.5} scale={20} blur={2} far={4.5} resolution={256} frames={1} />
            
            {/* Player Component */}
            {navMode === 'play' && (
              <Player 
                room={gameState} 
                onInteract={handleAction}
                bounds={{ x: [-10, 10], z: [-10, 10] }} 
              />
            )}
          </Suspense>

          <Suspense fallback={null}>
            <Environment preset={gameState === 'outside' ? 'sunset' : 'night'} resolution={256} />
          </Suspense>

          <OrbitControls 
            makeDefault
            enablePan={false}
            enableZoom={true}
            maxPolarAngle={Math.PI / 2 - 0.1}
            minDistance={2}
            maxDistance={30}
          />
        </Canvas>
      </ErrorBoundary>
      
      <Loader />

      {/* Play Mode UI Overlay */}
      {navMode === 'play' && (
        <div className="absolute inset-0 pointer-events-none z-40">
          {/* Action Button */}
          <AnimatePresence>
            {canInteract && (
              <motion.div 
                initial={{ scale: 0, opacity: 0, y: 20 }}
                animate={{ scale: 1, opacity: 1, y: 0 }}
                exit={{ scale: 0, opacity: 0, y: 20 }}
                className="absolute bottom-32 left-1/2 -translate-x-1/2 pointer-events-auto flex flex-col items-center gap-2"
              >
                <button 
                  onClick={handleAction}
                  className="px-6 py-3 sm:px-8 sm:py-4 bg-cyan-400 rounded-full flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.5)] active:scale-95 transition-transform"
                >
                  <span className="text-black font-bold text-sm sm:text-xl uppercase tracking-wider">{interactionText || 'ACTION'}</span>
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Jump Button */}
          <div className="absolute bottom-8 left-8 pointer-events-auto">
            <button 
              onPointerDown={() => setIsJumping(true)}
              onPointerUp={() => setIsJumping(false)}
              onPointerLeave={() => setIsJumping(false)}
              className="w-12 h-12 sm:w-16 sm:h-16 bg-white/20 backdrop-blur-md border border-white/50 rounded-full flex items-center justify-center active:bg-white/40 transition-colors"
            >
              <span className="text-white font-bold text-xs sm:text-base">JUMP</span>
            </button>
          </div>

          {/* Joystick */}
          <div className="absolute bottom-8 right-8 pointer-events-auto">
            <Joystick 
              size={100} 
              sticky={false} 
              baseColor="rgba(255,255,255,0.2)" 
              stickColor="rgba(255,255,255,0.8)" 
              move={(e) => setJoystickMove({ x: e.x || 0, y: e.y || 0 })} 
              stop={() => setJoystickMove({ x: 0, y: 0 })} 
            />
          </div>
        </div>
      )}

      {/* Customization Modal */}
      <AnimatePresence>
        {isCustomizing && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 bg-zinc-900 border border-zinc-800 rounded-2xl p-6 z-50 shadow-2xl"
          >
            <h2 className="text-white text-xl font-bold mb-6">CUSTOMIZE GRANDSON</h2>
            
            <div className="space-y-6">
              <div>
                <label className="text-zinc-400 text-sm font-bold mb-2 block">SHIRT COLOR</label>
                <div className="flex gap-2">
                  {['#000000', '#ffffff', '#ff0055', '#00ffcc', '#ffcc00'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setShirtColor(c)}
                      className="w-8 h-8 rounded-full border-2 border-zinc-700 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
              
              <div>
                <label className="text-zinc-400 text-sm font-bold mb-2 block">PANTS COLOR</label>
                <div className="flex gap-2">
                  {['#333333', '#111111', '#555555', '#2222ff', '#ff2222'].map(c => (
                    <button 
                      key={c}
                      onClick={() => setPantsColor(c)}
                      className="w-8 h-8 rounded-full border-2 border-zinc-700 hover:scale-110 transition-transform"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>
            </div>

            <button 
              onClick={() => setIsCustomizing(false)}
              className="mt-8 w-full py-3 bg-white text-black font-bold rounded-xl hover:bg-zinc-200 transition-colors"
            >
              DONE
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {gameState === 'computer' && (
          <ComputerUI 
            onClose={() => setGameState('inside')} 
            onShop={() => setGameState('shop')} 
            onGames={() => setGameState('games')} 
          />
        )}
        {gameState === 'games' && (
          <GamesUI 
            onClose={() => setGameState('inside')} 
            onBack={() => setGameState('computer')} 
          />
        )}
        {gameState === 'shop' && (
          <ShopUI 
            onClose={() => setGameState('inside')} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}