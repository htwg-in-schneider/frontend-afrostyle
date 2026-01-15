
<script setup>
import { ref, onMounted } from 'vue';
import { useAuth0 } from '@auth0/auth0-vue'; // 1. Import de Auth0
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';

const transactions = ref([]);
const { getAccessTokenSilently } = useAuth0(); // 2. Extraction de la fonction token

const fetchData = async () => {
  try {
    // 3. Récupération du jeton admin
    const token = await getAccessTokenSilently();

    const response = await fetch("http://localhost:8080/api/transaktionen", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}` // 4. Envoi du token au backend
      }
    });

    if (!response.ok) {
      throw new Error(`Erreur: ${response.status}`);
    }

    transactions.value = await response.json();
  } catch (err) {
    console.error("Erreur de récupération des transactions :", err);
    // Optionnel: Rediriger si 401 ou afficher un message d'erreur
  }
};

onMounted(fetchData);
</script>




<template>
  <Navbar />
  <div class="container mt-5 pt-5">
    <div class="d-flex justify-content-between align-items-center mb-4">
      <h2>Vue Administrateur : Processus Global</h2>
      <button @click="fetchData" class="btn btn-outline-primary btn-sm">Rafraîchir les données</button>
    </div>

    <div class="table-responsive shadow-sm rounded border bg-white">
      <table class="table table-hover mb-0">
        <thead class="table-dark">
          <tr>
            <th>ID</th>
            <th>Email Client</th>
            <th>Montant</th>
            <th>Statut</th>
            <th>Date de l'achat</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="t in transactions" :key="t.id">
            <td>#{{ t.id }}</td>
            <td>{{ t.customerEmail }}</td>
            <td>{{ t.totalAmount }} €</td>
            <td><span class="badge bg-success">{{ t.status }}</span></td>
            <td>{{ new Date(t.createdAt).toLocaleString() }}</td>
          </tr>
          <tr v-if="transactions.length === 0">
            <td colspan="5" class="text-center">Aucune transaction pour le moment.</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
  <Footer />
</template>
