<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import Button from '@/components/Button.vue';

const route = useRoute();
const router = useRouter();

const id = route.params.id; // On récupère l'ID depuis l'URL
const url = `${import.meta.env.VITE_API_BASE_URL}/api/product/${id}`;

const product = ref({
  title: '',
  description: '',
  price: 0,
  imageUrl: '',
  category: ''
});

// 1. Charger les données actuelles du produit
onMounted(async () => {
  try {
    const response = await fetch(url);
    if (response.ok) {
      product.value = await response.json();
    }
  } catch (error) {
    console.error("Fehler beim Laden:", error);
  }
});

// 2. Envoyer les modifications (Bearbeiten)
async function updateProduct() {
  try {
    const response = await fetch(url, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product.value)
    });

    if (response.ok) {
      alert("Produkt aktualisiert!");
      router.push(`/product/view/${id}`); // Retour à la vue détails
    }
  } catch (error) {
    alert("Update fehlgeschlagen");
  }
}
</script>

<template>
  <Navbar />
  <div class="container py-5">
    <div class="card shadow p-4 mx-auto" style="max-width: 600px;">
      <h2 class="mb-4">Produkt bearbeiten</h2>
      
      <form @submit.prevent="updateProduct">
        <div class="mb-3">
          <label class="form-label">Titel</label>
          <input v-model="product.title" type="text" class="form-control" required>
        </div>

        <div class="mb-3">
          <label class="form-label">Beschreibung</label>
          <textarea v-model="product.description" class="form-control" rows="3"></textarea>
        </div>

        <div class="mb-3">
          <label class="form-label">Preis (€)</label>
          <input v-model.number="product.price" type="number" step="0.01" class="form-control">
        </div>

        <div class="mb-3">
          <label class="form-label">Bild URL (GitHub Raw Link)</label>
          <input v-model="product.imageUrl" type="text" class="form-control">
        </div>

        <div class="d-flex gap-2">
          <Button type="submit" variant="accent">Speichern</Button>
          <Button type="button" variant="secondary" @click="router.back()">Abbrechen</Button>
        </div>
      </form>
    </div>
  </div>
  <Footer />
</template>

<style scoped>
.container {
  min-height: 80vh;
}

.card {
  border-radius: 15px;
  border: none;
  background-color: #ffffff;
}

.form-label {
  font-weight: bold;
  color: #333;
}

.form-control {
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 10px;
}

.form-control:focus {
  border-color: #FF8C00; /* Remplace par ta couleur orange/marron */
  box-shadow: 0 0 0 0.2rem rgba(255, 165, 0, 0.25);
}
</style>


