import Impulso from '../modelos/Impulso.js';

function validarDatos(datos, creacion) {
  if (!datos || typeof datos !== 'object' || Array.isArray(datos)) {
    return 'El cuerpo debe ser un objeto JSON.';
  }
  const campos = ['nombre', 'precio', 'motivo', 'prioridad', 'restriccionPersonal'];
  if (creacion) campos.push('duracionEspera');
  if (Object.keys(datos).some(campo => !campos.includes(campo))) {
    return 'El cuerpo contiene campos no permitidos.';
  }
  if (typeof datos.nombre !== 'string' || !datos.nombre.trim()
      || typeof datos.motivo !== 'string' || !datos.motivo.trim()) {
    return 'Nombre y motivo deben ser textos no vacíos.';
  }
  if (typeof datos.precio !== 'number' || !Number.isFinite(datos.precio) || datos.precio < 0) {
    return 'El precio debe ser un número no negativo.';
  }
  if (creacion && ![1, 3, 7, 14].includes(datos.duracionEspera)) {
    return 'La duración de espera debe ser 1, 3, 7 o 14 días.';
  }
  if ((creacion || Object.hasOwn(datos, 'prioridad'))
      && !['soloLoQuiero', 'seriaUtil', 'creoQueLoNecesito'].includes(datos.prioridad)) {
    return 'Selecciona una prioridad válida.';
  }
  if (Object.hasOwn(datos, 'restriccionPersonal') && typeof datos.restriccionPersonal !== 'string') {
    return 'La restricción personal debe ser un texto.';
  }
  return null;
}

export async function listarImpulsos(_peticion, respuesta) {
  const impulsos = await Impulso.find().sort({ createdAt: -1, _id: -1 });
  respuesta.json(impulsos);
}

export async function obtenerImpulso(peticion, respuesta) {
  const impulso = await Impulso.findById(peticion.params.id);
  if (!impulso) return respuesta.status(404).json({ mensaje: 'Impulso no encontrado.' });
  respuesta.json(impulso);
}

export async function crearImpulso(peticion, respuesta) {
  const mensaje = validarDatos(peticion.body, true);
  if (mensaje) return respuesta.status(400).json({ mensaje });
  const { nombre, precio, motivo, duracionEspera, prioridad, restriccionPersonal } = peticion.body;
  const impulso = await Impulso.create({
    nombre,
    precio,
    motivo,
    prioridad,
    restriccionPersonal,
    fechaFinEspera: new Date(Date.now() + duracionEspera * 24 * 60 * 60 * 1000),
    estado: 'pendiente',
    fechaDecision: null,
  });
  respuesta.status(201).location(`/api/impulsos/${impulso.id}`).json(impulso);
}

function esObjeto(datos) {
  return Boolean(datos) && typeof datos === 'object' && !Array.isArray(datos);
}

function validarDecision(datos) {
  if (Object.keys(datos).length !== 1) {
    return 'La decisión solo puede contener el campo estado.';
  }
  if (!['comprado', 'descartado'].includes(datos.estado)) {
    return "El estado de la decisión debe ser 'comprado' o 'descartado'.";
  }
  return null;
}

async function aplicarDecision(peticion, respuesta) {
  const mensaje = validarDecision(peticion.body);
  if (mensaje) return respuesta.status(400).json({ mensaje });
  const { estado } = peticion.body;
  const filtro = { _id: peticion.params.id, estado: 'pendiente' };
  // Solo la compra exige haber terminado la espera; el descarte anticipado sigue permitido.
  if (estado === 'comprado') filtro.fechaFinEspera = { $lte: new Date() };
  // La fecha de decisión la asigna el servidor; el cliente nunca la envía.
  const impulso = await Impulso.findOneAndUpdate(
    filtro,
    { $set: { estado, fechaDecision: new Date() } },
    { returnDocument: 'after', runValidators: true },
  );
  if (impulso) return respuesta.json(impulso);

  const existente = await Impulso.findById(peticion.params.id);
  if (!existente) return respuesta.status(404).json({ mensaje: 'Impulso no encontrado.' });
  if (existente.estado !== 'pendiente') {
    return respuesta.status(409).json({ mensaje: 'Este impulso ya tiene una decisión.' });
  }
  return respuesta.status(409).json({ mensaje: 'Solo se puede comprar después de terminar la espera.' });
}

export async function editarImpulso(peticion, respuesta) {
  // PUT con un único campo estado: es una decisión, no una edición de campos.
  if (esObjeto(peticion.body) && Object.hasOwn(peticion.body, 'estado')) {
    return aplicarDecision(peticion, respuesta);
  }
  const mensaje = validarDatos(peticion.body, false);
  if (mensaje) return respuesta.status(400).json({ mensaje });
  const { nombre, precio, motivo } = peticion.body;
  const cambios = { nombre, precio, motivo };
  for (const campo of ['prioridad', 'restriccionPersonal']) {
    if (Object.hasOwn(peticion.body, campo)) cambios[campo] = peticion.body[campo];
  }
  // El filtro comprueba el estado en la misma operación que modifica el documento.
  const impulso = await Impulso.findOneAndUpdate(
    { _id: peticion.params.id, estado: 'pendiente' },
    { $set: cambios },
    { returnDocument: 'after', runValidators: true },
  );
  if (!impulso) {
    const existe = await Impulso.exists({ _id: peticion.params.id });
    return respuesta.status(existe ? 409 : 404).json({
      mensaje: existe ? 'Solo se pueden editar impulsos pendientes.' : 'Impulso no encontrado.',
    });
  }
  respuesta.json(impulso);
}

export async function eliminarImpulso(peticion, respuesta) {
  const impulso = await Impulso.findByIdAndDelete(peticion.params.id);
  if (!impulso) return respuesta.status(404).json({ mensaje: 'Impulso no encontrado.' });
  respuesta.json({ mensaje: 'Impulso eliminado permanentemente.' });
}
