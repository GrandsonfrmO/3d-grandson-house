import { useState } from 'react';
import { motion } from 'motion/react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';
import { X, AlertCircle, CheckCircle } from 'lucide-react';

export function CheckoutUI({ onClose, onSuccess }: { onClose: () => void; onSuccess: () => void }) {
  const cart = useStore((state: any) => state.cart);
  const clearCart = useStore((state: any) => state.clearCart);
  const createOrder = useStore((state: any) => state.createOrder);
  const { t, formatPrice } = useTranslation();

  const [formData, setFormData] = useState({
    customerName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
  });

  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const total = cart.reduce((sum: number, item: any) => sum + item.price * item.quantity, 0);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setError('');
  };

  const validateForm = () => {
    if (!formData.customerName.trim()) return 'Please enter your name';
    if (!formData.email.trim()) return 'Please enter your email';
    if (!formData.phone.trim()) return 'Please enter your phone number';
    if (!formData.address.trim()) return 'Please enter your address';
    if (!formData.city.trim()) return 'Please enter your city';
    return '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsProcessing(true);
    setError('');

    try {
      // Create order with items
      const orderId = `#ORD-${Date.now()}`;
      const order = {
        id: orderId,
        customer: formData.customerName,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        date: new Date().toISOString(),
        total: total.toFixed(2),
        status: 'Pending',
        items: cart,
      };

      await createOrder(order);

      setSuccess(true);
      setTimeout(() => {
        clearCart();
        onSuccess();
      }, 2000);
    } catch (err) {
      setError('Failed to process order. Please try again.');
      console.error('Checkout error:', err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      >
        <div className="bg-white rounded-2xl p-8 max-w-md w-full text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <CheckCircle size={32} className="text-green-600" />
          </motion.div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{t('checkout.orderPlaced')}</h2>
          <p className="text-gray-600 mb-6">
            {t('checkout.orderPlaced')}
          </p>
          <button
            onClick={onClose}
            className="w-full py-3 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition-colors"
          >
            {t('shop.title')}
          </button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
    >
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
          <h2 className="text-2xl font-bold text-gray-900">{t('checkout.title')}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={24} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg"
            >
              <AlertCircle size={20} className="text-red-600 flex-shrink-0" />
              <p className="text-red-700 font-medium">{error}</p>
            </motion.div>
          )}

          {/* Order Summary */}
          <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
            <h3 className="font-bold text-gray-900 mb-3">{t('checkout.orderSummary')}</h3>
            <div className="space-y-2 mb-3 max-h-40 overflow-y-auto">
              {cart.map((item: any) => (
                <div key={item.id} className="flex justify-between text-sm text-gray-600">
                  <span>
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-200 pt-3 flex justify-between">
              <span className="font-bold text-gray-900">{t('checkout.total')}:</span>
              <span className="text-xl font-bold text-cyan-600">
                {formatPrice(total)}
              </span>
            </div>
          </div>

          {/* Shipping Information */}
          <div>
            <h3 className="font-bold text-gray-900 mb-3">{t('checkout.customerInfo')}</h3>
            <div className="space-y-3">
              <input
                type="text"
                name="customerName"
                placeholder={t('checkout.name')}
                value={formData.customerName}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              />
              <input
                type="email"
                name="email"
                placeholder={t('checkout.email')}
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Numéro de téléphone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              />
              <input
                type="text"
                name="address"
                placeholder={t('checkout.address')}
                value={formData.address}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  name="city"
                  placeholder={t('checkout.city')}
                  value={formData.city}
                  onChange={handleInputChange}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
                />
              </div>
            </div>
          </div>

          {/* Payment Information */}
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <h3 className="font-bold text-gray-900 mb-2">Paiement</h3>
            <p className="text-sm text-blue-900">
              Vous paierez le montant de <span className="font-bold">{formatPrice(total)}</span> à la livraison.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 px-4 bg-gray-100 text-gray-900 rounded-lg font-bold hover:bg-gray-200 transition-colors"
            >
              {t('common.cancel')}
            </button>
            <button
              type="submit"
              disabled={isProcessing}
              className="flex-1 py-3 px-4 bg-cyan-600 text-white rounded-lg font-bold hover:bg-cyan-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed active:scale-95"
            >
              {isProcessing ? t('common.loading') : `${t('checkout.placeOrder')} ${formatPrice(total)}`}
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}
