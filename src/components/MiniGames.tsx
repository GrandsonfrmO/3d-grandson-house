import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Palette, Cat, Trophy, RotateCcw } from 'lucide-react';
import { useStore } from '../store';
import { GameScoreUI } from './GameScoreUI';

// --- STUDIO GAME: DRAWING TABLET ---
export function StudioGameUI() {
  const setIsStudioGame = useStore((state: any) => state.setIsStudioGame);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [color, setColor] = useState('#00ffcc');

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (ctx) ctx.beginPath();
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    let x, y;
    if ('touches' in e) {
      x = e.touches[0].clientX - rect.left;
      y = e.touches[0].clientY - rect.top;
    } else {
      x = e.clientX - rect.left;
      y = e.clientY - rect.top;
    }

    ctx.lineWidth = 5;
    ctx.lineCap = 'round';
    ctx.strokeStyle = color;

    ctx.lineTo(x, y);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.fillStyle = '#111';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl"
      >
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-3">
            <Palette className="text-cyan-400" size={24} />
            <h2 className="text-2xl font-black text-white tracking-wider">DESIGN TABLET</h2>
          </div>
          <button onClick={() => setIsStudioGame(false)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex gap-2 justify-center">
            {['#00ffcc', '#ff00ff', '#ffff00', '#ff0055', '#ffffff'].map(c => (
              <button 
                key={c}
                onClick={() => setColor(c)}
                className={`w-10 h-10 rounded-full border-2 transition-transform ${color === c ? 'scale-110 border-white' : 'border-transparent'}`}
                style={{ backgroundColor: c }}
              />
            ))}
            <button onClick={clearCanvas} className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-white hover:bg-zinc-700">
              <RotateCcw size={18} />
            </button>
          </div>
          
          <div className="border-4 border-zinc-800 rounded-xl overflow-hidden bg-[#111] touch-none">
            <canvas
              ref={canvasRef}
              width={600}
              height={400}
              className="w-full h-auto cursor-crosshair"
              onMouseDown={startDrawing}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onMouseMove={draw}
              onTouchStart={startDrawing}
              onTouchEnd={stopDrawing}
              onTouchMove={draw}
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
}

// --- CAT GAME: CATCH THE LASER ---
export function CatGameUI() {
  const setIsCatGame = useStore((state: any) => state.setIsCatGame);
  const [score, setScore] = useState(0);
  const [laserPos, setLaserPos] = useState({ x: 50, y: 50 });
  const [catPos, setCatPos] = useState({ x: 50, y: 50 });
  const [timeLeft, setTimeLeft] = useState(30);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showScoreUI, setShowScoreUI] = useState(false);
  const [playerName, setPlayerName] = useState('');

  useEffect(() => {
    if (!isPlaying) return;
    
    const timer = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) {
          setIsPlaying(false);
          return 0;
        }
        return t - 1;
      });
    }, 1000);

    const catMove = setInterval(() => {
      setCatPos(prev => {
        const dx = laserPos.x - prev.x;
        const dy = laserPos.y - prev.y;
        return {
          x: prev.x + dx * 0.1,
          y: prev.y + dy * 0.1
        };
      });
    }, 50);

    return () => {
      clearInterval(timer);
      clearInterval(catMove);
    };
  }, [isPlaying, laserPos]);

  const handleAreaClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isPlaying) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    setLaserPos({ x, y });
    
    // Check if cat is close enough to laser
    const dist = Math.sqrt(Math.pow(catPos.x - x, 2) + Math.pow(catPos.y - y, 2));
    if (dist < 15) {
      setScore(s => s + 1);
      // Move laser randomly
      setLaserPos({
        x: Math.random() * 80 + 10,
        y: Math.random() * 80 + 10
      });
    }
  };

  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setLaserPos({ x: 50, y: 50 });
    setCatPos({ x: 10, y: 10 });
  };

  const handleGameEnd = () => {
    setShowScoreUI(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-2xl"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Cat className="text-pink-400" size={24} />
              <h2 className="text-2xl font-black text-white tracking-wider">LASER CAT</h2>
            </div>
            <button onClick={() => setIsCatGame(false)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="flex justify-between text-white mb-4 font-mono text-xl">
            <div>SCORE: <span className="text-pink-400">{score}</span></div>
            <div>TIME: <span className="text-cyan-400">{timeLeft}s</span></div>
          </div>

          <div 
            className="relative w-full aspect-video bg-zinc-800 rounded-xl overflow-hidden cursor-crosshair border-2 border-zinc-700"
            onClick={handleAreaClick}
          >
            {!isPlaying && timeLeft === 30 && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/50">
                <button onClick={startGame} className="px-8 py-4 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-400 transition-colors text-xl">
                  START GAME
                </button>
              </div>
            )}
            
            {!isPlaying && timeLeft === 0 && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80">
                <div className="text-4xl font-black text-white mb-2">TIME'S UP!</div>
                <div className="text-2xl text-pink-400 mb-6">Final Score: {score}</div>
                <div className="flex gap-4">
                  <button onClick={startGame} className="px-8 py-4 bg-pink-500 text-white font-bold rounded-full hover:bg-pink-400 transition-colors">
                    PLAY AGAIN
                  </button>
                  <button onClick={handleGameEnd} className="px-8 py-4 bg-cyan-500 text-white font-bold rounded-full hover:bg-cyan-400 transition-colors">
                    SAVE SCORE
                  </button>
                </div>
              </div>
            )}

            {/* Laser Pointer */}
            {isPlaying && (
              <div 
                className="absolute w-3 h-3 bg-red-500 rounded-full shadow-[0_0_10px_#ff0000] transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-100"
                style={{ left: `${laserPos.x}%`, top: `${laserPos.y}%` }}
              />
            )}

            {/* Cat */}
            <div 
              className="absolute text-4xl transform -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all duration-75"
              style={{ left: `${catPos.x}%`, top: `${catPos.y}%` }}
            >
              🐈‍⬛
            </div>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showScoreUI && (
          <GameScoreUI
            gameName="Laser Cat"
            playerName={playerName}
            score={score}
            onClose={() => {
              setShowScoreUI(false);
              setIsCatGame(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}

// --- BASKETBALL GAME ---
export function BasketballGameUI() {
  const setIsBasketballGame = useStore((state: any) => state.setIsBasketballGame);
  const [score, setScore] = useState(0);
  const [ballPos, setBallPos] = useState({ x: 50, y: 90 });
  const [isShooting, setIsShooting] = useState(false);
  const [hoopPos, setHoopPos] = useState(50);
  const [message, setMessage] = useState('');
  const [showScoreUI, setShowScoreUI] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [gameEnded, setGameEnded] = useState(false);

  useEffect(() => {
    // Move hoop left and right
    const hoopMove = setInterval(() => {
      setHoopPos(prev => {
        const time = Date.now() / 1000;
        return 50 + Math.sin(time * 2) * 30; // Oscillate between 20 and 80
      });
    }, 50);

    return () => clearInterval(hoopMove);
  }, []);

  const shoot = () => {
    if (isShooting) return;
    setIsShooting(true);
    
    // Animate ball
    let progress = 0;
    const startY = 90;
    const endY = 20;
    
    const animation = setInterval(() => {
      progress += 0.05;
      if (progress >= 1) {
        clearInterval(animation);
        checkScore();
      } else {
        // Parabolic arc for Y, straight line for X (stays at 50)
        setBallPos({
          x: 50,
          y: startY - (startY - endY) * progress
        });
      }
    }, 16);
  };

  const checkScore = () => {
    // Check if ball x (50) is close to hoop x
    const dist = Math.abs(50 - hoopPos);
    if (dist < 10) {
      setScore(s => s + 2);
      setMessage('SWISH! +2');
    } else {
      setMessage('MISS!');
    }
    
    setTimeout(() => {
      setBallPos({ x: 50, y: 90 });
      setIsShooting(false);
      setMessage('');
    }, 1000);
  };

  const endGame = () => {
    setGameEnded(true);
    setShowScoreUI(true);
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 w-full max-w-md"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <Trophy className="text-orange-500" size={24} />
              <h2 className="text-2xl font-black text-white tracking-wider">HOOPS</h2>
            </div>
            <button onClick={() => setIsBasketballGame(false)} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors">
              <X size={24} />
            </button>
          </div>

          <div className="text-center text-white mb-4 font-mono text-2xl">
            SCORE: <span className="text-orange-500">{score}</span>
          </div>

          <div className="relative w-full aspect-[3/4] bg-zinc-800 rounded-xl overflow-hidden border-2 border-zinc-700 mb-6">
            {/* Hoop */}
            <div 
              className="absolute top-[20%] w-16 h-4 border-4 border-orange-500 rounded-full transform -translate-x-1/2 -translate-y-1/2 transition-all duration-75"
              style={{ left: `${hoopPos}%` }}
            >
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 w-12 h-12 border-2 border-white/30 border-t-0 rounded-b-lg" style={{ borderStyle: 'dashed' }} />
            </div>

            {/* Ball */}
            <div 
              className="absolute w-10 h-10 bg-orange-500 rounded-full shadow-inner transform -translate-x-1/2 -translate-y-1/2 flex items-center justify-center overflow-hidden"
              style={{ left: `${ballPos.x}%`, top: `${ballPos.y}%` }}
            >
              <div className="w-full h-[2px] bg-black/30 absolute" />
              <div className="w-[2px] h-full bg-black/30 absolute" />
            </div>

            {/* Message */}
            {message && (
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-3xl font-black text-white italic drop-shadow-lg">
                {message}
              </div>
            )}
          </div>

          <div className="flex gap-3">
            <button 
              onClick={shoot}
              disabled={isShooting}
              className="flex-1 py-4 bg-orange-500 text-white font-black text-xl rounded-xl hover:bg-orange-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              SHOOT
            </button>
            <button 
              onClick={endGame}
              className="flex-1 py-4 bg-cyan-500 text-white font-black text-xl rounded-xl hover:bg-cyan-400 transition-colors"
            >
              END
            </button>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showScoreUI && (
          <GameScoreUI
            gameName="Basketball"
            playerName={playerName}
            score={score}
            onClose={() => {
              setShowScoreUI(false);
              setIsBasketballGame(false);
            }}
          />
        )}
      </AnimatePresence>
    </>
  );
}
