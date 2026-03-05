import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ArrowLeft, Gamepad2, Trophy, Target, Zap, RotateCcw } from 'lucide-react';

const GAMES = [
  {
    id: 'snake',
    title: 'NEON SNAKE',
    icon: <Zap size={24} />,
    color: 'text-green-400',
    borderColor: 'border-green-500',
    bgHover: 'hover:bg-green-500/10',
    description: 'Le classique revisité avec une touche néon. Mangez les pixels pour grandir !'
  },
  {
    id: 'tictactoe',
    title: 'CYBER MORPION',
    icon: <Target size={24} />,
    color: 'text-cyan-400',
    borderColor: 'border-cyan-500',
    bgHover: 'hover:bg-cyan-500/10',
    description: 'Affrontez un ami ou jouez seul dans ce duel futuriste.'
  },
  {
    id: 'memory',
    title: 'NEURO MEMORY',
    icon: <Trophy size={24} />,
    color: 'text-fuchsia-400',
    borderColor: 'border-fuchsia-500',
    bgHover: 'hover:bg-fuchsia-500/10',
    description: 'Testez votre mémoire avec ces paires de symboles cryptographiques.'
  }
];

// --- SNAKE GAME ---
const GRID_SIZE = 20;
function SnakeGame() {
  const [snake, setSnake] = useState([{ x: 10, y: 10 }]);
  const [food, setFood] = useState({ x: 15, y: 15 });
  const [dir, setDir] = useState({ x: 1, y: 0 });
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const resetGame = () => {
    setSnake([{ x: 10, y: 10 }]);
    setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
    setDir({ x: 1, y: 0 });
    setGameOver(false);
    setScore(0);
    setIsPaused(false);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowUp': if (dir.y !== 1) setDir({ x: 0, y: -1 }); break;
        case 'ArrowDown': if (dir.y !== -1) setDir({ x: 0, y: 1 }); break;
        case 'ArrowLeft': if (dir.x !== 1) setDir({ x: -1, y: 0 }); break;
        case 'ArrowRight': if (dir.x !== -1) setDir({ x: 1, y: 0 }); break;
        case ' ': setIsPaused(p => !p); break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dir]);

  useEffect(() => {
    if (gameOver || isPaused) return;
    const moveSnake = () => {
      setSnake(prev => {
        const newHead = { x: prev[0].x + dir.x, y: prev[0].y + dir.y };
        if (newHead.x < 0 || newHead.x >= GRID_SIZE || newHead.y < 0 || newHead.y >= GRID_SIZE || prev.some(seg => seg.x === newHead.x && seg.y === newHead.y)) {
          setGameOver(true);
          return prev;
        }
        const newSnake = [newHead, ...prev];
        if (newHead.x === food.x && newHead.y === food.y) {
          setScore(s => s + 10);
          setFood({ x: Math.floor(Math.random() * GRID_SIZE), y: Math.floor(Math.random() * GRID_SIZE) });
        } else {
          newSnake.pop();
        }
        return newSnake;
      });
    };
    const interval = setInterval(moveSnake, 150);
    return () => clearInterval(interval);
  }, [dir, food, gameOver, isPaused]);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div className="flex justify-between w-full max-w-md mb-4 text-green-400 font-mono">
        <span className="text-xl">SCORE: {score}</span>
        {gameOver && <span className="text-red-500 animate-pulse">GAME OVER</span>}
        {isPaused && !gameOver && <span className="text-yellow-500 animate-pulse">PAUSED</span>}
      </div>
      <div className="relative w-full max-w-md aspect-square bg-black border-2 border-green-500/50 rounded-lg overflow-hidden shadow-[0_0_30px_rgba(0,255,0,0.1)]">
        {/* Grid lines */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(0,255,0,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(0,255,0,0.1)_1px,transparent_1px)] bg-[length:5%_5%]"></div>
        
        {snake.map((seg, i) => (
          <div key={i} className="absolute bg-green-400 rounded-sm shadow-[0_0_10px_rgba(0,255,0,0.8)]" style={{ left: `${(seg.x / GRID_SIZE) * 100}%`, top: `${(seg.y / GRID_SIZE) * 100}%`, width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%` }} />
        ))}
        <div className="absolute bg-red-500 rounded-full shadow-[0_0_10px_rgba(255,0,0,0.8)] animate-pulse" style={{ left: `${(food.x / GRID_SIZE) * 100}%`, top: `${(food.y / GRID_SIZE) * 100}%`, width: `${100 / GRID_SIZE}%`, height: `${100 / GRID_SIZE}%` }} />
        
        {gameOver && (
          <div className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center">
            <button onClick={resetGame} className="flex items-center gap-2 px-6 py-3 bg-green-500/20 text-green-400 border border-green-500 rounded hover:bg-green-500/40 transition-colors font-mono">
              <RotateCcw size={18} /> REJOUER
            </button>
          </div>
        )}
      </div>
      <div className="mt-8 grid grid-cols-3 gap-2 md:hidden">
        <div />
        <button onClick={() => dir.y !== 1 && setDir({x:0, y:-1})} className="p-4 bg-gray-800 rounded-lg text-white">↑</button>
        <div />
        <button onClick={() => dir.x !== 1 && setDir({x:-1, y:0})} className="p-4 bg-gray-800 rounded-lg text-white">←</button>
        <button onClick={() => dir.y !== -1 && setDir({x:0, y:1})} className="p-4 bg-gray-800 rounded-lg text-white">↓</button>
        <button onClick={() => dir.x !== -1 && setDir({x:1, y:0})} className="p-4 bg-gray-800 rounded-lg text-white">→</button>
      </div>
    </div>
  );
}

// --- TIC TAC TOE ---
function TicTacToe() {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);

  const calculateWinner = (squares: any[]) => {
    const lines = [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6], [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
    }
    return null;
  };

  const winner = calculateWinner(board);
  const isDraw = !winner && board.every(s => s !== null);

  const handleClick = (i: number) => {
    if (board[i] || winner) return;
    const newBoard = [...board];
    newBoard[i] = xIsNext ? 'X' : 'O';
    setBoard(newBoard);
    setXIsNext(!xIsNext);
  };

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setXIsNext(true);
  };

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div className="mb-8 text-cyan-400 font-mono text-2xl h-8">
        {winner ? `GAGNANT: ${winner}` : isDraw ? 'MATCH NUL' : `AU TOUR DE: ${xIsNext ? 'X' : 'O'}`}
      </div>
      <div className="grid grid-cols-3 gap-2 w-full max-w-[300px] aspect-square">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => handleClick(i)}
            className="bg-[#1a1a1a] border border-cyan-500/30 rounded-lg flex items-center justify-center text-5xl font-black hover:bg-cyan-500/10 transition-colors shadow-[0_0_15px_rgba(0,255,255,0.05)]"
          >
            {cell === 'X' && <span className="text-cyan-400 drop-shadow-[0_0_10px_rgba(0,255,255,0.8)]">X</span>}
            {cell === 'O' && <span className="text-fuchsia-400 drop-shadow-[0_0_10px_rgba(255,0,255,0.8)]">O</span>}
          </button>
        ))}
      </div>
      {(winner || isDraw) && (
        <button onClick={resetGame} className="mt-8 flex items-center gap-2 px-6 py-3 bg-cyan-500/20 text-cyan-400 border border-cyan-500 rounded hover:bg-cyan-500/40 transition-colors font-mono">
          <RotateCcw size={18} /> REJOUER
        </button>
      )}
    </div>
  );
}

// --- MEMORY GAME ---
const SYMBOLS = ['Δ', 'Ω', 'Ψ', 'Σ', 'Φ', 'Θ', 'Λ', 'Ξ'];
function MemoryGame() {
  const [cards, setCards] = useState<{id: number, symbol: string, isFlipped: boolean, isMatched: boolean}[]>([]);
  const [flippedIndices, setFlippedIndices] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);

  const initializeGame = useCallback(() => {
    const shuffled = [...SYMBOLS, ...SYMBOLS]
      .sort(() => Math.random() - 0.5)
      .map((symbol, id) => ({ id, symbol, isFlipped: false, isMatched: false }));
    setCards(shuffled);
    setFlippedIndices([]);
    setMoves(0);
  }, []);

  useEffect(() => {
    initializeGame();
  }, [initializeGame]);

  const handleCardClick = (index: number) => {
    if (flippedIndices.length === 2 || cards[index].isFlipped || cards[index].isMatched) return;
    
    const newCards = [...cards];
    newCards[index].isFlipped = true;
    setCards(newCards);
    
    const newFlipped = [...flippedIndices, index];
    setFlippedIndices(newFlipped);

    if (newFlipped.length === 2) {
      setMoves(m => m + 1);
      const [first, second] = newFlipped;
      if (cards[first].symbol === cards[second].symbol) {
        setTimeout(() => {
          const matchedCards = [...cards];
          matchedCards[first].isMatched = true;
          matchedCards[second].isMatched = true;
          setCards(matchedCards);
          setFlippedIndices([]);
        }, 500);
      } else {
        setTimeout(() => {
          const resetCards = [...cards];
          resetCards[first].isFlipped = false;
          resetCards[second].isFlipped = false;
          setCards(resetCards);
          setFlippedIndices([]);
        }, 1000);
      }
    }
  };

  const isWin = cards.length > 0 && cards.every(c => c.isMatched);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full p-4">
      <div className="flex justify-between w-full max-w-md mb-6 text-fuchsia-400 font-mono text-xl">
        <span>COUPS: {moves}</span>
        {isWin && <span className="animate-pulse">VICTOIRE !</span>}
      </div>
      <div className="grid grid-cols-4 gap-3 w-full max-w-md aspect-square">
        {cards.map((card, i) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(i)}
            className={`relative w-full h-full rounded-lg transition-all duration-300 transform-gpu ${card.isFlipped || card.isMatched ? 'rotate-y-180' : ''}`}
            style={{ perspective: '1000px' }}
          >
            <div className={`absolute inset-0 w-full h-full flex items-center justify-center text-3xl font-black rounded-lg transition-all duration-300 ${card.isFlipped || card.isMatched ? 'bg-[#222] border-2 border-fuchsia-500 text-fuchsia-400 shadow-[0_0_15px_rgba(255,0,255,0.3)]' : 'bg-[#1a1a1a] border border-gray-800 hover:border-fuchsia-500/50'}`}>
              {(card.isFlipped || card.isMatched) ? card.symbol : '?'}
            </div>
          </button>
        ))}
      </div>
      {isWin && (
        <button onClick={initializeGame} className="mt-8 flex items-center gap-2 px-6 py-3 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500 rounded hover:bg-fuchsia-500/40 transition-colors font-mono">
          <RotateCcw size={18} /> REJOUER
        </button>
      )}
    </div>
  );
}

export function GamesUI({ onClose, onBack }: { onClose: () => void, onBack: () => void }) {
  const [activeGame, setActiveGame] = useState<string | null>(null);

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-4 sm:p-8 bg-black/60 backdrop-blur-sm"
    >
      <div className="relative w-full max-w-5xl h-[85vh] bg-[#111] border-2 border-yellow-500/50 rounded-2xl shadow-[0_0_50px_rgba(255,204,0,0.2)] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="h-12 bg-[#222] border-b border-yellow-500/30 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={activeGame ? () => setActiveGame(null) : onBack}
              className="text-gray-400 hover:text-white transition-colors flex items-center gap-1"
            >
              <ArrowLeft size={18} />
              <span className="text-xs font-mono uppercase">{activeGame ? 'RETOUR' : 'MENU'}</span>
            </button>
            <div className="w-px h-4 bg-gray-700"></div>
            <div className="flex items-center gap-2 text-yellow-400">
              <Gamepad2 size={18} />
              <span className="font-mono text-sm tracking-widest">ARCADE_STATION</span>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 relative overflow-hidden bg-[#0a0a0a]">
          {/* Scanlines */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-30"></div>
          
          <AnimatePresence mode="wait">
            {!activeGame ? (
              <motion.div 
                key="menu"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="absolute inset-0 p-4 md:p-8 flex flex-col items-center justify-center z-20 overflow-y-auto"
              >
                <h2 className="text-3xl md:text-5xl font-black text-white mb-8 md:mb-12 tracking-tighter text-center">
                  SÉLECTIONNEZ UN JEU
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 w-full max-w-4xl">
                  {GAMES.map((game) => (
                    <button
                      key={game.id}
                      onClick={() => setActiveGame(game.id)}
                      className={`group relative flex flex-col items-start p-6 bg-[#1a1a1a] border border-gray-800 rounded-xl hover:${game.borderColor} ${game.bgHover} transition-all duration-300 hover:-translate-y-1 text-left`}
                    >
                      <div className={`w-12 h-12 rounded-lg bg-black/50 flex items-center justify-center mb-4 ${game.color} border border-gray-800 group-hover:${game.borderColor} transition-colors`}>
                        {game.icon}
                      </div>
                      <h3 className={`text-xl font-bold font-mono tracking-wider mb-2 ${game.color}`}>{game.title}</h3>
                      <p className="text-sm text-gray-400 font-sans leading-relaxed">
                        {game.description}
                      </p>
                      <div className="mt-6 flex items-center gap-2 text-xs font-mono text-gray-500 group-hover:text-white transition-colors">
                        <span>APPUYEZ POUR JOUER</span>
                        <span className="animate-pulse">_</span>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="game"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="absolute inset-0 flex items-center justify-center z-20"
              >
                {activeGame === 'snake' && <SnakeGame />}
                {activeGame === 'tictactoe' && <TicTacToe />}
                {activeGame === 'memory' && <MemoryGame />}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
