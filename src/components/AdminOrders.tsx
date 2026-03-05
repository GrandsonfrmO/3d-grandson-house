import { useState, useEffect } from 'react';
import { Search, Eye, X } from 'lucide-react';
import { useStore } from '../store';
import { useTranslation } from '../hooks/useTranslation';

export function AdminOrders() {
  const [orderStatusFilter, setOrderStatusFilter] = useState('All');
  const [orderSearchQuery, setOrderSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const storeOrders = useStore((state: any) => state.orders);
  const updateOrderStatus = useStore((state: any) => state.updateOrderStatus);
  const loadOrders = useStore((state: any) => state.loadOrders);
  const { formatPrice } = useTranslation();

  // Load orders on component mount and set up polling
  useEffect(() => {
    loadOrders();
    
    // Poll for new orders every 5 seconds
    const interval = setInterval(() => {
      loadOrders();
    }, 5000);

    return () => clearInterval(interval);
  }, [loadOrders]);

  const orders = storeOrders.length > 0 ? storeOrders : [];

  const filteredOrders = orders.filter((o: any) => {
    const matchesStatus = orderStatusFilter === 'All' || o.status === orderStatusFilter;
    const matchesSearch = o.id.toLowerCase().includes(orderSearchQuery.toLowerCase()) || 
                          o.customer.toLowerCase().includes(orderSearchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const handleOrderStatusChange = async (orderId: string, newStatus: string) => {
    try {
      await updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
        <h3 className="font-bold text-gray-900">Gestion des Commandes</h3>
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher les commandes..." 
              value={orderSearchQuery}
              onChange={(e) => setOrderSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 w-full bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all"
            />
          </div>
          <select 
            className="w-full sm:w-auto text-sm border border-gray-200 rounded-lg text-gray-600 focus:ring-cyan-500 outline-none px-3 py-2 bg-gray-50"
            value={orderStatusFilter}
            onChange={(e) => setOrderStatusFilter(e.target.value)}
          >
            <option value="All">Tous les Statuts</option>
            <option value="Livré">Livré</option>
            <option value="En traitement">En traitement</option>
            <option value="Expédié">Expédié</option>
            <option value="En attente">En attente</option>
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
              <th className="px-6 py-4 font-medium">ID Commande</th>
              <th className="px-6 py-4 font-medium">Client</th>
              <th className="px-6 py-4 font-medium">Date</th>
              <th className="px-6 py-4 font-medium">Total</th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {filteredOrders.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                  Aucune commande trouvée
                </td>
              </tr>
            ) : (
              filteredOrders.map((order: any, i: number) => (
                <tr key={i} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-bold text-gray-900">{order.id}</td>
                  <td className="px-6 py-4 text-gray-600 font-medium">{order.customer}</td>
                  <td className="px-6 py-4 text-gray-500">{new Date(order.date).toLocaleDateString('fr-FR')}</td>
                  <td className="px-6 py-4 font-bold text-gray-900">{typeof order.total === 'number' ? `${order.total.toFixed(2)}` : order.total}</td>
                  <td className="px-6 py-4">
                    <select
                      value={order.status}
                      onChange={(e) => handleOrderStatusChange(order.id, e.target.value)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold outline-none cursor-pointer appearance-none border-2 ${
                        order.status === 'Livré' ? 'bg-green-50 text-green-700 border-green-200' :
                        order.status === 'En traitement' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                        order.status === 'Expédié' ? 'bg-purple-50 text-purple-700 border-purple-200' :
                        'bg-yellow-50 text-yellow-700 border-yellow-200'
                      }`}
                    >
                      <option value="En attente">En attente</option>
                      <option value="En traitement">En traitement</option>
                      <option value="Expédié">Expédié</option>
                      <option value="Livré">Livré</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button 
                      onClick={() => setSelectedOrder(order)}
                      className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors" 
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 sticky top-0 bg-white">
              <h2 className="text-2xl font-bold text-gray-900">Détails de la Commande</h2>
              <button
                onClick={() => setSelectedOrder(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={24} className="text-gray-600" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Summary */}
              <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">ID Commande</p>
                  <p className="font-bold text-gray-900 text-lg">{selectedOrder.id}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Date</p>
                  <p className="font-bold text-gray-900 text-lg">
                    {new Date(selectedOrder.date).toLocaleDateString('fr-FR')}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Statut</p>
                  <p className={`font-bold text-lg ${
                    selectedOrder.status === 'Livré' ? 'text-green-600' :
                    selectedOrder.status === 'En traitement' ? 'text-blue-600' :
                    selectedOrder.status === 'Expédié' ? 'text-purple-600' :
                    'text-yellow-600'
                  }`}>
                    {selectedOrder.status}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Total</p>
                  <p className="font-bold text-cyan-600 text-lg">
                    {typeof selectedOrder.total === 'number' 
                      ? formatPrice(selectedOrder.total)
                      : selectedOrder.total
                    }
                  </p>
                </div>
              </div>

              {/* Customer Information */}
              <div className="bg-blue-50 p-5 rounded-lg border border-blue-200">
                <h3 className="font-bold text-gray-900 mb-4 text-lg">Informations Client</h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-gray-600 font-medium">Nom:</span>
                    <span className="font-bold text-gray-900">{selectedOrder.customer}</span>
                  </div>
                  {selectedOrder.email && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 font-medium">Email:</span>
                      <span className="font-bold text-gray-900 break-all text-right">{selectedOrder.email}</span>
                    </div>
                  )}
                  {selectedOrder.phone && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 font-medium">Téléphone:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.phone}</span>
                    </div>
                  )}
                  {selectedOrder.address && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 font-medium">Adresse:</span>
                      <span className="font-bold text-gray-900 text-right">{selectedOrder.address}</span>
                    </div>
                  )}
                  {selectedOrder.city && (
                    <div className="flex justify-between items-start">
                      <span className="text-gray-600 font-medium">Ville:</span>
                      <span className="font-bold text-gray-900">{selectedOrder.city}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Items Section */}
              {selectedOrder.items && selectedOrder.items.length > 0 ? (
                <div>
                  <h3 className="font-bold text-gray-900 mb-4 text-lg">Articles Commandés</h3>
                  <div className="space-y-3">
                    {selectedOrder.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-cyan-300 transition-colors">
                        {item.image && (
                          <img 
                            src={item.image} 
                            alt={item.name}
                            className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 text-base">{item.name}</p>
                          <p className="text-sm text-gray-500 mt-1">Quantité: <span className="font-semibold text-gray-900">{item.quantity}</span></p>
                          <p className="text-sm text-gray-500">Prix unitaire: <span className="font-semibold text-gray-900">{formatPrice(item.price)}</span></p>
                          <p className="font-bold text-cyan-600 text-base mt-2">
                            Sous-total: {formatPrice(item.price * item.quantity)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                  <p className="text-sm text-yellow-800">Détails des articles en cours de chargement...</p>
                </div>
              )}

              {/* Total Summary */}
              <div className="bg-gradient-to-r from-cyan-50 to-blue-50 p-5 rounded-lg border-2 border-cyan-300">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-gray-900 text-lg">Total de la Commande:</span>
                  <span className="text-3xl font-bold text-cyan-600">
                    {typeof selectedOrder.total === 'number' 
                      ? formatPrice(selectedOrder.total)
                      : selectedOrder.total
                    }
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
