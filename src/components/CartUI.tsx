import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';

export function CartUI({ onClose, onCheckout }: { onClose: () => void; onCheckout: () => void }) {
  const cart = useStore((state: any) => state.cart);
  const removeFromCart = useStore((state: any) => state.removeFromCart);
  const updateCartQuantity = useStore((state: any) => state.updateCartQuantity);
  const clearCart = useStore((state: any) => state.clearCart);
  const { t, formatPrice } = useTranslation();

  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  return (
    <motion.div
      initial={{ opacity: 0, x: 400 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 400 }}
      className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[9999] flex flex-col"
    >
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <ShoppingCart size={24} className="text-cyan-600" />
          <h2 className="text-xl font-bold text-gray-900">{t('cart.title')}</h2>
        </div>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <X size={20} className="text-gray-600" />
        </button>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <ShoppingCart size={48} className="text-gray-300 mb-4" />
            <p className="text-gray-500 font-medium">{t('cart.empty')}</p>
            <p className="text-gray-400 text-sm mt-1">{t('common.loading')}</p>
          </div>
        ) : (
          cart.map((item: any) => (
            <div
              key={item.id}
              className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-900 truncate">{item.name}</h3>
                <p className="text-cyan-600 font-mono font-bold">{formatPrice(item.price)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity - 1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Minus size={16} className="text-gray-600" />
                  </button>
                  <span className="w-8 text-center font-bold text-gray-900">
                    {item.quantity}
                  </span>
                  <button
                    onClick={() => updateCartQuantity(item.id, item.quantity + 1)}
                    className="p-1 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Plus size={16} className="text-gray-600" />
                  </button>
                </div>
              </div>
              <button
                onClick={() => removeFromCart(item.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          ))
        )}
      </div>

      {/* Footer */}
      {cart.length > 0 && (
        <div className="border-t border-gray-200 p-6 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600 font-medium">{t('checkout.subtotal')}:</span>
            <span className="text-2xl font-bold text-gray-900">
              {formatPrice(total)}
            </span>
          </div>
          <div className="flex gap-3">
            <button
              onClick={clearCart}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              {t('common.close')}
            </button>
            <button
              onClick={onCheckout}
              className="flex-1 py-3 px-4 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition-colors active:scale-95"
            >
              {t('checkout.title')}
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
}
