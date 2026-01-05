import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const healthCheckMiddleware = () => ({
  name: 'health-check',
  configureServer(server) {
    server.middlewares.use('/api/health', (req, res) => {
      res.statusCode = 200;
      res.setHeader('Content-Type', 'text/plain');
      res.end('ok');
    });
  },
});

export default defineConfig({
    plugins: [react(), healthCheckMiddleware()],
    root: '.',
    server: {
        port: 3000,
        open: true,
    },
    build: {
        outDir: 'dist',
        sourcemap: true,
    },
    test: {
        globals: true,
        environment: 'jsdom',
    },
});
