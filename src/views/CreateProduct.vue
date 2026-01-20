<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useAuth0 } from '@auth0/auth0-vue';
import Button from '@/components/Button.vue';

const { getAccessTokenSilently, isAuthenticated } = useAuth0();
const router = useRouter();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const url = `${API_BASE_URL}/api/product`;

const product = ref({ title: '', price: 0, imageUrl: '', description: '' });
const loading = ref(true); // Pour éviter un flash du formulaire avant vérification

// --- PROTECTION DE LA ROUTE ---
onMounted(async () => {
  if (!isAuthenticated.value) {
    router.push('/');
    return;
  }

  try {
    const token = await getAccessTokenSilently();
    // On appelle ton ProfileController pour vérifier le rôle en base
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    const userData = await res.json();

    if (userData.role !== 'ADMIN') {
      alert("Zugriff verweigert: Nur Administratoren können Produkte erstellen.");
      router.push('/'); // Redirection si simple USER
    } else {
      loading.value = false; // C'est un admin, on affiche le formulaire
    }
  } catch (error) {
    console.error("Fehler bei der Rollenprüfung:", error);
    router.push('/');
  }
});

// --- LOGIQUE DE CRÉATION ---
async function createProduct() {
  try {
    const token = await getAccessTokenSilently();

    const response = await fetch(url, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(product.value),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("Détails du serveur:", errorData);
      throw new Error(`Fehler: ${response.status}`);
    }

    alert('Produkt erfolgreich erstellt!');
    router.push('/products'); 
  } catch (error) {
    console.error('Fehler beim Erstellen:', error);
    alert('Produkt konnte nicht erstellt werden. Prüfen Sie die Konsole.');
  }
}
</script>

<template>
  <div v-if="!loading" class="container py-5">
    <div class="mb-4">
       <router-link to="/products" class="text-decoration-none">← Zurück zum Katalog</router-link>
    </div>
    
    <h2 class="fw-bold mb-4">Neues Produkt erstellen</h2>
    
    <form @submit.prevent="createProduct" class="bg-light p-4 shadow-sm border">
      <div class="mb-3">
        <label for="productName" class="form-label fw-bold">Name</label>
        <input type="text" id="productName" class="form-control" v-model="product.title" required />
      </div>
      
      <div class="mb-3">
        <label for="productPrice" class="form-label fw-bold">Preis (€)</label>
        <input type="number" step="0.01" id="productPrice" class="form-control" v-model="product.price" required />
      </div>
      
      <div class="mb-3">
        <label for="productImageUrl" class="form-label fw-bold">Bild-URL</label>
        <input type="text" id="productImageUrl" class="form-control" v-model="product.imageUrl" placeholder="https://..." required />
      </div>
      
      <div class="mb-3">
        <label for="productDescription" class="form-label fw-bold">Beschreibung</label>
        <textarea id="productDescription" class="form-control" v-model="product.description" rows="4"></textarea>
      </div>
      
      <div class="d-grid">
        <Button type="submit" variant="accent">Produkt Erstellen</Button>
      </div>
    </form>
  </div>
  
  <div v-else class="text-center py-5">
    <p>Verifizierung der Berechtigungen...</p>
  </div>
</template>

<style scoped>
.container {
  max-width: 600px;
}
.form-control {
  border-radius: 0; /* Pour rester dans ton style rectangulaire */
}
</style>