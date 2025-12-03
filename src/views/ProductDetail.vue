<script setup>
  import Footer from '@/components/Footer.vue';
  import Navbar from '@/components/Navbar.vue';
  import NavButton from '@/components/NavButton.vue';
  import Button from '@/components/Button.vue';
  import ProductReviews from '@/components/ProductReviews.vue';
  import { ref, onMounted } from 'vue';

  const url = `${import.meta.env.VITE_API_BASE_URL}/api/product`;

  const props = defineProps({
      id: {
          type: [String, Number],
          required: true
      }
  });

  const product = ref(null);
  onMounted(async () => fetchProduct());

  async function fetchProduct() {
    try {
      const response = await fetch(`${url}/${props.id}`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      product.value = await response.json();
      console.log(product.value);
    } catch (error) {
      console.error('Error fetching product:', error);
    }
  }
</script>

<template>
  <Navbar />
    <section class="container py-5">
      <div v-if="product" class="row">
        <div class="col-md-6">
          <img :src="product.imageUrl" class="img-fluid" :alt="product.title" />
        </div>
        <div class="col-md-6">
          <h2 class="fw-bold">{{ product.title }}</h2>
            <p class="text-accent fw-bold fs-4">{{ product.price }} €</p>
            <p>{{ product.description }}</p>
            <NavButton variant="secondary" class="me-2" to="/">Zurück</NavButton>
            <Button variant="accent">In den Warenkorb</Button>
            <ProductReviews :productId="id" />
        </div>
      </div>
      <div v-else class="text-center">
        <p>Produkt wurde nicht gefunden.</p>
        <NavButton variant="secondary" class="me-2" to="/">Zurück</NavButton>
      </div>
    </section>
  <Footer />
  </template>
