import { useState } from 'react';
import { Plus, Search, Edit, Trash2 } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { useStore } from '../store';
import { EditProductModal } from './EditProductModal';
import { AddProductModal } from './AddProductModal';

export function AdminProducts() {
  const [productSearchQuery, setProductSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const products = useStore((state: any) => state.products);
  const updateProduct = useStore((state: any) => state.updateProduct);
  const deleteProduct = useStore((state: any) => state.deleteProduct);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleStockChange = async (id: number, newStock: string) => {
    const stock = parseInt(newStock) || 0;
    let status = 'Active';
    if (stock === 0) status = 'Out of Stock';
    else if (stock < 15) status = 'Low Stock';
    
    try {
      await updateProduct(id, { stock, status });
    } catch (error) {
      console.error('Failed to update stock:', error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (confirm('Êtes-vous sûr de vouloir supprimer ce produit?')) {
      try {
        await deleteProduct(id);
      } catch (error) {
        console.error('Failed to delete product:', error);
      }
    }
  };

  const processedProducts = [...products]
    .filter(p => 
      p.name.toLowerCase().includes(productSearchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (!sortConfig) return 0;
      const { key, direction } = sortConfig;
      let aVal: any = a[key as keyof typeof a];
      let bVal: any = b[key as keyof typeof b];
      
      if (key === 'price') {
        aVal = typeof aVal === 'number' ? aVal : parseFloat(aVal);
        bVal = typeof bVal === 'number' ? bVal : parseFloat(bVal);
      }
      
      if (aVal < bVal) return direction === 'asc' ? -1 : 1;
      if (aVal > bVal) return direction === 'asc' ? 1 : -1;
      return 0;
    });

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
      <div className="p-5 md:p-6 border-b border-gray-200 flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 shrink-0">
        <h3 className="font-bold text-gray-900">Tous les Produits</h3>
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input 
              type="text" 
              placeholder="Rechercher les produits..." 
              value={productSearchQuery}
              onChange={(e) => setProductSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:bg-white focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 outline-none transition-all w-full sm:w-64"
            />
          </div>
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors shrink-0"
          >
            <Plus size={16} />
            <span className="hidden sm:inline">Ajouter un Produit</span>
          </button>
        </div>
      </div>

      {/* Remove inline form - using modal instead */}

      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse min-w-[700px]">
          <thead>
            <tr className="bg-gray-50 text-gray-500 text-sm border-b border-gray-200">
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-gray-900 select-none" onClick={() => handleSort('name')}>
                Produit {sortConfig?.key === 'name' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-6 py-4 font-medium">Variantes</th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-gray-900 select-none" onClick={() => handleSort('price')}>
                Prix {sortConfig?.key === 'price' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-6 py-4 font-medium cursor-pointer hover:text-gray-900 select-none" onClick={() => handleSort('stock')}>
                Stock {sortConfig?.key === 'stock' ? (sortConfig.direction === 'asc' ? '↑' : '↓') : ''}
              </th>
              <th className="px-6 py-4 font-medium">Statut</th>
              <th className="px-6 py-4 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {processedProducts.map((product) => (
              <tr key={product.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl overflow-hidden border border-gray-200 shrink-0">
                      <img src={product.image} alt={product.name} loading="lazy" decoding="async" className="w-full h-full object-cover" />
                    </div>
                    <span className="font-bold text-gray-900 text-base">{product.name}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="space-y-1">
                    <div className="text-xs">
                      <span className="font-bold text-gray-600">Tailles: </span>
                      <span className="text-gray-700">
                        {Array.isArray(product.sizes) ? product.sizes.join(', ') : 
                         typeof product.sizes === 'string' ? JSON.parse(product.sizes).join(', ') : 'N/A'}
                      </span>
                    </div>
                    <div className="text-xs">
                      <span className="font-bold text-gray-600">Couleurs: </span>
                      <span className="text-gray-700">
                        {Array.isArray(product.colors) ? product.colors.join(', ') : 
                         typeof product.colors === 'string' ? JSON.parse(product.colors).join(', ') : 'N/A'}
                      </span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600 font-medium">{typeof product.price === 'number' ? product.price.toFixed(0) : product.price} GNF</td>
                <td className="px-6 py-4">
                  <input 
                    type="number" 
                    min="0"
                    value={product.stock}
                    onChange={(e) => handleStockChange(product.id, e.target.value)}
                    className="w-20 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 outline-none transition-all"
                  />
                </td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                    product.status === 'Active' ? 'bg-green-100 text-green-700' :
                    product.status === 'Low Stock' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {product.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button 
                      onClick={() => setEditingProduct(product)}
                      className="p-2 text-gray-400 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button 
                      onClick={() => handleDeleteProduct(product.id)}
                      className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Edit Product Modal */}
      <AnimatePresence>
        {editingProduct && (
          <EditProductModal
            product={editingProduct}
            onClose={() => setEditingProduct(null)}
          />
        )}
        {showAddModal && (
          <AddProductModal
            onClose={() => setShowAddModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default AdminProducts;
