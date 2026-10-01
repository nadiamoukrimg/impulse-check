import React, { useEffect, useRef } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import Icono from './Icono.jsx';

export default function Estructura() {
  const { pathname } = useLocation();
  const contenido = useRef(null);
  useEffect(() => {
    window.scrollTo(0, 0);
    contenido.current?.focus({ preventScroll: true });
    const titulo = pathname === '/' ? 'Home' : pathname === '/historial' ? 'History' : pathname === '/impulsos/nuevo' ? 'Add Impulse' : pathname.endsWith('/editar') ? 'Edit Impulse' : pathname.startsWith('/impulsos/') ? 'Impulse Detail' : 'Page not found';
    document.title = `${titulo} · Impulse Check`;
  }, [pathname]);

  return <>
    <a className="saltar" href="#contenido">Skip to content</a>
    <header className="cabecera"><div className="cabecera-interior">
      <Link to="/" className="marca" aria-label="Impulse Check home"><span className="marca-icono"><Icono nombre="pausa" /></span><span>IMPULSE<br />CHECK<span className="punto">.</span></span></Link>
      <Link className="boton boton-pequeno" to="/impulsos/nuevo"><Icono nombre="mas" />Add impulse</Link>
    </div></header>
    <main id="contenido" ref={contenido} tabIndex={-1}>
      <p className="aviso-demo"><span aria-hidden="true">◉</span> Shared demo — use fictional data only</p>
      <Outlet />
    </main>
    <nav className="navegacion" aria-label="Main navigation"><div>
      <NavLink to="/" end><Icono nombre="inicio" /><span>Home</span></NavLink>
      <NavLink to="/historial"><Icono nombre="historial" /><span>History</span></NavLink>
    </div></nav>
  </>;
}
