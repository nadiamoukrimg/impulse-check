import React, { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { actualizarImpulso, eliminarImpulso, obtenerImpulso } from '../servicios/api.js';
import { obtenerEstadoVisual } from '../componentes/TarjetaImpulso.jsx';
import Icono from '../componentes/Icono.jsx';

const estados = { enfriando: 'Cooling down', listo: 'Ready to decide', comprado: 'Purchased', descartado: 'Skipped' };
const prioridades = { soloLoQuiero: 'Just Want It', seriaUtil: 'Would Be Useful', creoQueLoNecesito: 'I Think I Need It' };
const decisiones = { comprado: 'Purchased', descartado: 'Skipped' };
const moneda = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const fecha = valor => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(valor));

function progresoEspera(impulso, ahora) {
  const inicio = Date.parse(impulso.createdAt);
  const fin = Date.parse(impulso.fechaFinEspera);
  if (!Number.isFinite(inicio) || !Number.isFinite(fin) || fin <= inicio) return 1;
  return Math.min(1, Math.max(0, (ahora - inicio) / (fin - inicio)));
}

export default function DetalleImpulso() {
  const { id } = useParams();
  const navigate = useNavigate();
  const ubicacion = useLocation();
  const [impulso, establecerImpulso] = useState(null);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState(null);
  const [intento, establecerIntento] = useState(0);
  const [ahora, establecerAhora] = useState(Date.now);
  const [aviso, establecerAviso] = useState(() => (ubicacion.state?.guardado ? { tipo: 'ok', texto: 'Changes saved. Your impulse is up to date.' } : null));
  const [confirmando, establecerConfirmando] = useState(false);
  const [eliminando, establecerEliminando] = useState(false);
  const [errorBorrado, establecerErrorBorrado] = useState(null);
  const [decidiendo, establecerDecidiendo] = useState(false);

  useEffect(() => {
    let activo = true;
    establecerCargando(true); establecerError(null); establecerImpulso(null);
    obtenerImpulso(id).then(datos => { if (activo) establecerImpulso(datos); })
      .catch(fallo => { if (activo) establecerError([400, 404].includes(fallo.codigoHttp) ? 'ausente' : 'conexion'); })
      .finally(() => { if (activo) establecerCargando(false); });
    return () => { activo = false; };
  }, [id, intento]);

  useEffect(() => {
    if (impulso?.estado !== 'pendiente') return;
    const temporizador = setInterval(() => establecerAhora(Date.now()), 1000);
    return () => clearInterval(temporizador);
  }, [impulso]);

  // El aviso de guardado solo debe verse justo después de editar, no tras recargar.
  useEffect(() => {
    if (ubicacion.state?.guardado) navigate(ubicacion.pathname + ubicacion.search, { replace: true, state: null });
  }, [ubicacion, navigate]);

  // UPDATE: la decisión envía un único campo estado; el backend decide si es válida.
  async function resolverDecision(estado) {
    if (decidiendo) return;
    establecerDecidiendo(true);
    try {
      const actualizado = await actualizarImpulso(id, { estado });
      establecerImpulso(actualizado);
      establecerAviso({ tipo: 'ok', texto: 'Decision saved. This impulse is now ' + decisiones[estado] + '.' });
    } catch (fallo) {
      if (fallo.codigoHttp === 404) { navigate('/', { replace: true }); return; }
      if (fallo.codigoHttp === 409) {
        // El registro cambió en el servidor: recargar para mostrar el estado real.
        try { establecerImpulso(await obtenerImpulso(id)); } catch { establecerError('conexion'); }
        establecerAviso({ tipo: 'error', texto: 'This impulse already has a decision.' });
      } else {
        establecerAviso({ tipo: 'error', texto: 'We could not save your decision. Please try again.' });
      }
    } finally {
      establecerDecidiendo(false);
    }
  }

  async function confirmarBorrado() {
    if (eliminando) return;
    establecerEliminando(true);
    establecerErrorBorrado(null);
    try {
      await eliminarImpulso(id);
      navigate('/', { replace: true });
    } catch (fallo) {
      if (fallo.codigoHttp === 404) { navigate('/', { replace: true }); return; }
      establecerErrorBorrado('We could not delete this impulse. Please try again.');
      establecerEliminando(false);
    }
  }

  if (cargando) return <p role="status">Loading your impulse…</p>;
  if (error) return <section className="tarjeta pagina-estrecha"><h1>{error === 'ausente' ? 'Impulse not found.' : 'Unable to load this impulse.'}</h1><p role="alert">{error === 'ausente' ? 'It may have been deleted, or the link is incorrect.' : 'Please check your connection and try again.'}</p>{error !== 'ausente' && <button className="boton" onClick={() => establecerIntento(valor => valor + 1)}>Try again</button>}<Link className="enlace-texto" to="/">Back to my impulses</Link></section>;
  if (!impulso) return null;

  const estadoVisual = obtenerEstadoVisual(impulso, ahora);
  const pendiente = impulso.estado === 'pendiente';
  const minutos = Math.max(0, Math.ceil((Date.parse(impulso.fechaFinEspera) - ahora) / 60000));
  const progreso = Math.round(progresoEspera(impulso, ahora) * 100);
  // El estado "listo" se deriva de la fecha: nunca se guarda ni se envía al servidor.
  const listo = pendiente && Date.parse(impulso.fechaFinEspera) <= ahora;
  const diasEspera = Math.max(1, Math.round((Date.parse(impulso.fechaFinEspera) - Date.parse(impulso.createdAt)) / 86400000));

  return <div className="pagina-estrecha apilado detalle-real">
    <Link to="/" className="enlace-texto">← My impulses</Link>

    {aviso && <div className={'tarjeta aviso-guardado ' + (aviso.tipo === 'error' ? 'tarjeta-melocoton' : 'tarjeta-lima')} role={aviso.tipo === 'error' ? 'alert' : 'status'}><p>{aviso.texto}</p></div>}

    {listo && <section className="cabecera-decision">
      <span className="etiqueta">COOL-DOWN COMPLETE // PROTOCOL</span>
      <h2 className="titulo-decision">YOU'VE WAITED<br />{diasEspera} FULL {diasEspera === 1 ? 'DAY' : 'DAYS'}.</h2>
      <p className="nota">Your pause is over. Take a breath before you decide. Buying on purpose and letting it go are both valid outcomes.</p>
    </section>}

    <section className="tarjeta">
      <div className="rotulo"><span>OBJECT SPEC</span><span className="etiqueta">{estados[estadoVisual]}</span></div>
      <h1>{impulso.nombre}</h1>
      <strong className="importe">{moneda.format(impulso.precio)}</strong>
      {prioridades[impulso.prioridad] && <p>{prioridades[impulso.prioridad]}</p>}
    </section>

    <section className="tarjeta tarjeta-lavanda">
      <h2>COOLING PROTOCOL</h2>
      <p className="reloj-detalle">{pendiente
        ? (listo ? estados.listo : Math.floor(minutos / 1440) + 'd ' + Math.floor(minutos % 1440 / 60) + 'h ' + minutos % 60 + 'm left')
        : estados[estadoVisual]}</p>
      {pendiente && <div className="barra-espera" aria-hidden="true"><span style={{ width: progreso + '%' }} /></div>}
      <p>{pendiente ? (listo ? 'Unlocked ' : 'Unlocks ') + fecha(impulso.fechaFinEspera) : 'Decided ' + (impulso.fechaDecision ? fecha(impulso.fechaDecision) : '—')}</p>
    </section>

    <section className="tarjeta tarjeta-melocoton"><div className="rotulo"><span>PAST SELF INTENT</span><span aria-hidden="true">99</span></div><h2>YOU ORIGINALLY SAID</h2><blockquote>{impulso.motivo}</blockquote></section>

    {listo && <section className="tarjeta panel-decision" aria-labelledby="titulo-decision">
      <div className="rotulo"><span>THE MOMENT OF TRUTH</span><span className="etiqueta">TIME EXPIRED</span></div>
      <h2 id="titulo-decision">DO YOU STILL WANT IT?</h2>
      <p className="nota">Put what you said then next to how you feel now. No guilt either way: buying intentionally is just as valid as skipping.</p>
      <div className="opciones-decision">
        <button className="boton decision-positiva" type="button" onClick={() => resolverDecision('comprado')} disabled={decidiendo}>
          <span className="icono-decision"><Icono nombre="compra" /></span>
          <span className="texto-decision">
            <strong>YES, I STILL WANT IT →</strong>
            <small>I've waited {diasEspera} {diasEspera === 1 ? 'day' : 'days'} and this still feels like a deliberate, conscious choice.</small>
          </span>
        </button>
        <button className="boton decision-negativa" type="button" onClick={() => resolverDecision('descartado')} disabled={decidiendo}>
          <span className="icono-decision"><Icono nombre="ahorro" /></span>
          <span className="texto-decision">
            <strong>NO, LET IT GO (SAVE {moneda.format(impulso.precio)})</strong>
            <small>I let this one pass and keep the money.</small>
          </span>
        </button>
      </div>
      {decidiendo && <p className="nota" role="status">Saving your decision…</p>}
    </section>}

    <section className="tarjeta">
      <h2>PERSONAL REMINDER</h2>
      <p className="texto-con-saltos">{impulso.restriccionPersonal || 'No personal reminder added.'}</p>
      <p className="nota">Just a reminder. Your waiting period still applies.</p>
    </section>

    <section className="tarjeta">
      <h2>PAUSE DETAILS</h2>
      <dl>
        <dt>Added</dt><dd>{fecha(impulso.createdAt)}</dd>
        <dt>Waiting until</dt><dd>{fecha(impulso.fechaFinEspera)}</dd>
        {prioridades[impulso.prioridad] && <><dt>Priority</dt><dd>{prioridades[impulso.prioridad]}</dd></>}
        <dt>Status</dt><dd>{estados[estadoVisual]}</dd>
        {impulso.fechaDecision && <><dt>Decided</dt><dd>{fecha(impulso.fechaDecision)}</dd></>}
      </dl>
    </section>

    <section className="acciones-detalle" aria-label="Impulse actions">
      {pendiente && <Link className="boton boton-secundario" to={'/impulsos/' + encodeURIComponent(id) + '/editar'}>Edit details</Link>}
      <button className="boton boton-peligro" type="button" onClick={() => { establecerConfirmando(true); establecerErrorBorrado(null); }}>Delete impulse</button>
    </section>

    {confirmando && <section className="tarjeta tarjeta-melocoton confirmacion-borrado" role="alertdialog" aria-labelledby="titulo-borrado" aria-describedby="texto-borrado">
      <div className="rotulo"><span>DELETE PERMANENTLY</span><span aria-hidden="true">•••</span></div>
      <h2 id="titulo-borrado">Delete this impulse?</h2>
      <p id="texto-borrado"><strong>{impulso.nombre}</strong> will disappear from My Impulses and from the database. This cannot be undone.</p>
      {errorBorrado && <p className="error-borrado" role="alert">{errorBorrado}</p>}
      <div className="acciones-formulario">
        <button className="boton boton-peligro" type="button" onClick={confirmarBorrado} disabled={eliminando}>{eliminando ? 'Deleting…' : 'Delete permanently'}</button>
        <button className="boton boton-cancelar" type="button" onClick={() => establecerConfirmando(false)} disabled={eliminando}>Keep it</button>
      </div>
    </section>}
  </div>;
}
