<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import Button from '@/components/Button.vue';

const route = useRoute();
const router = useRouter();
const url = `${import.meta.env.VITE_API_BASE_URL}/api/product`;
const product = ref({});

onMounted(async () => {
  await fetchProduct();
});

async function fetchProduct() {
  const productId = route.params.id;
  try {
    const response = await fetch(`${url}/${productId}`);
    if (!response.ok) {
      throw new Error(`Produkt nicht gefunden: ${response.status}`);
    }
    product.value = await response.json();
  } catch (error) {
    console.error('Fehler beim Laden des Produkts:', error);
    alert('Produkt konnte nicht geladen werden.');
    router.push('/');
  }
}

async function updateProduct() {
  try {
    const response = await fetch(`${url}/${product.value.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product.value),
    });
    if (!response.ok) {
      throw new Error(`Fehler beim Aktualisieren: ${response.status}`);
    }
    alert('Produkt erfolgreich aktualisiert!');
    router.push('/');
  } catch (error) {
    console.error('Fehler beim Aktualisieren des Produkts:', error);
    alert('Produkt konnte nicht aktualisiert werden.');
  }
}

async function deleteProduct() {
  if (!confirm('Möchten Sie dieses Produkt wirklich löschen?')) return;
  try {
    const response = await fetch(`${url}/${product.value.id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error(`Fehler beim Löschen: ${response.status}`);
    }
    alert('Produkt erfolgreich gelöscht!');
    router.push('/');
  } catch (error) {
    console.error('Fehler beim Löschen des Produkts:', error);
    alert('Produkt konnte nicht gelöscht werden.');
  }
}
</script>

<template>
  <div class="container py-5">
    <h2 class="fw-bold mb-4">Produkt bearbeiten</h2>

    <!-- Image Preview -->
    <div class="text-center mb-4">
      <img :src="product.imageUrl" alt="Produktbild" class="img-fluid" style="max-height: 300px;" />
    </div>

    <form @submit.prevent="updateProduct">
      <div class="mb-3">
        <label for="productId" class="form-label">Produkt ID</label>
        <input type="text" id="productId" class="form-control" v-model="product.id" readonly />
      </div>
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
      <Button type="submit" variant="accent">Aktualisieren</Button>
      <Button type="button" variant="danger" class="ms-2" @click="deleteProduct">Löschen</Button>
    </form>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
</style>