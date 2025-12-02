<script setup>
</script>
<template>      
    <!-- HEADER -->
    <header class= "header-with-eclipse" >  
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div class="container d-flex justify-content-between align-items-center">
          <!-- Logo -->
          <router-link class="navbar-brand fw-bold text-accent" to="/">
            <img src="../assets/logo_Desktop.svg" alt="afroStslyle Logo" height="100">
          </router-link>

          <!-- Demi-cercle ovale -->
   
          <img src="../assets/image/Ellipse1.svg" alt="Shape" class="img-fluid ">
    
          <!-- Bouton hamburger (mobile) -->
          <button class="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
            <span class="navbar-toggler-icon"></span>
          </button>



          <!-- Liens / icônes -->
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto d-flex align-items-center gap-3 mb-0">
              <li class="nav-item">
                <a class="nav-link" href="recherche.html" aria-label="Recherche">
                  <i class="bi bi-search fs-4"></i>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link position-relative" href="panier.html" aria-label="Panier">
                  <i class="bi bi-cart fs-4"></i>
                  <span class="position-absolute top-0 start-100 translate-middle ">
                  </span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="profil.html" aria-label="Profil">
                  <i class="bi bi-person-circle" fs-4></i>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
    <!-- NAVBAR SECONDAIRE -->
    <nav class="navbar custom-navbar">
        <div class="container d-flex justify-content-center">
            <ul class="navbar-nav text-center flex-row">
                <li class="nav-item"><a href="Bogolan_textile" class="nav-link custom-text">Textile_Stoffe</a></li>
                <li class="nav-item"><a href="#" class="nav-link custom-text">Bekleidung</a></li>
                <li class="nav-item"><a href="#" class="nav-link custom-text">Accessoires</a></li>
                <li class="nav-item"><a href="#" class="nav-link custom-text">Home</a></li>
            </ul>
        </div>
    </nav>
</template>

<style scoped>

</style>