<script setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const profileData = ref({ name: '', adresse: '', phone: '', role: '' });
const originalData = ref({});
const isEditing = ref(false);
const saving = ref(false);

// Formatage de l'affichage du rôle
function getRoleName(role) {
  if (!role) return 'USER 👤';
  return role.toUpperCase() === 'ADMIN' ? 'ADMIN 🛡️' : 'USER 👤';
}

// 1. CHARGEMENT DES DONNÉES (GET)
async function loadUserData() {
  if (!isAuthenticated.value) return;
  try {
    const token = await getAccessTokenSilently();
    
    // Correction ici : On utilise GET pour charger les données
    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'GET', 
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (res.ok) {
      const data = await res.json();
      profileData.value = data;
      originalData.value = { ...data }; // Sauvegarde pour "Annuler"
    } else {
      console.error("Erreur de chargement:", res.status);
    }
  } catch (err) {
    console.error("Réseau erreur:", err);
  }
}

// 2. SAUVEGARDE DES DONNÉES (PUT)
async function saveProfile() {
  saving.value = true;
  try {
    const token = await getAccessTokenSilently();
    
    // NETTOYAGE CRITIQUE pour éviter l'erreur 400 :
    // On n'envoie que les champs que le Backend peut modifier
    const dataToSend = {
      name: profileData.value.name,
      adresse: profileData.value.adresse,
      phone: profileData.value.phone
    };

    const res = await fetch(`${API_BASE_URL}/api/profile`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(dataToSend)
    });

    if (res.ok) {
      const updatedData = await res.json();
      profileData.value = updatedData;
      originalData.value = { ...updatedData };
      isEditing.value = false;
      alert("✅ Profil erfolgreich aktualisiert!");
    } else if (res.status === 403) {
      alert("❌ Accès refusé (403). Vérifiez vos droits.");
    } else {
      alert("❌ Fehler: " + res.status);
    }
  } catch (err) {
    console.error("Fetch error:", err);
    alert("❌ Netzwerkfehler.");
  } finally {
    saving.value = false;
  }
}

function cancelEdit() {
  profileData.value = { ...originalData.value };
  isEditing.value = false;
}

onMounted(loadUserData);
</script>

<template>
  <div class="profile-page">
    <div class="top-left-nav">
      <router-link to="/">
        <button class="back-btn">←</button>
      </router-link>
    </div>

    <div class="content-wrapper">
      <h1 class="main-title">Mein Profil</h1>

      <div class="profile-card">
        <div class="avatar-section">
          <img :src="user?.picture" alt="Avatar" class="profile-avatar" />
          <div class="user-meta">
            <p class="auth0-id">OAuth-ID: {{ user?.sub }}</p>
            <span class="role-badge">{{ getRoleName(profileData.role) }}</span>
          </div>
        </div>

        <div class="info-grid">
          <div class="info-group">
            <label>Benutzername</label>
            <div class="input-wrapper" :class="{ 'editing': isEditing }">
              <input type="text" v-model="profileData.name" :disabled="!isEditing" placeholder="Name...">
            </div>
          </div>

          <div class="info-group">
            <label>E-Mail</label>
            <div class="input-wrapper disabled">
              <input type="text" :value="user?.email" disabled>
            </div>
          </div>

          <div class="info-group">
            <label>Adresse</label>
            <div class="input-wrapper" :class="{ 'editing': isEditing }">
              <input type="text" v-model="profileData.adresse" :disabled="!isEditing" placeholder="Ihre Adresse...">
            </div>
          </div>

          <div class="info-group">
            <label>Telefon</label>
            <div class="input-wrapper" :class="{ 'editing': isEditing }">
              <input type="text" v-model="profileData.phone" :disabled="!isEditing" placeholder="Nummer...">
            </div>
          </div>
        </div>

        <div class="actions">
          <button v-if="!isEditing" @click="isEditing = true" class="btn-main">
            Profil bearbeiten
          </button>

          <div v-else class="edit-actions">
            <button @click="saveProfile" class="btn-save" :disabled="saving">
              {{ saving ? 'Speichern...' : 'Speichern' }}
            </button>
            <button @click="cancelEdit" class="btn-cancel">Abbrechen</button>
          </div>
        </div>
      </div>

      <div class="stats-grid">
        <router-link to="/panier" class="stat-card">
          <h3>Mein Warenkorb</h3>
          <p>Bestellungen verwalten</p>
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Tes styles restent identiques, ils sont très propres */
.profile-page { min-height: 100vh; background: #f8f9fa; display: flex; justify-content: center; padding: 40px 20px; }
.content-wrapper { width: 100%; max-width: 600px; }
.main-title { color: #333; font-family: 'Inter', sans-serif; font-size: 32px; font-weight: 800; text-transform: uppercase; letter-spacing: 2px; text-align: left; margin-bottom: 30px; border-bottom: 4px solid #333; display: inline-block; }
.profile-card { background: #444; padding: 30px; border-radius: 0; box-shadow: 10px 10px 0px rgba(0,0,0,0.1); color: white; }
.avatar-section { display: flex; align-items: center; gap: 20px; margin-bottom: 25px; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 20px; }
.profile-avatar { width: 80px; height: 80px; border-radius: 0; border: 2px solid white; object-fit: cover; }
.role-badge { background: white; color: #333; padding: 2px 10px; border-radius: 0; font-weight: bold; font-size: 11px; text-transform: uppercase; }
.info-grid { display: grid; gap: 20px; }
.info-group label { display: block; font-size: 11px; font-weight: 700; margin-bottom: 8px; text-transform: uppercase; color: #ccc; }
.input-wrapper { background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.2); padding: 12px; }
.input-wrapper.editing { background: white; border: 1px solid #333; }
.input-wrapper.disabled { opacity: 0.6; cursor: not-allowed; }
input { background: transparent; border: none; color: white; width: 100%; outline: none; font-size: 15px; }
.input-wrapper.editing input { color: #000; }
.edit-actions { display: flex; gap: 10px; margin-top: 20px; }
.btn-main, .btn-save, .btn-cancel, .back-btn { border-radius: 0; padding: 12px; font-weight: 700; border: none; cursor: pointer; text-transform: uppercase; }
.btn-main { background: white; color: #333; width: 100%; margin-top: 20px; }
.btn-save { background: #222; color: white; flex: 2; }
.btn-cancel { background: #666; color: white; flex: 1; }
.back-btn { background: #333; color: white; width: 40px; height: 40px; margin-bottom: 20px; }
.stat-card { background: white; padding: 20px; border-radius: 0; border: 1px solid #ddd; text-decoration: none; color: #333; display: block; margin-top: 20px; }
.stat-card h3 { margin: 0; font-size: 18px; border-left: 5px solid #333; padding-left: 10px; }
</style>