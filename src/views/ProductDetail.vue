<script setup>
  import Footer from '@/components/Footer.vue';
  import Navbar from '@/components/Navbar.vue';
  import NavButton from '@/components/NavButton.vue';
  import Button from '@/components/Button.vue';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const url = `${import.meta.env.VITE_API_BASE_URL}/api/product`;
  const transactionUrl = `${import.meta.env.VITE_API_BASE_URL}/api/transaktionen`; // URL pour l'admin

  const props = defineProps({
      id: {
          type: [String, Number],
          required: true
      }
  });

  const product = ref(null);
  const router = useRouter();
  // Fonction pour actualiser le badge de la Navbar instantanément
  const notifyCartUpdate = () => {
    window.dispatchEvent(new CustomEvent('cart-updated'));
  };

  onMounted(() => {
    fetchProduct();
  });

  

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



  // --- NOUVELLE FONCTION CORRIGÉE (AVEC TOKEN) ---
  async function commanderProduit(title, price) {
    const email = prompt(`Möchten Sie ${title} kaufen?\nGeben Sie Ihre E-Mail ein:`);
    
    if (!email || !email.includes('@')) {
      alert("Kauf abgebrochen oder ungültige E-Mail.");
      return false;
    }

    try {
      // RÉCUPÉRATION DU TOKEN POUR ÉVITER LA 401
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
          'Authorization': `Bearer ${token}` // AJOUT DU TOKEN
        },
        body: JSON.stringify(transactionData)
      });

      if (!response.ok) {
        if(response.status === 401) alert("Sitzung abgelaufen. Bitte neu einloggen.");
        return false;
      }
      return true;
    } catch (error) {
      console.error("Fehler beim Senden der Transaktion:", error);
      return false;
    }
  }

  async function warenkorb() {
    if (!product.value) return;

    const success = await commanderProduit(product.value.title, product.value.price);

    if (success) {
      const cart = JSON.parse(localStorage.getItem('cart')) || [];
      const existing = cart.find(item => item.id === product.value.id);
      
      if (existing) {
        existing.quantity += 1;
      } else {
        cart.push({ 
          id: product.value.id, 
          title: product.value.title, 
          price: product.value.price, 
          quantity: 1 
        });
      }

      localStorage.setItem('cart', JSON.stringify(cart));
      
      // ACTUALISATION DU PANIER PENDANT L'ACHAT
      notifyCartUpdate(); 
      
      alert(`${product.value.title} wurde bestellt und zum Warenkorb hinzugefügt!`);
    }
  }




// --- DELETE AUSSI AVEC TOKEN ---
  async function deleteProduct() {
    if (!product.value) return;
    const confirmDelete = confirm('Möchten Sie dieses %product% wirklich löschen?');
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
      alert('Erreur 401: Sie haben keine Berechtigung.');
    }
  }

  function zurück() {
    if (window.history.length > 1) router.back();
    else router.push('/');
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
            <Button variant="danger" @click="deleteProduct">Löschen</Button>
            <NavButton :to="`/product/edit/${product.id}`" variant="warning">Bearbeiten</NavButton>
          </div>
        </div>
      </div>
      <div v-else class="text-center py-5">
        <p>Produkt wird geladen oder wurde nicht gefunden...</p>
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