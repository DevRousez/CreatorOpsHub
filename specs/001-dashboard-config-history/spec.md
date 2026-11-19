# Spec 001 — Configuración Visual y Rendimiento Histórico Real (14 Días)

Estado: implementada

## Contexto y objetivo
El proyecto CreatorOps Hub carecía de dos capacidades críticas para su usabilidad en producción: los datos del gráfico histórico de 14 días eran ficticios y hardcodeados incluso en modo real, y todas las configuraciones de canales y APIs requerían modificar archivos de código fuente o variables `.env.local`. Esta especificación establece la configuración visual integral desde la interfaz sin código y la renderización dinámica del histórico de métricas conectada a Supabase y YouTube APIs.

## Usuarios / actores
- **Creador de contenido multicuenta**: Administra múltiples canales de YouTube y perfiles de TikTok, sin conocimientos técnicos ni necesidad de programar.
- **Desarrollador / Agente de IA**: Mantiene el código bajo la arquitectura SDD y la constitución del proyecto.

## Historias de usuario
- HU-1. Como creador, quiero poder agregar, editar o eliminar canales de YouTube y TikTok desde el dashboard para no tener que abrir un editor de código.
- HU-2. Como creador, quiero autodetectar mis canales de YouTube ingresando solo mi `@handle` o `channelId` para que se completen automáticamente el nombre, avatar y suscriptores.
- HU-3. Como creador, quiero probar mis claves de YouTube y Supabase con un solo clic para verificar que las conexiones funcionen antes de guardar.
- HU-4. Como creador, quiero ver un gráfico histórico comparativo de los últimos 14 días que refleje fielmente mis cuentas reales y sus métricas en lugar de datos inventados.

## Requisitos funcionales (criterios de aceptación en EARS)
- RF-1: CUANDO el usuario hace clic en "⚙️ Configuración", EL SISTEMA despliega un modal visual con pestañas para Canales, Claves API y Modo/Sincronización.
- RF-2: CUANDO el usuario ingresa un `@handle` o Channel ID de YouTube y pulsa "Detectar", EL SISTEMA consulta la YouTube Data API v3 y autocompleta el nombre, logo y suscriptores.
- RF-3: CUANDO el usuario pulsa "Probar Conexión" en Supabase o "Probar Clave" en YouTube, EL SISTEMA ejecuta una validación en tiempo real y muestra un indicador de estado visual (éxito o mensaje de error comprensible).
- RF-4: CUANDO el usuario guarda los cambios, EL SISTEMA persiste la configuración en `data/settings.json`, sincroniza `.env.local` y refresca el estado del dashboard sin recargar la página.
- RF-5: CUANDO el dashboard carga en modo real, EL SISTEMA consulta `daily_metrics` en Supabase agrupando por día en zona horaria local y genera series dinámicas con formato `views_${account.id}` y `subs_${account.id}`.
- RF-6: SI una cuenta recién registrada no posee aún 14 días en Supabase, ENTONCES EL SISTEMA sintetiza la curva temporal de 14 días mapeando exactamente los identificadores y métricas reales de dicha cuenta.
- RF-7: CUANDO el usuario selecciona una tarjeta de cuenta específica, EL SISTEMA filtra el gráfico comparativo para aislar únicamente las métricas de esa cuenta.

## Requisitos no funcionales
- Rendimiento: La carga inicial y renderizado del gráfico no debe exceder 2 segundos.
- Compatibilidad: Funciona en Chrome, Edge, Firefox y Safari, responsive para escritorio y móviles.
- Seguridad: No exponer claves secretas al cliente; llamadas a APIs y archivos protegidos encapsuladas en endpoints `/api/*`.
- Idioma: Interfaz y mensajes completamente en español.

## Casos límite
- Supabase desconectado o sin tablas: El sistema recurre de forma segura a la configuración local sin crashear.
- Canales sin avatar: Asignar un avatar predeterminado de respaldo.
- Cuenta sin vistas en 24h: Mostrar 0 sin romper divisiones por cero en tasas de engagement.
- Múltiples canales con el mismo nombre: Distinguirlos inequívocamente por su `id` y `channelId`.

## Fuera de alcance
- Autenticación OAuth completa con consentimiento de usuario final para TikTok (queda pendiente para v2).
- Facturación o cobros de APIs.

## Criterios de finalización
- Verificación con tests unitarios en verde (`node --test tests/*.test.js`).
- Cero errores en `npx tsc --noEmit`.
- Configuración editable y comprobada desde el dashboard.
- Gráfico de 14 días mostrando series dinámicas por cada cuenta activa.

## Dudas abiertas
- [RESUELTO] ¿Dónde se persisten las configuraciones si Supabase no está configurado? Se guardan localmente en `data/settings.json` asegurando total independencia de la nube.
