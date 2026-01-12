<script setup>
const props = defineProps({
  text: String,
  href: { type: String, default: '#' }
});
</script>

<template>
  <router-link :to="href" class="footer-link">
    {{ text }}
  </router-link>
</template>

<style scoped>
.footer-link {
  font-family: 'La Belle Aurore', cursive;
  color: #333; /* Couleur plus foncée pour être visible */
  text-decoration: none;
  font-size: 1.2rem;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #A03E15; 
}
</style>