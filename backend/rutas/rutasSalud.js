import { Router } from 'express';

import { obtenerSalud } from '../controladores/controladorSalud.js';

const rutasSalud = Router();

rutasSalud.get('/', obtenerSalud);

export default rutasSalud;

