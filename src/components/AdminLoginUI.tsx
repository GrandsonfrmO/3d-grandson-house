import { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, ShieldCheck, ArrowRight, X, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export function AdminLoginUI({ onLogin, onClose }: { onLogin: (token: string) => void, onClose: () => void }) {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const { login, isLoading, error } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const token = await login(username, password);
      onLogin(token);
    } catch (err) {
      // Error is handled by useAuth hook
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 z-[9999] flex items-center justify-center bg-black/80 backdrop-blur-md font-sans p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="w-full max-w-md bg-gray-900 border border-gray-800 rounded-2xl shadow-2xl overflow-hidden relative"
      >
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors">
          <X size={20} />
        </button>
        
        <div className="p-8 pb-6 text-center border-b border-gray-800">
          <div className="w-16 h-16 bg-cyan-500/10 border border-cyan-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShieldCheck size={32} className="text-cyan-500" />
          </div>
          <h2 className="text-2xl font-black text-white tracking-tight">ADMIN LOGIN</h2>
          <p className="text-gray-400 text-sm mt-2">Authenticate to access the control panel.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-3 bg-red-500/10 border border-red-500/30 rounded-lg"
            >
              <AlertCircle size={18} className="text-red-500 flex-shrink-0" />
              <p className="text-red-500 text-sm font-medium">{error}</p>
            </motion.div>
          )}

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Username</label>
            <input 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 bg-black border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-white outline-none transition-all"
              placeholder="Enter username..."
              disabled={isLoading}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Password</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-black border border-gray-700 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 rounded-xl text-white outline-none transition-all"
                placeholder="Enter password..."
                disabled={isLoading}
                autoFocus
              />
            </div>
            <p className="text-gray-500 text-xs mt-2">Demo: admin / admin123</p>
          </div>

          <button 
            type="submit"
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 py-3 bg-cyan-600 hover:bg-cyan-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-bold transition-colors"
          >
            {isLoading ? 'Authenticating...' : <>Authenticate <ArrowRight size={18} /></>}
          </button>
        </form>
      </motion.div>
    </motion.div>
  );
}
