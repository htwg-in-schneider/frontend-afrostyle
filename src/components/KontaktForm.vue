<script setup>
</script>



<template>
  <section class="kontakt-section">
    <div class="banner-container mb-5 text-center">
      <img src="../assets/image_2.svg"
           alt="image_2" class="image-banner">
    </div>

    <div class="container pb-5">
      <div class="row justify-content-center">
        <div class="col-md-6 text-center">
          <h3 class="mb-4">Kontaktieren Sie uns</h3>
          <form action="mailto:MadeleinePahwangFotso@htwg-konstanz.de" method="GET" enctype="text/plain">
            <div class="mb-3">
              <input type="text" name="subject" class="form-control custom-input" placeholder="subject" required>
            </div>
            <div class="mb-3">
              <textarea name="body" class="form-control custom-input" rows="4" placeholder="Ihre Nachricht" required></textarea>
            </div>
            <button type="submit" class="btn btn-next w-100">E-Mail senden</button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.image-banner {
  display: block;      /* Transforme l'image en bloc */
  margin: 0 auto;      /* Centre l'image horizontalement */
  max-width: 100%;     /* Empêche l'image de dépasser sur mobile */
  height: auto;        /* Garde les proportions */
  max-height: 250px;   /* Ajuste selon la taille voulue comme sur ton image */
}

.custom-input {
  border: 1px solid #ccc;
  border-radius: 0; /* Style rectangulaire comme ton image */
  padding: 12px;
}

.btn-next {
  background-color: #A03E15;
  color: white;
  border: none;
  padding: 12px;
  font-weight: bold;
}
</style>