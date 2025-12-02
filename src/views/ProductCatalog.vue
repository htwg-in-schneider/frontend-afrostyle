<script setup>
import Footer from '@/components/Footer.vue';
import Navbar from '@/components/Navbar.vue';
import ProductCard from '@/components/ProductCard.vue';
import NavButton from '@/components/NavButton.vue';


import { products } from '@/data.js';

function getProducts() {
  return products;
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
    <!-- Product Grid -->
    <div class="container py-5">
        <div class="row g-4">
            <div class="col-12 col-sm-6 col-md-4 col-lg-3" v-for="product in getProducts()":key="product.id">
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
</template>