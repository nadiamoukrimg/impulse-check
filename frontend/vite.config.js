import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
  const entorno = loadEnv(mode, process.cwd(), '');
  const proxy = entorno.API_DESTINO
    ? { '/api': { target: entorno.API_DESTINO, changeOrigin: true } }
    : undefined;

  return {
    server: { proxy },
    preview: { proxy },
  };
});
