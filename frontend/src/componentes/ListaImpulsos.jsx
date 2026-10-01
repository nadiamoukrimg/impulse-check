import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import TarjetaImpulso, { obtenerEstadoVisual } from './TarjetaImpulso.jsx';

// Recibe los impulsos ya cargados por Inicio para no repetir la petición GET.
export default function ListaImpulsos({ impulsos, cargando, error, reintentar }) {
  const [ahora, establecerAhora] = useState(Date.now);

  useEffect(() => {
    establecerAhora(Date.now());
    if (!impulsos.some(impulso => impulso.estado === 'pendiente')) return;
    const temporizador = setInterval(() => establecerAhora(Date.now()), 1000);
    return () => clearInterval(temporizador);
  }, [impulsos]);

  if (cargando) return <div className="estado-listado" role="status"><span className="antetitulo">LOADING YOUR IMPULSES</span><p>A little moment while we fetch your pauses…</p></div>;
  if (error) return <div className="tarjeta tarjeta-melocoton"><p role="alert">We couldn't load your impulses. Please try again.</p><button className="boton boton-blanco" onClick={reintentar}>Try again</button></div>;
  if (!impulsos.length) return <div className="estado-vacio"><h3>A fresh start.</h3><p>No impulses yet. Add something you are considering buying.</p><Link className="boton" to="/impulsos/nuevo">+ Add impulse</Link></div>;

  const listos = impulsos.filter(impulso => obtenerEstadoVisual(impulso, ahora) === 'listo');
  const enfriando = impulsos.filter(impulso => obtenerEstadoVisual(impulso, ahora) === 'enfriando');
  const resueltos = impulsos.filter(impulso => ['comprado', 'descartado'].includes(impulso.estado))
    .sort((a, b) => Date.parse(b.fechaDecision || b.updatedAt) - Date.parse(a.fechaDecision || a.updatedAt));
  const grupos = [
    { titulo: 'READY TO DECIDE', registros: listos, vacio: 'Nothing ready yet. Give yourself time to decide.', sufijo: 'unlocked' },
    { titulo: 'COOLING DOWN', registros: enfriando, vacio: 'No impulses cooling down. Your next pause starts with you.', sufijo: 'paused' },
    { titulo: 'RECENT DECISIONS', registros: resueltos, vacio: 'Your decisions will appear here once you buy or skip an impulse.', sufijo: 'decided' },
  ];
  return <div className="grupos-impulsos">{grupos.map(grupo => (
    <section className="grupo-impulsos" key={grupo.titulo}>
      <div className="titulo-seccion"><h3>{grupo.titulo}</h3><span className="etiqueta">{grupo.registros.length} {grupo.sufijo}</span></div>
      {grupo.registros.length
        ? <div className="listas">{grupo.registros.map(impulso => <TarjetaImpulso key={impulso._id} impulso={impulso} ahora={ahora} />)}</div>
        : <p className="estado-vacio">{grupo.vacio}</p>}
    </section>
  ))}</div>;
}
