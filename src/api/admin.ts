import { getAuthHeader } from './client';

const API_BASE = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

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
    if (!response.ok) throw new Error('Login failed');
    return response.json();
  },

  // Products
  getProducts: async () => {
    const response = await fetch(`${API_BASE}/admin/products`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch products');
    return response.json();
  },

  createProduct: async (product: any) => {
    const response = await fetch(`${API_BASE}/admin/products`, {
      method: 'POST',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to create product');
    return response.json();
  },

  updateProduct: async (id: string, product: any) => {
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'PUT',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(product)
    });
    if (!response.ok) throw new Error('Failed to update product');
    return response.json();
  },

  deleteProduct: async (id: string) => {
    const response = await fetch(`${API_BASE}/admin/products/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete product');
    return response.json();
  },

  // Orders
  getOrders: async () => {
    const response = await fetch(`${API_BASE}/admin/orders`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch orders');
    return response.json();
  },

  getOrder: async (id: string) => {
    const response = await fetch(`${API_BASE}/admin/orders/${id}`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch order');
    return response.json();
  },

  updateOrderStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE}/admin/orders/${id}`, {
      method: 'PUT',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
    if (!response.ok) throw new Error('Failed to update order');
    return response.json();
  },

  // Posters
  getPosters: async () => {
    const response = await fetch(`${API_BASE}/admin/posters`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch posters');
    return response.json();
  },

  createPoster: async (poster: any) => {
    const response = await fetch(`${API_BASE}/admin/posters`, {
      method: 'POST',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(poster)
    });
    if (!response.ok) throw new Error('Failed to create poster');
    return response.json();
  },

  updatePoster: async (id: string, poster: any) => {
    const response = await fetch(`${API_BASE}/admin/posters/${id}`, {
      method: 'PUT',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(poster)
    });
    if (!response.ok) throw new Error('Failed to update poster');
    return response.json();
  },

  deletePoster: async (id: string) => {
    const response = await fetch(`${API_BASE}/admin/posters/${id}`, {
      method: 'DELETE',
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to delete poster');
    return response.json();
  },

  // Screens
  getScreens: async () => {
    const response = await fetch(`${API_BASE}/admin/screens`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch screens');
    return response.json();
  },

  updateScreen: async (id: string, screen: any) => {
    const response = await fetch(`${API_BASE}/admin/screens/${id}`, {
      method: 'PUT',
      headers: { ...getAdminAuthHeader(), 'Content-Type': 'application/json' },
      body: JSON.stringify(screen)
    });
    if (!response.ok) throw new Error('Failed to update screen');
    return response.json();
  },

  // Stats
  getStats: async () => {
    const response = await fetch(`${API_BASE}/admin/stats`, {
      headers: getAdminAuthHeader()
    });
    if (!response.ok) throw new Error('Failed to fetch stats');
    return response.json();
  }
};
