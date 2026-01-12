import { createRouter, createWebHistory } from 'vue-router';

// 1. LES COMPOSANTS POUR LA QUESTION (a) - La Startseite et le Légal
import HomeView from '@/views/AfroHome.vue';
import Impressum from '@/views/Impressum.vue';
import DatenschutzView from '@/views/DatenschutzView.vue';
import UserManagement from '../views/UserManagement.vue';

// 2. TES COMPOSANTS EXISTANTS - Le Catalogue (Stammdaten)
import ProductCatalog from '@/views/ProductCatalogTextile.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import CreateProduct from '@/views/CreateProduct.vue';
import EditProduct from '@/views/EditProduct.vue';
import ModifyProduct from '@/views/ModifyProduct.vue';
import AfroHome from '@/views/AfroHome.vue';

const routes = [
  // --- SECTION QUESTION (a) ---
  { 
    path: '/', 
    name: 'home', 
    component: AfroHome // C'est ici que se trouve ton formulaire mailto:
  },
  { 
    path: '/impressum', 
    name: 'impressum', 
    component: Impressum 
  },
  { 
    path: '/datenschutz', 
    name: 'datenschutz', 
    component: DatenschutzView 
  },

  // --- SECTION CATALOGUE / STAMMDATEN ---
  { 
    path: '/products', 
    name: 'products', 
    component: ProductCatalog 
  },
  { 
    path: '/product/view/:id', 
    name: 'product-detail',
    component: ProductDetail,
    props: true
  },
  { 
    path: '/product/create', 
    name: 'product-create',
    component: CreateProduct 
  },
  { 
    path: '/product/edit/:id', 
    name: 'product-edit',
    component: EditProduct 
  },
  { 
    path: '/product/modify-product/:id', 
    name: 'product-modify',
    component: ModifyProduct 
  },
  {
    path: '/admin/users',
    name: 'UserManagement',
    component: UserManagement
  },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
  // Petit bonus pour l'expérience utilisateur : remonte en haut de page à chaque changement
  scrollBehavior() {
    return { top: 0 };
  }
});

export default router;