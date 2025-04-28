  import { defineConfig } from 'vite'
  import react from '@vitejs/plugin-react'

  // https://vite.dev/config/
  export default defineConfig({
    plugins: [react()],

    build: {
      outDir: 'build', // Make sure this is the directory that you want to deploy from
    },
  })
