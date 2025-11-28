
<script setup>
import { ref } from 'vue';

const showBanner = ref(true);

function closeBanner() {
    showBanner.value = false;
}
</script>
  <template>
    <!-- HEADER -->
    <header class= "header-with-eclipse" >
      <nav class="navbar navbar-expand-lg navbar-light bg-white shadow-sm py-3">
        <div class="container d-flex justify-content-between align-items-center">
          <!-- Logo -->
          <a class="navbar-brand fw-bold text-accent" href="index.html">
            <img src="./assets/logo_Desktop.svg" alt="afroStslyle Logo" height="100">
          </a>
          <!-- Demi-cercle ovale -->
   
          <img src="./assets/image/Ellipse 1.svg" alt="Shape" class="img-fluid ">
    
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



    <!-- Category Header -->
    <section class="hero text-center position-relative py-5">

        <!-- Demi-cercle ovale en fond -->
        <div class="ovale_Shape position-absolute w-100 ">
            <img src="./assets/image/Frame 14.svg" alt="Shape" class="img-fluid" style= "max-height: 1200px; z-index: 1; position: relative;">
        </div>
        <div >
            <p>Entdecke unsere Bogolan_Textile.</p>
        </div>


    </section>

    <!-- Product Grid -->
    <div class="btn-accent mt-auto active ">
        <div class="row g-4">
            <!-- Product Card -->
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <img src="./assets/image/Rectangle 14.svg" class="card-img-top"
                        alt="Produktbild">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">Bogolan</h5>
                        <p class="card-text text-accent fw-bold">40,00 €</p>
                    </div>
                </div>
            </div>
            <!-- Product Card -->
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <img src="./assets/image/Rectangle 12.svg" class="card-img-top"
                        alt="Produktbild">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">Bogolan</h5>
                        <p class="card-text text-accent fw-bold">30,00 €</p>
                    </div>
                </div>
            </div>
            <!-- Product Card -->
            <div class="col-md-4">
                <div class="card h-100 shadow-sm">
                    <img src="./assets/image/Rectangle 13.svg" class="card-img-top"
                        alt="Produktbild">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">Bogolan</h5>
                        <p class="card-text text-accent fw-bold">35,00 €</p>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- FOOTER -->
    <footer class="bg-light py-4">
      <div class="container d-flex justify-content-between align-items-center flex-wrap">

        <!-- Kontakt + icônes -->
        <div class="d-flex align-items-center gap-3">
          <strong>Kontakt:</strong> 
          <span> 01590256088</span>
          <div class="social-icons mt-2">
            <i class="bi bi-instagram mx-2"></i>
            <i class="bi bi-facebook mx-2"></i>
          </div>
        </div>

        <!-- Hilfe -->
        <div>
          <strong>Hilfe</strong>
        </div>

        <!-- Blog -->
        <div>
          <strong>Blog</strong>
        </div>
      </div>
    </footer>
  </template>
  <style scoped></style>
