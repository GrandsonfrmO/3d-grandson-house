import React, { useState } from 'react';
import { motion } from 'motion/react';

interface AdminLoginProps {
  onLogin: (username: string, password: string) => void;
  onCancel: () => void;
  error?: string;
}

export function AdminLogin({ onLogin, onCancel, error }: AdminLoginProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call delay
    setTimeout(() => {
      onLogin(username, password);
      setIsLoading(false);
    }, 500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl"
      >
        <h1 className="text-white text-3xl font-bold mb-2 text-center">ADMIN ACCESS</h1>
        <p className="text-zinc-400 text-center mb-8">Veuillez vous connecter</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-zinc-400 text-sm font-bold mb-2 block">IDENTIFIANT</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Entrez votre identifiant"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="text-zinc-400 text-sm font-bold mb-2 block">MOT DE PASSE</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Entrez votre mot de passe"
              className="w-full px-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-cyan-400 transition-colors"
              disabled={isLoading}
            />
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-3 bg-red-900/30 border border-red-700 rounded-lg text-red-400 text-sm"
            >
              {error}
            </motion.div>
          )}

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 py-3 bg-zinc-800 text-white font-bold rounded-lg hover:bg-zinc-700 transition-colors disabled:opacity-50"
              disabled={isLoading}
            >
              ANNULER
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-cyan-400 text-black font-bold rounded-lg hover:bg-cyan-300 transition-colors disabled:opacity-50"
              disabled={isLoading || !username || !password}
            >
              {isLoading ? 'CONNEXION...' : 'CONNEXION'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}