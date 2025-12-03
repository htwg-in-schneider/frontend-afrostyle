import { createRouter, createWebHistory } from 'vue-router';
import ProductCatalog from '@/views/ProductCatalog.vue';
import ProductDetail from '@/views/ProductDetail.vue';
import CreateProduct from '@/views/CreateProduct.vue';
import EditProduct from '@/views/EditProduct.vue';

const routes = [
  { path: '/', component: ProductCatalog },
  { 
    path: '/product/view/:id', 
    name: 'product',
    component: ProductDetail,
    props: true
  },
  { path: '/product/create', component: CreateProduct },
  { path: '/product/edit/:id', component: EditProduct },
];

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes,
});

export default router;