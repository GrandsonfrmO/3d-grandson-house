import { create } from 'zustand';
import { apiClient } from './api/client';
import { i18n } from './i18n';

export const useStore = create((set) => ({
  // Localization
  language: 'fr',
  setLanguage: (lang: string) => set({ language: lang }),
  currency: i18n.currency.code,
  setCurrency: (curr: string) => set({ currency: curr }),

  // Game State
  gameState: 'outside',
  setGameState: (state: string) => set({ gameState: state }),

  // Navigation Mode
  navMode: 'explore', // 'explore' or 'play'
  setNavMode: (mode: 'explore' | 'play') => set({ navMode: mode }),

  // Player State
  playerPosition: [0, 0, 9],
  setPlayerPosition: (pos: [number, number, number]) => set({ playerPosition: pos }),
  playerRotation: 0,
  setPlayerRotation: (rot: number) => set({ playerRotation: rot }),
  
  // Interaction State
  canInteract: false,
  interactionType: null, // 'pc', 'clothes', 'door', 'switch'
  interactionTarget: null,
  interactionText: '',
  setInteraction: (canInteract: boolean, type: string | null, target: string | null, text: string = '') => set({ canInteract, interactionType: type, interactionTarget: target, interactionText: text }),
  
  // Customization
  shirtColor: '#000000',
  pantsColor: '#333333',
  setShirtColor: (color: string) => set({ shirtColor: color }),
  setPantsColor: (color: string) => set({ pantsColor: color }),
  isCustomizing: false,
  setIsCustomizing: (val: boolean) => set({ isCustomizing: val }),
  
  // Mini-games
  isStudioGame: false,
  setIsStudioGame: (val: boolean) => set({ isStudioGame: val }),
  isCatGame: false,
  setIsCatGame: (val: boolean) => set({ isCatGame: val }),
  isBasketballGame: false,
  setIsBasketballGame: (val: boolean) => set({ isBasketballGame: val }),
  
  // Input State
  joystickMove: { x: 0, y: 0 },
  setJoystickMove: (move: { x: number, y: number }) => set({ joystickMove: move }),
  isJumping: false,
  setIsJumping: (val: boolean) => set({ isJumping: val }),
  isRunning: false,
  setIsRunning: (val: boolean) => set({ isRunning: val }),

  // API Data
  products: [],
  setProducts: (products: any) => set({ products }),
  
  posters: [],
  setPosters: (posters: any) => set({ posters }),

  screens: {
    pcLeft: null,
    pcMain: null,
    tv: null
  },
  setScreens: (screens: any) => set({ screens }),

  orders: [],
  setOrders: (orders: any) => set({ orders }),

  // Loading states
  isLoading: false,
  setIsLoading: (loading: boolean) => set({ isLoading: loading }),

  // Cart State
  cart: [] as Array<{ id: number; name: string; price: number; quantity: number; image: string }>,
  addToCart: (product: any) => set((state: any) => {
    const existingItem = state.cart.find((item: any) => item.id === product.id);
    if (existingItem) {
      return {
        cart: state.cart.map((item: any) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        ),
      };
    }
    return {
      cart: [...state.cart, { ...product, quantity: 1 }],
    };
  }),
  removeFromCart: (productId: number) => set((state: any) => ({
    cart: state.cart.filter((item: any) => item.id !== productId),
  })),
  updateCartQuantity: (productId: number, quantity: number) => set((state: any) => ({
    cart: state.cart.map((item: any) =>
      item.id === productId ? { ...item, quantity: Math.max(0, quantity) } : item
    ).filter((item: any) => item.quantity > 0),
  })),
  clearCart: () => set({ cart: [] }),
  getCartTotal: () => {
    const state = useStore.getState() as any;
    return state.cart.reduce((total: number, item: any) => total + (item.price * item.quantity), 0);
  },
  getCartCount: () => {
    const state = useStore.getState() as any;
    return state.cart.reduce((count: number, item: any) => count + item.quantity, 0);
  },

  // Async Actions
  loadProducts: async () => {
    try {
      set({ isLoading: true });
      const data = await apiClient.getProducts();
      set({ products: data });
    } catch (error) {
      console.error('Failed to load products:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadPosters: async () => {
    try {
      set({ isLoading: true });
      const data = await apiClient.getPosters();
      set({ posters: data });
    } catch (error) {
      console.error('Failed to load posters:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadOrders: async () => {
    try {
      set({ isLoading: true });
      const data = await apiClient.getOrders();
      set({ orders: data });
    } catch (error) {
      console.error('Failed to load orders:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  loadScreens: async () => {
    try {
      set({ isLoading: true });
      const data = await apiClient.getScreens();
      if (data && data.length > 0) {
        const screenMap: any = {
          pcLeft: null,
          pcMain: null,
          tv: null
        };
        
        // Override with database values
        data.forEach((screen: any) => {
          screenMap[screen.id] = screen.image;
        });
        set({ screens: screenMap });
      }
    } catch (error) {
      console.error('Failed to load screens:', error);
    } finally {
      set({ isLoading: false });
    }
  },

  createProduct: async (product: any) => {
    try {
      const newProduct = await apiClient.createProduct(product);
      set((state: any) => ({ products: [...state.products, newProduct] }));
      return newProduct;
    } catch (error) {
      console.error('Failed to create product:', error);
      throw error;
    }
  },

  updateProduct: async (id: number, product: any) => {
    try {
      const updated = await apiClient.updateProduct(id, product);
      set((state: any) => ({
        products: state.products.map((p: any) => p.id === id ? updated : p)
      }));
      return updated;
    } catch (error) {
      console.error('Failed to update product:', error);
      throw error;
    }
  },

  deleteProduct: async (id: number) => {
    try {
      await apiClient.deleteProduct(id);
      set((state: any) => ({
        products: state.products.filter((p: any) => p.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete product:', error);
      throw error;
    }
  },

  updatePoster: async (id: string, poster: any) => {
    try {
      const updated = await apiClient.updatePoster(id, poster);
      set((state: any) => ({
        posters: state.posters.map((p: any) => p.id === id ? updated : p)
      }));
      return updated;
    } catch (error) {
      console.error('Failed to update poster:', error);
      throw error;
    }
  },

  deletePoster: async (id: string) => {
    try {
      await apiClient.deletePoster(id);
      set((state: any) => ({
        posters: state.posters.filter((p: any) => p.id !== id)
      }));
    } catch (error) {
      console.error('Failed to delete poster:', error);
      throw error;
    }
  },

  updateScreen: async (id: string, image: string) => {
    try {
      const updated = await apiClient.updateScreen(id, image);
      set((state: any) => ({
        screens: { ...state.screens, [id]: image }
      }));
      return updated;
    } catch (error) {
      console.error('Failed to update screen:', error);
      throw error;
    }
  },

  createOrder: async (order: any) => {
    try {
      const newOrder = await apiClient.createOrder(order);
      set((state: any) => ({ orders: [...state.orders, newOrder] }));
      return newOrder;
    } catch (error) {
      console.error('Failed to create order:', error);
      throw error;
    }
  },

  updateOrderStatus: async (id: string, status: string) => {
    try {
      const updated = await apiClient.updateOrderStatus(id, status);
      set((state: any) => ({
        orders: state.orders.map((o: any) => o.id === id ? { ...o, status } : o)
      }));
      return updated;
    } catch (error) {
      console.error('Failed to update order status:', error);
      throw error;
    }
  },

  saveGameScore: async (gameName: string, playerName: string, score: number) => {
    try {
      return await apiClient.saveGameScore(gameName, playerName, score);
    } catch (error) {
      console.error('Failed to save game score:', error);
      throw error;
    }
  },

  getGameScores: async (gameName: string) => {
    try {
      return await apiClient.getGameScores(gameName);
    } catch (error) {
      console.error('Failed to get game scores:', error);
      throw error;
    }
  },

  // Game Scores State
  gameScores: {} as Record<string, any[]>,
  setGameScores: (gameName: string, scores: any[]) => set((state: any) => ({
    gameScores: { ...state.gameScores, [gameName]: scores },
  })),

  // Fetch and cache game scores
  fetchGameScores: async (gameName: string) => {
    try {
      const scores = await apiClient.getGameScores(gameName);
      set((state: any) => ({
        gameScores: { ...state.gameScores, [gameName]: scores },
      }));
      return scores;
    } catch (error) {
      console.error('Failed to fetch game scores:', error);
      throw error;
    }
  },

  // Admin Authentication
  isAdminAuthenticated: false,
  adminAuthError: '',
  setAdminAuthenticated: (authenticated: boolean) => set({ isAdminAuthenticated: authenticated, adminAuthError: '' }),
  setAdminAuthError: (error: string) => set({ adminAuthError: error }),
  
  authenticateAdmin: (username: string, password: string) => {
    // Default credentials - in production, this should be validated against a backend
    const ADMIN_USERNAME = 'admin';
    const ADMIN_PASSWORD = 'admin123';
    
    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      set({ isAdminAuthenticated: true, adminAuthError: '' });
      // Store auth token in sessionStorage (cleared when browser closes)
      sessionStorage.setItem('adminToken', 'authenticated');
      return true;
    } else {
      set({ adminAuthError: 'Identifiant ou mot de passe incorrect' });
      return false;
    }
  },

  logoutAdmin: () => {
    set({ isAdminAuthenticated: false, adminAuthError: '' });
    sessionStorage.removeItem('adminToken');
  },

  // Check if admin is already authenticated (on app load)
  checkAdminAuth: () => {
    const token = sessionStorage.getItem('adminToken');
    if (token) {
      set({ isAdminAuthenticated: true });
    }
  },
}));
