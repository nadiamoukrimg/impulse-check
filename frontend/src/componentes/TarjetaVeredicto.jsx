import React from 'react';
import { Link } from 'react-router-dom';
import Icono from './Icono.jsx';

// Un veredicto es un impulso resuelto: comprado o descartado, nunca pendiente.
const decisiones = { comprado: 'Purchased', descartado: 'Skipped' };
const prioridades = {
  soloLoQuiero: 'Just Want It', seriaUtil: 'Would Be Useful', creoQueLoNecesito: 'I Think I Need It',
};
const moneda = new Intl.NumberFormat('en-IE', { style: 'currency', currency: 'EUR' });
// Fecha y hora: hacen visible el orden de las decisiones tomadas el mismo día.
const fechaDecision = valor => new Intl.DateTimeFormat('en-GB', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(valor));

export default function TarjetaVeredicto({ impulso }) {
  const comprado = impulso.estado === 'comprado';
  const decision = decisiones[impulso.estado];
  const categoria = prioridades[impulso.prioridad];
  const fecha = fechaDecision(impulso.fechaDecision || impulso.updatedAt);
  // El descarte se presenta como dinero que no salió del bolsillo.
  const importe = (comprado ? '' : '+ ') + moneda.format(impulso.precio);

  return (
    <Link
      className={'tarjeta veredicto veredicto-' + impulso.estado}
      to={'/impulsos/' + encodeURIComponent(impulso._id)}
      aria-label={'View impulse: ' + impulso.nombre}
    >
      <span className="veredicto-icono" aria-hidden="true"><Icono nombre={comprado ? 'compra' : 'ahorro'} /></span>
      <h3 className="veredicto-nombre">{impulso.nombre}</h3>
      <div className="veredicto-precio">
        <strong>{importe}</strong>
        <span className="veredicto-etiqueta">{decision.toUpperCase()}</span>
      </div>
      <p className="veredicto-meta">{categoria ? categoria + ' · ' : ''}{fecha}</p>
    </Link>
  );
}
