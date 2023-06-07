import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import terser from "@rollup/plugin-terser";

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [
        react(),
        terser({
            format: {
                comments: false,
            },
            compress: true,
            mangle: true,
            sourceMap: false
        })
    ],
    build: {
        sourcemap: false,
    },
})
