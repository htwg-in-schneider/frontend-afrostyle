<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
</script>



<template>
  <Navbar />
  <div class="container my-5 py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="fw-bold mb-4">Impressum</h1>
        <section class="mb-4">
          <h5 class="fw-bold">Angaben gemäß § 5 TMG</h5>
          <p>
            Madeleine Pahwang<br />
            AfroStyle Projekt<br />
            Brauneggerstraße 55<br />
            78462 Konstanz
          </p>
        </section>
        
        <section class="mb-4">
          <h5 class="fw-bold">Kontakt</h5>
          <p>
            Telefon: +49 (0) 159 02 56088<br />
            E-Mail: MadeleinePahwangFotso@htwg-konstanz.de
          </p>
        </section>

        <section>
          <h5 class="fw-bold">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h5>
          <p>Madeleine Pahwang<br />Brauneggerstraße 55<br />
            78462 Konstanz</p>
        </section>
        
        <router-link to="/" class="btn btn-outline-dark mt-4">Zurück zur Startseite</router-link>
      </div>
    </div>
  </div>
  <Footer />
</template>


<style scoped>
.container {
  max-width: 800px;
  padding-top: 100px;
}
</style>
