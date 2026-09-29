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
| Actualizar | Edición, descarte y compra | `PUT /api/impulsos/:id`, `PATCH /api/impulsos/:id/decision` |
| Eliminar | `Delete permanently` con confirmación | `DELETE /api/impulsos/:id` |

Descartar nunca llama a `DELETE`: cambia el estado a `descartado`, asigna la fecha de decisión y conserva el registro.

## Modelo principal: Impulso

`Impulso` es el único modelo de dominio.

| Campo | Tipo | Reglas |
| --- | --- | --- |
| `nombre` | String | Obligatorio y sin espacios exteriores |
| `precio` | Number | Obligatorio, igual o mayor que cero y expresado en EUR |
| `motivo` | String | Obligatorio y sin espacios exteriores |
| `fechaFinEspera` | Date | Obligatoria y calculada por el backend |
| `estado` | String enum | `pendiente`, `comprado` o `descartado`; inicialmente `pendiente` |
| `fechaDecision` | Date o null | Asignada por el backend al decidir |
| `createdAt` | Date | Timestamp estándar de Mongoose |
| `updatedAt` | Date | Timestamp estándar de Mongoose |

El formulario envía `duracionEspera`; el servidor la convierte en `fechaFinEspera`. El cliente no puede establecer ni editar esta fecha directamente.

## Estados derivados

- `pendiente` antes de `fechaFinEspera`: `Cooling down`.
- `pendiente` desde `fechaFinEspera`: `Ready to decide`.
- `descartado`: historial y total no gastado.
- `comprado`: historial y total comprado.

Los estados visuales y totales se calculan a partir de `Impulso`. No existe otro modelo.

## Reglas de negocio

- Solo se editan `nombre`, `precio` y `motivo`, y únicamente si el impulso está pendiente.
- La fecha de espera no cambia después de crear el impulso.
- Se puede descartar cualquier impulso pendiente.
- Solo se puede comprar después de terminar la espera.
- Un impulso resuelto no recibe una segunda decisión.
- El backend aplica todas las reglas aunque la interfaz desactive botones.
- El borrado requiere confirmación explícita.
- Los errores devuelven JSON con un mensaje comprensible y un código HTTP adecuado.

## Endpoints

- `GET /api/impulsos`: devuelve todos los impulsos.
- `GET /api/impulsos/:id`: devuelve uno o un error `404`.
- `POST /api/impulsos`: valida, calcula `fechaFinEspera` y crea un pendiente.
- `PUT /api/impulsos/:id`: edita nombre, precio y motivo en un pendiente.
- `PATCH /api/impulsos/:id/decision`: aplica `comprado` o `descartado`.
- `DELETE /api/impulsos/:id`: elimina permanentemente un impulso.

## Arquitectura

- React gestiona pantallas, componentes, formularios y estado mediante `useState` y `useEffect`.
- Express publica la API JSON y aplica las reglas de negocio.
- Mongoose define y valida `Impulso`.
- MongoDB Atlas conserva los datos de la demo compartida.
- Las variables de entorno contienen configuración y secretos.
- Vercel aloja el frontend y la API.

No se necesitan procesos en segundo plano: se guarda una fecha límite y se compara con la hora actual al mostrar datos y procesar decisiones.

## Estructura prevista del repositorio

La estructura se creará durante la fase de preparación. En este momento todavía no existe código de aplicación.

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
│   ├── configuracion/
│   ├── controladores/
│   ├── modelos/
│   ├── rutas/
│   ├── middleware/
│   └── package.json
├── PLAN.md
├── AGENTS.md
├── SKILLS.md
├── TASKS.md
├── README.md
└── .env.example
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

Autenticación, categorías, prioridad, enlaces, imágenes, edición del plazo, reapertura de decisiones, notificaciones, exportación, filtros avanzados, gráficos, varias monedas y varios idiomas.
