# Impulse Check

Aplicación mobile-first para pausar compras impulsivas. El alcance se describe en PLAN.md.

## Estado actual

Backend Express con `/api/health`, conexión a MongoDB Atlas, modelo Mongoose `Impulso` y cinco operaciones CRUD implementadas y verificadas contra Atlas. Frontend React con listado real en Home y su resumen económico, detalle con lectura, edición, eliminación y decisión (comprar o descartar), y Historial con las decisiones resueltas, todos conectados a la API. Siguen pendientes el formulario compartido de creación y edición, las pruebas de diseño móvil y despliegue, y la entrega en Vercel.

## Frontend: estructura y navegación

Desde `frontend`, ejecutar `npm.cmd install` y `npm.cmd run desarrollo`. Abrir `http://127.0.0.1:5173`. `npm.cmd run construir` genera `dist/` y `npm.cmd run vista-previa` permite revisar la compilación en `http://127.0.0.1:4173`.

Dependencias previstas en el plan: React define los componentes; React DOM los monta en el documento; React Router gestiona rutas y enlaces; Vite sirve y compila el proyecto. No se añadieron librerías de estilos, iconos ni peticiones HTTP.

| Carpeta o archivo | Responsabilidad |
| --- | --- |
| `frontend/src/componentes/` | Estructura compartida, navegación, iconos y estados visuales reutilizables |
| `frontend/src/paginas/` | Inicio, creación, detalle, edición, historial y página no encontrada |
| `frontend/src/servicios/` | `api.js` con las cinco peticiones HTTP a la API, su manejo de errores y la documentación del servicio |
| `frontend/src/estilos/` | CSS mobile-first compartido |
| `frontend/src/Aplicacion.jsx` | Relaciona URLs y páginas |
| `frontend/src/principal.jsx` | Monta React y BrowserRouter |

Home e Impulses permanecen unificados en `/`. Las demás rutas son `/impulsos/nuevo`, `/impulsos/:id`, `/impulsos/:id/editar` y `/historial`. La barra inferior enlaza Home e History; la cabecera permite acceder a Add Impulse. Cada tarjeta abre su detalle y las rutas desconocidas muestran una página con enlace de vuelta.

`Link` y `NavLink` cambian la página sin recargar el documento; `NavLink` destaca la sección activa. `Outlet` muestra cada página dentro de la misma cabecera y navegación. Un `useEffect` actualiza el título y devuelve el foco al contenido al cambiar de ruta. Cada página carga y guarda sus datos con `useState` y `useEffect`.

La referencia local de Stitch se utilizó para colores, tipografía y estilo, sin copiar su código ni incorporar Settings. Las fuentes de Google Fonts tienen alternativa sans-serif si no se descargan.

Comprobado en la primera fase: los tres scripts, navegación y recarga de creación, historial y detalle, manejo de rutas desconocidas y ausencia de errores en la consola durante el recorrido. Home y detalle no desbordan horizontalmente a 320 px; también se revisó a 390 px y en escritorio. La versión compilada permite entrar y recargar `/impulsos/nuevo`.

Vite terminó la compilación con dos avisos de React Router sobre la directiva `use client`; no bloquearon la compilación ni el recorrido del navegador. No se ocultan los avisos.

Para el futuro despliegue del frontend en Vercel, seleccionar `frontend` como directorio raíz. `vercel.json` prepara la resolución de rutas a `index.html`. Esta configuración todavía no se ha probado en un despliegue público.

## Arranque local

Desde `backend`, instalar las dependencias con `npm.cmd install`. Copiar `.env.example` a `.env` solo si este último no existe y configurar manualmente `MONGODB_URI` con la base `Impulse_Check`, respetando sus mayúsculas. No sobrescribir un `.env` existente ni publicar sus credenciales.

Ejecutar `npm.cmd run iniciar` o `npm.cmd run desarrollo`. El puerto predeterminado es 3000; puede cambiarse con la variable opcional `PUERTO`.

Ambos scripts usan `node --use-system-ca`: se necesita una versión de Node que admita esta opción. Resuelve el error de certificados observado en este entorno utilizando las autoridades de confianza del sistema, sin desactivar la verificación TLS.

## Conexión, Schema y Model

- `configuracion/conexionMongo.js`: abre la conexión con `process.env.MONGODB_URI`. Si falta la variable o no se alcanza Atlas, el servidor no empieza a escuchar. El plazo de selección de servidor es de diez segundos. Se evita crear colecciones e índices automáticamente.
- `modelos/Impulso.js`: el Schema describe los campos y sus validaciones: nombre y motivo obligatorios sin espacios exteriores, precio no negativo, fecha de espera obligatoria e inmutable, estados españoles y fecha de decisión inicialmente nula. `timestamps` añade `createdAt` y `updatedAt`.
- El Model `Impulso` se construye a partir del Schema y se exporta para que los futuros controladores puedan consultar y guardar documentos. Importarlo o validar una instancia no guarda registros.
- `servidor.js`: carga dotenv, espera la conexión y después arranca Express. Ante un fallo muestra un mensaje sin datos de conexión.

La conexión abre el acceso a la base; el Schema define la forma de un documento; el Model permite trabajar con documentos que siguen ese Schema.

El controlador calcula el plazo al crear y limita la edición a impulsos pendientes. Las decisiones se resuelven en el propio PUT, que rechaza una compra anterior a `fechaFinEspera` y permite el descarte anticipado; el modelo por sí solo no bloquea nada, la regla vive en el controlador.

## API CRUD

| Operación | Petición | Respuesta correcta |
| --- | --- | --- |
| CREATE | `POST /api/impulsos` | 201 y documento creado |
| READ | `GET /api/impulsos` | 200 y lista de documentos |
| READ | `GET /api/impulsos/:id` | 200 y documento |
| UPDATE | `PUT /api/impulsos/:id` | 200 y documento actualizado |
| DELETE | `DELETE /api/impulsos/:id` | 200 y mensaje de eliminación |

POST exige `nombre`, `precio`, `motivo`, `prioridad` y `duracionEspera` (número de días: 1, 3, 7 o 14). PUT exige nombre, precio y motivo completos. Se admite `restriccionPersonal` como recordatorio opcional. PUT permite enviar también prioridad y recordatorio; al omitirlos se conservan. Los campos ajenos al contrato se rechazan, incluidos estado y fechas, salvo que el cuerpo contenga únicamente `estado`, que se interpreta como decisión. El servidor calcula el plazo y crea el estado pendiente. PUT utiliza un filtro de estado en la propia actualización para impedir editar registros resueltos.

El mismo `PUT /api/impulsos/:id` acepta un cuerpo de decisión formado solo por `{ "estado": "comprado" }` o `{ "estado": "descartado" }`. Ese cuerpo no admite ningún otro campo, ni `pendiente` (no se reabre una decisión), ni `fechaDecision`, que asigna siempre el servidor. `comprado` exige que `fechaFinEspera` ya haya pasado; `descartado` se acepta en cualquier momento. `listo` / `ready` nunca se guarda: se deriva comparando `fechaFinEspera` con la hora actual.

Los errores tienen la forma `{ "mensaje": "..." }`: 400 para datos o identificadores inválidos, 404 para documentos o rutas inexistentes, 409 para edición o decisión sobre un impulso ya resuelto y para una compra antes del plazo, 413 para cuerpos demasiado grandes y 500 para fallos internos. Nunca incluyen trazas ni mensajes internos de MongoDB.

`rutas/rutasImpulsos.js` asocia método y URL a cada función; `controladores/controladorImpulsos.js` valida y consulta el modelo; `middleware/gestionarErrores.js` centraliza los errores. Express 5 dirige automáticamente los rechazos de las funciones asíncronas al middleware de errores.

## Pruebas del CRUD

Desde `backend`: `node --use-system-ca --test pruebas/crud.test.js`. Esta prueba escribe en la base configurada, crea un documento ficticio y elimina exclusivamente su propio documento al terminar. Usa un puerto local libre y cierra su servidor y conexión. Incluye persistencia, edición, plazo intacto, eliminación, errores de validación, IDs, JSON incorrecto y una simulación controlada de error interno.

Para pruebas manuales: `pruebas/impulsos.http` y `pruebas/impulsos.postman.json`. El borrado manual debe ejecutarse solo después de seleccionar y confirmar el ID del registro de prueba.

Incidencia detectada: Atlas contiene `Impulse_Check` y la URI seleccionaba `impulse_check`; MongoDB rechazó la primera creación con código 13297. La conexión y el ping no detectaban ese conflicto de mayúsculas. La usuaria corrigió manualmente la URI y la prueba de integración pasó: creación persistida, listado, detalle, edición sin cambiar el plazo, bloqueo de edición de resueltos, borrado real y errores controlados. El registro temporal fue eliminado.

## Comprobaciones realizadas

El 1 de octubre de 2026 se verificaron sintaxis, campos obligatorios, tipos inválidos, precio negativo y cero, cadenas vacías tras recortar espacios, estados permitidos, valores predeterminados y configuración de timestamps e inmutabilidad. Las validaciones fueron en memoria, sin insertar datos.

La conexión y el ping a `impulse_check` funcionaron. Ambos scripts arrancaron conectados a Atlas y `/api/health` respondió HTTP 200. `.env` está ignorado por Git y no está entre los archivos versionados. `.env.example` contiene solo un marcador de conexión.

## Uso de IA e incidencias

Codex generó la estructura inicial, la conexión, el modelo y esta documentación. La usuaria confirmó mantener el modelo español del plan. Los prompts, incidencias de certificados y caché npm y la corrección de la prueba obsoleta `validateSync()` se registran en SKILLS.md. La revisión manual de la alumna y la reflexión final siguen pendientes.

## Servicio de comunicación

El servicio frontend/src/servicios/api.js exporta listarImpulsos, obtenerImpulso, crearImpulso, actualizarImpulso y eliminarImpulso. Usa fetch y VITE_API_URL; las respuestas HTTP fallidas lanzan Error con message y codigoHttp. Las páginas del frontend usan este servicio: Inicio lista los impulsos, el detalle los lee, los edita, los decide y los elimina, y el formulario de creación los crea. frontend/.env.example documenta /api y el destino local del proxy. Reiniciar Vite tras cambiar configuración. Para producción, definir VITE_API_URL antes de construir; el proxy local no se despliega y habrá que resolver el enrutamiento o CORS según los orígenes. Más detalles en frontend/src/servicios/README.md. Se comprobaron las cinco funciones con respuestas controladas, lecturas y errores reales mediante el proxy, y la compilación.

## Add Impulse conectado

El formulario usa useState para los valores, error, guardado y resultado; onChange actualiza el campo modificado; onSubmit evita la recarga, valida y llama a crearImpulso del servicio. Express valida los campos, calcula el plazo y Mongoose guarda en Atlas. La respuesta 201 muestra confirmación y un enlace a Home, donde un listado mínimo carga los pendientes con useEffect. El recordatorio es solo texto; no desbloquea compras. No hay categoría ni URL.

Se actualizó el modelo con prioridad obligatoria para nuevas instancias, sin migrar documentos antiguos, y la API exige prioridad en POST. Se sincronizaron las peticiones HTTP y Postman. El CRUD automatizado contra Atlas pasó, incluidas validaciones nuevas y conservación/edición de campos en PUT. En navegador se comprobó formulario vacío, guardado real, aparición en Home tras recargar y feedback al detener temporalmente la API. El registro de prueba se eliminó y la API volvió a arrancarse. El build pasó con los avisos conocidos de React Router. En esa fase, detalle, historial, métricas y decisiones todavía no estaban conectados.

## My Impulses dentro de Home

`Inicio` es quien carga `GET /api/impulsos` mediante el servicio y conserva el resultado en `useState`; pasa esos datos a `ListaImpulsos` como propiedades, de modo que el resumen económico y el listado se alimentan de la misma petición sin repetirla. `useEffect` ejecuta la carga al montar o al reintentar y su limpieza impide actualizar una pantalla desmontada. `ListaImpulsos` mantiene el reloj local con su propio efecto y lo limpia al salir; no consulta la API cada segundo.

El resumen sigue la referencia visual: `SAVINGS_VAULT.SYS` con `TOTAL NET SAVED / NOT SPENT` (suma de los precios descartados y número de impulsos descartados), `ON HOLD` (suma de los pendientes y pausas activas) y `PURCHASED` (suma de los comprados y compras intencionadas). Mientras carga o si falla la API, los tres muestran `—`; `Try again` reutiliza el mismo reintento del listado. La tarjeta lima `MAKE ROOM FOR WHAT MATTERS` con el acceso `Pause an impulse` queda debajo de los grupos, como en la referencia, y el botón de la cabecera sigue ofreciendo Add Impulse.

Los pendientes se dividen por fechaFinEspera en Ready to decide y Cooling down. Comprados y descartados aparecen en Recent decisions ordenados por fecha de decisión. Cada tarjeta muestra precio EUR, prioridad si existe, recordatorio opcional, estado textual/color y enlace al ID exacto, y los títulos de grupo llevan su contador (`unlocked`, `paused`, `decided`). La carga, lista vacía y error con Try again tienen vistas propias. La navegación al detalle se verificó en esa fase; los datos del detalle se comprobaron después.

Verificado con Atlas: cero, uno y múltiples documentos; creación desde formulario; estados cooling/ready/purchased/skipped; cambio automático al vencer; error y recuperación con Try again. Los cinco documentos temporales fueron eliminados. Revisión móvil a 320 y 390 px, sin desbordamiento horizontal observado, y compilación satisfactoria. No se añadieron dependencias ni se modificó la API.

Verificado el 1 de octubre de 2026 con cuatro registros reales (uno pendiente, uno vencido, uno comprado y uno descartado): el resumen mostró la suma correcta de cada grupo, los contadores de grupo cambiaron a `1 unlocked`, `3 paused` y `2 decided`, y los importes marcaron `—` al detener la API y volvieron al valor real al pulsar `Try again`. Ninguna tarjeta desborda a 320 px y no hubo errores de consola. Los cuatro registros de prueba se eliminaron después; los documentos creados por la usuaria se conservaron.

## Detalle: lectura, edición y eliminación

`/impulsos/:id` carga el registro con `obtenerImpulso` (GET por ID real) mediante `useEffect`, con limpieza para no actualizar una pantalla desmontada. Se distinguen tres estados: carga (`Loading your impulse…`), fallo de conexión con `Try again` y no encontrado (`Impulse not found.`) cuando la API devuelve 400 o 404.

La pantalla sigue la referencia visual: `OBJECT SPEC` con la etiqueta de estado, el nombre, el precio y la prioridad; `COOLING PROTOCOL` con la cuenta atrás, una barra de progreso entre `createdAt` y `fechaFinEspera` y la fecha de desbloqueo; `YOU ORIGINALLY SAID` con el motivo; `PERSONAL REMINDER` con `restriccionPersonal`; y `PAUSE DETAILS` con fechas, prioridad y estado. El modelo no tiene categoría, así que la posición que ocupa `Category` en la referencia se resuelve con `prioridad`, manteniendo las categorías fuera de alcance.

`Edit details` es un enlace secundario, visible solo mientras el impulso está pendiente. La ruta `/impulsos/:id/editar` muestra `EditarImpulso`, que vuelve a consultar el registro, precarga nombre, precio, motivo, prioridad y recordatorio, deja la fecha de espera en solo lectura con el aviso `The waiting period cannot be changed once started.` y envía `actualizarImpulso` (PUT) con esos cinco campos. El servidor exige estado pendiente, conserva `fechaFinEspera` y responde 400, 404 o 409, cuyos mensajes se traducen al inglés en la interfaz. Tras guardar se vuelve al detalle con el aviso `Changes saved.`; el estado de navegación se limpia después para que el aviso no reaparezca al recargar.

`Delete impulse` es una acción secundaria destructiva que abre un panel de confirmación en la misma página. Solo `Delete permanently` llama a `eliminarImpulso` (DELETE) y `Keep it` cierra el panel sin ninguna petición. Confirmado el borrado se navega a `/`, donde el listado ya no incluye el documento; un 404 durante el borrado también lleva a Home.

Comprobado el 1 de octubre de 2026 contra Atlas desde el navegador: lectura del registro con sus seis campos y estado, `PUT` con respuesta 200 que conserva `fechaFinEspera` y persistencia tras recargar, panel de confirmación sin petición al cancelar, `DELETE` con respuesta 200, vuelta a My Impulses, ausencia del registro en el listado y 404 al reabrir su URL. También el estado de carga, el error con `Try again` tras detener la API (el proxy respondió 502) y el estado no encontrado. El registro temporal se eliminó y la base quedó vacía. `npm.cmd run construir` pasó con los avisos conocidos de React Router; no se añadieron dependencias ni se modificó la API.

Detalle a tener en cuenta: en desarrollo `React.StrictMode` ejecuta dos veces el efecto de carga, por lo que se ven dos GET al abrir una pantalla. Solo ocurre en desarrollo y la limpieza del efecto descarta la primera respuesta.

El componente de opciones de radio se extrajo de `CrearImpulso` a `componentes/OpcionesFormulario.jsx` para reutilizarlo en creación y edición sin duplicar marcado.

## Decisión: comprar o descartar

La pantalla de detalle decide si muestra la vista de espera o la de decisión comparando `fechaFinEspera` con la hora actual: mientras quede tiempo se conserva la vista normal de `COOLING PROTOCOL` con la cuenta atrás; cuando el plazo ya pasó aparece el encabezado `COOL-DOWN COMPLETE`, el titular `YOU'VE WAITED N FULL DAYS.` y el panel `THE MOMENT OF TRUTH` con las dos opciones, `YES, I STILL WANT IT` y `NO, LET IT GO`. El estado `listo` no se guarda nunca: se deriva de la fecha, igual que en el listado.

El motivo original (`YOU ORIGINALLY SAID`, tarjeta `PAST SELF INTENT`) queda encima del panel para que la decisión se tome frente a la intención inicial. La copia de la referencia sobre la "subida de dopamina" se descartó por pseudocientífica; el resto del diseño de Stitch se mantiene, con dos iconos nuevos (`compra` y `ahorro`) añadidos a `componentes/Icono.jsx` sin dependencias nuevas.

Cada botón llama a `actualizarImpulso(id, { estado })`, es decir, un PUT con el cuerpo de decisión del backend. La respuesta del servidor sustituye el registro en `useState`: no hay una segunda petición de lectura. Un `decidiendo` evita dobles toques y un 409 recarga el registro para reflejar el estado real de la base. Con la decisión guardada desaparecen el panel y `Edit details`, el estado pasa a `Purchased` o `Skipped`, `PAUSE DETAILS` muestra la fecha de decisión y `Delete impulse` sigue disponible.

Comprobado el 1 de octubre de 2026 contra Atlas y desde el navegador: un impulso sin vencer no ofrece las decisiones y el backend rechaza su compra con 409; dos registros vencidos resolvieron uno a `comprado` y otro a `descartado`, ambos con `fechaDecision` asignada por el servidor y persistencia tras recargar; una segunda decisión devuelve 409; los estados del listado pasaron a Ready to decide, Cooling down y Recent decisions sin la fila resuelta en los grupos de espera. La transición en caliente se probó con un registro que vencía ocho segundos después: el panel apareció en la misma página, sin recargar. En MongoDB no existe ningún documento con `estado: listo`, ningún pendiente con `fechaDecision` y ningún resuelto sin ella. El CRUD automatizado (`node --use-system-ca --test pruebas/crud.test.js`) y `npm.cmd run construir` pasaron; no se añadieron dependencias ni se modificó el modelo. `pruebas/impulsos.http` y la colección de Postman incorporan los cinco bloques de decisión.

## Historial: decisiones resueltas

`/historial` consulta con `listarImpulsos` los mismos documentos que el resto de pantallas y transforma la respuesta en el componente, sin endpoint propio y sin dependencias nuevas. Dos operaciones encadenadas preparan los datos:

```js
const resueltos = impulsos
  .filter(impulso => ['comprado', 'descartado'].includes(impulso.estado))
  .sort((a, b) => Date.parse(b.fechaDecision || b.updatedAt) - Date.parse(a.fechaDecision || a.updatedAt));
```

`filter()` crea un array nuevo solo con los impulsos ya resueltos, de modo que los que siguen enfriando o esperando decisión no llegan a renderizarse; como el array es nuevo, `sort()` puede ordenarlo en el sitio sin mutar el estado de React. La ordenación es descendente por `fechaDecision`, con `updatedAt` como respaldo, y el render recorre `resueltos` con `.map()`, usando `impulso._id` como clave para que React identifique cada tarjeta.

La tarjeta `TarjetaVeredicto.jsx` muestra nombre, la prioridad en el hueco de categoría (mismo criterio que en el detalle), fecha y hora de decisión, precio e importe, y abre el detalle desde cualquier punto mediante `Link`. Los descartados se presentan como dinero no gastado: importe con el prefijo `+`, icono e importe sobre fondo lima y la etiqueta `SKIPPED`; los comprados, sin prefijo, fondo blanco y la etiqueta `PURCHASED`. La cabecera `RECENT VERDICTS` indica cuántas decisiones hay, sin recortar a un rango de días. La tarjeta amarilla `PAUSE RECAP` recupera el bloque de consejo de la referencia sin sus afirmaciones sobre dopamina.

También se implementaron los estados: `Loading your history…`, error con `Try again`, vacío con `No decisions yet` y lista con las tarjetas.

Comprobado el 1 de octubre de 2026 contra Atlas y desde el navegador: con cinco registros de prueba (uno enfriando, uno listo, dos comprados y un descartado con fechas escalonadas), solo aparecieron los tres resueltos, en el mismo orden que devolvía `GET /api/impulsos` ordenado por `fechaDecision` descendente, y los pendientes no se pintaron. Al comprar el registro listo desde el detalle, la pantalla pasó de 3 a 4 decisiones con el nuevo el primero. Cada tarjeta abrió su detalle. También se verificaron el estado vacío con la usuaria presente, el error al detener la API y la recuperación al arrancarla de nuevo. Sin desbordes a 320 px, sin errores de consola y con `npm.cmd run construir` correcto. Los cinco registros de prueba se borraron al terminar y el documento existente se conservó; `.http` y la colección de Postman no cambian, porque la API no se modifica.
