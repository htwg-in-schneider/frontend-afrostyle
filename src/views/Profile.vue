
<script setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';

const { user, getAccessTokenSilently, isAuthenticated } = useAuth0();
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const profileData = ref({ name: '', adresse: '', phone: '', role: '' });
const originalData = ref({});
const isEditing = ref(false);
const isEnabled = ref(true);
//const bearerToken = ref(true);
const saving = ref(false);

function getRoleName(role) {
  // 1. On vérifie si le rôle existe
  if (!role) {
    return 'USER 👤';
  }

  // 2. On transforme en majuscules pour comparer
  if (role.toUpperCase() === 'ADMIN') {
    return 'ADMIN 🛡️';
  } else {
    // 3. Pour tous les autres cas
    return 'USER 👤';
  }
}

async function loadUserData() {
  if (!isAuthenticated.value) return;
  try {
    const token = await getAccessTokenSilently();

    // 1. On crée une copie des données
    const dataToSend = { ...profileData.value };

    // 2. LA CORRECTION : Si le rôle est une chaîne vide, on le supprime 
    // pour que Java ne reçoive rien et ne plante pas sur la conversion.
    if (!dataToSend.role || dataToSend.role === "") {
      delete dataToSend.role;
    }
    //bearerToken.value = token;
    const res = await fetch(`${API_BASE_URL}/api/users/update-profile`, {
      method: 'PUT', 
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(profileData.value)
    });

    if (res.ok) {
      isEditing.value = false;
      originalData.value = { ...profileData.value };
      alert("✅ Profil erfolgreich aktualisiert!");
    } else {
      alert("❌ Fehler: " + res.status);
    }
  } catch (err) {
    alert("❌ Netzwerkfehler.");
  } finally {
    saving.value = false;
  }
}

async function saveProfile() {
  saving.value = true;
  try {
    const token = await getAccessTokenSilently();
    
    // On crée une copie simple des données pour ne pas modifier l'affichage en cas d'erreur
    const dataToSend = { ...profileData.value };

    // NETTOYAGE CRITIQUE : Si le rôle est vide, on supprime la clé
    // pour que Java ne tente pas de convertir "" en Enum Role
    if (!dataToSend.role || dataToSend.role.trim() === "") {
      delete dataToSend.role;
    }

    const res = await fetch(`${API_BASE_URL}/api/users/update-profile`, {
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
  // On restaure les données originales
  profileData.value = JSON.parse(JSON.stringify(originalData.value));
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

      <div v-if="isEnabled === false" class="banned-banner">
        Konto eingeschränkt. Kontaktieren Sie den Support.
      </div>

      <div class="profile-card">
        <div class="avatar-section">
          <img :src="user?.picture" alt="Avatar" class="profile-avatar" />
          <p class="auth0-id">OAuth-ID: {{ user?.sub }}</p>
          <span class="role-badge">{{ getRoleName(profileData.role) }}</span>
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
/* Fond de page gris très clair */
.profile-page { 
  min-height: 100vh; 
  background: #f8f9fa; 
  display: flex; 
  justify-content: center; 
  padding: 40px 20px; 
}

.content-wrapper { 
  width: 100%; 
  max-width: 600px; 
}

/* Titre sobre en gris foncé */
.main-title { 
  color: #333; 
  font-family: 'Inter', sans-serif; /* Plus moderne que le cursif pour ce style */
  font-size: 32px; 
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-align: left; 
  margin-bottom: 30px; 
  border-bottom: 4px solid #333; /* Soulignement rectangulaire */
  display: inline-block;
}

/* Carte Grise Rectangulaire */
.profile-card { 
  background: #444; /* Gris foncé */
  padding: 30px; 
  border-radius: 0; /* Angles droits */
  box-shadow: 10px 10px 0px rgba(0,0,0,0.1); /* Ombre rectangulaire */
  color: white; 
}

.avatar-section { 
  display: flex; 
  align-items: center; 
  gap: 20px;
  margin-bottom: 25px; 
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 20px;
}

.profile-avatar { 
  width: 80px; 
  height: 80px; 
  border-radius: 0; /* Avatar carré */
  border: 2px solid white; 
  object-fit: cover; 
}

.role-badge { 
  background: white; 
  color: #333; 
  padding: 2px 10px; 
  border-radius: 0; /* Badge rectangulaire */
  font-weight: bold; 
  font-size: 11px; 
  text-transform: uppercase;
}

/* Inputs Rectangulaires */
.info-grid { display: grid; gap: 20px; }
.info-group label { 
  display: block; 
  font-size: 11px; 
  font-weight: 700; 
  margin-bottom: 8px; 
  text-transform: uppercase;
  color: #ccc;
}

.input-wrapper { 
  background: rgba(255, 255, 255, 0.05); 
  border: 1px solid rgba(255, 255, 255, 0.2); 
  border-radius: 0; /* Angles droits */
  padding: 12px; 
}

.input-wrapper.editing { 
  background: white; 
  border: 1px solid #333;
}

input { 
  background: transparent; 
  border: none; 
  color: white; 
  width: 100%; 
  outline: none; 
  font-size: 15px; 
}

.input-wrapper.editing input { color: #000; }

/* Boutons Rectangulaires */
.btn-main, .btn-save, .btn-cancel, .back-btn { 
  border-radius: 0; /* Angles droits */
  padding: 12px; 
  font-weight: 700; 
  border: none; 
  cursor: pointer; 
  text-transform: uppercase;
  letter-spacing: 1px;
}

.btn-main { background: white; color: #333; width: 100%; margin-top: 20px; }
.btn-main:hover { background: #eee; }

.btn-save { background: #222; color: white; flex: 2; }
.btn-cancel { background: #666; color: white; flex: 1; }

.back-btn { 
  background: #333; 
  color: white; 
  width: 40px; 
  height: 40px; 
  margin-bottom: 20px;
}

/* Stats / Cartes du bas */
.stat-card { 
  background: white; 
  padding: 20px; 
  border-radius: 0; 
  border: 1px solid #ddd;
  text-decoration: none; 
  color: #333; 
  display: block;
  margin-top: 20px;
}

.stat-card h3 { 
  margin: 0; 
  font-size: 18px; 
  border-left: 5px solid #333; 
  padding-left: 10px; 
}

.debug-details { margin-top: 30px; border-top: 1px solid #ddd; padding-top: 10px; }
pre { background: #f1f1f1; border-radius: 0; padding: 15px; font-size: 10px; color: #666; }
</style>