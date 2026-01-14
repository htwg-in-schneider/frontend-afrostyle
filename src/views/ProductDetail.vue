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

  // --- NOUVELLE FONCTION : COMMANDE POUR L'ADMIN ---
  async function commanderProduit(title, price) {
    const email = prompt(`Möchten Sie ${title} kaufen?\nGeben Sie Ihre E-Mail ein:`);
    
    if (!email || !email.includes('@')) {
      alert("Kauf abgebrochen oder ungültige E-Mail.");
      return false; // On retourne false pour savoir que ça a échoué
    }

    const transactionData = {
      customerEmail: email,
      totalAmount: price,
      status: "PAID"
    };

    try {
      const response = await fetch(transactionUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(transactionData)
      });
      return response.ok;
    } catch (error) {
      console.error("Fehler beim Senden der Transaktion:", error);
      return false;
    }
  }

  // --- MISE À JOUR : AJOUT AU PANIER + COMMANDE ---
  async function warenkorb() {
    if (!product.value) return;

    // 1. On lance d'abord le processus de commande (le prompt)
    const success = await commanderProduit(product.value.title, product.value.price);

    // 2. Si la commande est validée, on l'ajoute aussi au panier local
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
      alert(`${product.value.title} wurde bestellt und zum Warenkorb hinzugefügt!`);
    }
  }

  async function deleteProduct() {
    if (!product.value) return;
    const confirmDelete = confirm('Möchten Sie dieses Produkt wirklich löschen?');
    if (!confirmDelete) return;
    try {
      const response = await fetch(`${url}/${props.id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Fehler beim Löschen');
      alert('Produkt erfolgreich gelöscht!');
      router.push('/');
    } catch (error) {
      alert('Produkt konnte nicht gelöscht werden.');
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