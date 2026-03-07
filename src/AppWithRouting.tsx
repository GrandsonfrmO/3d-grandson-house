import React, { useEffect, useState } from 'react';
import App from './App';
import { AdminUI } from './components/AdminUI';
import { AdminLoginPage } from './components/AdminLoginPage';
import { useStore } from './store';

export function AppWithRouting() {
  // Changement de la page par défaut vers 'admin' pour l'affichage immédiat
  const [currentPage, setCurrentPage] = useState<'main' | 'admin'>('admin');
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  
  const storeScreens = useStore((state: any) => state.screens);
  const storePosters = useStore((state: any) => state.posters);
  const loadScreens = useStore((state: any) => state.loadScreens);
  const loadPosters = useStore((state: any) => state.loadPosters);
  const loadProducts = useStore((state: any) => state.loadProducts);
  
  const [screens, setScreens] = useState(storeScreens);
  const [posters, setPosters] = useState(storePosters);

  useEffect(() => {
    loadScreens();
    loadPosters();
    loadProducts();
    
    const screensInterval = setInterval(() => {
      loadScreens();
    }, 1000);
    
    const postersInterval = setInterval(() => {
      loadPosters();
    }, 1000);

    const productsInterval = setInterval(() => {
      loadProducts();
    }, 2000);
    
    const checkPath = () => {
      const path = window.location.pathname;
      const token = localStorage.getItem('adminToken');
      
      // On reste sur admin si c'est le souhait de l'utilisateur, 
      // ou si l'URL contient /admin
      if (path === '/admin' || path === '/admin/' || currentPage === 'admin') {
        setCurrentPage('admin');
        if (token) {
          setIsAdminLoggedIn(true);
        }
      } else {
        setCurrentPage('main');
      }
    };

    checkPath();

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
  }, [loadScreens, loadPosters, loadProducts, currentPage]);

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