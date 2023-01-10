import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default ({ mode }) => {
  return defineConfig({
    //vite config
      plugins: [react()],
      envDir:'../',
      envPrefix:'SECRET_',
      server: {
        proxy: {
          '/api/': 'http://127.0.0.1:4000/',
        },
      },
  });
}

