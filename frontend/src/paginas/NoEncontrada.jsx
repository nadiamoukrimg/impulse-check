import React from 'react';
import { Link } from 'react-router-dom';

export default function NoEncontrada() {
  return <section className="tarjeta pagina-estrecha"><p className="antetitulo">404</p><h1>Let's take a step back.</h1><p>This page doesn't exist.</p><Link className="boton" to="/">Back home</Link></section>;
}
