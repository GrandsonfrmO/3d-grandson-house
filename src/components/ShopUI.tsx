import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { CartUI } from './CartUI';
import { CheckoutUI } from './CheckoutUI';
import { X, Minus, Square, ShoppingCart, Search, Globe, ChevronLeft, ChevronRight, RotateCw } from 'lucide-react';

const ProductImage = ({ src, alt }: { src: string; alt: string }) => {
  if (!src) return <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">No Image</div>;
  
  const isGif = src.toLowerCase().endsWith('.gif') || src.includes('giphy.com');
  
  return (
    <img 
      src={src} 
      alt={alt}
      loading="lazy"
      className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ${!isGif && !src.startsWith('data:') ? 'mix-blend-multiply' : ''}`}
      referrerPolicy="no-referrer"
    />
  );
};

export function ShopUI({ onClose }: { onClose: () => void }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);
  const { t, formatPrice } = useTranslation();
  
  const products = useStore((state: any) => state.products);
  const cart = useStore((state: any) => state.cart);
  const addToCart = useStore((state: any) => state.addToCart);

  const filteredProducts = products.filter((product: any) => 
    product.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const cartCount = cart.reduce((sum: number, item: any) => sum + item.quantity, 0);

  const handleAddToCart = (product: any) => {
    addToCart({
      id: product.id,
      name: product.name,
      price: typeof product.price === 'string' ? parseFloat(product.price) : product.price,
      image: product.image,
    });
  };

  const handleCheckoutSuccess = () => {
    setIsCheckoutOpen(false);
    setIsCartOpen(false);
    onClose();
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="absolute inset-0 z-[999] flex items-center justify-center p-0 sm:p-4 md:p-8 bg-black/90 backdrop-blur-sm font-sans"
    >
      <div className="w-full max-w-6xl h-full sm:max-h-[900px] bg-[#111] sm:rounded-2xl sm:border-4 border-[#333] shadow-2xl shadow-cyan-500/20 flex flex-col overflow-hidden relative">
        
        <div className="hidden sm:flex h-6 w-full bg-[#0a0a0a] border-b border-[#222] items-center justify-center">
          <div className="w-2 h-2 rounded-full bg-[#222]"></div>
        </div>

        <div className="flex-1 bg-gradient-to-br from-indigo-900 via-purple-900 to-black relative p-0 sm:p-4 md:p-8 overflow-hidden flex items-center justify-center">
          
          <motion.div 
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-full h-full max-w-5xl bg-white sm:rounded-lg shadow-2xl flex flex-col overflow-hidden"
          >
            <div className="bg-[#e2e2e2] border-b border-gray-300 flex flex-col">
              <div className="h-12 sm:h-10 flex items-center px-4 justify-between">
                <div className="flex items-center gap-3 sm:gap-2">
                  <button onClick={onClose} className="w-5 h-5 sm:w-3.5 sm:h-3.5 rounded-full bg-red-500 hover:bg-red-600 flex items-center justify-center group">
                    <X size={12} className="text-red-900 opacity-100 sm:opacity-0 group-hover:opacity-100" />
                  </button>
                  <button className="w-5 h-5 sm:w-3.5 sm:h-3.5 rounded-full bg-yellow-400 hover:bg-yellow-500 flex items-center justify-center group">
                    <Minus size={12} className="text-yellow-900 opacity-100 sm:opacity-0 group-hover:opacity-100" />
                  </button>
                  <button className="w-5 h-5 sm:w-3.5 sm:h-3.5 rounded-full bg-green-500 hover:bg-green-600 flex items-center justify-center group">
                    <Square size={10} className="text-green-900 opacity-100 sm:opacity-0 group-hover:opacity-100" />
                  </button>
                </div>
                <div className="text-gray-500 text-xs font-medium flex-1 text-center mr-16 sm:mr-16">
                  Grandson OS - Web Browser
                </div>
              </div>
              
              <div className="h-14 sm:h-12 bg-[#f1f1f1] flex items-center px-2 sm:px-4 gap-2 sm:gap-4">
                <div className="flex items-center gap-1 sm:gap-2 text-gray-500">
                  <ChevronLeft size={24} className="hover:text-gray-800 cursor-pointer sm:w-5 sm:h-5" />
                  <ChevronRight size={24} className="text-gray-300 sm:w-5 sm:h-5" />
                  <RotateCw size={20} className="hover:text-gray-800 cursor-pointer ml-1 sm:ml-2 sm:w-[18px] sm:h-[18px]" />
                </div>
                <div className="flex-1 bg-white border border-gray-300 rounded-md h-9 sm:h-8 flex items-center px-2 sm:px-3 gap-2">
                  <Globe size={16} className="text-gray-400" />
                  <span className="text-xs sm:text-sm text-gray-700 font-mono truncate">https://store.grandson.com/shop</span>
                </div>
                <div className="w-64 bg-white border border-gray-300 rounded-md h-8 flex items-center px-3 gap-2 hidden lg:flex">
                  <Search size={16} className="text-gray-400" />
                  <input 
                    type="text" 
                    placeholder="Search..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full text-sm text-gray-700 outline-none bg-transparent"
                  />
                </div>
              </div>
            </div>

            <div className="flex-1 bg-gray-50 overflow-y-auto p-4 sm:p-6 md:p-10">
              <div className="max-w-4xl mx-auto">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10 border-b border-gray-200 pb-6">
                  <h1 className="text-3xl sm:text-4xl font-black tracking-tighter text-black">
                    GRANDSON <span className="text-cyan-500">{t('shop.title')}</span>
                  </h1>
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    <div className="flex-1 lg:hidden relative">
                      <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input 
                        type="text" 
                        placeholder={t('shop.title')} 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-full text-sm focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                      />
                    </div>
                    <button onClick={() => setIsCartOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shrink-0">
                      <ShoppingCart size={20} />
                      <span className="font-bold">{t('nav.cart')} ({cartCount})</span>
                    </button>
                  </div>
                </div>

                {filteredProducts.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredProducts.map((product: any) => (
                      <div key={product.id} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all group">
                        <div className="aspect-square overflow-hidden bg-gray-100">
                          <ProductImage src={product.image} alt={product.name} />
                        </div>
                        <div className="p-5">
                          <h3 className="text-lg font-bold text-gray-900 mb-1">{product.name}</h3>
                          <p className="text-cyan-600 font-mono text-lg font-bold mb-4">{formatPrice(typeof product.price === 'number' ? product.price : parseFloat(product.price))}</p>
                          <button 
                            onClick={() => handleAddToCart(product)}
                            disabled={product.stock === 0}
                            className={`w-full py-2.5 rounded-lg font-bold transition-colors active:scale-95 ${
                              product.stock === 0 
                                ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                : 'bg-black hover:bg-cyan-500 text-white'
                            }`}
                          >
                            {product.stock === 0 ? 'OUT OF STOCK' : t('shop.addToCart')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <p className="text-gray-500 text-lg">{t('shop.noProducts')}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
          
          <div className="hidden sm:flex absolute bottom-0 left-0 w-full h-12 bg-black/50 backdrop-blur-md border-t border-white/10 items-center px-4 gap-4">
            <div className="w-8 h-8 bg-cyan-500 rounded-md flex items-center justify-center shadow-lg shadow-cyan-500/50">
              <div className="w-4 h-4 border-2 border-white rounded-sm"></div>
            </div>
            <div className="flex-1"></div>
            <div className="text-white/80 text-sm font-mono">
              {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
        
        <div className="hidden sm:flex h-8 w-full bg-[#0a0a0a] border-t border-[#222] items-center justify-center">
          <span className="text-[#444] text-[10px] tracking-widest font-bold">GRANDSON</span>
        </div>
      </div>

      <AnimatePresence>
        {isCartOpen && (
          <CartUI
            onClose={() => setIsCartOpen(false)}
            onCheckout={() => setIsCheckoutOpen(true)}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isCheckoutOpen && (
          <CheckoutUI
            onClose={() => setIsCheckoutOpen(false)}
            onSuccess={handleCheckoutSuccess}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}