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
    return user.value?.email === "votre-email@exemple.com"; 
});

/**
 * SCHRITT 1: READ - Benutzerliste laden (Nur für Admins)
 */
const fetchUsers = async () => {
    if (!isAdmin.value) {
        loading.value = false;
        return;
    }

    try {
        const token = await getAccessTokenSilently(); // JWT abrufen
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` } // Token im Header senden
        });
        if (response.ok) {
            users.value = await response.json();
        }
    } catch (error) {
        console.error("Fehler beim Laden:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchUsers);

/**
 * SCHRITT 2: CREATE - Benutzer erstellen
 */
async function createUser() {
    if (!newUser.value.name || !newUser.value.email.includes('@')) {
        alert("Eingabe ungültig: Name und E-Mail erforderlich.");
        return;
    }

    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(newUser.value)
        });

        if (response.ok) {
            alert("Erfolgreich erstellt!");
            newUser.value = { name: '', email: '', role: 'USER' };
            await fetchUsers();
        }
    } catch (error) {
        alert("Fehler beim Erstellen des Benutzers.");
    }
}

/**
 * SCHRITT 3: UPDATE - Benutzerdaten aktualisieren
 */
async function saveUser(userObj, newRole = null) {
    const updatedUser = { ...userObj, role: newRole || userObj.role };

    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${url}/${userObj.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` 
            },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            if (newRole) userObj.role = newRole;
            alert("Aktualisierung erfolgreich!");
        }
    } catch (error) {
        alert("Fehler bei der Aktualisierung.");
    }
}

/**
 * SCHRITT 4: DELETE - Benutzer löschen
 */
async function deleteUser(id) {
    if (!confirm("Möchten Sie diesen Benutzer wirklich löschen?")) return;

    try {
        const token = await getAccessTokenSilently();
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` } 
        });

        if (response.ok) {
            alert("Benutzer gelöscht.");
            await fetchUsers();
        }
    } catch (error) {
        alert("Netzwerkfehler beim Löschen.");
    }
}
</script>

<template>
  <Navbar />
  <main class="container py-5">
    
    <div v-if="isAdmin">
      <h1>Benutzerverwaltung (Admin-Bereich)</h1>
      <p>Willkommen, {{ user.name }}. Hier können Sie die Benutzerdaten verwalten.</p>
      
      <div class="mb-4 p-3 border rounded">
          <h3>Neuen Benutzer hinzufügen</h3>
          <input v-model="newUser.name" placeholder="Name" class="form-control mb-2" />
          <input v-model="newUser.email" placeholder="E-Mail" class="form-control mb-2" />
          <button @click="createUser" class="btn btn-primary">Erstellen</button>
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
              <td>{{ u.name }}</td>
              <td>{{ u.email }}</td>
              <td>{{ u.role }}</td>
              <td>
                <button @click="deleteUser(u.id)" class="btn btn-danger btn-sm">Löschen</button>
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