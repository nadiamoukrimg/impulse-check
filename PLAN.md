# Impulse Check — Plan del proyecto

## Objetivo

Impulse Check es una aplicación web fullstack y mobile-first para reducir compras impulsivas. La persona registra un producto, explica por qué lo quiere y elige un periodo de espera. Cuando el periodo termina, decide conscientemente si lo compra o lo descarta.

La PEC evalúa un CRUD completo de una única entidad principal, `Impulso`, implementado con React y JavaScript, Node.js y Express, MongoDB Atlas y Mongoose, y desplegado en Vercel.

## Idioma y convenciones

- Todo el texto visible en la web estará en inglés.
- El código, los identificadores, variables, funciones, componentes, rutas de API y nombres propios de archivos estarán en español.
- La documentación del proyecto estará en español.
- Se mantienen `PLAN.md`, `AGENTS.md`, `SKILLS.md`, `TASKS.md` y `README.md` porque el enunciado exige literalmente esos archivos.
- Los nombres oficiales o estándar, como React, Express, MongoDB, HTTP, JSON, `useState`, `useEffect`, `.env`, `createdAt` y `updatedAt`, no se traducen.

Ejemplos: `TarjetaImpulso`, `impulsosPendientes`, `obtenerImpulsos`, `controladorImpulsos.js` y `/api/impulsos`. Una cadena visible equivalente sería `Discard impulse`.

## Alcance del MVP

1. Crear un impulso con nombre, precio estimado, motivo y periodo de espera.
2. Ver los pendientes separados entre `Cooling down` y `Ready to decide`.
3. Abrir un impulso y consultar su información.
4. Editar nombre, precio y motivo mientras esté pendiente.
5. Descartarlo en cualquier momento, incluso antes de terminar la espera.
6. Marcarlo como comprado solamente después de terminar la espera.
7. Consultar los impulsos comprados y descartados en el historial.
8. Eliminar permanentemente un impulso después de una confirmación.

## Decisiones confirmadas

- La interfaz permanece en inglés.
- El diseño de Google Stitch/Netlify se utiliza como referencia visual, sin reutilizar su código.
- La aplicación es mobile-first.
- `Home` e `Impulses` se fusionan porque muestran las mismas listas activas.
- Confirmado de nuevo al iniciar el frontend: navegación inferior con Home e History, y acceso destacado a Add Impulse. La primera fase solo preparó páginas y navegación, sin API, con el enlace `/impulsos/ejemplo` como previsualización explícita del detalle, sin registros simulados ni persistencia; ese enlace se retiró cuando el detalle se conectó a la API y ahora se abre desde cada tarjeta, y la edición cuenta con su propia ruta `/impulsos/:id/editar`.
- Se omite `Settings` porque el almacenamiento local, la exportación y las preferencias quedan fuera del MVP.
- No hay autenticación en esta versión.
- Es una demo compartida: todas las visitas ven los mismos registros de MongoDB.
- La interfaz muestra `Shared demo — use fictional data only`.
- El periodo se elige al crear y no puede editarse después.
- Se permite el descarte anticipado.
- La compra permanece bloqueada hasta que termina la espera.
- Las decisiones completadas no pueden reabrirse en el MVP.
- Descartar actualiza el registro y lo conserva en el historial.
- Eliminar borra permanentemente el registro y es una acción CRUD diferente.

## Pantallas y rutas del frontend

Las rutas se expresan en español; el contenido visible de las pantallas está en inglés.

### Inicio — `/`

Aviso de demo compartida, botón para añadir, resúmenes económicos, `Ready to decide`, `Cooling down`, decisiones recientes y enlace al historial. Cada tarjeta abre el detalle.

### Crear impulso — `/impulsos/nuevo`

Formulario con `What caught your eye?`, `Estimated price (€)`, `Why do you want it right now?`, `Select pause duration` y `Pause it now`. Las duraciones son 24 horas, 3 días, 7 días y 14 días.

### Detalle — `/impulsos/:id`

Datos, fechas, estado y tiempo restante. Incluye las acciones permitidas: editar, descartar, decidir comprar y eliminar permanentemente.

### Editar — `/impulsos/:id/editar`

Reutiliza el formulario. Nombre, precio y motivo son editables. El plazo es de solo lectura y muestra `The waiting period cannot be changed once started.`

### Historial — `/historial`

Muestra comprados y descartados ordenados por fecha de decisión, con acceso al detalle y a la eliminación permanente.

## CRUD visible

| Operación | Interfaz | API |
| --- | --- | --- |
| Crear | `+ Add impulse` y formulario | `POST /api/impulsos` |
| Leer | Inicio, detalle e historial | `GET /api/impulsos`, `GET /api/impulsos/:id` |
| Actualizar | Edición, descarte y compra | `PUT /api/impulsos/:id` |
| Eliminar | `Delete permanently` con confirmación | `DELETE /api/impulsos/:id` |

Descartar nunca llama a `DELETE`: cambia el estado a `descartado`, asigna la fecha de decisión y conserva el registro.

## Modelo principal: Impulso

`Impulso` es el único modelo de dominio.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `nombre` | String | Obligatorio y sin espacios exteriores |
| `precio` | Number | Obligatorio, igual o mayor que cero y expresado en EUR |
| `motivo` | String | Obligatorio y sin espacios exteriores |
| `prioridad` | String enum | Obligatoria al crear: `soloLoQuiero`, `seriaUtil` o `creoQueLoNecesito` |
| `restriccionPersonal` | String | Recordatorio opcional, sin efecto en el plazo |
| `fechaFinEspera` | Date | Obligatoria y calculada por el backend |
| `estado` | String enum | `pendiente`, `comprado` o `descartado`; inicialmente `pendiente` |
| `fechaDecision` | Date o null | Asignada por el backend al decidir |
| `createdAt` | Date | Timestamp estándar de Mongoose |
| `updatedAt` | Date | Timestamp estándar de Mongoose |

El formulario envía `duracionEspera`; el servidor la convierte en `fechaFinEspera`. El cliente no puede establecer ni editar esta fecha directamente.

Contrato confirmado para el CRUD: `duracionEspera` es un número de días con valores permitidos `1`, `3`, `7` y `14`. POST exige `nombre`, `precio`, `motivo`, `duracionEspera` y `prioridad`, y admite `restriccionPersonal`; PUT exige los tres campos básicos completos y permite actualizar prioridad y recordatorio. Se rechazan campos adicionales. Las respuestas correctas contienen el documento o la lista directamente; DELETE devuelve un mensaje JSON. Los errores tienen la forma `{ "mensaje": "..." }`.

Las decisiones viajan en el mismo PUT como `{ "estado": "comprado" }` o `{ "estado": "descartado" }`, sin ningún otro campo, según el cambio de alcance registrado al final de este documento.

## Estados derivados

- `pendiente` antes de `fechaFinEspera`: `Cooling down`.
- `pendiente` desde `fechaFinEspera`: `Ready to decide`.
- `descartado`: historial y total no gastado.
- `comprado`: historial y total comprado.

Los estados visuales y totales se calculan a partir de `Impulso`. No existe otro modelo.

## Reglas de negocio

- Solo se editan `nombre`, `precio`, `motivo`, `prioridad` y `restriccionPersonal`, y únicamente si el impulso está pendiente.
- La fecha de espera no cambia después de crear el impulso.
- Se puede descartar cualquier impulso pendiente.
- Solo se puede comprar después de terminar la espera.
- Un impulso resuelto no recibe una segunda decisión.
- El backend aplica todas las reglas aunque la interfaz desactive botones.
- El borrado requiere confirmación explícita.
- Los errores devuelven JSON con un mensaje comprensible y un código HTTP adecuado.

## Endpoints

- `GET /api/health`: comprueba que la API está arrancada; devuelve `200` con `{ "estado": "ok" }` y no toca la base de datos.
- `GET /api/impulsos`: devuelve todos los impulsos.
- `GET /api/impulsos/:id`: devuelve uno o un error `404`.
- `POST /api/impulsos`: valida, calcula `fechaFinEspera` y crea un pendiente.
- `PUT /api/impulsos/:id`: edita nombre, precio y motivo en un pendiente; si el cuerpo solo contiene `estado`, aplica la decisión.
- `DELETE /api/impulsos/:id`: elimina permanentemente un impulso.

## Arquitectura

- React gestiona pantallas, componentes, formularios y estado mediante `useState` y `useEffect`.
- Express publica la API JSON y aplica las reglas de negocio.
- Mongoose define y valida `Impulso`.
- MongoDB Atlas conserva los datos de la demo compartida.
- Las variables de entorno contienen configuración y secretos.
- Vercel aloja el frontend y la API.

No se necesitan procesos en segundo plano: se guarda una fecha límite y se compara con la hora actual al mostrar datos y procesar decisiones.

## Estructura del repositorio

El backend CRUD y la aplicación React están integrados con la API: creación, listado, detalle, edición, decisión, eliminación e historial funcionan contra MongoDB Atlas. Siguen pendientes el formulario compartido y el despliegue.

```text
PEC5/
├── frontend/
│   ├── src/
│   │   ├── componentes/
│   │   ├── paginas/
│   │   ├── servicios/
│   │   └── estilos/
│   └── package.json
├── backend/
│   ├── aplicacion.js
│   ├── servidor.js
│   ├── .env.example
│   ├── configuracion/
│   ├── controladores/
│   ├── modelos/
│   ├── rutas/
│   ├── middleware/
│   ├── package.json
│   └── package-lock.json
├── PLAN.md
├── AGENTS.md
├── SKILLS.md
├── TASKS.md
├── README.md
```

El frontend consumirá la API mediante un módulo de servicio. El backend separará la conexión, el modelo, los controladores, las rutas y la gestión de errores sin introducir más capas de las necesarias para una única entidad.

## Fases de desarrollo

### Fase 1 — Documentación inicial

Definir el alcance, las reglas, la arquitectura prevista, las instrucciones para IA, los prompts reutilizables y el seguimiento de tareas. No incluye código de aplicación.

### Fase 2 — Preparación y backend

Crear la estructura, configurar variables de entorno, conectar MongoDB Atlas e implementar y probar el CRUD y las reglas de decisión.

### Fase 3 — Frontend

Crear las rutas, componentes reutilizables, formularios y estados de interfaz; conectar React con la API real.

### Fase 4 — Integración y pruebas

Verificar el recorrido completo, los errores, el diseño móvil y las colecciones `.http` y Postman.

### Fase 5 — Documentación final y despliegue

Completar el README y la reflexión con hechos reales, revisar los documentos de IA, desplegar frontend y API en Vercel y comprobar las URLs públicas.

## Dependencias justificadas

- `react` y `react-dom`: frontend obligatorio.
- `react-router-dom`: navegación entre pantallas.
- `express`: backend obligatorio.
- `mongoose`: modelo y acceso a MongoDB.
- `dotenv`: variables locales.
- `cors`: solo si frontend y API usan orígenes diferentes.
- `vite`: desarrollo y compilación de React.
- `nodemon`: reinicio del backend durante el desarrollo.

No se necesitan Axios, Redux, autenticación, librerías de fechas o gráficos ni otro framework visual.

## Entregables de la PEC

- `PLAN.md`, `AGENTS.md`, `SKILLS.md`, `TASKS.md` y `README.md`, escritos en español.
- `.env.example` sin secretos; el `.env` real no se sube al repositorio.
- Un archivo `.http` y una colección `.postman.json` con nombres en español.
- Repositorio GitHub con commits comprensibles.
- URLs funcionales del frontend y de la API.

## Verificación manual

1. Crear y comprobar que aparece en `Cooling down`.
2. Recargar y comprobar la persistencia en MongoDB.
3. Editar y comprobar que el plazo no cambia.
4. Descartar antes del plazo y comprobar historial y total no gastado.
5. Preparar un registro vencido, comprarlo y comprobar historial y total comprado.
6. Comprobar que comprar antes del plazo devuelve un error.
7. Eliminar permanentemente y comprobar que desaparece de la interfaz y MongoDB.

## Fuera del alcance

Autenticación, categorías, enlaces, imágenes, edición del plazo, reapertura de decisiones, notificaciones, exportación, filtros avanzados, gráficos, varias monedas y varios idiomas.

## Cambio de alcance confirmado — prioridad y recordatorio personal

La alumna solicita incorporar `prioridad` con valores `soloLoQuiero`, `seriaUtil` y `creoQueLoNecesito`, mostrados como Just Want It, Would Be Useful e I Think I Need It. Es obligatoria en las nuevas creaciones. `restriccionPersonal` es un texto opcional, sin espacios exteriores, utilizado solo como recordatorio: no verifica condiciones, no requiere confirmación y no adelanta el plazo de compra.

POST acepta estos dos campos además de los cuatro existentes. PUT permite editarlos mientras el impulso está pendiente; si se omiten conserva los valores anteriores, manteniendo compatibles las peticiones existentes. Los documentos antiguos no se migran ni reciben una prioridad inventada. Los campos básicos siguen siendo obligatorios. El servidor sigue calculando `fechaFinEspera`.

Add Impulse se organiza en 01 Target Object (nombre y precio), 02 Reality Check (motivo y prioridad) y 03 Cooling Protocol (duración y recordatorio). La duración inicial es 7 días y la prioridad inicial Would Be Useful, como en la referencia. La conexión mínima del listado de Home permite comprobar que el impulso creado aparece tras guardar; Home e Impulses siguen unificados. No se añaden categorías ni enlaces.

## Listado real de impulsos

Home mantiene unificado My Impulses. El listado carga todos los documentos mediante GET /api/impulsos y los agrupa en Ready to decide, Cooling down y Recent decisions (comprados y descartados). Las tarjetas reutilizables enlazan a /impulsos/:id. Ready se deriva de fechaFinEspera y no se guarda como estado; el reloj se actualiza localmente sin nuevas peticiones. No se implementan aquí detalle ni decisiones; los resúmenes económicos se describen en la sección siguiente.

## Resumen económico del Home

Petición de la alumna con la captura de la referencia: en Home deben verse el dinero en pausa, además del recuento de añadir impulso y de lo gastado o ahorrado. Se sustituyen las dos tarjetas provisionales con guiones por el bloque real de la referencia:

- **`SAVINGS_VAULT.SYS`** (tarjeta principal): `TOTAL NET SAVED / NOT SPENT`, suma de los precios de los descartados, con el número de impulsos descartados debajo.
- **`ON HOLD`**: suma de los precios de los pendientes y número de pausas activas.
- **`PURCHASED`**: suma de los precios de los comprados y número de compras intencionadas.

`Inicio` es el único que consulta `GET /api/impulsos` y pasa los datos a `ListaImpulsos` como propiedades, para no repetir la petición; el resumen y el listado se actualizan juntos y `Try again` reutiliza ese mismo reintento. Mientras carga o si falla la API, los importes muestran `—`. Los grupos de la lista muestran su contador como `unlocked`, `paused` y `decided`, como en la referencia. La tarjeta de añadir impulso se mueve debajo de los grupos, porque la referencia no la muestra antes del resumen; el botón de la cabecera sigue disponible. Se conservan los textos del héroe actuales por decisión de la alumna. No se añaden dependencias ni endpoints nuevos.

## Cambio de alcance confirmado — decisión de compra o descarte mediante PUT

La alumna pide resolver la decisión con **PUT mediante `services/api.js`**, en lugar del endpoint PATCH previsto inicialmente. Se descarta `PATCH /api/impulsos/:id/decision` y PUT pasa a aceptar dos modos de cuerpo:

- **Edición**: `nombre`, `precio` y `motivo` completos, con `prioridad` y `restriccionPersonal` opcionales. Solo con `estado: pendiente`. Es el contrato existente, sin cambios.
- **Decisión**: un único campo `estado`, con valor `comprado` o `descartado`. No se admite combinarlo con campos de edición, ni enviar `pendiente` (no se reabre una decisión), ni `fechaDecision`, que asigna siempre el servidor.

Reglas aplicadas por el backend, también en este modo:

- `comprado` exige `fechaFinEspera` igual o anterior a la hora actual; antes devuelve `409`.
- `descartado` se acepta en cualquier momento, porque el descarte anticipado sigue permitido.
- El filtro de actualización exige `estado: pendiente`, de modo que un impulso resuelto no recibe una segunda decisión (`409`).
- `listo` / `ready` **nunca** se almacena: se deriva comparando `fechaFinEspera` con la hora actual, igual que en la interfaz.

La interfaz solo ofrece las dos decisiones cuando el plazo ya terminó; el descarte anticipado como botón propio queda pendiente de su tarea.

## Historial con impulsos resueltos

Pantalla `/historial` sobre la referencia visual de Stitch, con datos reales y sin endpoints nuevos: hace la misma lectura `GET /api/impulsos` que el resto de páginas y transforma la respuesta en cliente.

- **Filtrado**: `filter()` conserva solo `estado: comprado` y `estado: descartado`. Los pendientes (enfriando o listos) nunca aparecen, aunque sigan en la base de datos.
- **Ordenación**: `sort()` sobre `fechaDecision` descendente, con `updatedAt` como respaldo. `filter()` devuelve un array nuevo, así que ordenar no muta el estado de React.
- **Presentación**: cada resuelto se pinta con `TarjetaVeredicto.jsx`, que reutiliza `Icono` y `Link` al detalle: nombre, categoría (prioridad, mismo criterio que en el detalle), fecha y hora de decisión, precio e importe. Los descartados se muestran como dinero no gastado con el prefijo `+`; los comprados, sin prefijo. El icono sobre fondo lima y el importe sobre fondo lima diferencian `SKIPPED` de `PURCHASED`, además de su etiqueta.
- **Contador**: `RECENT VERDICTS` muestra cuántas decisiones hay, sin recortar a un rango de días, para no ocultar decisiones antiguas.
- **Estados**: cargando, error con `Try again`, vacío (`No decisions yet`) y lista. Sin dependencias nuevas ni cambios de API.
