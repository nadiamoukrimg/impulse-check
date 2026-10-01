import React from 'react';
import { Route, Routes } from 'react-router-dom';
import Estructura from './componentes/Estructura.jsx';
import Inicio from './paginas/Inicio.jsx';
import CrearImpulso from './paginas/CrearImpulso.jsx';
import DetalleImpulso from './paginas/DetalleImpulso.jsx';
import EditarImpulso from './paginas/EditarImpulso.jsx';
import Historial from './paginas/Historial.jsx';
import NoEncontrada from './paginas/NoEncontrada.jsx';

export default function Aplicacion() {
  return (
    <Routes>
      <Route element={<Estructura />}>
        <Route index element={<Inicio />} />
        <Route path="impulsos/nuevo" element={<CrearImpulso />} />
        <Route path="impulsos/:id" element={<DetalleImpulso />} />
        <Route path="impulsos/:id/editar" element={<EditarImpulso />} />
        <Route path="historial" element={<Historial />} />
        <Route path="*" element={<NoEncontrada />} />
      </Route>
    </Routes>
  );
}
