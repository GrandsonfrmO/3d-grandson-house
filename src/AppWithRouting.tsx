import React, { useEffect, useState } from 'react';
import App from './App';
import { AdminUI } from './components/AdminUI';
import { AdminLoginPage } from './components/AdminLoginPage';
import { useStore } from './store';

export function AppWithRouting() {
  const [currentPage, setCurrentPage] = useState<'main' | 'admin'>('main');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  // Use store state directly instead of local state
  const storeScreens = useStore((state: any) => state.screens);
  const storePosters = useStore((state: any) => state.posters);
  const loadScreens = useStore((state: any) => state.loadScreens);
  const loadPosters = useStore((state: any) => state.loadPosters);
  const loadProducts = useStore((state: any) => state.loadProducts);
  
  // Local state for admin UI
  const [screens, setScreens] = useState(storeScreens);
  const [posters, setPosters] = useState(storePosters);

  // Load screens and posters from API on mount and set up polling
  useEffect(() => {
    loadScreens();
    loadPosters();
    loadProducts();
    
    // Poll for updates more frequently to keep data fresh
    // Faster polling (1 second) to ensure real-time updates
    const screensInterval = setInterval(() => {
      loadScreens();
    }, 1000);
    
    const postersInterval = setInterval(() => {
      loadPosters();
    }, 1000);

    const productsInterval = setInterval(() => {
      loadProducts();
    }, 2000); // Products can be slightly slower
    
    // Vérifier l'URL et le token au chargement
    const checkPath = () => {
      const path = window.location.pathname;
      const token = localStorage.getItem('adminToken');
      
      if (path === '/admin' || path === '/admin/') {
        setCurrentPage('admin');
        // Si on est sur /admin et qu'il y a un token, on reste connecté
        if (token) {
          setIsAdminLoggedIn(true);
        }
      } else {
        setCurrentPage('main');
      }
    };

    checkPath();

    // Écouter les changements d'URL
    const handlePopState = () => {
      checkPath();
    };

    window.addEventListener('popstate', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearInterval(screensInterval);
      clearInterval(postersInterval);
      clearInterval(productsInterval);
    };
  }, [loadScreens, loadPosters, loadProducts]);

  // Sync store data to local state whenever store updates
  useEffect(() => {
    setScreens(storeScreens);
  }, [storeScreens]);

  useEffect(() => {
    setPosters(storePosters);
  }, [storePosters]);

  if (currentPage === 'admin') {
    return (
      <div className="w-full min-h-screen bg-black">
        {isAdminLoggedIn ? (
          <div className="w-full">
            <AdminUI 
              onClose={() => {
                setIsAdminLoggedIn(false);
                localStorage.removeItem('adminToken');
                window.history.pushState({}, '', '/');
                setCurrentPage('main');
              }}
              screens={screens}
              setScreens={setScreens}
              posters={posters}
              setPosters={setPosters}
            />
          </div>
        ) : (
          <AdminLoginPage 
            onLoginSuccess={() => setIsAdminLoggedIn(true)} 
          />
        )}
      </div>
    );
  }

  return <App />;
}

export default AppWithRouting;