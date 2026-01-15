<script setup>
import { ref, onMounted, computed } from 'vue'; // 'computed' hinzugefügt für Rollenprüfung
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { useAuth0 } from '@auth0/auth0-vue'; // Auth0-Modul importieren

// Auth0-Funktionen extrahieren
const { getAccessTokenSilently, user, isAuthenticated } = useAuth0(); 

// API-Konfiguration aus Umgebungsvariablen
const url = `${import.meta.env.VITE_API_BASE_URL}/api/users`;
const users = ref([]);
const loading = ref(true);
const newUser = ref({ name: '', email: '', role: 'USER' });

/**
 * LOGIK: ADMIN-RECHTE PRÜFEN
 * Ein einfacher Nutzer darf die Liste nicht sehen.
 * Prüfung basierend auf der E-Mail des angemeldeten Benutzers.
 */
const isAdmin = computed(() => {
    // ACHTUNG: Ersetzen Sie dies durch Ihre tatsächliche Admin-E-Mail
    return user.value?.email === "Madeleine.PahwangFotso@gmail.com"; 
});


// GET - Charger les utilisateurs
const fetchUsers = async () => {
    try {
        const token = await getAccessTokenSilently(); 
        
        // --- AJOUTE CES LIGNES POUR VOIR TON TOKEN ---
        console.log("CLIQUE SUR CE LIEN -> https://jwt.io");
        console.log("PUIS COLLE CE CODE DANS LA CASE DE GAUCHE :");
        console.log(token); 
        // ---------------------------------------------

        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        
        if (response.ok) {
            users.value = await response.json();
            loading = false;
        } else {
            console.error("Le serveur a répondu avec l'erreur :", response.status);
        }
    } catch (error) {
        console.error("Erreur de récupération :", error);
    }
};

onMounted(fetchUsers);

/**
 * SCHRITT 2: CREATE - Benutzer erstellen
 */
// POST - Créer
async function createUser() {
    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(newUser.value)
        });
        if (response.ok) {
            newUser.value = { name: '', email: '', role: 'USER' };
            await fetchUsers();
        }
    } catch (error) { alert("Fehler beim Erstellen."); }
}

// PUT - Modifier (Sauvegarder les changements)
async function saveUserChanges(userObj) {
    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${url}/${userObj.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify(userObj)
        });
        if (response.ok) alert("Utilisateur mis à jour !");
    } catch (error) { alert("Fehler bei der Aktualisierung."); }
}

// DELETE - Supprimer
async function deleteUser(id) {
    if (!confirm("Voulez-vous supprimer cet utilisateur ?")) return;
    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` } 
        });
        if (response.ok) await fetchUsers();
    } catch (error) { alert("Fehler beim Löschen."); }
}
</script>

<template>
  <Navbar />
  <main class="container py-5">
    
    <div v-if="isAdmin">
      <h1>Benutzerverwaltung (Admin-Bereich)</h1>
      <p>Willkommen, {{ user.name }}. Hier können Sie die Benutzerdaten verwalten.</p>
      
      <div class="card p-4 mb-5 shadow-sm">
          <h4>Ajouter un nouvel utilisateur</h4>
          <div class="row g-2">
            <div class="col-md-4"><input v-model="newUser.name" placeholder="Nom" class="form-control" /></div>
            <div class="col-md-4"><input v-model="newUser.email" placeholder="Email" class="form-control" /></div>
            <div class="col-md-2">
              <select v-model="newUser.role" class="form-select">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div class="col-md-2"><button @click="createUser" class="btn btn-primary w-100">Ajouter</button></div>
          </div>
      </div>

      <section v-if="!loading">
        <table class="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>E-Mail</th>
              <th>Rolle</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td><input v-model="u.name" class="form-control form-control-sm border-0 bg-light" /></td>
              <td><input v-model="u.email" class="form-control form-control-sm border-0 bg-light" /></td>
              <td>
                <select v-model="u.role" class="form-select form-select-sm">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
              </td>
              <td>
                <div class="btn-group">
                  <button @click="saveUserChanges(u)" class="btn btn-success btn-sm"><i class="bi bi-save"></i></button>
                  <button @click="deleteUser(u.id)" class="btn btn-danger btn-sm"><i class="bi bi-trash"></i></button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
      <div v-else>Lädt Daten...</div>
    </div>

    <div v-else-if="isAuthenticated" class="alert alert-warning text-center">
      <h2>Zugriff verweigert</h2>
      <p>Entschuldigung {{ user.name }}, nur Administratoren dürfen diese Liste sehen.</p>
    </div>

    <div v-else class="alert alert-danger text-center">
      <p>Bitte loggen Sie sich ein, um fortzufahren.</p>
    </div>

  </main>
  <Footer />
</template>