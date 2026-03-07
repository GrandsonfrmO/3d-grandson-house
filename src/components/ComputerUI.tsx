import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Monitor, ShoppingBag, Gamepad2, Settings, X, Wifi, Battery, Volume2, Lock, User } from 'lucide-react';
import { adminAPI } from '../api/admin';

const WALLPAPERS = [
  'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop', // Cyberpunk city
  'https://images.unsplash.com/photo-1550684848-fac1c5b4e853?q=80&w=2564&auto=format&fit=crop', // Neon grid
  'https://images.unsplash.com/photo-1604871000636-074fa5117945?q=80&w=2564&auto=format&fit=crop', // Abstract dark
  'https://images.unsplash.com/photo-1614729939124-032f0b56c9ce?q=80&w=2564&auto=format&fit=crop'  // Synthwave sunset
];

export function ComputerUI({ onClose, onShop, onGames }: { onClose: () => void, onShop: () => void, onGames: () => void }) {
  const [time, setTime] = useState(new Date());
  const [wallpaper, setWallpaper] = useState(WALLPAPERS[0]);
  const [activeApp, setActiveApp] = useState<string | null>(null);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const handleAdminLogin = async () => {
    if (!username || !password) {
      setError('Veuillez remplir tous les champs');
      return;
    }
    
    setIsLoading(true);
    setError('');
    try {
      const { token } = await adminAPI.login(username, password);
      localStorage.setItem('adminToken', token);
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new PopStateEvent('popstate'));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Identifiants incorrects');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="absolute inset-0 z-50 flex items-center justify-center p-2 sm:p-8 bg-black/80 backdrop-blur-md"
    >
      <div className="relative w-full max-w-5xl h-[90vh] sm:h-[80vh] bg-[#0a0a0a] border-2 border-cyan-500/50 rounded-xl sm:rounded-2xl shadow-[0_0_50px_rgba(0,255,204,0.2)] overflow-hidden flex flex-col">
        {/* Screen Header / Monitor Bezel */}
        <div className="h-8 sm:h-12 bg-[#111] border-b border-cyan-500/30 flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-2 text-cyan-400">
            <Monitor size={16} />
            <span className="font-mono text-xs sm:text-sm tracking-widest">GRANDSON_OS</span>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-red-500 transition-colors p-1"
          >
            <X size={20} />
          </button>
        </div>

        {/* Desktop Area */}
        <div className="flex-1 relative overflow-hidden bg-cover bg-center transition-all duration-500" style={{ backgroundImage: `url(${wallpaper})` }}>
          {/* Overlay gradient for better readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/40 via-transparent to-black/80"></div>
          
          {/* Scanlines effect */}
          <div className="absolute inset-0 pointer-events-none bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(255,0,0,0.06),rgba(0,255,0,0.02),rgba(0,0,255,0.06))] bg-[length:100%_4px,3px_100%] z-10 opacity-30"></div>
          
          {/* Desktop Icons */}
          <div className="absolute inset-0 p-4 sm:p-8 z-20 flex flex-col sm:flex-row gap-6 sm:gap-8 content-start flex-wrap">
            
            {/* Boutique Icon */}
            <button 
              onClick={onShop}
              className="group flex flex-col items-center gap-2 w-20 sm:w-24 focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-fuchsia-500/40 group-hover:border-fuchsia-400 group-hover:scale-105 transition-all shadow-lg">
                <ShoppingBag size={28} className="text-white group-hover:text-fuchsia-300 drop-shadow-md" />
              </div>
              <span className="text-white text-xs sm:text-sm font-medium font-sans px-2 py-1 rounded bg-black/50 backdrop-blur-sm group-hover:bg-fuchsia-500/80 transition-colors text-center w-full truncate shadow-sm">
                Boutique
              </span>
            </button>

            {/* Paramètres Icon */}
            <button 
              onClick={() => setActiveApp('settings')}
              className="group flex flex-col items-center gap-2 w-20 sm:w-24 focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-blue-500/40 group-hover:border-blue-400 group-hover:scale-105 transition-all shadow-lg">
                <Settings size={28} className="text-white group-hover:text-blue-300 drop-shadow-md" />
              </div>
              <span className="text-white text-xs sm:text-sm font-medium font-sans px-2 py-1 rounded bg-black/50 backdrop-blur-sm group-hover:bg-blue-500/80 transition-colors text-center w-full truncate shadow-sm">
                Paramètres
              </span>
            </button>

            {/* Jeux Icon */}
            <button 
              onClick={onGames}
              className="group flex flex-col items-center gap-2 w-20 sm:w-24 focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-yellow-500/40 group-hover:border-yellow-400 group-hover:scale-105 transition-all shadow-lg">
                <Gamepad2 size={28} className="text-white group-hover:text-yellow-300 drop-shadow-md" />
              </div>
              <span className="text-white text-xs sm:text-sm font-medium font-sans px-2 py-1 rounded bg-black/50 backdrop-blur-sm group-hover:bg-yellow-500/80 transition-colors text-center w-full truncate shadow-sm">
                Jeux
              </span>
            </button>

            {/* Admin Icon */}
            <button 
              onClick={() => setActiveApp('admin')}
              className="group flex flex-col items-center gap-2 w-20 sm:w-24 focus:outline-none"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 flex items-center justify-center group-hover:bg-red-500/40 group-hover:border-red-400 group-hover:scale-105 transition-all shadow-lg">
                <Lock size={28} className="text-white group-hover:text-red-300 drop-shadow-md" />
              </div>
              <span className="text-white text-xs sm:text-sm font-medium font-sans px-2 py-1 rounded bg-black/50 backdrop-blur-sm group-hover:bg-red-500/80 transition-colors text-center w-full truncate shadow-sm">
                Admin
              </span>
            </button>

          </div>

          {/* Windows */}
          <AnimatePresence>
            {activeApp === 'settings' && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-md bg-[#111]/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl z-40 overflow-hidden flex flex-col"
              >
                <div className="h-10 bg-[#222] flex items-center justify-between px-4 border-b border-gray-700">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Settings size={16} />
                    <span className="text-xs font-mono">Paramètres système</span>
                  </div>
                  <button onClick={() => setActiveApp(null)} className="text-gray-400 hover:text-white transition-colors"><X size={16}/></button>
                </div>
                <div className="p-6">
                  <h3 className="text-white mb-4 font-sans text-sm font-semibold">Fonds d'écran</h3>
                  <div className="grid grid-cols-2 gap-3">
                    {WALLPAPERS.map((wp, i) => (
                      <button 
                        key={i} 
                        onClick={() => setWallpaper(wp)} 
                        className={`h-24 rounded-lg border-2 transition-all ${wallpaper === wp ? 'border-blue-500 scale-105 shadow-[0_0_15px_rgba(59,130,246,0.5)]' : 'border-transparent hover:border-gray-500'} bg-cover bg-center`} 
                        style={{backgroundImage: `url(${wp})`}} 
                      />
                    ))}
                  </div>
                </div>
              </motion.div>
            )}

            {activeApp === 'admin' && (
              <motion.div 
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[90%] max-w-sm bg-[#111]/95 backdrop-blur-xl border border-gray-700 rounded-lg shadow-2xl z-40 overflow-hidden flex flex-col"
              >
                <div className="h-10 bg-[#222] flex items-center justify-between px-4 border-b border-gray-700">
                  <div className="flex items-center gap-2 text-gray-300">
                    <Lock size={16} />
                    <span className="text-xs font-mono">Accès Restreint</span>
                  </div>
                  <button onClick={() => { setActiveApp(null); setError(''); setPassword(''); setUsername(''); }} className="text-gray-400 hover:text-white transition-colors"><X size={16}/></button>
                </div>
                <div className="p-6 flex flex-col gap-4">
                  <p className="text-gray-400 text-sm mb-2 text-center">Veuillez entrer vos identifiants administrateur.</p>
                  
                  <div className="relative">
                    <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="text" 
                      placeholder="Identifiant..." 
                      className="w-full bg-black border border-gray-700 rounded-md pl-10 pr-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      value={username}
                      onChange={e => setUsername(e.target.value)}
                      disabled={isLoading}
                    />
                  </div>

                  <div className="relative">
                    <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
                    <input 
                      type="password" 
                      placeholder="Mot de passe..." 
                      className="w-full bg-black border border-gray-700 rounded-md pl-10 pr-4 py-3 text-white font-mono text-sm focus:outline-none focus:border-cyan-500 transition-colors"
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      onKeyDown={e => { if(e.key === 'Enter') handleAdminLogin() }}
                      disabled={isLoading}
                    />
                  </div>

                  <button 
                    onClick={handleAdminLogin} 
                    disabled={isLoading}
                    className="bg-cyan-600 hover:bg-cyan-500 text-white font-bold py-3 rounded-md text-sm transition-colors mt-2 disabled:opacity-50"
                  >
                    {isLoading ? 'Vérification...' : 'Connexion'}
                  </button>
                  {error && <span className="text-red-500 text-xs text-center font-medium">{error}</span>}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Taskbar */}
          <div className="absolute bottom-0 left-0 right-0 h-12 bg-black/60 backdrop-blur-lg border-t border-white/10 z-30 flex items-center justify-between px-4">
            {/* Start Button */}
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-md hover:bg-white/10 transition-colors">
              <div className="w-6 h-6 rounded bg-gradient-to-br from-cyan-400 to-fuchsia-500 flex items-center justify-center">
                <Monitor size={14} className="text-white" />
              </div>
              <span className="text-white font-semibold text-sm hidden sm:block">Démarrer</span>
            </button>

            {/* System Tray */}
            <div className="flex items-center gap-4 text-gray-300">
              <div className="flex items-center gap-3 hidden sm:flex">
                <Volume2 size={16} className="hover:text-white cursor-pointer" />
                <Wifi size={16} className="hover:text-white cursor-pointer" />
                <Battery size={16} className="hover:text-white cursor-pointer" />
              </div>
              <div className="text-xs sm:text-sm font-mono text-right leading-tight">
                <div>{time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                <div className="text-gray-500">{time.toLocaleDateString()}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}