import './assets/style.css'
import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

// Configuration d'Auth0 adaptée pour GitHub Pages
app.use(
  createAuth0({
    domain: "dev-5uu2dt8o1qjjp0g1.us.auth0.com",
    client_id: "3VZ6m7z1hq3lFiOwhZ44F4pXTBNg7cPO",
    authorizationParams: {
      // On ajoute explicitement le nom du dépôt pour éviter les erreurs 404 au retour de login
      redirect_uri: window.location.origin + '/frontend-afrostyle/',
      audience: "https://afrostyle-api"
    }
  })
)

app.use(router)
app.use(pinia)
app.mount('#app')

// Vérification de la variable d'environnement dans la console
console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)