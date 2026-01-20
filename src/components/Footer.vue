<script setup>
import FooterLink from './FooterLink.vue';
</script>

<template>
  <footer class="custom-footer bg-light py-4 border-top">
    <div class="container d-flex justify-content-between align-items-start flex-wrap">

      <div class="d-flex flex-column align-items-start gap-2">
        <FooterLink text="Kontakt" href="/KontaktForm" />
      </div>

      <div class="d-flex flex-column">
        <FooterLink text="Impressum" href="/impressum" />
      </div>

      <div class="d-flex flex-column align-items-end">
        <FooterLink text="Datenschutz" href="/datenschutz" />
      </div>

    </div>
  </footer>
</template>

<style scoped>
.custom-footer {
  font-family: 'La Belle Aurore', cursive;
}

/* On s'assure que les liens ont un peu d'espace entre eux verticalement */
.d-flex.flex-column {
  gap: 5px;
}

.contact-number {
  font-size: 1.1rem;
  color: #555;
}

.social-icons i {
  font-size: 1.5rem;
  color: #555;
  transition: transform 0.3s ease;
}

.social-icons i:hover {
  color: #EA9424;
  transform: scale(1.1);
}
</style>