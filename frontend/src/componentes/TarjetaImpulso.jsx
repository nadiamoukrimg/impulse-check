import React from 'react';
import { Link } from 'react-router-dom';
import Icono from './Icono.jsx';

const etiquetas = {
  enfriando: 'Cooling down', listo: 'Ready to decide',
  comprado: 'Purchased', descartado: 'Skipped',
};
const prioridades = {
  soloLoQuiero: 'Just Want It', seriaUtil: 'Would Be Useful', creoQueLoNecesito: 'I Think I Need It',
};
const moneda = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });

export function obtenerEstadoVisual(impulso, ahora) {
  if (impulso.estado !== 'pendiente') return impulso.estado;
  return Date.parse(impulso.fechaFinEspera) <= ahora ? 'listo' : 'enfriando';
}

function tiempoRestante(fecha, ahora) {
  const minutos = Math.max(1, Math.ceil((Date.parse(fecha) - ahora) / 60000));
  const dias = Math.floor(minutos / 1440);
  const horas = Math.floor((minutos % 1440) / 60);
  return (dias ? dias + 'd ' : '') + (horas ? horas + 'h ' : '') + (minutos % 60) + 'm left';
}

export default function TarjetaImpulso({ impulso, ahora }) {
  const estadoVisual = obtenerEstadoVisual(impulso, ahora);
  return (
    <article className={'tarjeta tarjeta-impulso estado-' + estadoVisual}>
      <div className="cabecera-tarjeta-impulso">
        <span className="etiqueta etiqueta-estado">{etiquetas[estadoVisual]}</span>
        <Icono nombre={estadoVisual === 'enfriando' ? 'pausa' : 'historial'} />
      </div>
      <h3>{impulso.nombre}</h3>
      <strong className="precio-impulso">{moneda.format(impulso.precio)}</strong>
      {prioridades[impulso.prioridad] && <p className="prioridad-impulso">{prioridades[impulso.prioridad]}</p>}
      <p className="tiempo-impulso">{estadoVisual === 'enfriando'
        ? tiempoRestante(impulso.fechaFinEspera, ahora)
        : estadoVisual === 'listo' ? 'Your pause is complete.'
        : estadoVisual === 'comprado' ? 'Purchased intentionally.' : 'Let go. Money not spent.'}</p>
      {impulso.restriccionPersonal && <p className="recordatorio-tarjeta"><strong>Personal reminder:</strong> {impulso.restriccionPersonal}</p>}
      <Link className="boton boton-detalle" to={'/impulsos/' + encodeURIComponent(impulso._id)} aria-label={'View impulse: ' + impulso.nombre}>View impulse <Icono nombre="flecha" /></Link>
    </article>
  );
}
