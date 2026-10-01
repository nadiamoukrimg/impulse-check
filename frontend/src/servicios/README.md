# Servicios

`api.js` centraliza las cinco operaciones con `fetch`. Add Impulse y el listado mínimo de Home utilizan este servicio.

- `listarImpulsos()`: GET de todos los registros.
- `obtenerImpulso(id)`: GET de un registro.
- `crearImpulso(datos)`: POST con nombre, precio, motivo, duracionEspera, prioridad y restriccionPersonal opcional.
- `actualizarImpulso(id, datos)`: PUT con nombre, precio y motivo completos para editar, o con un único campo `estado` (`comprado` o `descartado`) para resolver el impulso. La fecha de decisión la asigna el servidor.
- `eliminarImpulso(id)`: DELETE; devuelve el mensaje JSON del backend.

Todas devuelven promesas con el JSON o lanzan un Error. Se puede capturar `error.message` y, para errores HTTP, `error.codigoHttp`. No se insertan mensajes en la interfaz; la futura capa visual deberá presentar los errores en inglés.

`VITE_API_URL` incluye el prefijo `/api`, sin `/impulsos`. En desarrollo se utiliza `/api` y el proxy de Vite reenvía las peticiones a `API_DESTINO`. Copiar `frontend/.env.example` a `frontend/.env` si no existe y reiniciar Vite después de cambiar variables. Las variables `VITE_` son públicas: nunca incluir credenciales de MongoDB.

En producción configurar `VITE_API_URL` antes de compilar. Si frontend y API comparten origen se puede usar `/api` con un enrutamiento real hacia el backend; si están en orígenes distintos, usar la URL pública terminada en `/api` y configurar CORS en el backend durante el despliegue. El proxy de Vite solo funciona en desarrollo y vista previa, no se despliega con `dist/`.
