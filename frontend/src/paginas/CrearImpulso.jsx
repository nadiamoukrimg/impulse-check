import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { crearImpulso } from '../servicios/api.js';
import Opciones from '../componentes/OpcionesFormulario.jsx';

const prioridades = [['soloLoQuiero', 'Just Want It'], ['seriaUtil', 'Would Be Useful'], ['creoQueLoNecesito', 'I Think I Need It']];
const duraciones = [['1', '24 HOURS'], ['3', '3 DAYS'], ['7', '7 DAYS'], ['14', '14 DAYS']];

export default function CrearImpulso() {
  const [formulario, establecerFormulario] = useState({ nombre: '', precio: '', motivo: '', prioridad: 'seriaUtil', duracionEspera: '7', restriccionPersonal: '' });
  const [error, establecerError] = useState('');
  const [guardando, establecerGuardando] = useState(false);
  const [creado, establecerCreado] = useState(null);
  const envioEnCurso = useRef(false);

  function cambiarCampo(evento) {
    const { name, value } = evento.target;
    establecerFormulario(anterior => ({ ...anterior, [name]: value }));
    establecerError('');
  }

  async function enviarFormulario(evento) {
    evento.preventDefault();
    if (envioEnCurso.current || creado) return;
    const precio = Number(formulario.precio);
    if (!formulario.nombre.trim() || !formulario.motivo.trim()) {
      establecerError('Please enter a product name and a reason for wanting it.'); return;
    }
    if (!formulario.precio.trim() || !Number.isFinite(precio) || precio < 0) {
      establecerError('Please enter a valid price of €0 or more.'); return;
    }
    if (!prioridades.some(([valor]) => valor === formulario.prioridad) || !duraciones.some(([valor]) => valor === formulario.duracionEspera)) {
      establecerError('Please select a priority and a pause duration.'); return;
    }
    envioEnCurso.current = true;
    establecerGuardando(true);
    establecerError('');
    try {
      const impulso = await crearImpulso({ ...formulario, nombre: formulario.nombre.trim(), motivo: formulario.motivo.trim(), precio, duracionEspera: Number(formulario.duracionEspera), restriccionPersonal: formulario.restriccionPersonal.trim() });
      establecerCreado(impulso);
    } catch (fallo) {
      establecerError(fallo.codigoHttp === 400 ? 'Your impulse could not be saved. Please check the fields and try again.' : 'We could not confirm your save. Check your impulses before trying again.');
    } finally {
      envioEnCurso.current = false;
      establecerGuardando(false);
    }
  }

  return <div className="pagina-estrecha apilado pagina-creacion">
    <Link className="enlace-texto" to="/">← Back home</Link>
    <header className="tarjeta tarjeta-lavanda cabecera-creacion"><div className="rotulo"><span>SYSTEM://PAUSE_PROTO.EXE</span><span aria-hidden="true">•••</span></div><h1>CATCH THE IMPULSE.</h1><p>Wait first. Decide with a clear head.</p></header>
    {creado ? <section className="tarjeta tarjeta-lima" aria-live="polite"><h2>Impulse paused.</h2><p><strong>{creado.nombre}</strong> is now cooling down.</p><p>Your personal condition is a reminder, not a way to shorten your pause.</p><Link className="boton boton-blanco" to="/">View my impulses →</Link></section> :
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
          <Opciones nombre="duracionEspera" titulo="SELECT PAUSE DURATION" opciones={duraciones} valor={formulario.duracionEspera} alCambiar={cambiarCampo} />
          <label htmlFor="restriccionPersonal">PERSONAL REALITY CONSTRAINT (optional)</label><input id="restriccionPersonal" name="restriccionPersonal" value={formulario.restriccionPersonal} onChange={cambiarCampo} placeholder="Only buy if…" aria-describedby="ayuda-recordatorio" />
          <p id="ayuda-recordatorio" className="nota ayuda-recordatorio">Just a reminder for later. Your waiting period still applies.</p>
        </fieldset>
        {error && <div className="tarjeta tarjeta-melocoton" role="alert"><p>{error}</p><Link to="/" className="enlace-texto">Check my impulses</Link></div>}
        <div className="acciones-formulario"><button className="boton" type="submit" disabled={guardando}>{guardando ? 'Saving…' : 'PAUSE IT NOW →'}</button><Link className="boton boton-cancelar" to="/">Cancel</Link></div>
      </form>}
  </div>;
}
