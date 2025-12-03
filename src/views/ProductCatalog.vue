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

</script>

<template>

    <Navbar />

        <!-- Category Header -->
        <section class="hero text-center position-relative py-5">

            <!-- Demi-cercle ovale en fond -->
            <div class="ovale_Shape position-absolute w-100 ">
                <img src="./image/Frame 14.svg" alt="Shape" class="img-fluid" style= "max-height: 1200px; z-index: 1; position: relative;">
            </div>
            <div >
                <p>Entdecke unsere Bogolan_Textile.</p>
            </div>
        </section>

        <!-- Search and Filter -->
        <ProductFilter @product-update="fetchProducts" />

        <!-- Product Grid -->
        <div class="container py-5">
            <div class="row g-4">
                <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="product in products":key="product.id">
                    <div class="card h-100 shadow-sm">
                        <img :src="product.imageUrl" class="card-img-top" alt="Produktbild">
                        <div class="card-body d-flex flex-column">
                            <h5 class="card-id">{{ product.id }}</h5>
                            <NavButton variant="accent" class="mt-auto" :to="`/product/${product.id}`">
                                Details
                            </NavButton>
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