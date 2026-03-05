import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { 
  LayoutDashboard, Package, ShoppingCart, Settings, 
  LogOut, Menu, X, Image as ImageIcon, Monitor, UploadCloud, XCircle, Search, Plus
} from 'lucide-react';
import { AdminDashboard } from './AdminDashboard';
import { AdminProducts } from './AdminProducts';
import { AdminOrders } from './AdminOrders';
import { AdminSettings } from './AdminSettings';
import { AddPosterModal } from './AddPosterModal';

const RECENT_ORDERS = [
  { id: '#ORD-001', customer: 'Alex Johnson', date: '2026-02-26', total: '120 000 GNF', status: 'Livré' },
  { id: '#ORD-002', customer: 'Sarah Smith', date: '2026-02-26', total: '65 000 GNF', status: 'En traitement' },
  { id: '#ORD-003', customer: 'Mike Brown', date: '2026-02-25', total: '210 000 GNF', status: 'Expédié' },
  { id: '#ORD-004', customer: 'Emma Wilson', date: '2026-02-25', total: '45 000 GNF', status: 'En attente' },
];

const ImageUpload = ({ onChange, onRemove, hasImage }: { onChange: (val: string) => void, onRemove?: () => void, hasImage?: boolean }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  const handleFile = async (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setIsUploading(true);
      try {
        // Convert to base64 for now, but limit size
        const reader = new FileReader();
        reader.onload = (e) => {
          if (e.target?.result) {
            const base64 = e.target.result as string;
            // Limit to 1MB for base64
            if (base64.length > 1000000) {
              alert('Image trop grande. Veuillez utiliser une image plus petite (max 1MB)');
              return;
            }
            onChange(base64);
          }
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error('Error uploading file:', error);
        alert('Erreur lors du téléchargement de l\'image');
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <div 
      className={`relative border-2 border-dashed rounded-xl p-4 flex flex-col items-center justify-center gap-2 transition-all ${isDragging ? 'border-cyan-500 bg-cyan-50 scale-[1.02]' : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'}`}
      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
          handleFile(e.dataTransfer.files[0]);
        }
      }}
    >
      <input 
        type="file" 
        accept="image/*" 
        disabled={isUploading}
        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
        onChange={(e) => {
          if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
          }
        }}
      />
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center pointer-events-none">
        <UploadCloud size={16} className={isUploading ? 'text-gray-400 animate-pulse' : 'text-gray-500'} />
      </div>
      <div className="text-center pointer-events-none">
        <p className="text-xs font-bold text-gray-700">{isUploading ? 'Téléchargement...' : 'Cliquez pour télécharger'}</p>
        <p className="text-[10px] text-gray-500">ou glissez-déposez (max 1MB)</p>
      </div>
      {hasImage && onRemove && (
        <button 
          onClick={(e) => { e.preventDefault(); e.stopPropagation(); onRemove(); }}
          className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-sm text-red-500 hover:bg-red-50 hover:text-red-600 transition-colors z-10"
          title="Remove Image"
        >
          <XCircle size={16} />
        </button>
      )}
    </div>
  );
};

export function AdminUI({ onClose, screens, setScreens, posters, setPosters }: { onClose: () => void, screens: any, setScreens: any, posters: any[], setPosters: any }) {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showAddPosterModal, setShowAddPosterModal] = useState(false);
  const [savingScreen, setSavingScreen] = useState<string | null>(null);

  const storeProducts = useStore((state: any) => state.products);
  const storeOrders = useStore((state: any) => state.orders);
  const updateScreen = useStore((state: any) => state.updateScreen);
  const loadScreens = useStore((state: any) => state.loadScreens);
  const updatePoster = useStore((state: any) => state.updatePoster);
  const loadPosters = useStore((state: any) => state.loadPosters);

  const products = storeProducts.length > 0 ? storeProducts : [];
  const orders = storeOrders.length > 0 ? storeOrders : RECENT_ORDERS;

  const handleScreenChange = async (screenId: string, imageUrl: string) => {
    // Update local state immediately for instant UI feedback
    setScreens({ ...screens, [screenId]: imageUrl });
    setSavingScreen(screenId);
    try {
      await updateScreen(screenId, imageUrl);
      // Force reload after save to ensure consistency
      setTimeout(() => {
        loadScreens();
      }, 100);
    } catch (error) {
      console.error('Failed to save screen:', error);
    } finally {
      setSavingScreen(null);
    }
  };

  const handlePosterChange = async (posterId: string, imageUrl: string) => {
    // Update local state immediately for instant UI feedback
    const updatedPosters = posters.map(p => p.id === posterId ? { ...p, image: imageUrl } : p);
    setPosters(updatedPosters);
    try {
      await updatePoster(posterId, { image: imageUrl });
      // Force reload after save to ensure consistency
      setTimeout(() => {
        loadPosters();
      }, 100);
    } catch (error) {
      console.error('Failed to save poster:', error);
    }
  };

  const NavLinks = () => (
    <>
      {[
        { id: 'dashboard', label: 'Tableau de Bord', icon: LayoutDashboard },
        { id: 'products', label: 'Produits', icon: Package },
        { id: 'orders', label: 'Commandes', icon: ShoppingCart },
        { id: 'posters', label: 'Affiches Murales', icon: ImageIcon },
        { id: 'screens', label: 'Écrans & TV', icon: Monitor },
        { id: 'settings', label: 'Paramètres', icon: Settings },
      ].map((item) => (
        <button
          key={item.id}
          onClick={() => {
            setActiveTab(item.id);
            setIsMobileMenuOpen(false);
          }}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
            activeTab === item.id 
              ? 'bg-gray-900 text-white' 
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
          }`}
        >
          <item.icon size={18} />
          {item.label}
        </button>
      ))}
    </>
  );

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="absolute inset-0 z-[999] bg-gray-50 flex font-sans text-gray-900 overflow-hidden"
    >
      {/* Desktop Sidebar */}
      <div className="hidden md:flex w-64 bg-white border-r border-gray-200 flex-col">
        <div className="h-16 flex items-center px-6 border-b border-gray-200 shrink-0">
          <h1 className="text-xl font-black tracking-tighter">GRANDSON <span className="text-cyan-600">ADMIN</span></h1>
        </div>
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <NavLinks />
        </nav>
        <div className="p-4 border-t border-gray-200 shrink-0">
          <button 
            onClick={onClose}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <LogOut size={18} />
            Quitter l'Admin
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-[9999] flex md:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setIsMobileMenuOpen(false)}></div>
          <div className="relative w-64 max-w-sm bg-white h-full flex flex-col shadow-2xl">
            <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 shrink-0">
              <h1 className="text-xl font-black tracking-tighter">GRANDSON <span className="text-cyan-600">ADMIN</span></h1>
              <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-500 hover:text-gray-900">
                <X size={20} />
              </button>
            </div>
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
              <NavLinks />
            </nav>
            <div className="p-4 border-t border-gray-200 shrink-0">
              <button 
                onClick={onClose}
                className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
              >
                <LogOut size={18} />
                Quitter l'Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Header */}
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-4 md:px-8 shrink-0">
          <div className="flex items-center gap-4">
            <button 
              className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
              onClick={() => setIsMobileMenuOpen(true)}
            >
              <Menu size={20} />
            </button>
            <h2 className="text-lg md:text-xl font-bold capitalize">{activeTab}</h2>
          </div>
          <div className="flex items-center gap-3 md:gap-4">
            <div className="relative hidden sm:block">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input 
                type="text" 
                placeholder="Rechercher..." 
                className="pl-10 pr-4 py-2 bg-gray-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-gray-300 focus:ring-2 focus:ring-cyan-500 outline-none transition-all w-48 md:w-64"
              />
            </div>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-fuchsia-500 shadow-sm border-2 border-white"></div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-6xl mx-auto space-y-6 md:space-y-8">
            
            {activeTab === 'dashboard' && (
              <AdminDashboard products={products} orders={orders} />
            )}

            {activeTab === 'products' && (
              <AdminProducts />
            )}

            {activeTab === 'orders' && (
              <AdminOrders />
            )}

            {activeTab === 'posters' && (
              <div className="space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Affiches Murales & Œuvres d'Art</h3>
                    <p className="text-sm text-gray-500">Gérez les images affichées sur les murs dans différentes pièces.</p>
                  </div>
                  <button 
                    onClick={() => setShowAddPosterModal(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
                  >
                    <Plus size={16} />
                    Ajouter un Emplacement
                  </button>
                </div>

                {['Gaming Room', 'Bedroom', 'Hallway', 'Bathroom'].map(room => {
                  const roomPosters = posters.filter(p => p.room === room);
                  if (roomPosters.length === 0) return null;
                  return (
                    <div key={room} className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-4 md:p-5 border-b border-gray-200 bg-gray-50/50">
                        <h4 className="font-bold text-gray-900 flex items-center gap-2">
                          <ImageIcon size={18} className="text-cyan-600" />
                          {room}
                        </h4>
                      </div>
                      <div className="p-4 md:p-5 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-6">
                        {roomPosters.map(poster => (
                          <div key={poster.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
                            <div className="aspect-video bg-gray-100 relative group overflow-hidden border-b border-gray-100 flex items-center justify-center">
                              <img src={poster.image} alt={poster.location} className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                            </div>
                            <div className="p-4 flex flex-col gap-4 flex-1">
                              <div>
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-1">Emplacement</p>
                                <p className="font-bold text-gray-800 text-sm">{poster.location}</p>
                              </div>
                              <div className="mt-auto">
                                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Télécharger l'Image</p>
                                <ImageUpload 
                                  hasImage={!!poster.image}
                                  onChange={(val) => handlePosterChange(poster.id, val)}
                                  onRemove={() => handlePosterChange(poster.id, '')}
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {activeTab === 'screens' && (
              <div className="space-y-6 md:space-y-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 bg-white p-5 md:p-6 rounded-2xl border border-gray-200 shadow-sm">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg">Écrans & TV</h3>
                    <p className="text-sm text-gray-500">Gérez les fonds d'écran et les vidéos (GIF) affichés sur les moniteurs PC et la TV.</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* PC Left Monitor */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Monitor size={18} className="text-cyan-600" />
                        Moniteur PC (Gauche)
                      </h4>
                    </div>
                    <div className="p-4 flex flex-col gap-4 flex-1">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                        <img src={screens.pcLeft} alt="PC Left" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Télécharger l'Image/GIF de l'Écran</p>
                        <ImageUpload 
                          hasImage={!!screens.pcLeft}
                          onChange={(val) => handleScreenChange('pcLeft', val)}
                          onRemove={() => handleScreenChange('pcLeft', '')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* PC Main Monitor */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                    <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Monitor size={18} className="text-cyan-600" />
                        Moniteur PC (Principal)
                      </h4>
                    </div>
                    <div className="p-4 flex flex-col gap-4 flex-1">
                      <div className="aspect-video bg-black rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                        <img src={screens.pcMain} alt="PC Main" className="w-full h-full object-contain" />
                      </div>
                      <div>
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Télécharger l'Image/GIF de l'Écran</p>
                        <ImageUpload 
                          hasImage={!!screens.pcMain}
                          onChange={(val) => handleScreenChange('pcMain', val)}
                          onRemove={() => handleScreenChange('pcMain', '')}
                        />
                      </div>
                    </div>
                  </div>

                  {/* TV Screen */}
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col md:col-span-2">
                    <div className="p-4 border-b border-gray-200 bg-gray-50/50">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <Monitor size={18} className="text-cyan-600" />
                        Écran TV Principal
                      </h4>
                    </div>
                    <div className="p-4 flex flex-col md:flex-row gap-6">
                      <div className="w-full md:w-1/2 aspect-video bg-black rounded-lg overflow-hidden border border-gray-200 flex items-center justify-center">
                        <img src={screens.tv} alt="TV" className="w-full h-full object-contain" />
                      </div>
                      <div className="w-full md:w-1/2 flex flex-col justify-center">
                        <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-2">Télécharger l'Image/GIF de la TV</p>
                        <ImageUpload 
                          hasImage={!!screens.tv}
                          onChange={(val) => handleScreenChange('tv', val)}
                          onRemove={() => handleScreenChange('tv', '')}
                        />
                        <div className="p-4 bg-cyan-50 border border-cyan-100 rounded-xl mt-4">
                          <p className="text-sm text-cyan-800 font-medium">💡 Conseil Pro</p>
                          <p className="text-xs text-cyan-600 mt-1">Téléchargez un fichier GIF pour animer les écrans ! La TV a l'air super avec un GIF de gameplay.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <AdminSettings />
            )}
          </div>
        </main>
      </div>

      {/* Add Poster Modal */}
      <AnimatePresence>
        {showAddPosterModal && (
          <AddPosterModal
            onClose={() => setShowAddPosterModal(false)}
            onAdd={(poster) => setPosters([...posters, poster])}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
