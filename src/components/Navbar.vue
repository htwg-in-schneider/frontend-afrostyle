<script setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'; // 1. Importation

const cartCount = ref(0);

// 2. Récupération des outils Auth0
const { loginWithRedirect, logout, user, isAuthenticated, isLoading } = useAuth0();

const updateCartCount = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartCount.value = cart.reduce((acc, item) => acc + item.quantity, 0);
};

onMounted(() => {
  updateCartCount();
  setInterval(updateCartCount, 1000);
});

// Fonction pour gérer la déconnexion
const handleLogout = () => {
  const confirmed = confirm("Voulez-vous vraiment vous déconnecter ? Votre panier sera vidé.");
  
  if (confirmed) {
    // 1. Supprimer les données du panier dans le localStorage
    localStorage.removeItem('cart');
    
    // 2. Optionnel : Si vous voulez forcer la mise à jour immédiate de cartCount à 0
    if (typeof cartCount !== 'undefined') {
      cartCount.value = 0;
    }

    // 3. Procéder à la déconnexion Auth0
    logout({ 
      logoutParams: { 
        returnTo: window.location.origin 
      } 
    });
  }
};
</script>

<template>      
  <header class="main-header">  
    <div class="header-top-bar">
      <div class="container d-flex justify-content-between align-items-center">
        <router-link to="/" class="logo-wrapper">
          <img src="../assets/logo_Desktop.svg" alt="afroStslyle Logo" class="logo-img">
        </router-link>

        <div class="ellipse-container">
          <img src="../assets/Ellipse1.svg" alt="" class="nav-shape-ellipse">
        </div>

        <div class="header-icons">
          <router-link to="/products" class="icon-link"><i class="bi bi-search"></i></router-link>
          
          <router-link to="/panier" class="icon-link position-relative">
            <i class="bi bi-cart"></i>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>

          <div v-if="!isLoading">
            <a v-if="!isAuthenticated" href="#" @click.prevent="loginWithRedirect" class="icon-link">
              <i class="bi bi-person-circle"></i>
            </a>

            <div v-else class="d-flex align-items-center gap-2">
              <span class="user-name">{{ user.nickname }}</span>
              <img :src="user.picture" class="user-avatar" alt="Profil">
              <a href="#" @click.prevent="handleLogout" class="icon-link logout-icon">
                <i class="bi bi-box-arrow-right"></i>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>

    <nav class="secondary-nav">
      <div class="container">
        <ul class="nav-links-list">
          <li><router-link to="/" class="custom-text">Textile_Stoffe</router-link></li>
          <li><a href="#" class="custom-text">Bekleidung</a></li>
          <li><a href="#" class="custom-text">Accessoires</a></li>
          <li><a href="#" class="custom-text">Home</a></li>
          <template v-if="isAuthenticated">
            <li class="admin-separator">|</li>
            <li><router-link to="/admin/users" class="custom-text admin-link">Users</router-link></li>
            <li><router-link to="/admin/transaktionen" class="custom-text admin-link">Transaktionen</router-link></li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* Tes styles existants ... */

.user-avatar {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 1px solid #EA9424;
}

.user-name {
  font-size: 0.9rem;
  font-weight: bold;
  color: #333;
}

.logout-icon {
  font-size: 1.2rem !important;
  color: #dc3545 !important; /* Couleur rouge pour la déconnexion */
}

/* On garde tout le reste de ton CSS identique */
.main-header { width: 100%; background-color: #fff; }
.header-top-bar { height: 100px; display: flex; align-items: center; border-bottom: 1px solid #f0f0f0; }
.logo-img { height: 70px; width: auto; }
.header-icons { display: flex; gap: 25px; align-items: center; }
.icon-link { font-size: 1.5rem; color: #000 !important; text-decoration: none; display: flex; align-items: center; justify-content: center; transition: transform 0.2s; position: relative; }
.cart-badge { position: absolute; top: -8px; right: -10px; background-color: #EA9424; color: white; font-size: 0.75rem; font-weight: bold; padding: 2px 6px; border-radius: 50%; border: 2px solid white; min-width: 20px; text-align: center; }
.icon-link:hover { transform: scale(1.1); color: #EA9424 !important; }
.secondary-nav { background-color: #fff; padding: 15px 0; }
.nav-links-list { display: flex; justify-content: center; gap: 40px; list-style: none; margin: 0; padding: 0; }
.custom-text { font-family: 'La Belle Aurore', cursive; color: #EA9424; font-size: 26px; text-decoration: none; text-shadow: 1px 1px 0 #000; }
.admin-separator { color: #ccc; font-size: 20px; }
</style>