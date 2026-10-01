import 'dotenv/config';
import assert from 'node:assert/strict';
import { test } from 'node:test';
import mongoose from 'mongoose';
import aplicacion from '../aplicacion.js';
import Impulso from '../modelos/Impulso.js';
import { conectarMongo } from '../configuracion/conexionMongo.js';

test('CRUD y errores contra Atlas; elimina únicamente sus propios registros', async () => {
  let servidor;
  let idCreado;
  const buscarOriginal = Impulso.find;
  try {
    await conectarMongo();
    servidor = aplicacion.listen(0, '127.0.0.1');
    await new Promise(resolver => servidor.once('listening', resolver));
    const base = `http://127.0.0.1:${servidor.address().port}`;
    async function solicitar(metodo, ruta, cuerpo, codigo) {
      const respuesta = await fetch(base + ruta, {
        method: metodo,
        headers: { 'Content-Type': 'application/json' },
        body: cuerpo === undefined ? undefined : JSON.stringify(cuerpo),
      });
      const datos = await respuesta.json();
      // Registrar el ID antes de cualquier aserción para garantizar la limpieza.
      if (metodo === 'POST' && datos._id) idCreado = datos._id;
      assert.equal(respuesta.status, codigo);
      if (codigo >= 400) assert.deepEqual(Object.keys(datos), ['mensaje']);
      return datos;
    }
    const ruta = '/api/impulsos';
    const datos = { nombre: ' Prueba automática CRUD ', precio: 0, motivo: ' Verificación temporal ', duracionEspera: 1, prioridad: 'seriaUtil', restriccionPersonal: ' Solo si aún lo necesito ' };
    const antes = Date.now();
    const creado = await solicitar('POST', ruta, datos, 201);
    assert.equal(creado.nombre, datos.nombre.trim());
    assert.equal(creado.estado, 'pendiente');
    assert.equal(creado.prioridad, 'seriaUtil');
    assert.equal(creado.restriccionPersonal, 'Solo si aún lo necesito');
    assert.equal(creado.fechaDecision, null);
    assert.ok(Date.parse(creado.fechaFinEspera) >= antes + 86400000);
    assert.ok(Date.parse(creado.fechaFinEspera) <= Date.now() + 86400000);
    assert.ok(await Impulso.exists({ _id: idCreado }));
    assert.ok((await solicitar('GET', ruta, undefined, 200)).some(i => i._id === idCreado));
    assert.equal((await solicitar('GET', `${ruta}/${idCreado}`, undefined, 200)).nombre, creado.nombre);
    const edicion = { nombre: 'Prueba editada', precio: 12.5, motivo: 'Comprobar persistencia' };
    const editado = await solicitar('PUT', `${ruta}/${idCreado}`, edicion, 200);
    assert.equal(editado.fechaFinEspera, creado.fechaFinEspera);
    assert.equal(editado.prioridad, 'seriaUtil');
    assert.equal(editado.restriccionPersonal, creado.restriccionPersonal);
    const ampliado = await solicitar('PUT', `${ruta}/${idCreado}`, { ...edicion, prioridad: 'soloLoQuiero', restriccionPersonal: '' }, 200);
    assert.equal(ampliado.prioridad, 'soloLoQuiero');
    assert.equal(ampliado.restriccionPersonal, '');
    await solicitar('POST', ruta, { ...datos, prioridad: undefined }, 400);
    assert.equal((await Impulso.findById(idCreado)).precio, 12.5);
    for (const cambios of [{ prioridad: 'otra' }, { restriccionPersonal: 42 }, { precio: -1 }, { precio: '12' }, { nombre: ' ' }, { motivo: null }, { duracionEspera: 2 }, { estado: 'comprado' }, { fechaFinEspera: new Date() }]) {
      await solicitar('POST', ruta, { ...datos, ...cambios }, 400);
    }
    await solicitar('POST', ruta, {}, 400);
    await solicitar('POST', ruta, [], 400);
    await solicitar('POST', ruta, undefined, 400);
    await solicitar('PUT', `${ruta}/${idCreado}`, { ...edicion, duracionEspera: 7 }, 400);
    await solicitar('PUT', `${ruta}/${idCreado}`, { precio: 5 }, 400);
    await solicitar('PUT', `${ruta}/${idCreado}`, { ...edicion, estado: 'comprado' }, 400);
    // Preparar exclusivamente el registro de esta prueba para comprobar el bloqueo.
    await solicitar('PUT', `${ruta}/${idCreado}`, { estado: 'comprado' }, 409);
    const descartado = await solicitar('PUT', `${ruta}/${idCreado}`, { estado: 'descartado' }, 200);
    assert.equal(descartado.estado, 'descartado');
    assert.ok(descartado.fechaDecision);
    assert.equal(descartado.fechaFinEspera, creado.fechaFinEspera);
    assert.equal((await Impulso.findById(idCreado)).estado, 'descartado');
    await solicitar('PUT', `${ruta}/${idCreado}`, { estado: 'descartado' }, 409);
    await solicitar('PUT', `${ruta}/${idCreado}`, edicion, 409);
    assert.equal((await Impulso.findById(idCreado)).nombre, edicion.nombre);
    for (const metodo of ['GET', 'PUT', 'DELETE']) {
      await solicitar(metodo, `${ruta}/incorrecto`, metodo === 'PUT' ? edicion : undefined, 400);
      await solicitar(metodo, `${ruta}/${new mongoose.Types.ObjectId()}`, metodo === 'PUT' ? edicion : undefined, 404);
    }
    const malformado = await fetch(base + ruta, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{' });
    assert.equal(malformado.status, 400);
    assert.deepEqual(Object.keys(await malformado.json()), ['mensaje']);
    await solicitar('GET', '/ruta-inexistente', undefined, 404);
    Impulso.find = () => { throw new Error('Detalle interno que no debe salir'); };
    const fallo = await solicitar('GET', ruta, undefined, 500);
    assert.equal(fallo.mensaje, 'No se pudo completar la operación.');
    Impulso.find = buscarOriginal;
    await solicitar('DELETE', `${ruta}/${idCreado}`, undefined, 200);
    assert.equal(await Impulso.findById(idCreado), null);
    await solicitar('GET', `${ruta}/${idCreado}`, undefined, 404);
    await solicitar('DELETE', `${ruta}/${idCreado}`, undefined, 404);
    console.log('Persistencia, edición, borrado y errores comprobados; registro temporal eliminado.');
  } finally {
    Impulso.find = buscarOriginal;
    try {
      if (idCreado) await Impulso.deleteOne({ _id: idCreado });
    } finally {
      if (servidor) await new Promise((resolver, rechazar) => servidor.close(error => error ? rechazar(error) : resolver()));
      await mongoose.disconnect();
    }
  }
});
