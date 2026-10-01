import React from 'react';

// Grupo de opciones radio reutilizado por el formulario de creación y el de edición.
export default function Opciones({ nombre, titulo, opciones, valor, alCambiar }) {
  return <fieldset className="grupo-opciones"><legend>{titulo}</legend>
    <div className={'opciones-formulario opciones-' + nombre}>{opciones.map(([clave, etiqueta]) =>
      <label className="opcion-formulario" key={clave}><input type="radio" name={nombre} value={clave} checked={valor === clave} onChange={alCambiar} required /><span>{etiqueta}</span></label>
    )}</div></fieldset>;
}
