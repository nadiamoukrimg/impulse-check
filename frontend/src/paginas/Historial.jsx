import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { listarImpulsos } from '../servicios/api.js';
import EstadoVacio from '../componentes/EstadoVacio.jsx';
import TarjetaVeredicto from '../componentes/TarjetaVeredicto.jsx';

export default function Historial() {
  const [impulsos, establecerImpulsos] = useState([]);
  const [cargando, establecerCargando] = useState(true);
  const [error, establecerError] = useState(false);
  const [intento, establecerIntento] = useState(0);

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

  // Filtrado: solo decisiones tomadas (comprado o descartado).
  // Ordenación: de la fecha de decisión más reciente a la más antigua.
  const resueltos = impulsos
    .filter(impulso => ['comprado', 'descartado'].includes(impulso.estado))
    .sort((a, b) => Date.parse(b.fechaDecision || b.updatedAt) - Date.parse(a.fechaDecision || a.updatedAt));

  if (cargando) return <div className="pagina-estrecha apilado"><header className="presentacion"><p className="antetitulo">LOOK BACK. MOVE FORWARD.</p><h1>Small pauses.<br />Thoughtful choices.</h1></header><p role="status">Loading your history…</p></div>;
  if (error) return <div className="pagina-estrecha apilado"><header className="presentacion"><p className="antetitulo">LOOK BACK. MOVE FORWARD.</p><h1>Small pauses.<br />Thoughtful choices.</h1></header><div className="tarjeta tarjeta-melocoton"><p role="alert">We couldn't load your history. Please try again.</p><button className="boton boton-blanco" onClick={() => establecerIntento(valor => valor + 1)}>Try again</button></div></div>;

  return <div className="pagina-estrecha apilado">
    <header className="presentacion">
      <p className="antetitulo">LOOK BACK. MOVE FORWARD.</p>
      <h1>Small pauses.<br />Thoughtful choices.</h1>
      <p>Your history, one considered decision at a time.</p>
    </header>

    <section>
      <div className="titulo-seccion"><h2>RECENT VERDICTS</h2><span className="etiqueta">{resueltos.length} {resueltos.length === 1 ? 'decision' : 'decisions'}</span></div>
      {resueltos.length
        ? <div className="lista-veredictos">{resueltos.map(impulso => <TarjetaVeredicto key={impulso._id} impulso={impulso} />)}</div>
        : <div className="estado-vacio-recuadro">
            <EstadoVacio titulo="No decisions yet">Impulses you buy or skip will show up here as soon as you decide.</EstadoVacio>
            <Link to="/" className="boton">Back to your impulses</Link>
          </div>}
    </section>

    <p className="consejo"><strong>PAUSE RECAP</strong>Every pause counts, whether you buy it on purpose or let it go. The choice stays yours.</p>
  </div>;
}
