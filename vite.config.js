import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig(({ command }) => {
  return {
    // Utilise le nom du dépôt uniquement lors du build (production)
    base: command === 'build' ? '/frontend-afrostyle/' : '/',
    
    plugins: [
      vue(),
      vueDevTools({
        launchEditor: 'code',
        enableInProd: false,
        componentInspector: true,
      }),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      },
    },
  }
})