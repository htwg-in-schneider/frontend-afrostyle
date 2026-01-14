<script setup>
import { ref, onMounted } from 'vue';
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
import { useAuth0 } from '@auth0/auth0-vue'; // AJOUT : Import Auth0

const { getAccessTokenSilently } = useAuth0(); // AJOUT : Outil pour le jeton

const url = `${import.meta.env.VITE_API_BASE_URL}/api/users`;
const users = ref([]);
const loading = ref(true);

const newUser = ref({ name: '', email: '', role: 'USER' });

/**
 * ETAPE 1 : READ (Avec Token)
 */
const fetchUsers = async () => {
    try {
        const token = await getAccessTokenSilently(); // RÉCUPÉRER LE JETON
        const response = await fetch(url, {
            headers: { 'Authorization': `Bearer ${token}` } // ENVOYER LE JETON
        });
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
 * ETAPE 2 : CREATE (Avec Token)
 */
async function createUser() {
    if (!newUser.value.name || !newUser.value.email.includes('@')) {
        alert("Validation Frontend : Nom et Email (@) requis.");
        return;
    }

    try {
        const token = await getAccessTokenSilently(); // RÉCUPÉRER LE JETON
        const response = await fetch(url, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ENVOYER LE JETON
            },
            body: JSON.stringify(newUser.value)
        });

        if (response.ok) {
            alert("Utilisateur créé !");
            newUser.value = { name: '', email: '', role: 'USER' };
            await fetchUsers();
        } else {
            alert("Erreur Backend : " + response.status);
        }
    } catch (error) {
        alert("Erreur lors de la création.");
    }
}

/**
 * ETAPE 3 : UPDATE (Avec Token)
 */
async function saveUser(user, newRole = null) {
    const updatedUser = { ...user, role: newRole || user.role };

    try {
        const token = await getAccessTokenSilently(); // RÉCUPÉRER LE JETON
        const response = await fetch(`${url}/${user.id}`, {
            method: 'PUT',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}` // ENVOYER LE JETON
            },
            body: JSON.stringify(updatedUser)
        });

        if (response.ok) {
            if (newRole) user.role = newRole;
            alert("Mise à jour réussie !");
        }
    } catch (error) {
        alert("Erreur de connexion.");
    }
}

/**
 * ETAPE 4 : DELETE (Avec Token)
 */
async function deleteUser(id) {
    if (!confirm("Voulez-vous vraiment supprimer cet utilisateur ?")) return;

    try {
        const token = await getAccessTokenSilently(); // RÉCUPÉRER LE JETON
        const response = await fetch(`${url}/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` } // ENVOYER LE JETON
        });

        if (response.ok) {
            alert("Utilisateur supprimé.");
            await fetchUsers();
        }
    } catch (error) {
        alert("Erreur réseau.");
    }
}
</script>