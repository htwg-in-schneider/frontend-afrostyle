<script setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const { getAccessTokenSilently } = useAuth0();
const transactions = ref([]);
const editingId = ref(null); // Pour savoir quelle ligne on modifie
const url = `${import.meta.env.VITE_API_BASE_URL}/api/transaktionen`;

const fetchData = async () => {
  try {
    const token = await getAccessTokenSilently();
    const response = await fetch(url, {
      headers: { "Authorization": `Bearer ${token}` }
    });
    if (response.ok) transactions.value = await response.json();
  } catch (err) {
    console.error("Erreur de récupération :", err);
  }
};

// Fonction pour STOPPER (PATCH)
const stopTransaction = async (id) => {
  try {
    const token = await getAccessTokenSilently();
    await fetch(`${url}/${id}/stop`, {
      method: 'PATCH',
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchData(); // Rafraîchir la liste
  } catch (err) { alert("Erreur lors de l'arrêt"); }
};

// Fonction pour SUPPRIMER (DELETE)
const deleteTransaction = async (id) => {
  if (!confirm("Supprimer définitivement ?")) return;
  try {
    const token = await getAccessTokenSilently();
    await fetch(`${url}/${id}`, {
      method: 'DELETE',
      headers: { "Authorization": `Bearer ${token}` }
    });
    fetchData();
  } catch (err) { alert("Erreur suppression"); }
};

// Logique d'édition
const startEdit = (t) => { editingId.value = t.id; };
const cancelEdit = () => { editingId.value = null; };
const saveEdit = async (t) => {
  try {
    const token = await getAccessTokenSilently();
    await fetch(`${url}/${t.id}`, {
      method: 'PUT',
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(t)
    });
    editingId.value = null;
    fetchData();
  } catch (err) { alert("Erreur modification"); }
};

onMounted(fetchData);
</script>




<template>
  <Navbar />
  <div class="container mt-5 pt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Gestion des Transactions 💳</h2>
      <button @click="fetchData" class="btn btn-outline-primary btn-sm">neue laden</button>
    </div>

    <div class="table-responsive shadow-sm rounded border bg-white">
      <table class="table align-middle mb-0">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Email</th>
            <th>Montant</th>
            <th>Statut</th>
            <th class="text-end">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transactions" :key="t.id">
            <td>#{{ t.id }}</td>
            
            <td>
              <input v-if="editingId === t.id" v-model="t.customerEmail" class="form-control form-control-sm">
              <span v-else>{{ t.customerEmail}}</span>
            </td>

            <td>
              <input v-if="editingId === t.id" type="number" v-model="t.totalAmount" class="form-control form-control-sm w-75">
              <span v-else>{{ t.totalAmount }} €</span>
            </td>

            <td>
              <select v-if="editingId === t.id" v-model="t.status" class="form-select form-select-sm">
                <option value="PENDING">PENDING</option>
                <option value="COMPLETED">COMPLETED</option>
                <option value="CANCELLED">CANCELLED</option>
              </select>
              <span v-else :class="['badge', t.status === 'CANCELLED' ? 'bg-danger' : 'bg-success']">
                {{ t.status }}
              </span>
            </td>

            <td class="text-end">
              <div v-if="editingId === t.id" class="btn-group">
                <button @click="saveEdit(t)" class="btn btn-sm btn-success">Valider</button>
                <button @click="cancelEdit" class="btn btn-sm btn-light border">Annuler</button>
              </div>
              <div v-else class="btn-group">
                <button @click="startEdit(t)" class="btn btn-sm btn-outline-primary">Modify</button>
                <button @click="stopTransaction(t.id)" class="btn btn-sm btn-outline-warning" title="Stopper">Stop</button>
                <button @click="deleteTransaction(t.id)" class="btn btn-sm btn-outline-danger">Delete</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Footer />
</template>
