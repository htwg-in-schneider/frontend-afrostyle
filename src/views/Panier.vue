<script setup>
import { ref, onMounted, computed } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'; // Import indispensable
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const { user, isAuthenticated } = useAuth0();
const cartItems = ref([]);
const total = ref(0);

// Génère une clé unique pour le localStorage (ex: cart_auth0|12345)
// Si non connecté, on utilise une clé temporaire 'cart_guest'
const cartKey = computed(() => {
  return isAuthenticated.value ? `cart_${user.value.sub}` : 'cart_guest';
});

const notifyCartUpdate = () => {
  window.dispatchEvent(new CustomEvent('cart-updated'));
};

const loadCart = () => {
  const cart = JSON.parse(localStorage.getItem(cartKey.value)) || [];
  cartItems.value = cart;
  calculateTotal();
};

const calculateTotal = () => {
  total.value = cartItems.value.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const removeItem = (id) => {
  cartItems.value = cartItems.value.filter(item => item.id !== id);
  localStorage.setItem(cartKey.value, JSON.stringify(cartItems.value));
  calculateTotal();
  notifyCartUpdate();
};

const updateQuantity = (id, delta) => {
  const item = cartItems.value.find(i => i.id === id);
  if (item) {
    item.quantity += delta;
    if (item.quantity <= 0) {
      removeItem(id);
    } else {
      localStorage.setItem(cartKey.value, JSON.stringify(cartItems.value));
      calculateTotal();
      notifyCartUpdate();
    }
  }
};

const handleCheckout = () => {
  if (!isAuthenticated.value) {
    alert("Bitte loggen Sie sich ein, um den Kauf abzuschließen.");
    return;
  }
  alert(`Vielen Dank, ${user.value.name}! Ihr Kauf wurde bestätigt.`);
  localStorage.removeItem(cartKey.value);
  notifyCartUpdate();
};

const clearCart = () => {
  if (confirm("Möchten Sie den gesamten Warenkorb leeren?")) {
    localStorage.removeItem(cartKey.value);
    cartItems.value = [];
    total.value = 0;
    notifyCartUpdate();
  }
};

onMounted(loadCart);
</script>

<template>
  <Navbar />
  <div class="container mt-5 py-5">
    <h2 class="mb-4">Mein Warenkorb</h2>
    
    <div v-if="cartItems.length > 0">
      <div class="table-responsive shadow-sm rounded border bg-white mb-4">
        <table class="table align-middle">
          <thead class="table-light">
            <tr>
              <th>Produkt</th>
              <th>Preis</th>
              <th>Anzahl</th>
              <th>Gesamt</th>
              <th>Aktion</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.price }} €</td>
              <td>
                <div class="d-flex justify-content-center align-items-center">
                  <button @click="updateQuantity(item.id, -1)" class="btn btn-sm btn-outline-secondary">-</button>
                  <span class="mx-3 fw-bold">{{ item.quantity }}</span>
                  <button @click="updateQuantity(item.id, 1)" class="btn btn-sm btn-outline-secondary">+</button>
                </div>
              </td>
              <td><strong>{{ (item.price * item.quantity).toFixed(2) }} €</strong></td>
              <td>
                <button @click="removeItem(item.id)" class="btn btn-sm btn-link text-danger">
                  <i class="bi bi-trash fs-5"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="d-flex justify-content-between align-items-center">
        <h4>Gesamtsumme: <span class="text-accent">{{ total.toFixed(2) }} €</span></h4>
        <div class="d-flex gap-3">
            <button @click="clearCart" class="btn btn-outline-danger">Warenkorb leeren</button>
            <router-link to="/" class="btn btn-success px-4" @click="handleCheckout">
                <i class="bi bi-check-circle me-2"></i>Kasse
            </router-link>
        </div>
      </div>
    </div>

    <div v-else class="text-center py-5">
      <i class="bi bi-cart-x fs-1 text-muted"></i>
      <p class="mt-3">Ihr Warenkorb ist leer.</p>
      <router-link to="/" class="btn btn-warning">Weiter einkaufen</router-link>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.text-accent { color: #EA9424; font-weight: bold; }
.btn-success {
  background-color: #EA9424;
  border-color: #333;
}
</style>