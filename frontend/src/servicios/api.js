const urlBase = import.meta.env.VITE_API_URL?.trim().replace(/\/+$/, '');

async function solicitar(ruta, metodo = 'GET', datos) {
  if (!urlBase) {
    throw new Error('Falta configurar VITE_API_URL.');
  }

  let respuesta;
  try {
    respuesta = await fetch(`${urlBase}/impulsos${ruta}`, {
      method: metodo,
      headers: {
        Accept: 'application/json',
        ...(datos !== undefined ? { 'Content-Type': 'application/json' } : {}),
      },
      ...(datos !== undefined ? { body: JSON.stringify(datos) } : {}),
    });
  } catch {
    throw new Error('No se pudo conectar con la API.');
  }

  let contenido = null;
  if (respuesta.status !== 204) {
    try {
      contenido = await respuesta.json();
    } catch {
      if (respuesta.ok) {
        throw new Error('La API no devolvió una respuesta JSON válida.');
      }
    }
  }

  if (!respuesta.ok) {
    const mensaje = typeof contenido?.mensaje === 'string'
      ? contenido.mensaje
      : `La petición falló (HTTP ${respuesta.status}).`;
    const error = new Error(mensaje);
    error.codigoHttp = respuesta.status;
    throw error;
  }

  return contenido;
}

function rutaPorId(id) {
  if (typeof id !== 'string' || !id.trim()) {
    throw new Error('Es necesario indicar el identificador del impulso.');
  }
  return `/${encodeURIComponent(id.trim())}`;
}

export async function listarImpulsos() {
  return solicitar('');
}

export async function obtenerImpulso(id) {
  return solicitar(rutaPorId(id));
}

export async function crearImpulso(datos) {
  return solicitar('', 'POST', datos);
}

export async function actualizarImpulso(id, datos) {
  return solicitar(rutaPorId(id), 'PUT', datos);
}

export async function eliminarImpulso(id) {
  return solicitar(rutaPorId(id), 'DELETE');
}
