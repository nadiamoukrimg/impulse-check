export function rutaNoEncontrada(_peticion, respuesta) {
  respuesta.status(404).json({ mensaje: 'Ruta no encontrada.' });
}

export function gestionarErrores(error, _peticion, respuesta, _siguiente) {
  if (error.type === 'entity.parse.failed') {
    return respuesta.status(400).json({ mensaje: 'El cuerpo contiene JSON no válido.' });
  }
  if (error.type === 'entity.too.large') {
    return respuesta.status(413).json({ mensaje: 'El cuerpo de la petición es demasiado grande.' });
  }
  if (error.name === 'ValidationError' || error.name === 'CastError') {
    return respuesta.status(400).json({ mensaje: 'Los datos enviados no son válidos.' });
  }
  // No devolver mensajes internos, trazas ni información de conexión al cliente.
  respuesta.status(500).json({ mensaje: 'No se pudo completar la operación.' });
}
