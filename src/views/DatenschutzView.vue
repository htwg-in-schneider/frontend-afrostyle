<script setup>
import Navbar from '@/components/Navbar.vue';
import Footer from '@/components/Footer.vue';
</script>


<template>
  <Navbar />
  <div class="container my-5 py-5">
    <div class="row justify-content-center">
      <div class="col-md-8">
        <h1 class="fw-bold mb-4">Datenschutzerklärung</h1>
        
        <h5 class="fw-bold">1. Datenschutz auf einen Blick</h5>
        <p>
          Diese Datenschutzerklärung klärt Sie über die Art, den Umfang und Zweck der Verarbeitung von personenbezogenen Daten innerhalb unseres Onlineangebotes auf.
        </p>

        <h5 class="fw-bold mt-4">2. Datenerfassung auf unserer Website</h5>
        <p>
          <strong>Kontaktformular:</strong> Wenn Sie uns per Kontaktformular (mailto) Anfragen zukommen lassen, werden Ihre Angaben aus der E-Mail inklusive der von Ihnen dort angegebenen Kontaktdaten zwecks Bearbeitung der Anfrage bei uns gespeichert. 
        </p>

        <h5 class="fw-bold mt-4">3. Rechte der betroffenen Person</h5>
        <p>
          Sie haben jederzeit das Recht, unentgeltlich Auskunft über Herkunft, Empfänger und Zweck Ihrer gespeicherten personenbezogenen Daten zu erhalten.
        </p>

        <router-link to="/" class="btn btn-outline-dark mt-4">Zurück zur Startseite</router-link>
      </div>
    </div>
  </div>
  <Footer />
</template>

