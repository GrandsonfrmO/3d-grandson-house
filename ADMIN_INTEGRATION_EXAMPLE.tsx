// Exemple d'intégration du panneau admin dans App.tsx

import React, { useState, useEffect } from 'react';
import { AdminPanel } from './src/components/AdminPanel';
import { AdminLoginPage } from './src/components/AdminLoginPage';
import YourMainApp from './src/App'; // Votre app principale

export function AppWithAdmin() {
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Vérifier si l'utilisateur est déjà connecté au démarrage
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdminLoggedIn(true);
    }
    setIsCheckingAuth(false);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
  };

  if (isCheckingAuth) {
    return <div>Chargement...</div>;
  }

  return (
    <>
      {isAdminLoggedIn ? (
        <div>
          <AdminPanel />
          <button
            onClick={handleLogout}
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 1000
            }}
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <AdminLoginPage onLoginSuccess={() => setIsAdminLoggedIn(true)} />
      )}
    </>
  );
}

// Alternative: Ajouter un bouton pour accéder à l'admin depuis l'app principale
export function AppWithAdminToggle() {
  const [showAdmin, setShowAdmin] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAdminLoggedIn(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setIsAdminLoggedIn(false);
    setShowAdmin(false);
  };

  return (
    <>
      {showAdmin ? (
        <div>
          <AdminPanel />
          <button
            onClick={handleLogout}
            style={{
              position: 'fixed',
              top: 20,
              right: 20,
              padding: '10px 20px',
              background: '#dc3545',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              zIndex: 1000
            }}
          >
            Déconnexion
          </button>
        </div>
      ) : (
        <>
          <YourMainApp />
          {isAdminLoggedIn && (
            <button
              onClick={() => setShowAdmin(true)}
              style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                padding: '10px 20px',
                background: '#007bff',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                zIndex: 1000
              }}
            >
              Admin
            </button>
          )}
          {!isAdminLoggedIn && (
            <button
              onClick={() => setShowAdmin(true)}
              style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                padding: '10px 20px',
                background: '#6c757d',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                zIndex: 1000
              }}
            >
              Admin Login
            </button>
          )}
        </>
      )}
    </>
  );
}

// Utilisation:
// export default AppWithAdmin;
// ou
// export default AppWithAdminToggle;
