import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Aplicacion from './Aplicacion.jsx';
import './estilos/general.css';

createRoot(document.getElementById('raiz')).render(
  <React.StrictMode>
    <BrowserRouter><Aplicacion /></BrowserRouter>
  </React.StrictMode>,
);
