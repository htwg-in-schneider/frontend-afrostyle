<script setup>
</script>

<template>
  <div class="hero-wrapper">
    <div class="hero-image-container">
      <img src="../assets/image_Hero.svg" 
           alt="African Art Header" class="main-hero-img">
    </div>

    <div class="welcome-section text-center py-5">
      <h2 class="fw-bold mb-3">WILLKOMMEN IN AFRIKA</h2>
      <p class="welcome-text mx-auto">
        Liebst du den afrikanischen Stil und möchtest ihn in deinen Alltag integrieren? 
        Dann bist du hier genau richtig! AfroStyle bietet dir die Möglichkeit, 
        die afrikanische Welt kennenzulernen.
      </p>
      <router-link to="/products" class="btn btn-next mt-4">
        Next &rarr;
      </router-link>
      <div class="banner-container mb-5 text-center">
      <img src="../assets/image_2.svg"
           alt="image_2" class="image-banner">
    </div>

    </div>
  </div>
</template>

<style scoped>

.hero-image-container {
  width: 100%;
  display: flex;
  justify-content: center;
  overflow: hidden; /* Empêche les débordements */
  background-color: #f8f9fa; /* Optionnel : fond léger pour voir la zone */
}  
.main-hero-img {
  width: 100%;
  max-width: 1200px; /* Limite la largeur pour ne pas déformer le SVG */
  height: auto;      /* Laisse le SVG décider de sa hauteur pour ne pas l'étirer */
  max-height: 500px; /* Limite la hauteur maximale */
  display: block;
  object-fit: contain; /* Important pour les SVG : évite de couper le dessin */
}

.welcome-text {
  max-width: 700px;
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
}

.btn-next {
  background-color: #A03E15; /* Marron/Orange foncé comme ton image */
  color: white;
  padding: 12px 40px;
  border-radius: 5px;
  text-decoration: none;
  font-weight: bold;
  display: inline-block;
}
.image-banner {
  display: block;      /* Transforme l'image en bloc */
  margin: 0 auto;      /* Centre l'image horizontalement */
  max-width: 100%;     /* Empêche l'image de dépasser sur mobile */
  height: auto;        /* Garde les proportions */
  max-height: 250px;   /* Ajuste selon la taille voulue comme sur ton image */
}

/* Version Mobile */
@media (max-width: 768px) {
  .main-hero-img {
    max-height: 300px;
  }
}
</style>