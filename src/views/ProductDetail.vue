<script setup>
  import Footer from '@/components/Footer.vue';
  import Navbar from '@/components/Navbar.vue';
  import NavButton from '@/components/NavButton.vue';
  import Button from '@/components/Button.vue';
  import { ref, onMounted, computed } from 'vue'; // Ajout de computed
  import { useRouter } from 'vue-router';
  import { useAuth0 } from '@auth0/auth0-vue';

  const url = `${import.meta.env.VITE_API_BASE_URL}/api/product`;
  const transactionUrl = `${import.meta.env.VITE_API_BASE_URL}/api/transaktionen`;
  const profileUrl = `${import.meta.env.VITE_API_BASE_URL}/api/profile`;
  
  const { getAccessTokenSilently, isAuthenticated, user } = useAuth0();
  const isAdmin = ref(false);

  const props = defineProps({
      id: {
          type: [String, Number],
          required: true
      }
  });

  const product = ref(null);
  const router = useRouter();

  // CLÉ DYNAMIQUE : Le panier est rattaché à l'ID de l'utilisateur
  // Si non connecté, on utilise 'cart_guest'
  const cartKey = computed(() => {
    return isAuthenticated.value && user.value ? `cart_${user.value.sub}` : 'cart_guest';
  });

  const notifyCartUpdate = () => {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  onMounted(() => {
    fetchProduct();
    checkAdminStatus();
  });

  async function checkAdminStatus() {
    if (!isAuthenticated.value) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(profileUrl, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (response.ok) {
        const userData = await response.json();
        isAdmin.value = userData.role === 'ADMIN';
      }
    } catch (error) {
      console.error('Erreur vérification admin:', error);
    }
  }

  async function fetchProduct() {
    try {
      const response = await fetch(`${url}/${props.id}`);
      if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
      const data = await response.json();
      product.value = data; 
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }

  async function commanderProduit(title, price) {
    // Utilisation de l'email de l'utilisateur connecté par défaut s'il existe
    const defaultEmail = user.value?.email || "";
    const email = prompt(`Möchten Sie ${title} in den Warenkorb stellen? Email bestätigen:`, defaultEmail);
    if (!email) return false;

    try {
      const token = await getAccessTokenSilently();
      const transactionData = {
        customerEmail: email,
        totalAmount: price,
        status: "PAID"
      };

      const response = await fetch(transactionUrl, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(transactionData)
      });

      return response.ok;
    } catch (error) {
      console.error("Fehler beim Senden der Transaktion:", error);
      return false;
    }
  }

  async function warenkorb() {
    if (!product.value) return;
    
    // On force la connexion pour ajouter au panier (optionnel mais recommandé pour rattacher au compte)
    if (!isAuthenticated.value) {
      alert("Bitte loggen Sie sich ein, um Artikel zum Warenkorb hinzuzufügen.");
      return;
    }

    const success = await commanderProduit(product.value.title, product.value.price);
    
    if (success) {
      // On utilise cartKey.value au lieu de 'cart'
      const cart = JSON.parse(localStorage.getItem(cartKey.value)) || [];
      const existing = cart.find(item => item.id === product.value.id);
      
      if (existing) existing.quantity += 1;
      else cart.push({ id: product.value.id, title: product.value.title, price: product.value.price, quantity: 1 });
      
      localStorage.setItem(cartKey.value, JSON.stringify(cart));
      notifyCartUpdate(); 
      alert(`${product.value.title} wurde zu Ihrem persönlichen Warenkorb hinzugefügt!`);
    }
  }

  async function deleteProduct() {
    if (!product.value) return;
    const confirmDelete = confirm('Produkt wirklich löschen?');
    if (!confirmDelete) return;
    try {
      const token = await getAccessTokenSilently();
      const response = await fetch(`${url}/${props.id}`, { 
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Fehler beim Löschen');
      alert('Produkt erfolgreich gelöscht!');
      router.push('/');
    } catch (error) {
      alert('Zugriff verweigert.');
    }
  }

  function zurück() {
    router.back();
  }

  const normalizeImageUrl = (url) => {
    if (!url) return '';
    if (url.includes('github.com')) {
      return url.replace('github.com', 'raw.githubusercontent.com').replace('/blob', '');
    }
    return url;
  };
</script>

<template>
  <Navbar />
    <section class="container py-5 product-page-content">
      <div v-if="product" class="row">
        <div class="col-md-6 text-center">
          <img :src="normalizeImageUrl(product.imageUrl)" class="img-fluid rounded shadow-sm" :alt="product.title" style="max-height: 500px;" />
        </div>
        <div class="col-md-6">
          <h2 class="fw-bold">{{ product.title }}</h2>
          <p class="text-accent fw-bold fs-4">{{ product.price }} €</p>
          <p class="text-muted">{{ product.description }}</p>
          <hr>
          <div class="d-flex flex-wrap gap-2 mt-4">
            <Button variant="secondary" @click="zurück">Zurück</Button>
            <Button variant="accent" @click="warenkorb">In den Warenkorb</Button>
            
            <Button v-if="isAdmin" variant="danger" @click="deleteProduct">Löschen</Button>
            <NavButton v-if="isAdmin" :to="`/product/edit/${product.id}`" variant="warning">Bearbeiten</NavButton>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <p>Produkt wird geladen...</p>
        <NavButton variant="secondary" to="/">Zurück zur Übersicht</NavButton>
      </div>
    </section>
  <Footer />
</template>

<style scoped>
.product-page-content {
  position: relative;
  z-index: 5;
}
.text-accent {
  color: #EA9424;
}
</style>