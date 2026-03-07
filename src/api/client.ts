const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export const getAuthHeader = () => {
  const token = typeof window !== 'undefined' 
    ? (localStorage.getItem('authToken') || localStorage.getItem('adminToken')) 
    : null;
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};

export const apiClient = {
  // Auth
  async login(username: string, password: string) {
    const res = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    });
    return res.json();
  },

  // Products
  async getProducts() {
    const res = await fetch(`${API_BASE_URL}/products`);
    return res.json();
  },

  async createProduct(product: any) {
    const res = await fetch(`${API_BASE_URL}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  async updateProduct(id: number, product: any) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(product),
    });
    return res.json();
  },

  async deleteProduct(id: number) {
    const res = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Posters
  async getPosters() {
    const res = await fetch(`${API_BASE_URL}/posters`);
    return res.json();
  },

  async updatePoster(id: string, poster: any) {
    const res = await fetch(`${API_BASE_URL}/posters/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify(poster),
    });
    return res.json();
  },

  async deletePoster(id: string) {
    const res = await fetch(`${API_BASE_URL}/posters/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
    });
    return res.json();
  },

  // Screens
  async getScreens() {
    const res = await fetch(`${API_BASE_URL}/screens`);
    return res.json();
  },

  async updateScreen(id: string, image: string) {
    const res = await fetch(`${API_BASE_URL}/screens/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ image }),
    });
    return res.json();
  },

  // Orders
  async getOrders() {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      headers: getAuthHeader()
    });
    return res.json();
  },

  async createOrder(order: any) {
    const res = await fetch(`${API_BASE_URL}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(order),
    });
    return res.json();
  },

  async updateOrderStatus(id: string, status: string) {
    const res = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', ...getAuthHeader() },
      body: JSON.stringify({ status }),
    });
    return res.json();
  },

  // Game Scores
  async getGameScores(gameName: string) {
    const res = await fetch(`${API_BASE_URL}/game-scores/${gameName}`);
    return res.json();
  },

  async saveGameScore(gameName: string, playerName: string, score: number) {
    const res = await fetch(`${API_BASE_URL}/game-scores`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ game_name: gameName, player_name: playerName, score }),
    });
    return res.json();
  },
};