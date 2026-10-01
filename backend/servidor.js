import 'dotenv/config';

import aplicacion from './aplicacion.js';
import { conectarMongo } from './configuracion/conexionMongo.js';

const puerto = process.env.PUERTO || 3000;

try {
  await conectarMongo();
  console.log('Conexión con MongoDB establecida.');
  aplicacion.listen(puerto, () => {
    console.log(`API de Impulse Check disponible en http://localhost:${puerto}`);
  });
} catch {
  // No imprimir el error original: podría contener datos de conexión.
  console.error('No se pudo conectar con MongoDB. Revisa MONGODB_URI y el acceso a Atlas.');
  process.exitCode = 1;
}
