<script setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

const { getAccessTokenSilently } = useAuth0();
const profileData = ref({ name: '', adresse: '', telephone: '' });
const loading = ref(true);
const saving = ref(false);

// On récupère l'URL de base depuis Vite
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
// 1. Charger les données au démarrage
onMounted(async () => {
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    if (response.ok) {
      profileData.value = await response.json();
    }
  } catch (error) {
    console.error("Erreur de chargement", error);
  } finally {
    loading.ref = false;
  }
});

// 2. Sauvegarder les modifications
const saveProfile = async () => {
  saving.value = true;
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(`${API_BASE_URL}/api/users/me`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData.value)
    });
    if (response.ok) alert("Profil mis à jour !");
  } catch (error) {
    alert("Erreur lors de la sauvegarde.");
  } finally {
    saving.value = false;
  }
};
</script>

<template>
  <div class="profile-container">
    <h1>Mein Profile</h1>
    <div v-if="loading">loading...</div>
    <form v-else @submit.prevent="saveProfile">
      <div class="form-group">
        <label>Nom :</label>
        <input v-model="profileData.name" type="text" required />
      </div>

      <div class="form-group">
        <label>Adresse (Optionnel) :</label>
        <input v-model="profileData.adresse" type="text" />
      </div>

      <div class="form-group">
        <label>Phone (Optional) :</label>
        <input v-model="profileData.phone" type="text" />
      </div>

      <button type="submit" :disabled="saving">
        {{ saving ? 'wird gespeichert...' : 'Bearbeitung speichern?' }}
      </button>
    </form>
  </div>
</template>