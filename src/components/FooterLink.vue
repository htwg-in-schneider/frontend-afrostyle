<script setup>
const props = defineProps({
  text: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: false,
    default: ''
  },
  href: {
    type: String,
    required: false,
    default: '#'
  },
});
</script>

<template>
  <a :href="href" class="footer-link" :aria-label="label">
    {{ text }}
  </a>
</template>

<style scoped>
/* Liens du footer adaptés à la classe custom-footer */
.footer-link {
  font-family: 'La Belle Aurore', cursive;
  color: #dcdcdc;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ff6600; 
}
</style>
