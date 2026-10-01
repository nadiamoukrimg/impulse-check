import React from 'react';
import Icono from './Icono.jsx';

export default function EstadoVacio({ titulo, children }) {
  return <div className="estado-vacio"><span className="icono-vacio"><Icono nombre="pausa" /></span><h3>{titulo}</h3><p>{children}</p></div>;
}
