<script setup>
  import Footer from '@/components/Footer.vue';
  import Navbar from '@/components/Navbar.vue';
  import NavButton from '@/components/NavButton.vue';
  import Button from '@/components/Button.vue';
  import ProductReviews from '@/components/ProductReviews.vue';
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';

  const url = `${import.meta.env.VITE_API_BASE_URL}/api/product`;

  const props = defineProps({
      id: {
          type: [String, Number],
          required: true
      }
  });

  const product = ref(null);
  onMounted(() => {
  console.log("ID reçu par le composant:", props.id);
  fetchProduct();
});

async function fetchProduct() {
  try {
    const response = await fetch(`${url}/${props.id}`);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    // CORRECTION ICI : Utilisez product.value
    const data = await response.json();
    product.value = data; 
    
    console.log("Produit chargé :", product.value);
  } catch (error) {
    console.error('Error fetching product:', error);
  }
}
    
  const router = useRouter();

  async function deleteProduct() {
    if (!product.value) return;
    
    const confirmDelete = confirm('Möchten Sie dieses Produkt wirklich löschen?');
    if (!confirmDelete) return;

    try {
      const response = await fetch(`${url}/${props.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Fehler beim Löschen');

      alert('Produkt erfolgreich gelöscht!');
      router.push('/'); // retourne à la liste des produits
    } catch (error) {
      console.error('Fehler beim Löschen des Produkts:', error);
      alert('Produkt konnte nicht gelöscht werden.');
    }
  }

  function warenkorb() {
  if (!product.value) return;

    // Récupérer le panier depuis localStorage ou créer un tableau vide
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    // Ajouter le produit (id + quantité)
    const existing = cart.find(item => item.id === product.value.id);
    if (existing) {
      existing.quantity += 1; // augmenter la quantité si déjà présent
    } else {
      cart.push({ id: product.value.id, title: product.value.title, price: product.value.price, quantity: 1 });
    }

    // Sauvegarder le panier
    localStorage.setItem('cart', JSON.stringify(cart));

    alert(`${product.value.title} wurde zum Warenkorb hinzugefügt!`);
  }

 function zurück() {
  console.log("Clic détecté !");
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/');
  }
}
//ich hole die Bilder von meinem github repository, da ich keinen eigenen bilderspeicher habe
const normalizeImageUrl = (url) => {
  if (!url) return '';
  if (url.includes('github.com')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob', '');
  }
  return url;
};



</script>

<template>
  <Navbar />
    <section class="container py-5 product-page-content">
      <div v-if="product" class="row">
        <div class="col-md-6">
          <img :src="normalizeImageUrl(product.imageUrl)"  class="img-fluid" :alt="product.title" />
        </div>
        <div class="col-md-6">
          <h2 class="fw-bold">{{ product.title }}</h2>
            <p class="text-accent fw-bold fs-4">{{ product.price }} €</p>
            <p>{{ product.description }}</p>
            <Button variant="secondary" class="me-2" @click="zurück">Zurück</Button>
            <Button variant="accent"    class="ms-2" @click="warenkorb">In den Warenkorb</Button>
            <Button variant="danger"    class="ms-2" @click="deleteProduct">Produkt löschen</Button>
            <NavButton :to="`/product/edit/${product.id}`" variant="warning">Bearbeiten</NavButton>
        </div>
      </div>
      <div v-else class="text-center">
        <p>Produkt wurde nicht gefunden.</p>
        <NavButton variant="secondary" class="me-2" to="/">Zurück</NavButton>
      </div>
    </section>
  <Footer />
  </template>
  <style scoped>
.product-page-content {
  position: relative;
  z-index: 5; /* Passe au-dessus du débordement de la navbar */
}

/* Assurez-vous que @click est bien en MINUSCULE dans votre template */
</style>
