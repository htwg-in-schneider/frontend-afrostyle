<script setup>
import FooterLink from './FooterLink.vue';
</script>

<template>
  <footer class="custom-footer bg-light py-4 border-top">
    <div class="container d-flex justify-content-between align-items-start flex-wrap">

      <div class="d-flex flex-column align-items-start gap-2">
        <span class="contact-number">01590256088</span>
        <div class="social-icons d-flex gap-3">
          <a href="https://www.instagram.com" target="_blank"><i class="bi bi-instagram"></i></a>
          <a href="https://www.facebook.com" target="_blank"><i class="bi bi-facebook"></i></a>
        </div>
      </div>

      <div class="d-flex flex-column">
        <FooterLink text="Hilfe" href="/hilfe" />
        <FooterLink text="Blog" href="/blog" />
      </div>

      <div class="d-flex flex-column align-items-end">
        <FooterLink text="Impressum" href="/impressum" />
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