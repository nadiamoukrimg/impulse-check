# Impulse Check — Seguimiento de tareas

Leyenda: `[ ]` pendiente, `[~]` en curso, `[x]` terminada.

## Planificación

- [x] Analizar la referencia visual y los requisitos.
- [x] Definir el MVP y la entidad única.
- [x] Asociar cada operación CRUD a una acción visible.
- [x] Decidir la demo compartida sin autenticación.
- [x] Fusionar Home e Impulses y omitir Settings.
- [x] Definir el descarte anticipado y el plazo no editable.
- [x] Fijar la interfaz en inglés y el código y documentación en español.
- [x] Registrar las decisiones en `PLAN.md` y `AGENTS.md`.
- [x] Definir las fases y la estructura prevista sin crear código.
- [x] Crear el registro inicial de técnicas y prompts en `SKILLS.md`.

## Preparación

- [x] Crear frontend y backend con nombres en español: ambas estructuras creadas.
- [x] Configurar los scripts iniciales del backend.
- [x] Añadir `.gitignore`, `.env.example` y variables locales: `.env` excluido y variable MongoDB documentada sin secretos.
- [x] Conectar MongoDB Atlas: conexión y ping a `impulse_check` comprobados.
- [x] Configurar la comunicación entre frontend y API: servicio, proxy, creación y listado mínimo conectados.

## Backend

- [x] Configurar Express y la ruta `GET /api/health`.
- [x] Crear el modelo `Impulso`: validaciones comprobadas en memoria sin guardar registros.
- [x] Implementar listado y detalle.
- [x] Implementar creación y cálculo de plazo.
- [x] Implementar edición sin cambios de plazo.
- [x] Implementar descarte anticipado y validación de compra: PUT con cuerpo `{ "estado": ... }`, compra rechazada antes de `fechaFinEspera` (409) y descarte aceptado en cualquier momento; segunda decisión, estados no resolubles y mezcla con edición rechazados.
- [x] Implementar eliminación permanente.
- [x] Añadir validación y gestión JSON de errores.

## Frontend

- [x] Implementar estructura y navegación mobile-first: Home e Impulses unificados; creación, detalle e historial accesibles, sin conexión a la API. Compilación, navegación y recarga local comprobadas.
- [x] Implementar Inicio con resúmenes y listas activas: `SAVINGS_VAULT.SYS` con el dinero no gastado, `ON HOLD` con lo que está en pausa y `PURCHASED` con lo comprado, calculados desde los documentos reales; `Inicio` hace la única petición GET y se la pasa a `ListaImpulsos`. Cargando o en error los importes muestran `—` y `Try again` reutiliza el mismo reintento.
- [ ] Implementar el formulario compartido.
- [x] Implementar detalle y acciones según estado: lectura por ID, edición, eliminación y decisión (comprar o descartar) cuando termina la espera.
- [x] Implementar confirmaciones de descarte y eliminación: la eliminación pide confirmación en un panel; las dos decisiones se aplican directamente desde sus botones, siguiendo la referencia visual, y no se puede repetir una decisión ya guardada.
- [x] Implementar Historial: página `/historial` con los documentos reales de `GET /api/impulsos`, filtrados con `filter()` a `comprado` y `descartado` y ordenados con `sort()` por `fechaDecision` descendente; tarjetas `TarjetaVeredicto` con nombre, prioridad, fecha y hora, precio e importe, sin dependencias nuevas ni endpoints nuevos.
- [x] Añadir estados de carga, vacío, éxito y error: detalle con loading, error con reintento y no encontrado; aviso de guardado tras editar; listado con loading, vacío e error; historial con loading, error con `Try again` y vacío (`No decisions yet`).
- [x] Añadir el aviso de demo compartida.
- [x] Comprobar que todas las cadenas visibles de la estructura actual estén en inglés; repetir al añadir funcionalidad.

## Pruebas

- [x] Crear el archivo `.http` con nombre en español.
- [x] Crear la colección `.postman.json` con nombre en español.
- [x] Probar el CRUD completo contra MongoDB: prueba de integración superada tras la corrección manual de la URI; persistencia, edición, borrado y errores verificados. Registro temporal eliminado.
- [x] Probar descarte anticipado y bloqueo de compra anticipada: compra con 409 antes del plazo, descarte anticipado con 200 y `fechaDecision` del servidor, segunda decisión con 409, `listo`/`pendiente` con 400 y mezcla de decisión y edición con 400. En interfaz, un impulso sin vencer no muestra las decisiones y dos vencidos resolvieron a `comprado` y `descartado` con persistencia tras recargar. En MongoDB no hay documentos con `estado: listo` ni resueltos sin `fechaDecision`.
- [x] Probar el detalle desde la interfaz contra Atlas: lectura por ID con el registro correcto, PUT con plazo intacto y persistencia tras recargar, confirmación y DELETE real, ausencia del registro en My Impulses y 404 posterior. También loading, error con Try again tras detener la API y estado no encontrado. Registro temporal eliminado y base vacía al terminar.
- [ ] Probar diseño móvil y despliegues.

## Documentación

- [x] Crear `SKILLS.md` en español.
- [x] Crear la documentación inicial exigida: `PLAN.md`, `AGENTS.md`, `SKILLS.md` y `TASKS.md`.
- [x] Crear el `README.md` en español con el estado actual del backend; se ampliará durante las siguientes fases.
- [ ] Documentar herramientas, prompts y partes generadas por IA.
- [ ] Documentar correcciones manuales y errores reales de la IA.
- [ ] Escribir la reflexión final.
- [ ] Revisar toda la documentación frente a la implementación final.

## Entrega

- [ ] Crear commits significativos.
- [ ] Subir el repositorio a GitHub.
- [ ] Desplegar API y frontend en Vercel.
- [ ] Verificar las URLs públicas.
- [ ] Entregar repositorio y URLs en Google Classroom.

- [x] Ajuste visual solicitado: cabecera lavanda en Add Impulse, con borde, sombra, separador y puntos decorativos; comprobada en navegador móvil.

- [x] Crear servicio HTTP reutilizable con cinco funciones, variable de entorno y proxy de desarrollo. Comprobados métodos y errores con respuestas controladas, y lecturas reales mediante el proxy. Integración de componentes pendiente.

- [x] Add Impulse: tres secciones según referencia, prioridad y recordatorio opcional; validación, POST real, confirmación y listado mínimo en Home comprobados.

- [x] Listado real en Home/My Impulses: TarjetaImpulso reutilizable, cuatro estados visuales, agrupación, tiempo restante, loading/error/vacío y reintento. Verificados cero, uno y múltiples registros reales, transición por vencimiento y enlace al ID correcto. El contenido del detalle se implementó después, en la entrada siguiente.

- [x] Detalle de Impulse (READ, UPDATE y DELETE): DetalleImpulso obtiene el registro real por ID con loading, error con Try again y not found; muestra nombre, precio, prioridad, motivo, recordatorio, cooldown con barra de progreso y estado, más acciones Edit details y Delete impulse. Nueva ruta `/impulsos/:id/editar` con EditarImpulso, formulario precargado, plazo de solo lectura y PUT; el borrado requiere confirmación en un panel y vuelve a My Impulses. El componente de opciones radio se extrajo a `OpcionesFormulario.jsx` para no duplicarlo entre creación y edición. Sin dependencias nuevas y sin cambios de API.

- [x] Decisión cuando termina la espera (UPDATE): el detalle compara `fechaFinEspera` con la hora actual y, si aún no venció, conserva la vista de cooling; si venció, muestra `COOL-DOWN COMPLETE`, el titular con los días esperados y el panel `DO YOU STILL WANT IT?` con `YES, I STILL WANT IT` y `NO, LET IT GO`, bajo `YOU ORIGINALLY SAID`. Cada botón envía `actualizarImpulso(id, { estado })` y el documento devuelto actualiza la pantalla sin una segunda lectura; `decidiendo` evita dobles toques y un 409 recarga el registro. El backend acepta el cuerpo `{ "estado": "comprado" | "descartado" }` dentro de PUT, exige `pendiente`, bloquea la compra antes del plazo, asigna `fechaDecision` y no almacena nunca `listo`. Cambio de alcance registrado en `PLAN.md` antes de implementar; `.http`, colección de Postman, README y servicios/README sincronizados. Nuevos iconos `compra` y `ahorro` en `Icono.jsx`, sin dependencias nuevas. Verificado contra Atlas y navegador; CRUD automatizado y build correctos; la base se dejó vacía.

- [x] Resumen económico del Home: bloque nuevo `SAVINGS_VAULT.SYS` / `ON HOLD` / `PURCHASED` con importes y contadores reales, sustituyendo las tarjetas provisionales con guiones. `Inicio` centraliza la única carga de `GET /api/impulsos` y la comparte con `ListaImpulsos` como propiedades, sin peticiones duplicadas; `—` durante la carga o el error y `Try again` común. Los grupos muestran `unlocked`, `paused` y `decided`, y la tarjeta `Pause an impulse` pasa al final de la página. Sección nueva en `PLAN.md` y documentación actualizada. Comprobado en navegador con cuatro registros reales, error con parada de la API y recuperación, sin desbordes a 320 px ni errores de consola; registros de prueba eliminados y los de la usuaria conservados. Sin dependencias nuevas ni cambios de API.

- [x] Historial con impulsos resueltos: `/historial` reutiliza `GET /api/impulsos` y en cliente aplica `filter()` sobre `['comprado', 'descartado']` y `sort()` por `fechaDecision` descendente (`updatedAt` como respaldo), de modo que `filter()` entrega un array nuevo y ordenarlo no muta el estado. El componente nuevo `TarjetaVeredicto.jsx` muestra nombre, prioridad (en el hueco de categoría, igual que en el detalle), fecha y hora, precio e importe, y abre el detalle desde cualquier punto de la tarjeta: los descartados con `+` sobre fondo lima como dinero no gastado y `SKIPPED`, los comprados sin `+` sobre fondo blanco y `PURCHASED`. La sección `RECENT VERDICTS` muestra el contador de decisiones, sin recortar a `past 14 days` para no ocultar decisiones antiguas, y la tarjeta `PAUSE RECAP` evita las afirmaciones pseudocientíficas de la referencia. Estados de carga, error con `Try again` y vacío añadidos. Comprobado contra MongoDB: cinco registros creados (uno enfriando, uno listo, dos comprados y uno descartado) mostraron solo los tres resueltos en el orden correcto, y tras comprar el listo en el detalle pasó a ser el primero; después se comprobaron vacío, error con la API parada y recuperación, y se borraron los registros propios dejando el de la usuaria. Build correcto y sin desbordes a 320 px. Sin dependencias nuevas, sin cambios de API y sin tocar `.http` ni la colección de Postman.

- [x] Auditoría completa de la PEC 5 sin modificar código, y corrección de los problemas clasificados como importantes. Se comprobaron contra Atlas y el navegador los cinco CRUD (creación desde el formulario real, listado, detalle, edición con `fechaFinEspera` intacta y eliminación con 404 posterior), la persistencia, la gestión de errores (400, 404, 409, 413 y 500), las variables de entorno, la ausencia de secretos en los archivos trackeados, los componentes reutilizables, el uso de `useState` y `useEffect`, la conexión frontend-backend mediante proxy, `.http`, la colección de Postman, `PLAN.md`, `AGENTS.md`, `SKILLS.md`, `TASKS.md`, `README.md`, `.env.example`, el build de producción (exit 0) y la consola sin errores ni avisos en las seis pantallas. Corregidas las frases obsoletas de `README.md` (estado actual, carpeta de servicios, rutas, `useState` y previsualización), de `PLAN.md` (integración del frontend) y de `SKILLS.md` (integración del frontend), y añadido `GET /api/health` a `pruebas/impulsos.http`, a la colección de Postman y a la lista de endpoints de `PLAN.md`: quedan 15 bloques y 15 peticiones, con la prueba de salud primero y sin tocar datos. El repositorio ya estaba subido a GitHub por la alumna, sin ningún `.env`. Sigue pendiente, como problema crítico, el despliegue en Vercel con CORS y enrutamiento de la API. Sin dependencias nuevas ni cambios de código.

- [x] Preparación del despliegue en Vercel sin alterar el funcionamiento local. La app Express se expone con tres adaptadores de la carpeta `api/` (`health.js`, `impulsos.js` e `impulsos/[id].js`) que delegan en `configuracion/entradaVercel.js`, el cual memoriza la conexión con Atlas por instancia caliente y llama a `aplicacion.js`, porque Vercel no ejecuta `servidor.js`; no se usan `rewrites` para enrutar la API, ya que Vercel sustituye `req.url` y Express necesita la URL original. Nuevo middleware `middleware/corsPermitido.js`, sin dependencias, que añade las cabeceras CORS y responde `204` a `OPTIONS` solo si `ORIGEN_PERMITIDO` coincide con el origen de la petición; `aplicacion.js` lo monta con una línea y, sin la variable, no modifica ninguna respuesta. `.env.example` documenta `ORIGEN_PERMITIDO`. Verificado en local: la prueba de integración del CRUD sigue pasando, las cabeceras CORS se emiten con la variable y no se emiten sin ella, los tres archivos exportan una función, la entrada devuelve `200` en `/api/health`, `200` con los documentos reales en `/api/impulsos` y `400` con JSON en un identificador inválido, y `npm.cmd run construir` termina con exit 0. Variables manuales en Vercel y checklist de comprobación documentadas en `README.md`; **el despliegue real sigue pendiente de ejecutarse y verificarse**.

- [x] Corrección de los problemas críticos de la auditoría y repetición completa de la auditoría. **Crítico 1, repositorio vacío**: ya estaba resuelto por la alumna y se comprobó de nuevo (`origin` apunta a `github.com/nadiamoukrimg/impulse-check`, tres commits, todos los archivos trackeados y ningún `.env`; solo se ignoran `backend/.env` y `frontend/.env`). **Crítico 2, despliegue de la API en Vercel**: se completó la preparación añadiendo que `frontend/vercel.json` excluye `/api/` del fallback SPA, de modo que en producción una llamada a `/api/*` mal configurada devuelve el 404 de Vercel en lugar de `index.html`. Sigue sin ejecutarse ni verificarse el despliegue real: no hay CLI ni credenciales de Vercel en este entorno y los pasos manuales están en `README.md`. **Auditoría repetida, sin fallos**: 24 comprobaciones HTTP contra la API en marcha (salud; CREATE 201 con `Location`, `estado: pendiente`, `fechaDecision: null` y plazo futuro; cinco validaciones de creación con 400; id mal formado con 400; id desconocido con 404 en GET, PUT y DELETE; compra anticipada con 409; descarte anticipado con 200 y `fechaDecision` del servidor; segunda decisión con 409; edición sobre resuelto con 409; edición válida con 200 y `fechaFinEspera` intacta; estado de decisión inválido y mezcla de decisión y edición con 400; cuerpo de 150 KB con 413; rutas desconocidas con 404 en JSON; DELETE con 200 y 404 posterior; y colección restaurada al estado inicial con el documento existente). Prueba de integración `pass 1/1`, fallback 500 en JSON, CORS con cabeceras cuando existe `ORIGEN_PERMITIDO` y sin cabeceras cuando no existe, y los tres archivos de `api/` respondiendo con la URL original a través de la entrada de Vercel. `npm.cmd run construir` con exit 0 y `vercel.json` con JSON válido. En navegador: Home carga por proxy con el documento existente, el formulario crea con 201 y muestra la confirmación, el detalle y la edición hacen PUT 200 sin tocar el plazo, el descarte pasa a `Skipped`, el Historial muestra `1 decision` con fecha y hora, el borrado pide confirmación y devuelve 200 con el registro fuera de Atlas, `/ruta-inexistente` y un id desconocido muestran sus pantallas, y los estados vacío (Home e Historial), de error con `Try again` y de recuperación se probaron en una instancia aislada con API simulada, dejando los servidores de la usuaria intactos. La consola no muestra errores de aplicación (solo los registros de red 404/502 provocados por las propias pruebas) y los registros temporales se borraron al terminar. **Hallazgo nuevo clasificado como importante, no crítico**: la interfaz todavía no ofrece el descarte anticipado como botón propio, pendiente documentado en `PLAN.md`; el resto de pendientes conocidos (formulario compartido, pruebas de diseño móvil, despliegue real) no cambian. Sin dependencias nuevas.
