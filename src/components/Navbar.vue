<script setup>
</script>
<template>      
  <!-- HEADER -->
  <header class="main-header">  
    <div class="header-top-bar">
      <div class="container d-flex justify-content-between align-items-center">
        <!-- Logo -->
        <router-link to="/" class="logo-wrapper">
          <img src="../assets/logo_Desktop.svg" alt="afroStslyle Logo" class="logo-img">
        </router-link>

        <!-- Demi-cercle ovale -->
   
        <div class="ellipse-container">
          <img src="../assets/Ellipse1.svg" alt="" class="nav-shape-ellipse">
        </div>

        <!-- Liens / icônes -->
        <div class="header-icons">
          <router-link to="/recherche" class="icon-link"><i class="bi bi-search"></i></router-link>
          <router-link to="/panier" class="icon-link"><i class="bi bi-cart"></i></router-link>
          <router-link to="/profil" class="icon-link"><i class="bi bi-person-circle"></i></router-link>
        </div>
      </div>
    </div>
      <!-- NAVBAR SECONDAIRE -->
      <nav class="secondary-nav">
        <div class="container">
          <ul class="nav-links-list">
            <li><router-link to="/" class="custom-text">Textile_Stoffe</router-link></li>
            <li><a href="#" class="custom-text">Bekleidung</a></li>
            <li><a href="#" class="custom-text">Accessoires</a></li>
            <li><a href="#" class="custom-text">Home</a></li>
          </ul>
        </div>
      </nav>
    </header>
</template>

<style scoped>
/* Conteneur principal */
.main-header {
  width: 100%;
  background-color: #fff;
}

/* Barre du haut (Logo + Icones) */
.header-top-bar {
  height: 100px; /* On fixe la hauteur pour éviter les décalages */
  display: flex;
  align-items: center; /* Aligne verticalement au centre */
  border-bottom: 1px solid #f0f0f0;
}

.logo-img {
  height: 70px;
  width: auto;
}

/* --- ICONES (CORRECTION FINALE) --- */
.header-icons {
  display: flex;
  gap: 20px;
  align-items: center;
  height: 100%; /* Prend toute la hauteur du parent pour être centrée */
}

.icon-link {
  font-size: 1.5rem;
  color: #000 !important;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: transform 0.2s;
}

.icon-link:hover {
  transform: scale(1.1);
  color: #EA9424 !important;
}

/* --- ELLIPSE --- */
.ellipse-container {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  pointer-events: none; /* L'ellipse ne doit JAMAIS bloquer le clic */
}

.nav-shape-ellipse {
  height: 50px;
  opacity: 0.6;
}

/* --- NAV SECONDAIRE --- */
.secondary-nav {
  background-color: #fff;
  padding: 15px 0;
}

.nav-links-list {
  display: flex;
  justify-content: center;
  gap: 40px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.custom-text {
  font-family: 'La Belle Aurore', cursive;
  color: #EA9424;
  font-size: 26px;
  text-decoration: none;
  text-shadow: 1px 1px 0 #000;
}
</style>