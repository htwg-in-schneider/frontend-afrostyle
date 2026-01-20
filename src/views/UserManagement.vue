<script setup>
import { ref, onMounted, computed } from 'vue'
import Navbar from '@/components/Navbar.vue'
import Footer from '@/components/Footer.vue'
import { useAuth0 } from '@auth0/auth0-vue'

// 🔐 Auth0
const { user, isAuthenticated, getAccessTokenSilently } = useAuth0()

// 🌐 API
const API_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
const url = `${API_URL}/api/users`

// 📦 State
const users = ref([])
const loading = ref(true)
const isAdmin = ref(false) // Changé de computed à ref pour plus de contrôle
const newUser = ref({ name: '', email: '', role: 'USER' })
const editingId = ref(null)



// ======================
// CHARGEMENT & VÉRIFICATION
// ======================
const fetchUsers = async () => {
  if (!isAuthenticated.value) return

  loading.value = true
  try {
    const token = await getAccessTokenSilently()

    // 1. Vérification du rôle via le Profile (comme dans la Navbar)
    const profileResponse = await fetch(`${API_URL}/api/profile`, {
      headers: { Authorization: `Bearer ${token}` }
    })

    if (profileResponse.ok) {
      const profileData = await profileResponse.json()
      isAdmin.value = profileData.role === 'ADMIN'
      
      console.log("Vérification Admin sur la page Users:", isAdmin.value)
    }

    // 2. Si on est Admin, on charge la liste complète
    if (isAdmin.value) {
      const response = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` }
      })
      if (response.ok) {
        users.value = await response.json()
      } else {
        console.error("Erreur Backend lors du fetch users:", response.status)
      }
    }
  } catch (err) {
    console.error("Erreur globale fetchUsers:", err)
  } finally {
    loading.value = false
  }
}


// ======================
// CRUD ACTIONS (Inchangées mais utilisent le token)
// ======================
async function createUser() {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(newUser.value)
    })
    if (response.ok) {
      newUser.value = { name: '', email: '', role: 'USER' }
      await fetchUsers()
    }
  } catch (err) {
    alert('Erreur création')
  }
}

function startEdit(u) {
  editingId.value = u.id
}

function cancelEdit() {
  editingId.value = null
}

async function saveUserChanges(u) {
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${url}/${u.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(u)
    })
    if (response.ok) editingId.value = null
  } catch (err) {
    alert('Erreur mise à jour')
  }
}

async function deleteUser(id) {
  if (!confirm('Supprimer cet utilisateur ?')) return
  try {
    const token = await getAccessTokenSilently()
    const response = await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` }
    })
    if (response.ok) await fetchUsers()
  } catch (err) {
    alert('Erreur suppression')
  }
}

onMounted(fetchUsers)
</script>


<template>
  <Navbar />
  <main class="container py-5">

    <div v-if="isAuthenticated && user" class="mb-4 text-center">
      <img
        :src="user.picture"
        alt="Profil"
        class="rounded-circle mb-2"
        width="80"
      />
      <p class="mb-0">{{ user.email }}</p>
      <small class="text-muted">{{ user.sub }}</small>
    </div>

    
    <div v-if="isAdmin">
      <h1 class="mb-4">Gestion des Utilisateurs</h1>
      
      <div class="card p-4 mb-5 shadow-sm border-0 bg-light">
          <h5 class="mb-3">➕ Ajouter un utilisateur</h5>
          <div class="row g-2">
            <div class="col-md-4"><input v-model="newUser.name" placeholder="Nom complet" class="form-control" /></div>
            <div class="col-md-4"><input v-model="newUser.email" placeholder="Email" class="form-control" /></div>
            <div class="col-md-2">
              <select v-model="newUser.role" class="form-select">
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div class="col-md-2"><button @click="createUser" class="btn btn-dark w-100">Ajouter</button></div>
          </div>
      </div>

      <div class="table-responsive bg-white shadow-sm rounded">
        <table class="table align-middle mb-0">
          <thead class="table-light">
            <tr>
              <th>Nom</th>
              <th>E-Mail</th>
              <th>Rôle</th>
              <th class="text-end">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in users" :key="u.id">
              <td>
                <input v-if="editingId === u.id" v-model="u.name" class="form-control form-control-sm" />
                <span v-else class="fw-bold">{{ u.name }}</span>
              </td>

              <td>
                <input v-if="editingId === u.id" v-model="u.email" class="form-control form-control-sm" />
                <span v-else>{{ u.email }}</span>
              </td>

              <td>
                <select v-if="editingId === u.id" v-model="u.role" class="form-select form-select-sm">
                  <option value="USER">USER</option>
                  <option value="ADMIN">ADMIN</option>
                </select>
                <span v-else :class="u.role === 'ADMIN' ? 'badge bg-warning text-dark' : 'badge bg-secondary'">
                    {{ u.role }}
                </span>
              </td>

              <td class="text-end">
                <div v-if="editingId === u.id" class="btn-group">
                  <button @click="saveUserChanges(u)" class="btn btn-success btn-sm">Sauver</button>
                  <button @click="cancelEdit" class="btn btn-outline-secondary btn-sm">Annuler</button>
                </div>
                <div v-else class="btn-group">
                  <button @click="startEdit(u)" class="btn btn-outline-primary btn-sm">Modifier</button>
                  <button @click="deleteUser(u.id)" class="btn btn-outline-danger btn-sm">Supprimer</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-else-if="isAuthenticated" class="alert alert-warning text-center">
      <h2>Accès refusé</h2>
      <p>Désolé {{ user.name }}, seuls les administrateurs ont accès à cette page.</p>
    </div>

    <div v-else class="alert alert-danger text-center">
      <p>Veuillez vous connecter pour continuer.</p>
    </div>

  </main>
  <Footer />
</template>