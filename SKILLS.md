# Impulse Check — Técnicas y prompts reutilizables

## Finalidad

Este archivo registra cómo se utiliza la IA durante el proyecto. Se actualizará progresivamente con prompts realmente usados, el resultado obtenido y las correcciones realizadas por la alumna.

No se documentarán errores, aprendizajes, pruebas o correcciones que todavía no hayan sucedido.

## Herramienta utilizada hasta ahora

- **Codex:** utilizado para analizar el enunciado y la referencia visual, delimitar el MVP y crear la documentación inicial del repositorio.

Hasta este momento no se ha generado código del frontend ni del backend.

## Técnicas utilizadas

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

## Plantilla para futuras entradas

Cada uso relevante de IA puede añadirse con esta estructura:

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
