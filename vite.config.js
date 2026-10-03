import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// shortiki.com has no CORS headers, so the browser calls /api/joke and we proxy it.
// Same rewrite lives in vercel.json and public/_redirects for deploys.
const jokeProxy = {
  '/api/joke': {
    target: 'https://shortiki.com',
    changeOrigin: true,
    rewrite: () => '/export/api.php?format=json&type=top&amount=100',
  },
}

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: { proxy: jokeProxy },
  preview: { proxy: jokeProxy },
})
