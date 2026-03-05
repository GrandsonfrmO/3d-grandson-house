import React, { useState } from 'react';
import './AdminPanel.css';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
}

export function AdminPanelSimple() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'posters'>('dashboard');
  const [products, setProducts] = useState<Product[]>([
    { id: 1, name: 'Produit Test', price: 99.99, stock: 10, status: 'Active' }
  ]);
  const [orders, setOrders] = useState<Order[]>([
    { id: 'order-1', customer: 'Client Test', date: new Date().toISOString(), total: 299.99, status: 'Pending' }
  ]);
  const [showProductForm, setShowProductForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    price: 0,
    stock: 0,
    status: 'Active'
  });

  const handleAddProduct = () => {
    if (formData.name && formData.price > 0) {
      setProducts([...products, {
        id: products.length + 1,
        ...formData
      }]);
      setFormData({ name: '', price: 0, stock: 0, status: 'Active' });
      setShowProductForm(false);
    }
  };

  const handleDeleteProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  const handleUpdateOrderStatus = (id: string, status: string) => {
    setOrders(orders.map(o => o.id === id ? { ...o, status } : o));
  };

  return (
    <div className="admin-panel">
      <div className="admin-header">
        <h1>Panneau d'Administration</h1>
        <div className="admin-tabs">
          <button
            className={`tab ${activeTab === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            Tableau de Bord
          </button>
          <button
            className={`tab ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            Produits
          </button>
          <button
            className={`tab ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            Commandes
          </button>
          <button
            className={`tab ${activeTab === 'posters' ? 'active' : ''}`}
            onClick={() => setActiveTab('posters')}
          >
            Affiches
          </button>
        </div>
      </div>

      {activeTab === 'dashboard' && (
        <div className="dashboard">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Produits</h3>
              <p className="stat-value">{products.length}</p>
            </div>
            <div className="stat-card">
              <h3>Commandes</h3>
              <p className="stat-value">{orders.length}</p>
            </div>
            <div className="stat-card">
              <h3>Revenu Total</h3>
              <p className="stat-value">${orders.reduce((sum, o) => sum + o.total, 0).toFixed(2)}</p>
            </div>
          </div>

          <div className="recent-orders">
            <h3>Commandes Récentes</h3>
            <table>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Client</th>
                  <th>Total</th>
                  <th>Statut</th>
                </tr>
              </thead>
              <tbody>
                {orders.map(order => (
                  <tr key={order.id}>
                    <td>{order.id}</td>
                    <td>{order.customer}</td>
                    <td>${order.total.toFixed(2)}</td>
                    <td>{order.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="products-section">
          <button
            className="btn-primary"
            onClick={() => setShowProductForm(true)}
          >
            + Ajouter Produit
          </button>

          {showProductForm && (
            <form className="product-form" onSubmit={(e) => {
              e.preventDefault();
              handleAddProduct();
            }}>
              <input
                type="text"
                placeholder="Nom du produit"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
              />
              <input
                type="number"
                placeholder="Prix"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                required
              />
              <input
                type="number"
                placeholder="Stock"
                value={formData.stock}
                onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
                required
              />
              <div className="form-actions">
                <button type="submit" className="btn-primary">Enregistrer</button>
                <button type="button" className="btn-secondary" onClick={() => setShowProductForm(false)}>Annuler</button>
              </div>
            </form>
          )}

          <table className="products-table">
            <thead>
              <tr>
                <th>Nom</th>
                <th>Prix</th>
                <th>Stock</th>
                <th>Statut</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map(product => (
                <tr key={product.id}>
                  <td>{product.name}</td>
                  <td>${product.price.toFixed(2)}</td>
                  <td>{product.stock}</td>
                  <td>{product.status}</td>
                  <td>
                    <button
                      className="btn-delete"
                      onClick={() => handleDeleteProduct(product.id)}
                    >
                      Supprimer
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'orders' && (
        <div className="orders-section">
          <table className="orders-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Client</th>
                <th>Date</th>
                <th>Total</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {orders.map(order => (
                <tr key={order.id}>
                  <td>{order.id}</td>
                  <td>{order.customer}</td>
                  <td>{new Date(order.date).toLocaleDateString()}</td>
                  <td>${order.total.toFixed(2)}</td>
                  <td>
                    <select
                      value={order.status}
                      onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                    >
                      <option>Pending</option>
                      <option>Processing</option>
                      <option>Shipped</option>
                      <option>Delivered</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'posters' && (
        <div className="posters-section">
          <p>Gestion des affiches - À implémenter</p>
        </div>
      )}
    </div>
  );
}
