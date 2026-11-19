# Spec 002 — Configuración Oficial de TikTok y Activación/Desactivación de Cuentas

Estado: implementada

## Contexto y objetivo
El creador necesita dos capacidades adicionales en el panel de configuración:
1. Una sección específica para configurar y probar las credenciales oficiales de TikTok (`Client Key` y `Client Secret` / `Access Token`) para cuando disponga de su cuenta aprobada en TikTok for Developers.
2. La posibilidad de **activar o desactivar cuentas** (habilitar / pausar) con un switch en lugar de borrarlas, permitiendo aislar o enfocar el análisis del dashboard y gráficas en los canales de su interés actual sin perder la configuración de las demás cuentas.

## Usuarios / actores
- **Creador de contenido multicuenta**: Desea comparar solo los canales que le interesan en cada momento pausando otros temporalmente, y configurar su API oficial de TikTok cuando la tenga lista.

## Historias de usuario
- HU-1: Como creador, quiero tener un interruptor (switch) en cada cuenta para activarla o desactivarla sin tener que eliminarla ni perder sus datos.
- HU-2: Como creador, quiero que al desactivar una cuenta, sus métricas no sumen en el resumen general ni se pinten en las gráficas, para enfocarme en los canales que estoy analizando.
- HU-3: Como creador, quiero una sección para ingresar `TIKTOK_CLIENT_KEY` y `TIKTOK_CLIENT_SECRET` en la pestaña de Claves API con un botón para probar la conexión en vivo.

## Requisitos funcionales (criterios de aceptación en EARS)
- RF-1: EL SISTEMA mantendrá una propiedad booleana `enabled` (por defecto `true`) en cada cuenta configurada en `data/settings.json`.
- RF-2: CUANDO el usuario hace clic en el switch de activar/desactivar de una cuenta en el panel de configuración, EL SISTEMA alternará su estado entre "Activa" y "Pausada" visualmente.
- RF-3: CUANDO el usuario guarde los cambios, EL SISTEMA persistirá el estado `enabled` de cada cuenta en `data/settings.json`.
- RF-4: CUANDO el dashboard renderice las tarjetas de cuentas, gráficas de 14 días y métricas de overview, EL SISTEMA solo incluirá las cuentas donde `enabled !== false`.
- RF-5: CUANDO el usuario acceda a la pestaña "2. Claves API" en el panel de configuración, EL SISTEMA mostrará la sección de **TikTok for Developers** con campos para `Client Key`, `Client Secret` y `Access Token`, además del modo actual de handles monitoreados.
- RF-6: CUANDO el usuario pulse el botón "Probar Conexión TikTok", EL SISTEMA ejecutará una validación en tiempo real (comprobando credenciales con la API de TikTok o validando el formato) y mostrará feedback visual claro (éxito o mensaje de error explicativo).
- RF-7: CUANDO todas las cuentas estén desactivadas, EL SISTEMA mostrará un mensaje amigable indicando que debe activar al menos una cuenta para visualizar métricas, sin crashear.

## Requisitos no funcionales
- Rendimiento: El filtrado de cuentas activas debe realizarse instantáneamente en memoria.
- Seguridad: Los secretos de TikTok (`clientSecret`) deben tratarse como contraseñas en inputs tipo `password` y no exponerse al cliente en payloads públicos innecesarios.
- Idioma: Todos los controles y mensajes en español claro para no programadores.

## Casos límite
- Cuentas antiguas sin la propiedad `enabled`: Deben tratarse por defecto como `enabled: true` (compatibilidad hacia atrás).
- Todas las cuentas desactivadas: El overview debe mostrar 0 y las gráficas un estado vacío sin errores.
- Credenciales de TikTok vacías o inválidas: Mostrar mensaje claro indicando qué falta o el motivo del error.

## Fuera de alcance
- Flujo interactivo de login web OAuth con popup en TikTok (se deja para cuando la app en TikTok Developers esté aprobada públicamente).

## Criterios de finalización
- Pruebas unitarias en verde con `node --test tests/metrics.test.js` verificando el filtrado por `enabled`.
- `npx tsc --noEmit` con 0 errores.
- Switch interactivo funcional en el modal de configuración.
- Panel de TikTok con prueba de conexión funcional en la pestaña de APIs.
