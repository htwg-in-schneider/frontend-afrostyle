<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const cartItems = ref([]);
const total = ref(0);

const loadCart = () => {
  const cart = JSON.parse(localStorage.getItem('cart')) || [];
  cartItems.value = cart;
  total.value = cart.reduce((acc, item) => acc + (item.price * item.quantity), 0);
};

const clearCart = () => {
  localStorage.removeItem('cart');
  loadCart();
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
            </tr>
          </thead>
          <tbody>
            <tr v-for="item in cartItems" :key="item.id">
              <td>{{ item.title }}</td>
              <td>{{ item.price }} €</td>
              <td>{{ item.quantity }}</td>
              <td><strong>{{ (item.price * item.quantity).toFixed(2) }} €</strong></td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="d-flex justify-content-between align-items-center">
        <h4>Gesamtsumme: <span class="text-accent">{{ total.toFixed(2) }} €</span></h4>
        <button @click="clearCart" class="btn btn-outline-danger">Warenkorb leeren</button>
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
</style>