<script setup>
import FooterLink from './FooterLink.vue';
</script>

<template>
  <footer class="custom-footer bg-light py-4">
    <div class="container d-flex justify-content-between align-items-center flex-wrap">

      <!-- Contact + Social Icons -->
      <div class="d-flex align-items-center gap-3">
        <FooterLink text="Kontakt" label="Kontakt" href="/kontakt" />
        <span>01590256088</span>
        <div class="social-icons mt-2 d-flex gap-2">
        <span>
          <a href="https://www.instagram.com/deinprofil" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
            <i class="bi bi-instagram"></i>
          </a>
          <a href="https://www.facebook.com/deinprofil" target="_blank" rel="noopener noreferrer" aria-label="Facebook">
            <i class="bi bi-facebook"></i>
          </a>
        </span>
        </div>
      </div>

<!-- Hilfe -->
<div class="d-flex flex-column">
  <FooterLink text="Hilfe" label="Hilfe" href="/hilfe" />
</div>

<!-- Blog -->
<div class="d-flex flex-column">
  <FooterLink text="Blog" label="Blog" href="/blog" />
</div>


    </div>
  </footer>
</template>

<style scoped>
/* Police du footer */
.custom-footer {
  font-family: 'La Belle Aurore', cursive;
}

/* Social icons */
.social-icons i {
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.3s ease, transform 0.3s ease;
  color: #555;
}

.social-icons i:hover {
  color: #EA9424;
  transform: scale(1.2);
}

/* Liens FooterLink */
.footer-link {
  color: #aaa;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer-link:hover {
  color: #ff6600;
}
</style>
