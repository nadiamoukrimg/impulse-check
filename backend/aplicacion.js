import express from 'express';

import rutasSalud from './rutas/rutasSalud.js';
import rutasImpulsos from './rutas/rutasImpulsos.js';
import { corsPermitido } from './middleware/corsPermitido.js';
import { rutaNoEncontrada, gestionarErrores } from './middleware/gestionarErrores.js';

const aplicacion = express();

// Activa las cabeceras CORS solo si el entorno define ORIGEN_PERMITIDO.
aplicacion.use(corsPermitido);
aplicacion.use(express.json());
aplicacion.use('/api/health', rutasSalud);
aplicacion.use('/api/impulsos', rutasImpulsos);
aplicacion.use(rutaNoEncontrada);
aplicacion.use(gestionarErrores);

export default aplicacion;
