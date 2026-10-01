# Instrucciones para agentes de IA — Impulse Check

## Contexto

Impulse Check es una aplicación mobile-first para pausar compras impulsivas. Su única entidad principal es `Impulso`. Se debe leer `PLAN.md` antes de proponer o implementar cambios.

## Stack obligatorio

- Frontend: React con JavaScript y Vite.
- Backend: Node.js con Express.
- Base de datos: MongoDB Atlas con Mongoose.
- Despliegue: Vercel.
- API: JSON.

No se debe sustituir el stack ni introducir autenticación sin registrar un cambio explícito de alcance.

No se debe migrar a TypeScript. Todo el código de aplicación se escribirá en JavaScript.

## Regla de idioma

- Todo el texto visible en la web debe estar en inglés.
- El código, identificadores, variables, funciones, componentes, rutas, nombres propios de archivos, documentación y comentarios deben estar en español.
- Se mantienen `PLAN.md`, `AGENTS.md`, `SKILLS.md`, `TASKS.md` y `README.md` porque los exige literalmente el enunciado.
- Los nombres oficiales de tecnologías, APIs, hooks y campos estándar no se traducen.

## Reglas del producto

- Usar Stitch/Netlify únicamente como referencia visual.
- Mantener la implementación mobile-first.
- Mostrar el aviso de demo compartida.
- No crear pantallas separadas de Impulses o Settings.
- No permitir editar la fecha límite.
- Permitir el descarte anticipado.
- No permitir la compra antes del plazo.
- Tratar el descarte como actualización y el borrado permanente como DELETE.
- Usar `Impulso` como único modelo de dominio.

## Convenciones de implementación

- Usar nombres claros en español para archivos e identificadores.
- Mantener en inglés únicamente las cadenas visibles de la interfaz.
- Preferir componentes React pequeños y reutilizables.
- Usar `useState` para estado local y `useEffect` para cargas iniciales o dependientes de rutas.
- Validar las reglas en el backend y reflejar las restricciones en el frontend.
- Devolver errores JSON coherentes con códigos HTTP adecuados.
- No confiar en el cliente para el estado, la fecha de decisión o la fecha límite.
- Subir `.env.example`, nunca credenciales reales.
- Añadir dependencias solo si su finalidad está documentada.
- Registrar cualquier cambio de alcance en `PLAN.md` antes de implementarlo.

## Estructura

El backend y la estructura base del frontend ya existen:

```text
frontend/src/componentes/
frontend/src/paginas/
frontend/src/servicios/
frontend/src/estilos/
backend/configuracion/
backend/controladores/
backend/modelos/
backend/rutas/
backend/middleware/
```

- El frontend y el backend tendrán sus propios `package.json`.
- La API se organizará alrededor de la única entidad `Impulso`.
- El frontend centralizará las peticiones HTTP en `servicios/`.
- No se crearán repositorios, DTO, gestores de estado global u otras capas que el alcance no necesite.
- Los archivos propios utilizarán nombres descriptivos en español.

## Comandos previstos

Los comandos del backend y del frontend están creados y verificados. En PowerShell se puede utilizar `npm.cmd` en lugar de `npm`.

### Backend

```powershell
cd backend
npm install
npm run desarrollo
npm run iniciar
```

### Frontend

```powershell
cd frontend
npm install
npm run desarrollo
npm run construir
npm run vista-previa
```

Los scripts definitivos deben documentarse aquí y en el README después de comprobarlos. Un agente no debe ejecutar instalaciones ni añadir paquetes que no formen parte del plan aprobado.

Los dos scripts del backend utilizan `node --use-system-ca` (directamente o mediante nodemon) para confiar en los certificados del sistema. Se han comprobado con conexión a Atlas y respuesta HTTP de salud. No desactivar la verificación TLS.

Frontend: `desarrollo` inicia Vite en 127.0.0.1:5173; `construir` genera `dist/`; `vista-previa` sirve esa compilación en 127.0.0.1:4173. La navegación y recarga se han comprobado localmente. `frontend/vercel.json` prepara el fallback de rutas para un proyecto Vercel cuya raíz sea `frontend`; el despliegue no está verificado.

## Reglas para agentes de IA

- Inspeccionar primero el repositorio y leer `PLAN.md`, `AGENTS.md` y `TASKS.md`.
- Trabajar solamente en la tarea solicitada y mantener `TASKS.md` sincronizado con avances reales.
- No marcar una tarea como hecha hasta haberla implementado y comprobado.
- No inventar errores, pruebas, correcciones, aprendizajes ni resultados de despliegue.
- No crear código cuando la tarea se limite a documentación o análisis.
- No cambiar el modelo, las rutas, las reglas de espera o el alcance sin documentar y justificar la decisión.
- No añadir dependencias sin explicar su necesidad y comprobar antes si la plataforma ya ofrece la capacidad.
- No incluir secretos, credenciales ni la URI real de MongoDB en archivos versionados.
- Revisar el código generado antes de presentarlo como terminado y ejecutar comprobaciones proporcionales al cambio.
- Registrar en `SKILLS.md` los prompts o técnicas que hayan resultado realmente útiles.

## Verificación y documentación

- Probar creación, listado, detalle, edición, descarte anticipado, compra permitida y eliminación.
- Probar validaciones, identificadores desconocidos y compra anticipada.
- Mantener el archivo `.http` y la colección Postman sincronizados con la API.
- Actualizar `TASKS.md` durante el trabajo.
- Registrar en `SKILLS.md` y `README.md` prompts, partes generadas, errores reales, correcciones manuales y aprendizajes.
