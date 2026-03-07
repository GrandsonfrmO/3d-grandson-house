const API_BASE = '/api';

const getAdminAuthHeader = () => {
  const token = typeof window !== 'undefined' ? localStorage.getItem('adminToken') : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const adminAPI = {
  // Auth
  login: async (username: string, password: string) => {
    const response = await fetch(`${API_BASE}/admin/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Identifiants invalides');
    }
    return response.json();
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE}/admin/products`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Échec de la récupération des produits');
    return response.json();
  },

  createProduct: async (product: any) => {
    const response = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Échec de la création du produit');
    return response.json();
  },

  updateProduct: async (id: string, product: any) => {
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Échec de la mise à jour du produit');
    return response.json();
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Échec de la suppression du produit');
    return response.json();
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE}/admin/orders`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Échec de la récupération des commandes');
    return response.json();
  },

  getOrder: async (id: string) => {
    const response = await fetch(`${API_BASE}/admin/orders/${id}`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Échec de la récupération de la commande');
    return response.json();
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/admin/orders/${id}`, {
      method: 'PUT',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Échec de la mise à jour de la commande');
    return response.json();
  },

  // Posters
  getPosters: async () => {
    const response = await fetch(`${API_BASE}/admin/posters`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Échec de la récupération des affiches');
    return response.json();
  },

  createPoster: async (poster: any) => {
    const response = await fetch(`${API_BASE}/admin/posters`, {
      method: 'POST',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(poster)
    });
    if (!response.ok) throw new Error('Échec de la création de l\'affiche');
    return response.json();
  },

  updatePoster: async (id: string, poster: any) => {
    const response = await fetch(`${API_BASE}/admin/posters/${id}`, {
      method: 'PUT',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(poster)
    });
    if (!response.ok) throw new Error('Échec de la mise à jour de l\'affiche');
    return response.json();
  },

  deletePoster: async (id: string) => {
    const response = await fetch(`${API_BASE}/admin/posters/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Échec de la suppression de l\'affiche');
    return response.json();
  },

  // Screens
  getScreens: async () => {
    const response = await fetch(`${API_BASE}/admin/screens`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Échec de la récupération des écrans');
    return response.json();
  },

  updateScreen: async (id: string, screen: any) => {
    const response = await fetch(`${API_BASE}/admin/screens/${id}`, {
      method: 'PUT',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(screen)
    });
    if (!response.ok) throw new Error('Échec de la mise à jour de l\'écran');
    return response.json();
  },

  // Stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Échec de la récupération des statistiques');
    return response.json();
  }
};