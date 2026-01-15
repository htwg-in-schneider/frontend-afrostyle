<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import Button from '@/components/Button.vue';


const { getAccessTokenSilently } = useAuth0(); // Récupérez la fonction de jeton
const router = useRouter();
const url = `${import.meta.env.VITE_API_BASE_URL}/api/product`;
const product = ref({ title: '', price: 0, imageUrl: '', description: '' });

async function createProduct() {
  try {
    // 1. Récupérer le jeton de sécurité
    const token = await getAccessTokenSilently();

    // 2. Envoyer la requête avec le header Authorization
    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}` // AJOUT INDISPENSABLE
      },
      body: JSON.stringify(product.value),
    });

    if (!response.ok) {
      // Analyse de l'erreur pour déboguer
      const errorData = await response.json();
      console.error("Détails du serveur:", errorData);
      throw new Error(`Fehler: ${response.status}`);
    }

    alert('Produkt erfolgreich erstellt!');
    router.push('/products'); // Redirige vers la liste des produits
  } catch (error) {
    console.error('Fehler beim Erstellen:', error);
    alert('Produkt konnte nicht erstellt werden. Prüfen Sie die Konsole.');
  }
}
</script>

<template>
  <div class="container py-5">
    <h2 class="fw-bold mb-4">Neues Produkt erstellen</h2>
    <form @submit.prevent="createProduct">
      <div class="mb-3">
        <label for="productName" class="form-label">Name</label>
        <input type="text" id="productName" class="form-control" v-model="product.title" />
      </div>
      <div class="mb-3">
        <label for="productPrice" class="form-label">Preis</label>
        <input type="number" id="productPrice" class="form-control" v-model="product.price" />
      </div>
      <div class="mb-3">
        <label for="productImageUrl" class="form-label">Bild-URL</label>
        <input type="text" id="productImageUrl" class="form-control" v-model="product.imageUrl" />
      </div>
      <div class="mb-3">
        <label for="productDescription" class="form-label">Beschreibung</label>
        <textarea id="productDescription" class="form-control" v-model="product.description"></textarea>
      </div>
      <Button type="submit" variant="accent">Erstellen</Button>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>