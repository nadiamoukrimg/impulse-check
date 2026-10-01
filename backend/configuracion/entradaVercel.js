import 'dotenv/config';

import aplicacion from '../aplicacion.js';
import { conectarMongo } from './conexionMongo.js';

// Vercel no ejecuta servidor.js: las peticiones llegan a funciones serverless.
// Esta entrada conecta con Atlas una sola vez por instancia caliente y reutiliza
// esa misma conexión entre peticiones; si falla, se limpia para reintentar en la siguiente.
let conexion;

function obtenerConexion() {
  if (!conexion) {
    conexion = conectarMongo().catch(error => {
      conexion = undefined;
      throw error;
    });
  }
  return conexion;
}

// Express enruta con la URL original de la petición (req.url), por eso la entrada
// solo espera a la conexión y delega en la misma aplicación usada en local.
export function manejarPeticion(peticion, respuesta) {
  return obtenerConexion().then(() => aplicacion(peticion, respuesta));
}
