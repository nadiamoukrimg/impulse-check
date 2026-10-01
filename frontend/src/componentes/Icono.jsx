import React from 'react';

const trazos = {
  inicio: 'm3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1z',
  historial: 'M3 11a9 9 0 1 1 2 7M3 4v7h7M12 7v5l3 2',
  pausa: 'M9 5v14M15 5v14',
  mas: 'M12 5v14M5 12h14',
  flecha: 'M5 12h14m-6-6 6 6-6 6',
  compra: 'M6 8h12l-1.2 12H7.2L6 8zM9.5 8V6.5a2.5 2.5 0 0 1 5 0V8',
  ahorro: 'M3 7h18v10H3zM12 9.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5z',
};

export default function Icono({ nombre }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d={trazos[nombre]} /></svg>;
}
