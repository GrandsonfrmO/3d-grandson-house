import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { Trophy, X } from 'lucide-react';

export function GameScoreUI({
  gameName,
  playerName,
  score,
  onClose,
}: {
  gameName: string;
  playerName: string;
  score: number;
  onClose: () => void;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [topScores, setTopScores] = useState<any[]>([]);
  const [isLoadingScores, setIsLoadingScores] = useState(true);

  const saveGameScore = useStore((state: any) => state.saveGameScore);
  const fetchGameScores = useStore((state: any) => state.fetchGameScores);

  useEffect(() => {
    loadScores();
  }, [gameName]);

  const loadScores = async () => {
    try {
      setIsLoadingScores(true);
      const scores = await fetchGameScores(gameName);
      setTopScores(scores || []);
    } catch (err) {
      console.error('Failed to load scores:', err);
      setTopScores([]);
    } finally {
      setIsLoadingScores(false);
    }
  };

  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      setError('Please enter your name');
      return;
    }

    setIsSaving(true);
    setError('');

    try {
      await saveGameScore(gameName, playerName, score);
      setSaved(true);
      await loadScores();
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (err) {
      setError('Failed to save score. Please try again.');
      console.error('Save score error:', err);
    } finally {
      setIsSaving(false);
    }
  };

  if (saved) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: 'spring', delay: 0.2 }}
            className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <Trophy size={32} className="text-yellow-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Score Saved!</h2>
          <p className="text-gray-600 mb-2">
            Great job, <span className="font-bold">{playerName}</span>!
          </p>
          <p className="text-3xl font-bold text-cyan-600 mb-6">{score} points</p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition-colors"
          >
            Continue
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-cyan-500 to-cyan-600">
          <div className="flex items-center gap-3">
            <Trophy size={24} className="text-white" />
            <h2 className="text-xl font-bold text-white">{gameName}</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X size={20} className="text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Score Display */}
          <div className="text-center">
            <p className="text-gray-600 text-sm font-medium mb-2">Your Score</p>
            <p className="text-5xl font-black text-cyan-600">{score}</p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          {/* Player Name Input */}
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">
              Player Name
            </label>
            <input
              type="text"
              defaultValue={playerName}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
            />
          </div>

          {/* Top Scores */}
          {!isLoadingScores && topScores.length > 0 && (
            <div>
              <h3 className="font-bold text-gray-900 mb-3">Top Scores</h3>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {topScores.slice(0, 5).map((s: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-lg font-bold text-cyan-600 w-6">
                        #{idx + 1}
                      </span>
                      <span className="font-medium text-gray-900">
                        {s.player_name}
                      </span>
                    </div>
                    <span className="font-bold text-gray-900">{s.score}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveScore}
              disabled={isSaving}
              className="flex-1 py-3 px-4 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isSaving ? 'Saving...' : 'Save Score'}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
