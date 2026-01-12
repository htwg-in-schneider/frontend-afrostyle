<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const url = `${import.meta.env.VITE_API_BASE_URL}/api/users`;
const users = ref([]);
const loading = ref(true);

// Modèle pour créer un nouvel utilisateur (ETAPE : CREATE)
const newUser = ref({
    name: '',
    email: '',
    role: 'USER'
});

/**
 * ETAPE 1 : READ (Anzeigen)
 * Récupération de la liste initiale
 */
const fetchUsers = async () => {
    try {
        const response = await fetch(url);
        if (response.ok) {
            users.value = await response.json();
        }
    } catch (error) {
        console.error("Erreur chargement:", error);
    } finally {
        loading.value = false;
    }
};

onMounted(fetchUsers);

/**
 * ETAPE 2 : CREATE (Anlegen)
 * Envoi d'un nouvel utilisateur au backend
 */
async function createUser() {
    // Validation Frontend avant création
    if (!newUser.value.name || !newUser.value.email.includes('@')) {
        alert("Validation Frontend : Nom et Email (@) requis pour la création.");
        return;
    }

    try {
        const response = await fetch(url, {
            method: 'POST', // Nécessite @PostMapping dans le Backend
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newUser.value)
        });

        if (response.ok) {
            alert("Utilisateur créé !");
            newUser.value = { name: '', email: '', role: 'USER' }; // Reset formulaire
            await fetchUsers(); // Recharger la liste
        } else {
            const errorMsg = await response.text();
            alert("Erreur Backend : " + errorMsg);
        }
    } catch (error) {
        alert("Erreur lors de la création.");
    }
}

/**
 * ETAPE 3 : UPDATE (Bearbeiten)
 * Sauvegarde des modifications Nom/Email/Rôle
 */
async function saveUser(user, newRole = null) {
    const updatedUser = { ...user, role: newRole || user.role };

    // Validation Frontend
    if (!updatedUser.name || !updatedUser.email.includes('@')) {
        alert("Validation Frontend : Données invalides.");
        return;
    }

    try {
        const response = await fetch(`${url}/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            if (newRole) user.role = newRole;
            alert("Mise à jour réussie !");
        } else {
            const errorMsg = await response.text();
            alert("Validation Backend : " + errorMsg);
        }
    } catch (error) {
        alert("Erreur de connexion.");
    }
}

/**
 * ETAPE 4 : DELETE (Löschen)
 * Suppression d'un utilisateur
 */
async function deleteUser(id) {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE' // Appelle @DeleteMapping dans le Backend
        });

        if (response.ok) {
            alert("Utilisateur supprimé de la base.");
            await fetchUsers(); // Rafraîchir le tableau
        } else {
            alert("Erreur lors de la suppression.");
        }
    } catch (error) {
        alert("Erreur réseau.");
    }
}
</script>

<template>
    <Navbar />
    <div class="container mt-5 py-5">
        <h1 class="mb-4">Gestion des Utilisateurs (CRUD Complet)</h1>

        <div class="card mb-4 p-4 shadow-sm">
            <h5 class="mb-3">Créer un utilisateur (Anlegen)</h5>
            <div class="row g-3">
                <div class="col-md-4">
                    <input v-model="newUser.name" type="text" class="form-control" placeholder="Nom complet">
                </div>
                <div class="col-md-4">
                    <input v-model="newUser.email" type="email" class="form-control" placeholder="Email (ex: test@mail.com)">
                </div>
                <div class="col-md-2">
                    <select v-model="newUser.role" class="form-select">
                        <option value="USER">USER</option>
                        <option value="ADMIN">ADMIN</option>
                    </select>
                </div>
                <div class="col-md-2">
                    <button @click="createUser" class="btn btn-primary w-100">Créer</button>
                </div>
            </div>
        </div>

        <div v-if="loading" class="text-center my-5">
            <div class="spinner-border text-primary"></div>
        </div>

        <div v-else-if="users.length > 0" class="table-responsive">
            <table class="table table-hover align-middle">
                <thead class="table-dark">
                    <tr>
                        <th>Nom (Editable)</th>
                        <th>Email (Editable)</th>
                        <th>Rôle</th>
                        <th class="text-end">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="user in users" :key="user.id">
                        <td><input v-model="user.name" class="form-control form-control-sm" /></td>
                        <td><input v-model="user.email" class="form-control form-control-sm" /></td>
                        <td>
                            <span :class="user.role === 'ADMIN' ? 'badge bg-danger' : 'badge bg-success'">
                                {{ user.role }}
                            </span>
                        </td>
                        <td class="text-end">
                            <button @click="saveUser(user)" class="btn btn-sm btn-success me-1">
                                Save
                            </button>

                            <button @click="saveUser(user, user.role === 'ADMIN' ? 'USER' : 'ADMIN')" 
                                    class="btn btn-sm btn-outline-warning me-1">
                                Switch Role
                            </button>

                            <button @click="deleteUser(user.id)" class="btn btn-sm btn-danger">
                                Delete
                            </button>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        
        <div v-else class="alert alert-info text-center">Aucun utilisateur en base.</div>
    </div>
    <Footer />
</template>

<style scoped>
.table-responsive { background: white; padding: 20px; border-radius: 12px; shadow: 0 4px 15px rgba(0,0,0,0.1); }
.card { border-radius: 12px; border: none; background-color: #f8f9fa; }
</style>