import './assets/style.css'
import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { createAuth0 } from '@auth0/auth0-vue'
import App from './App.vue'
import router from './router'

const app = createApp(App)

// Initialisation d'Auth0 avec les variables d'environnement
const auth0 = createAuth0({
    domain: import.meta.env.VITE_AUTH0_DOMAIN,
    clientId: import.meta.env.VITE_AUTH0_CLIENT_ID,
    authorizationParams: {
        audience: import.meta.env.VITE_AUTH0_AUDIENCE,
        // Indispensable pour GitHub Pages (Page 21 du PDF)
        redirect_uri: window.location.origin + window.location.pathname
    }
})

app.use(createPinia())
app.use(router)
app.use(auth0)

app.mount('#app')

console.log('API Base URL:', import.meta.env.VITE_API_BASE_URL)