import { Router } from 'express';
import {
  listarImpulsos, obtenerImpulso, crearImpulso, editarImpulso, eliminarImpulso,
} from '../controladores/controladorImpulsos.js';

const rutasImpulsos = Router();

rutasImpulsos.param('id', (peticion, respuesta, siguiente, id) => {
  if (!/^[a-fA-F0-9]{24}$/.test(id)) {
    return respuesta.status(400).json({ mensaje: 'El identificador no es válido.' });
  }
  siguiente();
});

rutasImpulsos.get('/', listarImpulsos);
rutasImpulsos.get('/:id', obtenerImpulso);
rutasImpulsos.post('/', crearImpulso);
rutasImpulsos.put('/:id', editarImpulso);
rutasImpulsos.delete('/:id', eliminarImpulso);

export default rutasImpulsos;
