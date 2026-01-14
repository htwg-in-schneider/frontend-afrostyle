import './assets/style.css'
import { createApp } from 'vue'
import { createAuth0 } from '@auth0/auth0-vue' // 1. On importe Auth0
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

const pinia = createPinia()
const app = createApp(App)

// 2. Configuration d'Auth0 (Page 19 du cours)
app.use(
  createAuth0({
    domain: "dev-5uu2dt8o1qjjp0g1.us.auth0.com",
    client_id: "3VZ6m7z1hq3lFiOwhZ44F4pXTBNg7cPO",
    authorizationParams: {
      redirect_uri: window.location.origin,
      audience: "https://afrostyle-api"
    }
  })
)

app.use(router)
app.use(pinia)
app.mount('#app')

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)