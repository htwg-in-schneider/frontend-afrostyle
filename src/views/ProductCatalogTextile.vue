<script setup>
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue';
import ProductCard from '@/components/ProductCard.vue';
import NavButton from '@/components/NavButton.vue';
import { ref, onMounted } from 'vue';
import ProductFilter from '@/components/ProductFilter.vue';




const url = `${import.meta.env.VITE_API_BASE_URL}/api/product`;

const products = ref([]);
onMounted(async () => {
  fetchProducts();
});

async function fetchProducts(filters = {}) {
    try {
        const params = new URLSearchParams();
        if (filters.name) {
        params.append('name', filters.name);
        }
        if (filters.category) {
        params.append('category', filters.category);
    }

    const response = await fetch(`${url}?${params.toString()}`);

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
        products.value = await response.json();
        console.log(products.value);
    } catch (error) {
    console.error('Error fetching products:', error);
  }
}
const normalizeImageUrl = (url) => {
  if (!url) return '';
  
  // Si c'est déjà un lien direct (raw), on ne touche à rien
  if (url.includes('raw.githubusercontent.com')) {
    return url;
  }

  // Si c'est un lien GitHub standard avec /blob/, on le transforme
  if (url.includes('github.com')) {
    return url
      .replace('github.com', 'raw.githubusercontent.com')
      .replace('/blob/', '/'); // Utilise '/blob/' avec les slashs pour être précis
  }
  
  return url;
};




</script>

<template>

    <Navbar />

        <!-- Category Header -->
        <header class="header-container position-relative overflow-hidden mt-5">
            <div class="header-text">
                <h1 class="textile-title">Textile Stoffe</h1>
                <p class="subtitle">Entdecke unsere Bogolan_Textile.</p>
            </div>
            <div class="filter-section mt-4">
                <ProductFilter @product-update="fetchProducts" />
            </div>
        </header>

        <!-- Product Grid -->
        <div class="container py-5 position-relative product-grid-container">

            <div class="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4">
                <div class="col" v-for="product in products" :key="product.id">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card h-100 shadow-sm border-0">
                            <img :src="normalizeImageUrl(product.imageUrl)" class="card-img-top h-100 w-100 object-fit-cover" alt="product">
                        </div>
                        <div class="card-body d-flex flex-column">
                            <h5 class="fw-bold">{{ product.title }}</h5>
                            <p class="text-muted small flex-grow-1">{{ product.description }}</p>
                            <NavButton variant="accent" :to="`/product/view/${product.id}`">Details</NavButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="container py-4">
            <div class="row g-4 text-center">
            <div class="col-md-4"></div>
            <div class="col-md-4">
                <NavButton to="/product/create">Neues Produkt</NavButton>
            </div>
            <div class="col-md-4"></div>
            
            </div>
        </div>
    <Footer />

</template>

<style scoped>
.header-container {
  /* Ajustez cette valeur (ex: 80px ou 100px) pour descendre l'entête */
  margin-top: 80px; 
  
  min-height: 250px;
  background-color: #ffffff;
  display: flex;
  flex-direction: column;
  align-items: center; /* Centre horizontalement le texte et le filtre */
  justify-content: center;
}

.header-text {
  text-align: center;
  z-index: 1;
}

.textile-title {
  font-family: 'cursive', sans-serif;
  font-size: 3.5rem;
  margin-bottom: 0.5rem;
}

.subtitle {
  font-size: 1.2rem;
  color: #666;
}

/* On s'assure que la barre de recherche prend une largeur correcte */
.filter-section {
  width: 100%;
  max-width: 800px;
  z-index: 2;
}

/* On s'assure que les cartes produits sont bien opaques pour masquer l'ellipse */
.card {
  background-color: #ffffff !important; 
  position: relative;
  z-index: 1; /* Supérieur à l'ellipse */
}

/* Pour que les images remplissent bien leur cadre sans déformation */
.object-fit-cover {
  object-fit: cover;
}
</style>