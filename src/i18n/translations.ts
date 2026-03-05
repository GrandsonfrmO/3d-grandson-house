// Traductions français
export const translations = {
  fr: {
    // Navigation
    nav: {
      explore: 'Explorer',
      play: 'Jouer',
      shop: 'Boutique',
      admin: 'Admin',
      cart: 'Panier',
      checkout: 'Passer la commande',
    },
    
    // Shop
    shop: {
      title: 'Boutique',
      addToCart: 'Ajouter au panier',
      price: 'Prix',
      quantity: 'Quantité',
      noProducts: 'Aucun produit disponible',
      addProduct: 'Ajouter un produit',
      editProduct: 'Modifier le produit',
      deleteProduct: 'Supprimer le produit',
      productName: 'Nom du produit',
      productDescription: 'Description',
      productPrice: 'Prix',
      productImage: 'Image',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
    },
    
    // Cart
    cart: {
      title: 'Panier',
      empty: 'Votre panier est vide',
      total: 'Total',
      checkout: 'Passer la commande',
      continueShopping: 'Continuer vos achats',
      removeItem: 'Retirer',
      quantity: 'Quantité',
    },
    
    // Checkout
    checkout: {
      title: 'Passer la commande',
      customerInfo: 'Informations client',
      name: 'Nom',
      email: 'Email',
      phone: 'Téléphone',
      address: 'Adresse',
      city: 'Ville',
      country: 'Pays',
      zipCode: 'Code postal',
      orderSummary: 'Résumé de la commande',
      subtotal: 'Sous-total',
      shipping: 'Livraison',
      tax: 'Taxe',
      total: 'Total',
      placeOrder: 'Passer la commande',
      orderPlaced: 'Commande passée avec succès',
      orderNumber: 'Numéro de commande',
    },
    
    // Admin
    admin: {
      title: 'Tableau de bord administrateur',
      dashboard: 'Tableau de bord',
      products: 'Produits',
      orders: 'Commandes',
      settings: 'Paramètres',
      users: 'Utilisateurs',
      analytics: 'Analytique',
      addProduct: 'Ajouter un produit',
      editProduct: 'Modifier le produit',
      deleteProduct: 'Supprimer le produit',
      viewOrders: 'Voir les commandes',
      orderStatus: 'Statut de la commande',
      pending: 'En attente',
      processing: 'En cours de traitement',
      shipped: 'Expédié',
      delivered: 'Livré',
      cancelled: 'Annulé',
    },
    
    // Game
    game: {
      score: 'Score',
      gameOver: 'Fin du jeu',
      playAgain: 'Rejouer',
      highScores: 'Meilleurs scores',
      playerName: 'Nom du joueur',
      submit: 'Soumettre',
    },
    
    // Common
    common: {
      loading: 'Chargement...',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Avertissement',
      info: 'Information',
      close: 'Fermer',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      yes: 'Oui',
      no: 'Non',
      confirm: 'Confirmer',
      logout: 'Déconnexion',
      login: 'Connexion',
      register: 'S\'inscrire',
    },
  },
};

export type TranslationKey = keyof typeof translations.fr;
