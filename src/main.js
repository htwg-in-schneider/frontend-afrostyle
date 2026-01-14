import './assets/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)
const pinia = createPinia()

// Configuration Auth0 - Conforme à la page 21 du PDF de déploiement
app.use(
  createAuth0({
    domain: "dev-5uu2dt8o1qjjp0g1.us.auth0.com",
    clientId: "3VZ6m7z1hq3lFiOwhZ44F4pXTBNg7cPO",
    authorizationParams: {
      // Le secret pour que ça marche partout (Local + GitHub Pages)
      redirect_uri: window.location.origin + window.location.pathname,
      audience: "https://afrostyle-api"
    }
  })
)

app.use(router)
app.use(pinia)

app.mount('#app')

// Utile pour déboguer ton point (c) du devoir
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)