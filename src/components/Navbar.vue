<script setup>
import { ref, onMounted, watch, computed } from 'vue'; // Ajout de computed
import { useAuth0 } from '@auth0/auth0-vue'; 
import { useRouter } from 'vue-router';

const { loginWithRedirect, logout, user, isAuthenticated, isLoading, getAccessTokenSilently } = useAuth0();
const cartCount = ref(0);
const isAdmin = ref(false);
const router = useRouter();
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080';

// --- CLÉ DYNAMIQUE DU PANIER ---
// On calcule la clé de la même manière que dans le panier et les produits
const cartKey = computed(() => {
  return isAuthenticated.value && user.value ? `cart_${user.value.sub}` : 'cart_guest';
});

async function checkAdminRole() {
  if (!isAuthenticated.value) {
    isAdmin.value = false;
    return;
  }
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      const data = await response.json();
      isAdmin.value = data.role === 'ADMIN'; 
    }
  } catch (error) {
    console.error('Erreur vérification rôle:', error);
    isAdmin.value = false;
  }
}

// --- GESTION DU PANIER ---
const updateCartCount = () => {
  // On utilise cartKey.value au lieu de la clé fixe 'cart'
  const cart = JSON.parse(localStorage.getItem(cartKey.value)) || [];
  cartCount.value = cart.reduce((acc, item) => acc + item.quantity, 0);
};

// RÉACTIVITÉ : On surveille le changement d'utilisateur pour rafraîchir le badge
watch([isAuthenticated, user], async ([newAuth]) => {
  if (newAuth) {
    await checkAdminRole();
  } else {
    isAdmin.value = false;
  }
  // TRÈS IMPORTANT : Quand on change d'utilisateur (ou logout), on recalcule le badge
  updateCartCount(); 
}, { immediate: true });

onMounted(() => {
  updateCartCount();
  window.addEventListener('cart-updated', updateCartCount);
});

const handleLogout = async () => {
  if (confirm("Voulez-vous vraiment vous déconnecter ?")) {
    // Note : On ne vide pas forcément le localStorage ici pour que 
    // l'utilisateur retrouve son panier à sa prochaine connexion !
    await logout({ 
      logoutParams: { returnTo: window.location.origin } 
    });
  }
};
</script>

<template>      
  <header class="main-header">
    <div v-if="isAuthenticated" style="background: #ededed; color: black; padding: 20px; font-family: monospace; z-index: 9999; position: relative;">
      <p>--- DEBUG ADMIN ---</p>
      <p>Email: {{ user.email }}</p>
      <p>Contenu du namespace: {{ user['https://afrostyle-api/role'] }}</p>
      <p>Est Admin (résultat calculé): {{ isAdmin }}</p>
    </div>  
    <div class="header-top-bar">
      <div class="container d-flex justify-content-between align-items-center">
        <router-link to="/" class="logo-wrapper">
          <img src="../assets/logo_Desktop.svg" alt="afroStslyle Logo" class="logo-img">
        </router-link>

        <div class="ellipse-container">
          <img src="../assets/Ellipse1.svg" alt="" class="nav-shape-ellipse">
        </div>

        <div class="header-icons d-flex align-items-center gap-3">
          <router-link to="/products" class="icon-link"><i class="bi bi-search"></i></router-link>
          
          <router-link to="/panier" class="icon-link position-relative">
            <i class="bi bi-cart"></i>
            <span v-if="cartCount > 0" class="cart-badge">{{ cartCount }}</span>
          </router-link>

          <div v-if="!isLoading">
            <a v-if="!isAuthenticated" href="#" @click.prevent="loginWithRedirect" class="icon-link">
              <i class="bi bi-person-circle"></i>
            </a>

            <div v-else class="d-flex align-items-center gap-3">
              <router-link to="/profile" class="d-flex align-items-center gap-2 text-decoration-none">
                <span class="user-name">{{ user.nickname }}</span>
                <img :src="user.picture" class="user-avatar" alt="Profil">
              </router-link>

              <a href="#" @click.prevent="handleLogout" class="icon-link logout-icon" title="Déconnexion">
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
          <li><router-link to="/products" class="custom-text">Textile_Stoffe</router-link></li>
          <li><router-link to="/products" class="custom-text">Bekleidung</router-link></li>
          <li><router-link to="/products" class="custom-text">Accessoires</router-link></li>
          <li><router-link to="/products" class="custom-text">Home_Artikeln</router-link></li>
          
          <template v-if="isAdmin">
            <li class="admin-separator">|</li>
            <li><router-link to="/admin/users" class="custom-text admin-link text-danger">Users 🛡️</router-link></li>
            <li><router-link to="/admin/transaktionen" class="custom-text admin-link text-danger">Transactions</router-link></li>
          </template>
        </ul>
      </div>
    </nav>
  </header>
</template>

<style scoped>
/* Conserve tout ton CSS original */
.user-avatar { width: 35px; height: 35px; border-radius: 50%; border: 2px solid #EA9424; object-fit: cover; }
.user-name { font-size: 0.9rem; font-weight: bold; color: #333; }
.logout-icon { font-size: 1.4rem !important; color: #dc3545 !important; }
.admin-link { color: #8b0000 !important; } /* Un rouge foncé pour distinguer l'admin */

/* ... Reste de tes styles ... */
.nav-links-list { display: flex; justify-content: center; align-items: center; gap: 30px; list-style: none; margin: 0; padding: 0; }
.custom-text { font-family: 'La Belle Aurore', cursive; color: #EA9424; font-size: 24px; text-decoration: none; text-shadow: 1px 1px 0 #000; }
.admin-separator { color: #ccc; font-size: 20px; font-weight: bold; }
</style>