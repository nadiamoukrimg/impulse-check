import React, { useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { actualizarImpulso, obtenerImpulso } from '../servicios/api.js';
import Opciones from '../componentes/OpcionesFormulario.jsx';

const prioridades = [['soloLoQuiero', 'Just Want It'], ['seriaUtil', 'Would Be Useful'], ['creoQueLoNecesito', 'I Think I Need It']];
const fecha = valor => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(valor));
const formularioVacio = { nombre: '', precio: '', motivo: '', prioridad: 'seriaUtil', restriccionPersonal: '' };

export default function EditarImpulso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [impulso, establecerImpulso] = useState(null);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState(null);
  const [intento, establecerIntento] = useState(0);
  const [formulario, establecerFormulario] = useState(formularioVacio);
  const [errorEnvio, establecerErrorEnvio] = useState('');
  const [guardando, establecerGuardando] = useState(false);
  const envioEnCurso = useRef(false);
  const rutaDetalle = '/impulsos/' + encodeURIComponent(id);

  useEffect(() => {
    let activo = true;
    establecerCargando(true); establecerError(null); establecerImpulso(null);
    obtenerImpulso(id).then(datos => {
      if (!activo) return;
      establecerImpulso(datos);
      establecerFormulario({
        nombre: datos.nombre ?? '',
        precio: datos.precio ?? '',
        motivo: datos.motivo ?? '',
        prioridad: datos.prioridad ?? 'seriaUtil',
        restriccionPersonal: datos.restriccionPersonal ?? '',
      });
    }).catch(fallo => { if (activo) establecerError([400, 404].includes(fallo.codigoHttp) ? 'ausente' : 'conexion'); })
      .finally(() => { if (activo) establecerCargando(false); });
    return () => { activo = false; };
  }, [id, intento]);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    establecerFormulario(anterior => ({ ...anterior, [name]: value }));
    establecerErrorEnvio('');
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    if (envioEnCurso.current) return;
    const precio = Number(formulario.precio);
    if (!formulario.nombre.trim() || !formulario.motivo.trim()) {
      establecerErrorEnvio('Please enter a product name and a reason for wanting it.'); return;
    }
    if (formulario.precio === '' || !Number.isFinite(precio) || precio < 0) {
      establecerErrorEnvio('Please enter a valid price of €0 or more.'); return;
    }
    if (!prioridades.some(([valor]) => valor === formulario.prioridad)) {
      establecerErrorEnvio('Please select a priority.'); return;
    }
    envioEnCurso.current = true;
    establecerGuardando(true);
    establecerErrorEnvio('');
    try {
      await actualizarImpulso(id, {
        nombre: formulario.nombre.trim(),
        precio,
        motivo: formulario.motivo.trim(),
        prioridad: formulario.prioridad,
        restriccionPersonal: formulario.restriccionPersonal.trim(),
      });
      navigate(rutaDetalle, { replace: true, state: { guardado: true } });
    } catch (fallo) {
      if (fallo.codigoHttp === 404) { establecerError('ausente'); establecerImpulso(null); }
      else if (fallo.codigoHttp === 409) establecerErrorEnvio('Only impulses that are still cooling down can be edited.');
      else if (fallo.codigoHttp === 400) establecerErrorEnvio('Your changes could not be saved. Please check the fields and try again.');
      else establecerErrorEnvio('We could not save your changes. Please try again.');
      envioEnCurso.current = false;
      establecerGuardando(false);
    }
  }

  if (cargando) return <p role="status">Loading your impulse…</p>;
  if (error === 'ausente') return <section className="tarjeta pagina-estrecha"><h1>Impulse not found.</h1><p role="alert">It may have been deleted, or the link is incorrect.</p><Link className="enlace-texto" to="/">Back to my impulses</Link></section>;
  if (error) return <section className="tarjeta pagina-estrecha"><h1>Unable to load this impulse.</h1><p role="alert">Please check your connection and try again.</p><button className="boton" onClick={() => establecerIntento(valor => valor + 1)}>Try again</button><Link className="enlace-texto" to="/">Back to my impulses</Link></section>;
  if (!impulso) return null;

  if (impulso.estado !== 'pendiente') return <div className="pagina-estrecha apilado">
    <Link className="enlace-texto" to={rutaDetalle}>← Back to impulse</Link>
    <section className="tarjeta tarjeta-melocoton">
      <div className="rotulo"><span>EDIT DETAILS</span><span className="etiqueta">LOCKED</span></div>
      <h1>This impulse is closed.</h1>
      <p>Only impulses that are still cooling down can be edited.</p>
      <Link className="boton boton-blanco" to={rutaDetalle}>Back to impulse</Link>
    </section>
  </div>;

  return <div className="pagina-estrecha apilado pagina-creacion">
    <Link className="enlace-texto" to={rutaDetalle}>← Back to impulse</Link>
    <header className="tarjeta tarjeta-lavanda cabecera-creacion">
      <div className="rotulo"><span>SYSTEM://PAUSE_PROTO.EXE</span><span aria-hidden="true">•••</span></div>
      <h1>EDIT THIS IMPULSE.</h1>
      <p>Change the details. The pause stays exactly the same.</p>
    </header>
    <form className="apilado formulario-impulso" onSubmit={enviarFormulario} noValidate aria-busy={guardando}>
      <fieldset className="tarjeta bloque-formulario" disabled={guardando}><legend>01 // TARGET OBJECT</legend>
        <label htmlFor="nombre">WHAT CAUGHT YOUR EYE?</label><input id="nombre" name="nombre" value={formulario.nombre} onChange={cambiarCampo} placeholder="Product name" required />
        <label htmlFor="precio">ESTIMATED PRICE (€)</label><input id="precio" name="precio" type="number" min="0" step="0.01" inputMode="decimal" value={formulario.precio} onChange={cambiarCampo} placeholder="0.00" required />
      </fieldset>
      <fieldset className="tarjeta bloque-formulario" disabled={guardando}><legend>02 // REALITY CHECK</legend>
        <label htmlFor="motivo">WHY DO YOU WANT IT RIGHT NOW?</label><textarea id="motivo" name="motivo" rows="3" value={formulario.motivo} onChange={cambiarCampo} placeholder="A real need, boredom, or something else?" required />
        <Opciones nombre="prioridad" titulo="INITIAL URGENCY / PRIORITY" opciones={prioridades} valor={formulario.prioridad} alCambiar={cambiarCampo} />
      </fieldset>
      <fieldset className="tarjeta bloque-formulario" disabled={guardando}><legend>03 // COOLING PROTOCOL</legend>
        <label htmlFor="fechaFinEspera">WAITING UNTIL</label>
        <input id="fechaFinEspera" name="fechaFinEspera" readOnly value={fecha(impulso.fechaFinEspera)} aria-describedby="ayuda-plazo" />
        <p id="ayuda-plazo" className="nota ayuda-recordatorio">The waiting period cannot be changed once started.</p>
        <label htmlFor="restriccionPersonal">PERSONAL REALITY CONSTRAINT (optional)</label><input id="restriccionPersonal" name="restriccionPersonal" value={formulario.restriccionPersonal} onChange={cambiarCampo} placeholder="Only buy if…" aria-describedby="ayuda-recordatorio" />
        <p id="ayuda-recordatorio" className="nota ayuda-recordatorio">Just a reminder for later. Your waiting period still applies.</p>
      </fieldset>
      {errorEnvio && <div className="tarjeta tarjeta-melocoton" role="alert"><p>{errorEnvio}</p><Link to={rutaDetalle} className="enlace-texto">Back to impulse</Link></div>}
      <div className="acciones-formulario">
        <button className="boton" type="submit" disabled={guardando}>{guardando ? 'Saving…' : 'SAVE CHANGES →'}</button>
        <Link className="boton boton-cancelar" to={rutaDetalle}>Cancel</Link>
      </div>
    </form>
  </div>;
}
