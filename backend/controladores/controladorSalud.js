export function obtenerSalud(_peticion, respuesta) {
  respuesta.status(200).json({
    estado: 'ok',
    mensaje: 'La API de Impulse Check funciona correctamente',
  });
}

