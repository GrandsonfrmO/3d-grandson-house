import React, { useState, useEffect } from 'react';
import { adminAPI } from '../api/admin';
import './AdminPanel.css';

interface Product {
  id: number;
  name: string;
  price: number;
  stock: number;
  status: string;
  image?: string;
  description?: string;
  category?: string;
}

interface Order {
  id: string;
  customer: string;
  date: string;
  total: number;
  status: string;
}

interface Poster {
  id: string;
  room: string;
  location: string;
  image?: string;
  status: string;
}

interface Stats {
  productsCount: number;
  ordersCount: number;
  totalRevenue: number;
  recentOrders: Order[];
}

export function AdminPanel() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'products' | 'orders' | 'posters'>('dashboard');
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [posters, setPosters] = useState<Poster[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form states
  const [showProductForm, setShowProductForm] = useState(false);
  const [showPosterForm, setShowPosterForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [editingPoster, setEditingPoster] = useState<Poster | null>(null);

  useEffect(() => {
    loadData();
  }, [activeTab]);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (activeTab === 'dashboard') {
        const statsData = await adminAPI.getStats();
        setStats(statsData);
      } else if (activeTab === 'products') {
        const productsData = await adminAPI.getProducts();
        setProducts(productsData);
      } else if (activeTab === 'orders') {
        const ordersData = await adminAPI.getOrders();
        setOrders(ordersData);
      } else if (activeTab === 'posters') {
        const postersData = await adminAPI.getPosters();
        setPosters(postersData);
      }
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleAddProduct = async (product: Omit<Product, 'id'>) => {
    try {
      if (editingProduct) {
        await adminAPI.updateProduct(editingProduct.id.toString(), product);
        setEditingProduct(null);
      } else {
        await adminAPI.createProduct(product);
      }
      setShowProductForm(false);
      loadData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (window.confirm('Êtes-vous sûr?')) {
      try {
        await adminAPI.deleteProduct(id.toString());
        loadData();
      } catch (err) {
        setError((err as Error).message);
      }
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
    try {
      await adminAPI.updateOrderStatus(id, status);
      loadData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleAddPoster = async (poster: Omit<Poster, 'id'>) => {
    try {
      if (editingPoster) {
        await adminAPI.updatePoster(editingPoster.id, poster);
        setEditingPoster(null);
      } else {
        await adminAPI.createPoster({ id: Date.now().toString(), ...poster });
      }
      setShowPosterForm(false);
      loadData();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDeletePoster = async (id: string) => {
    if (window.confirm('Êtes-vous sûr?')) {
      try {
        await adminAPI.deletePoster(id);
        loadData();
      } catch (err) {
        setError((err as Error).message);
      }
    }
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

      {error && <div className="error-message">{error}</div>}
      {loading && <div className="loading">Chargement...</div>}

      {activeTab === 'dashboard' && stats && (
        <div className="dashboard">
          <div className="stats-grid">
            <div className="stat-card">
              <h3>Produits</h3>
              <p className="stat-value">{stats.productsCount}</p>
            </div>
            <div className="stat-card">
              <h3>Commandes</h3>
              <p className="stat-value">{stats.ordersCount}</p>
            </div>
            <div className="stat-card">
              <h3>Revenu Total</h3>
              <p className="stat-value">${stats.totalRevenue.toFixed(2)}</p>
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
                {stats.recentOrders.map(order => (
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
            onClick={() => {
              setEditingProduct(null);
              setShowProductForm(true);
            }}
          >
            + Ajouter Produit
          </button>

          {showProductForm && (
            <ProductForm
              product={editingProduct}
              onSave={handleAddProduct}
              onCancel={() => setShowProductForm(false)}
            />
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
                      className="btn-edit"
                      onClick={() => {
                        setEditingProduct(product);
                        setShowProductForm(true);
                      }}
                    >
                      Éditer
                    </button>
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
                <th>Actions</th>
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
                      <option>Cancelled</option>
                    </select>
                  </td>
                  <td>
                    <button className="btn-view">Voir</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {activeTab === 'posters' && (
        <div className="posters-section">
          <button
            className="btn-primary"
            onClick={() => {
              setEditingPoster(null);
              setShowPosterForm(true);
            }}
          >
            + Ajouter Affiche
          </button>

          {showPosterForm && (
            <PosterForm
              poster={editingPoster}
              onSave={handleAddPoster}
              onCancel={() => setShowPosterForm(false)}
            />
          )}

          <div className="posters-grid">
            {posters.map(poster => (
              <div key={poster.id} className="poster-card">
                {poster.image && <img src={poster.image} alt={poster.room} />}
                <h4>{poster.room}</h4>
                <p>{poster.location}</p>
                <div className="poster-actions">
                  <button
                    className="btn-edit"
                    onClick={() => {
                      setEditingPoster(poster);
                      setShowPosterForm(true);
                    }}
                  >
                    Éditer
                  </button>
                  <button
                    className="btn-delete"
                    onClick={() => handleDeletePoster(poster.id)}
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ProductForm({
  product,
  onSave,
  onCancel
}: {
  product: Product | null;
  onSave: (product: Omit<Product, 'id'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    name: product?.name || '',
    price: product?.price || 0,
    stock: product?.stock || 0,
    status: product?.status || 'Active',
    image: product?.image || '',
    description: product?.description || '',
    category: product?.category || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="product-form" onSubmit={handleSubmit}>
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
      <input
        type="text"
        placeholder="URL de l'image"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
      />
      <textarea
        placeholder="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
      />
      <input
        type="text"
        placeholder="Catégorie"
        value={formData.category}
        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">Enregistrer</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}

function PosterForm({
  poster,
  onSave,
  onCancel
}: {
  poster: Poster | null;
  onSave: (poster: Omit<Poster, 'id'>) => void;
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    room: poster?.room || '',
    location: poster?.location || '',
    image: poster?.image || '',
    status: poster?.status || 'Active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form className="poster-form" onSubmit={handleSubmit}>
      <input
        type="text"
        placeholder="Pièce"
        value={formData.room}
        onChange={(e) => setFormData({ ...formData, room: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="Localisation"
        value={formData.location}
        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
        required
      />
      <input
        type="text"
        placeholder="URL de l'image"
        value={formData.image}
        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
      />
      <div className="form-actions">
        <button type="submit" className="btn-primary">Enregistrer</button>
        <button type="button" className="btn-secondary" onClick={onCancel}>Annuler</button>
      </div>
    </form>
  );
}
