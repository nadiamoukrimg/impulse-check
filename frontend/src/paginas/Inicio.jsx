import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Icono from '../componentes/Icono.jsx';
import ListaImpulsos from '../componentes/ListaImpulsos.jsx';
import { listarImpulsos } from '../servicios/api.js';

const moneda = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
const plural = (cantidad, singular, varios) => `${cantidad} ${cantidad === 1 ? singular : varios}`;

function importeDe(impulsos, estados) {
  return impulsos
    .filter(impulso => estados.includes(impulso.estado))
    .reduce((total, impulso) => total + Number(impulso.precio || 0), 0);
}

function cantidadDe(impulsos, estados) {
  return impulsos.filter(impulso => estados.includes(impulso.estado)).length;
}

export default function Inicio() {
  const [impulsos, establecerImpulsos] = useState([]);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState(false);
  const [intento, establecerIntento] = useState(0);

  // Una única petición compartida por el resumen y el listado.
  useEffect(() => {
    let activo = true;
    establecerCargando(true);
    establecerError(false);
    listarImpulsos().then(datos => {
      if (!Array.isArray(datos)) throw new Error('Respuesta de listado no válida.');
      if (activo) establecerImpulsos(datos);
    }).catch(() => { if (activo) establecerError(true); })
      .finally(() => { if (activo) establecerCargando(false); });
    return () => { activo = false; };
  }, [intento]);

  const disponible = !cargando && !error;
  const ahorrado = importeDe(impulsos, ['descartado']);
  const enPausa = importeDe(impulsos, ['pendiente']);
  const comprado = importeDe(impulsos, ['comprado']);
  const saltados = cantidadDe(impulsos, ['descartado']);
  const pausas = cantidadDe(impulsos, ['pendiente']);
  const compras = cantidadDe(impulsos, ['comprado']);

  return <div className="apilado">
    <section className="presentacion"><p className="antetitulo">A LITTLE PAUSE. A BETTER CHOICE.</p><h1>WANT IT NOW?<br /><span>DECIDE LATER.</span></h1><p>A little breathing room between wanting something and making it yours.</p></section>

    <section className="resumen" aria-label="Spending overview">
      <div className="tarjeta tarjeta-lima caja-ahorro">
        <div className="rotulo"><span>SAVINGS_VAULT.SYS</span><span aria-hidden="true">•••</span></div>
        <p className="antetitulo">TOTAL NET SAVED / NOT SPENT</p>
        <strong className="importe">{disponible ? moneda.format(ahorrado) : '—'}</strong>
        <p className="detalle-resumen">{disponible ? plural(saltados, 'impulse skipped', 'impulses skipped') : '—'}</p>
      </div>
      <div className="tarjeta tarjeta-lavanda caja-resumen">
        <p className="antetitulo">ON HOLD</p>
        <strong className="importe">{disponible ? moneda.format(enPausa) : '—'}</strong>
        <p className="nota">{disponible ? plural(pausas, 'active pause', 'active pauses') : '—'}</p>
      </div>
      <div className="tarjeta tarjeta-melocoton caja-resumen">
        <p className="antetitulo">PURCHASED</p>
        <strong className="importe">{disponible ? moneda.format(comprado) : '—'}</strong>
        <p className="nota">{disponible ? plural(compras, 'intentional purchase', 'intentional purchases') : '—'}</p>
      </div>
    </section>

    <section>
      <div className="titulo-seccion"><h2>Your impulses</h2><span className="etiqueta">ONE PAUSE AT A TIME</span></div>
      <ListaImpulsos
        impulsos={impulsos}
        cargando={cargando}
        error={error}
        reintentar={() => establecerIntento(valor => valor + 1)}
      />
    </section>

    <section className="tarjeta tarjeta-lima bienvenida"><div className="rotulo"><span>MAKE ROOM FOR WHAT MATTERS</span><Icono nombre="pausa" /></div><h2>Your next purchase<br />can wait.</h2><p>Save the thought. Take a pause.<br />Come back with a clearer mind.</p><Link to="/impulsos/nuevo" className="boton boton-blanco">Pause an impulse <Icono nombre="flecha" /></Link></section>

    <Link className="enlace-texto" to="/historial">Explore your history <Icono nombre="flecha" /></Link>
  </div>;
}
