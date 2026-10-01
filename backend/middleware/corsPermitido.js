// Cabeceras CORS configuradas con ORIGEN_PERMITIDO (lista separada por comas).
// Sin la variable definida la middleware no añade nada ni cambia respuestas,
// de modo que el uso local con proxy de Vite sigue funcionando igual que siempre.
export function corsPermitido(peticion, respuesta, siguiente) {
  const permitidos = (process.env.ORIGEN_PERMITIDO || '')
    .split(',')
    .map(origen => origen.trim())
    .filter(Boolean);
  const origen = peticion.headers.origin;

  if (origen && permitidos.includes(origen)) {
    respuesta.setHeader('Access-Control-Allow-Origin', origen);
    respuesta.setHeader('Vary', 'Origin');
    respuesta.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    respuesta.setHeader('Access-Control-Allow-Headers', 'Accept,Content-Type');
    respuesta.setHeader('Access-Control-Max-Age', '86400');
  }

  // Preflight: se responde aquí para que no llegue a las rutas de la API.
  if (peticion.method === 'OPTIONS') return respuesta.status(204).end();
  siguiente();
}
