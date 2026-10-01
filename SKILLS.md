# Impulse Check — Técnicas y prompts reutilizables

## Finalidad

Este archivo registra cómo se utiliza la IA durante el proyecto. Se actualizará progresivamente con prompts realmente usados, el resultado obtenido y las correcciones realizadas por la alumna.

No se documentarán errores, aprendizajes, pruebas o correcciones que todavía no hayan sucedido.

## Herramienta utilizada hasta ahora

- **Codex:** utilizado para analizar el enunciado y la referencia visual, delimitar el MVP y crear la documentación inicial del repositorio.

Se han generado y comprobado la estructura inicial del backend, la conexión a Atlas y el modelo `Impulso`. Las cinco operaciones CRUD están implementadas y verificadas contra Atlas. El frontend está integrado con la API: listado, creación, detalle, edición, decisión, eliminación e historial de decisiones, todos conectados y comprobados contra la base real.

## Técnicas utilizadas

### Base del frontend 

- Prompt: implementar únicamente estructura React y navegación mobile-first a partir de la referencia de Stitch, sin conectar la API.
- Decisión confirmada: conservar Home e Impulses unificados y nombres de carpetas en español, con textos visibles en inglés.
- Parte generada por Codex: páginas base, componentes compartidos, CSS, rutas, scripts y configuración de fallback para Vercel.
- Técnica útil: marcar explícitamente la previsualización, desactivar el formulario y usar guiones para los totales para no presentar datos inventados como reales.
- Verificación real: compilación, scripts de desarrollo y vista previa, navegación por enlaces, recarga de rutas, página desconocida y revisión móvil a 320 y 390 px. No se observaron errores de consola en el recorrido.
- Avisos reales: Vite mostró dos avisos de la directiva `use client` en React Router, sin impedir el build. La herramienta de consulta no pudo abrir la referencia Netlify; se inspeccionaron los HTML/CSS locales proporcionados.
- Pendiente: revisión manual de la alumna, integración API y comprobación del despliegue público. No se atribuyen correcciones manuales no realizadas.

### 1. Delimitar el MVP antes de generar código

**Objetivo:** evitar funciones innecesarias y asegurar que cada parte responde al CRUD evaluable.

**Técnica reutilizable:** proporcionar el contexto, el stack obligatorio, los requisitos, los criterios de aceptación y una instrucción explícita de no escribir código.

**Resultado real:** se definieron una sola entidad, las pantallas necesarias, las acciones CRUD, los endpoints previstos y las funciones que quedan fuera del MVP.

### 2. Convertir decisiones funcionales en reglas verificables

**Objetivo:** transformar una idea de producto en comportamientos que puedan implementarse y probarse.

**Técnica reutilizable:** plantear casos concretos y separar las acciones parecidas. Por ejemplo, diferenciar descartar una compra de eliminar permanentemente su registro.

**Resultado real:** se decidió que el descarte anticipado es una actualización, que el borrado corresponde a DELETE y que la compra se bloquea hasta el final de la espera.

### 3. Revisar el alcance con el enunciado oficial

**Objetivo:** comprobar que el plan cubre los entregables reales de la PEC.

**Técnica reutilizable:** aportar el enunciado completo después del primer análisis y pedir que se contrasten las decisiones con sus requisitos mínimos.

**Resultado real:** se incorporaron los documentos obligatorios, las pruebas `.http` y Postman, las variables de entorno, GitHub, los despliegues y la reflexión final.

### 4. Mantener separadas la interfaz y las convenciones internas

**Objetivo:** aplicar de manera coherente la decisión lingüística del proyecto.

**Técnica reutilizable:** indicar por separado el idioma del texto visible, del código, de los identificadores, de los archivos y de la documentación.

**Resultado real:** la interfaz será inglesa y el código y la documentación se escribirán en español, salvo nombres estándar y archivos exigidos literalmente por la PEC.

## Prompts principales utilizados

Los siguientes prompts están resumidos para poder reutilizarlos. No son afirmaciones sobre trabajo de implementación todavía no realizado.

### Análisis del MVP

```text
Analiza los requisitos y la referencia visual de esta aplicación fullstack.
Define el MVP más pequeño que conserve el concepto, las pantallas React,
los datos reales, el modelo principal, las operaciones CRUD y los endpoints.
Separa MVP y mejoras futuras. No escribas código y señala las decisiones ambiguas.
```

### Revisión frente al enunciado

```text
Contrasta el MVP acordado con este enunciado oficial de la PEC.
Comprueba que el CRUD sea visible de extremo a extremo y que estén incluidos
todos los entregables, pruebas y documentos obligatorios. No implementes código.
```

### Documentación inicial

```text
Inspecciona primero el repositorio y crea únicamente PLAN.md, AGENTS.md,
SKILLS.md y TASKS.md. Documenta solo decisiones reales, no inventes errores
ni aprendizajes y no implementes todavía frontend ni backend.
```

### Estructura inicial del backend

```text
Inspecciona las decisiones del repositorio e implementa únicamente la estructura
inicial de Node.js y Express. Separa aplicación, servidor, rutas y controladores,
añade el middleware JSON y GET /api/health. No implementes el CRUD y verifica el
arranque y la respuesta HTTP antes de dar el trabajo por terminado.
```

**Parte generada con IA:** configuración inicial de Express, separación entre aplicación, servidor, controlador y ruta de salud, scripts de npm y archivos de entorno.

**Comprobación realizada:** revisión de sintaxis, arranque mediante los dos scripts y petición HTTP real a `GET /api/health`.

**Incidencia real:** el primer intento de instalación quedó bloqueado por las restricciones de red del entorno. Se detuvo y se repitió con acceso autorizado; npm terminó sin vulnerabilidades detectadas.

## Plantilla para futuras entradas

### Conexión y modelo 

- Herramienta: Codex.
- Prompt y decisión útiles: implementar solo conexión y modelo; tras detectar diferencias con el plan, la alumna confirmó mantener los campos españoles de `Impulso` sin campos adicionales.
- Parte generada: conexión separada, Schema y Model, espera de conexión antes del arranque y documentación.
- Dependencia: Mongoose, ya prevista en PLAN.md, para conexión y validación.
- Incidencias reales: npm y Atlas devolvieron `UNABLE_TO_VERIFY_LEAF_SIGNATURE`; npm también encontró restricciones de acceso a su caché. Se usaron certificados del sistema y acceso autorizado para instalar. Los scripts incorporan `--use-system-ca`, sin desactivar TLS.
- Una primera prueba usó `validateSync()` y produjo un aviso de obsolescencia. Se repitieron las validaciones con `await validate()` sin ese aviso.
- Resultado: validaciones en memoria, conexión y ping a `impulse_check`, arranque con ambos scripts y HTTP 200 en `/api/health`. No se guardaron registros ni se implementaron rutas CRUD.
- Revisión y correcciones manuales de la alumna: pendientes; no se atribuyen las comprobaciones de Codex a la alumna.

Cada uso relevante de IA puede añadirse con esta estructura:

### CRUD REST 

- Herramienta: Codex.
- Prompt: implementar únicamente las cinco operaciones CRUD, con errores JSON, separación de rutas y controladores y pruebas reales. La usuaria confirmó rutas españolas y duración expresada en días.
- Técnica útil: concretar el contrato antes de programar, aceptar únicamente los campos permitidos y comprobar el estado dentro del filtro de actualización.
- Parte generada: rutas, controladores, middleware, prueba de integración con limpieza limitada a su registro, peticiones HTTP y colección Postman.
- Comprobaciones realizadas: sintaxis y cinco casos del middleware de errores. La primera prueba real devolvió 500 al crear; el diagnóstico identificó código MongoDB 13297: URI con `impulse_check` frente a base existente `Impulse_Check`.
- Corrección manual real: la usuaria corrigió la URI. Después, la prueba de integración pasó contra Atlas: creación persistida, listado, detalle, edición conservando el plazo, bloqueo de edición de resueltos, eliminación y errores controlados. El registro temporal se eliminó y la conexión de prueba se cerró.
- No se modificó el modelo ni se añadieron dependencias. Revisión manual de la alumna pendiente.

```text
### Fecha y tarea

- Herramienta:
- Objetivo:
- Prompt utilizado:
- Parte generada con IA:
- Revisión realizada por la alumna:
- Error o limitación observada, si ocurrió:
- Corrección manual, si ocurrió:
- Resultado comprobado:
```

Los campos sin hechos reales se dejarán pendientes; no se rellenarán con ejemplos inventados.

### Ajuste de cabecera de creación

Petición de la alumna: añadir un recuadro morado alrededor de Catch the impulse siguiendo su captura. Se reutilizaron las clases de tarjeta existentes y se añadió un separador con puntos decorativos. Resultado comprobado visualmente en navegador a 390 px, sin cambios de lógica.

### Servicio HTTP centralizado

Se creó src/servicios/api.js con fetch, cinco operaciones y errores capturables. Se mantuvieron las rutas españolas existentes. Se añadió configuración pública de entorno y proxy de Vite sin dependencias ni cambios de componentes. Las pruebas controladas verificaron métodos, cuerpos y fallos HTTP/red/JSON. La primera comprobación real falló porque el Vite abierto no había cargado el nuevo proxy; tras reiniciarlo pasaron listado 200 y errores 400/404 contra el backend. No se escribieron registros. La compilación pasó con los avisos ya conocidos de React Router.

### Add Impulse: referencia visual y conexión real

La alumna autorizó añadir prioridad y restricción personal como recordatorio. Se registró el cambio de alcance antes de tocar el modelo. Se consultaron la web y la carpeta de referencia y se usó la captura para las secciones 02 y 03. Codex implementó formulario controlado, opciones de radio reutilizadas, validación y envío mediante el servicio existente; añadió listado mínimo en Home para comprobar persistencia. Pruebas: CRUD contra Atlas, formulario vacío, POST desde móvil, lectura tras recarga y error de conexión con API temporalmente detenida. Se eliminó el documento ficticio y se restauró el backend. Se corrigió el espaciado entre grupos tras inspección visual. Una orden de estilos usó inicialmente una ruta relativa desde backend y no escribió el archivo; se repitió desde la raíz correcta. Revisión manual de la alumna pendiente.

### Listado real y tarjeta reutilizable

La alumna solicitó My Impulses con datos reales y cuatro estados. Se conservaron Home unificado, nombres españoles y el contrato /api/impulsos. Se extrajo TarjetaImpulso, se agruparon registros y se separó el reloj local de la petición GET. Pruebas reales: cero registros, creación desde React y aparición en lista, enlace al ID correcto, múltiples estados preparados exclusivamente en registros temporales de Atlas, transición de espera a listo y error/reintento deteniendo temporalmente la API. Se borraron los cinco registros de prueba y se restauró el servidor. Build correcto con los avisos conocidos de React Router; el primer comando de build se lanzó desde la raíz sin package.json y se repitió correctamente desde frontend. El detalle continúa siendo una previsualización.

### Detalle con edición y borrado 

- Herramienta: OpenCode con navegador integrado.
- Prompt: "Inspecciona los archivos relacionados y resume cómo funciona ahora. Si falta una decisión importante, indícala antes de asumirla. Propón un plan breve e implementa primero READ, después UPDATE y por último DELETE, comprobando cada uno."
- Técnica útil: preguntar antes de programar las decisiones abiertas (ubicación de la edición, qué mostrar en el hueco de `category` y tipo de confirmación de borrado) en lugar de elegir en silencio. Confirmadas: ruta `/impulsos/:id/editar`, `prioridad` en lugar de categoría y panel de confirmación en la propia página.
- Técnica útil: abrir la app de referencia visual en el navegador y crear un registro local en esa referencia para poder ver su pantalla de detalle; solo se observó el diseño, no se copió código.
- Parte generada con IA: ampliación de `DetalleImpulso` (barra de progreso, fila de prioridad, acciones y panel de borrado), página nueva `EditarImpulso`, ruta nueva, extracción de `OpcionesFormulario.jsx`, estilos del detalle y esta documentación.
- Resultado comprobado: creación de un registro de prueba desde el formulario, lectura por ID con sus campos, PUT 200 conservando `fechaFinEspera` y persistencia tras recargar, cancelación del borrado sin petición, DELETE 200 con vuelta a My Impulses, ausencia en el listado y 404 al reabrir la URL; además loading, error con `Try again` tras detener la API y estado no encontrado. Registro temporal eliminado y base vacía al terminar; build correcto con los avisos conocidos.
- Incidencias reales: el clic de la herramienta de navegador no alcanzaba el botón tapado por la navegación fija, así que se desplazó el elemento antes de pulsarlo; el estado de navegación de React Router mantenía el aviso `Changes saved.` tras recargar, y se limpia al mostrarlo; `React.StrictMode` repite el GET en desarrollo; la API se detuvo y relanzó para probar el estado de error.
- Sin dependencias nuevas y sin cambios en el modelo ni en las rutas de la API.
- Revisión manual de la alumna: pendiente.

### Decisión al terminar la espera 

- Herramienta: OpenCode con navegador integrado.
- Prompt: "Implementa únicamente el flujo de decisión cuando el periodo de espera haya terminado. Determina si `cooldownUntil` ya ha pasado; si no, conserva la vista de cooling; si ha pasado, muestra `Do you still want it?`. Recupera el motivo original, actualiza `purchased` y `skipped` con `resolvedAt`, usa PUT mediante `services/api.js`, no elimines el impulso, no guardes `ready`, evita afirmaciones pseudocientíficas sobre dopamina y no añadas dependencias. Forma de trabajo: inspecciona, explica el estado efectivo, señala edge cases, implementa, comprueba contra MongoDB y resume."
- Técnica útil: contrastar los nombres del enunciado con el modelo real antes de tocar código y presentar el mapeo (`cooldownUntil`→`fechaFinEspera`, `status`→`estado`, `resolvedAt`→`fechaDecision`, `reason`→`motivo`, `ready`→derivado). El enunciado pedía PUT y PLAN.md reservaba un `PATCH /decision` pendiente; se planteó la discrepancia y la alumna eligió ampliar PUT, decisión registrada en PLAN.md antes de implementar.
- Técnica útil: preparar registros vencidos con un script puntual de `node -e` que actualiza `fechaFinEspera` en la colección nativa (Mongoose marcaría ese campo como inmutable) porque la espera mínima es de 24 horas. El script se ejecuta desde `backend` con dotenv y `--use-system-ca`, y no se versiona ningún archivo nuevo.
- Parte generada con IA: rama de decisión en `controladorImpulsos.js` (`validarDecision` y `aplicarDecision`), encabezado y panel `DO YOU STILL WANT IT?` en `DetalleImpulso`, aviso único de éxito/error, iconos `compra` y `ahorro`, estilos del flujo de decisión, bloques de `.http` y colección de Postman, y documentación.
- Resultado comprobado: contra Atlas, compra con 409 antes del plazo, descarte anticipado con 200 y `fechaDecision` del servidor, segunda decisión con 409, `listo`/`pendiente` con 400, mezcla de edición y decisión con 400, id desconocido con 404 y edición clásica con 200 sobre pendiente. En navegador: un impulso sin vencer no ofrece el panel, dos vencidos resolvieron a `Purchased` y `Skipped` con persistencia tras recargar y sin `Edit details`, el listado repartió los grupos correctamente y la transición en caliente mostró el panel sin recargar al vencer el plazo. En MongoDB: cero documentos con `estado: listo`, cero pendientes con `fechaDecision` y cero resueltos sin ella. Prueba de integración y build correctos.
- Incidencias reales: el backend seguía ejecutando el código anterior y las primeras decisiones devolvieron 400, hasta reiniciar el proceso `node`; PowerShell falló dos veces al construir el script de Node (`$set:` dentro de comillas dobles y comillas dobles eliminadas al pasar el argumento), resueltas con cadenas entre comillas simples; la interfaz mostraba `I've waited 1 days` y se corrigió el singular; el clic de navegador falló con `Node is detached` por un re-renderizado, y se repitió con la referencia de una instantánea nueva.
- Sin dependencias nuevas y sin cambios en el modelo ni en las rutas de la API: sigue siendo `PUT /api/impulsos/:id`.
- Revisión manual de la alumna: pendiente.

### Resumen económico del Home 

- Herramienta: OpenCode con navegador integrado.
- Prompt: "En la referencia visual, en home hay un recuento también del dinero que está en pausa actualmente y en la web final eso no aparece, solo aparece el recuadro para añadir un impulso y el recuento del dinero gastado o ahorrado; puedes cambiar eso para que se vea como la imagen que te adjunto."
- Decisiones confirmadas antes de implementar: mover la tarjeta `Pause an impulse` al final de la página y conservar los textos actuales del héroe, aunque la captura muestre otros distintos.
- Técnica útil: abrir la referencia en el navegador y leer su árbol de accesibilidad para obtener el orden y los textos exactos del bloque (`SAVINGS_VAULT.SYS`, `TOTAL NET SAVED / NOT SPENT`, `ON HOLD`, `PURCHASED`) y los contadores de grupo (`unlocked`, `paused`), en lugar de deducirlos de una captura incompleta.
- Técnica útil: mover la carga al componente que ya necesita los datos y bajarlas por props (`Inicio` → `ListaImpulsos`) para no repetir `GET /api/impulsos`, en lugar de añadir un estado global o una segunda petición.
- Parte generada con IA: `Inicio` con la carga única y los tres cálculos de importes, `ListaImpulsos` convertido a componente con propiedades, estilos `.caja-ahorro` y `.caja-resumen`, y esta documentación.
- Resultado comprobado: con cuatro registros reales, `SAVINGS_VAULT.SYS` marcó €169.99 y `1 impulse skipped`, `ON HOLD` €679.96 y `3 active pauses`, `PURCHASED` €349.00 y `1 intentional purchase`, y los grupos `1 unlocked`, `3 paused` y `2 decided`. Deteniendo la API, los tres importes pasaron a `—` con el aviso de error y `Try again` devolvió los datos reales al arrancarla de nuevo. Ninguna tarjeta desborda a 320 px y no hubo errores de consola. `npm.cmd run construir` pasó con los avisos conocidos de React Router.
- Incidencias reales: la primera lectura del DOM se hizo durante la carga y devolvió los guiones del estado inicial; hizo falta repetir la instantánea. No hubo dependencias nuevas ni cambios de API.
- Registros: se eliminaron los cuatro documentos de prueba creados para esta comprobación; los documentos existentes de la usuaria se conservaron.
- Revisión manual de la alumna: pendiente.

### Historial con decisiones resueltas 

- Herramienta: OpenCode con navegador integrado.
- Prompt: "Implementa únicamente History con los impulsos ya resueltos. Utiliza datos reales, muestra únicamente purchased y skipped, ordena por resolvedAt del más reciente al más antiguo, diferencia visualmente ambas decisiones, muestra nombre, precio, categoría, decisión y fecha, para skipped muestra el precio como dinero no gastado, cada elemento puede abrir su detalle, incluye estado vacío, mantén el diseño mobile-first y no añadas dependencias sin explicar por qué. Forma de trabajo: inspecciona, explica qué datos reutilizas, implementa filtrado y ordenación, comprueba con varios estados, aplica la referencia visual, resume los cambios y explica filter(), sort() y el renderizado."
- Técnica útil: traducir los nombres del enunciado al modelo real antes de escribir código (`resolvedAt`→`fechaDecision`, `purchased`→`comprado`, `skipped`→`descartado` y `category`→`prioridad`, criterio ya confirmado por la alumna en el detalle) y anunciar ese mapeo en la respuesta.
- Técnica útil: preparar los cinco casos de una sola vez (enfriando, listo, dos comprados y un descartado, con `fechaDecision` escalonada en la colección nativa) para ver a la vez el filtrado, el orden y la aparición de un nuevo resuelto sin repetir la prueba.
- Parte generada con IA: componente nuevo `componentes/TarjetaVeredicto.jsx`, página `Historial.jsx` con carga, filtrado, ordenación y los tres estados, estilos `.lista-veredictos`, `.veredicto*`, `.estado-vacio-recuadro` y `.consejo`, y esta documentación.
- Resultado comprobado: con cinco registros, el historial mostró solo los tres resueltos, en orden `Ergonomic chair` (comprado), `Vintage film camera` (descartado) y `Mechanical keyboard` (comprado), coincidiendo línea a línea con `GET /api/impulsos` de MongoDB; los pendientes no aparecieron. Tras comprar el registro listo desde el detalle, `RECENT VERDICTS` pasó de 3 a 4 decisiones y el nuevo quedó el primero. Cada tarjeta abrió `/impulsos/:id`. Después se verificaron el estado vacío con `0 decisions`, el error con `Try again` deteniendo la API, la recuperación al volver a arrancarla y la ausencia de desbordes a 320 px (277 px de tarjeta, columna de nombre de 105 px). `npm.cmd run construir` pasó con los avisos conocidos de React Router y no hubo errores de consola en la página cargada.
- Incidencias reales: la primera maquetación con tres columnas centradas partía la palabra `Mechanical` a 320 px, porque `overflow-wrap: anywhere` encogía la columna del nombre; se cambió a una rejilla de dos filas (`icono | nombre | precio` y `meta` a ancho de la tarjeta) con icono de 42 px. Solo con la fecha, dos decisiones del mismo día se veían sin orden aparente, así que se muestra fecha y hora. La referencia pone `PAST 14 DAYS` y se sustituyó por el contador de decisiones, porque la lista no recorta por fecha y la etiqueta habría mentido sobre el filtro. La captura de pantalla y dos lecturas del DOM se hicieron durante la carga y devolvieron el estado inicial; hizo falta repetirlas.
- Sin dependencias nuevas y sin cambios en el modelo ni en las rutas de la API: se sigue usando `GET /api/impulsos`.
- Registros: los cinco documentos creados para esta comprobación se eliminaron al terminar; el documento de la usuaria se conservó.
- Revisión manual de la alumna: pendiente.

### Corrección de los críticos y repetición de la auditoría

- Herramienta: OpenCode con navegador integrado.
- Prompt: "arregla los criticos de la auditoria y vuelve a pasarla".
- Técnica útil: verificar cada crítico con hechos antes de darlo por resuelto (`git remote -v`, `git log`, `git ls-files` sobre los `.env`) en lugar de darlo por bueno por la ronda anterior.
- Técnica útil: concentrar toda la auditoría de la API en un único script que crea sus registros temporales, comprueba los códigos esperados, los borra y compara la colección con la línea de base, de modo que cualquier fallo quede listado y la base quede como al empezar.
- Técnica útil: probar los estados vacío y de error con una instancia aislada (segundo Vite en el puerto 5199 con `API_DESTINO` apuntando a una API simulada de unas cuantas líneas) en vez de detener la API de la usuaria; así se comprueban vacío, error con `Try again` y recuperación sin tocar nada.
- Técnica útil: para Vercel, leer la documentación antes de proponer cambios: las `rewrites` sustituyen `req.url`, así que la API se publica con archivos de la carpeta `api/` que coinciden con las rutas reales y no con rewrites.
- Parte generada con IA: `frontend/vercel.json` excluye `/api/` del fallback SPA; la configuración de Vercel del backend (archivos `api/`, `entradaVercel.js`, `corsPermitido.js`) y la documentación ya existían de la tarea anterior.
- Resultado comprobado: 24 comprobaciones HTTP correctas y 0 fallos (salud, 201 con `Location`, cinco validaciones de creación con 400, 400 de id mal formado, 404 en GET/PUT/DELETE desconocidos, 409 de compra anticipada, 200 de descarte anticipado con `fechaDecision` del servidor, 409 de segunda decisión y de edición sobre resuelto, 200 de edición con `fechaFinEspera` intacta, 400 de estado inválido y de mezcla, 413 con 150 KB, 404 en JSON para rutas desconocidas y colección restaurada al inicio). Prueba de integración `pass 1/1`, fallback 500 en JSON, CORS emitido con `ORIGEN_PERMITIDO` y ausente sin él, entrada de Vercel respondiendo 200/200/400 con la URL original, build con exit 0 y JSON de `vercel.json` y de Postman válidos. En navegador: creación con 201, edición con PUT 200 y plazo intacto, descarte, historial con `1 decision`, borrado con diálogo de confirmación y 200, pantallas de 404, estado vacío en Home e Historial, error con `Try again` y recuperación, y consola sin errores de la aplicación.
- Incidencias reales: el primer guion de auditoría usó `id` en lugar de `_id` y produjo 9 falsos fallos y dos registros temporales huérfanos, que se borraron antes de repetir la prueba corregida; un clic automatizado sobre `PAUSE IT NOW` no envió nada y hizo falta `form.requestSubmit()` para ejercitar el mismo controlador (artefacto del automatizador, no de la aplicación); la ventana del navegador mide 298 px, por lo que el desborde observado provenía del `min-width: 320px` del cuerpo y no de las tarjetas.
- Hallazgo nuevo: la interfaz todavía no ofrece el descarte anticipado como botón propio (pendiente ya documentado en `PLAN.md`), clasificado como importante y no crítico.
- Sin dependencias nuevas ni cambios de modelo ni de API.
- Registros: los documentos temporales creados por el guion y por el recorrido del navegador se borraron; solo queda el documento existente de la alumna.
- Revisión manual de la alumna: pendiente.
