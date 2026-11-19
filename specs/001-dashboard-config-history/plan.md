# Plan 001 — Configuración Visual y Rendimiento Histórico Real (14 Días)

## Archivos y responsabilidades
- `src/types/settings.ts`: Definición de interfaces de configuración (`ConfigAccount`, `AppSettings`, `DEFAULT_ACCOUNTS`). (RF-1, RF-4)
- `src/lib/settings.ts`: Lectura y persistencia de configuración en servidor (`data/settings.json`, `.env.local`). (RF-4)
- `src/lib/server-data.ts`: Consulta de datos a Supabase y cálculo de proyecciones históricas dinámicas. (RF-5, RF-6)
- `src/lib/data-provider.ts`: Cliente React ligero para consultar `/api/dashboard`. (RF-5)
- `src/app/api/settings/route.ts`: API REST para obtener y guardar configuración. (RF-4)
- `src/app/api/settings/test-connection/route.ts`: Endpoint para probar claves de YouTube y Supabase y autodetectar canales. (RF-2, RF-3)
- `src/app/api/dashboard/route.ts`: Endpoint servidor que entrega los datos procesados del dashboard. (RF-5, RF-6)
- `src/app/api/sync/route.ts`: Sincronización completa con YouTube Data API v3 y persistencia en tablas `accounts` y `daily_metrics`. (RF-5)
- `src/components/SettingsModal.tsx`: Interfaz visual con pestañas para gestión de cuentas, claves y sincronización. (RF-1, RF-2, RF-3, RF-4)
- `src/components/AnalyticsCharts.tsx`: Gráfica interactiva de Recharts que renderiza dinámicamente cada cuenta configurada. (RF-5, RF-6, RF-7)
- `tests/metrics.test.js`: Pruebas unitarias de funciones puras de histórico y agregaciones.

## Funciones puras (sin acoplamiento a DOM ni frameworks)
- `generateDynamicHistory(accounts, todayDate)`: Recibe la lista de cuentas y la fecha base; retorna exactamente 14 puntos temporales con claves `views_${acc.id}` y `subs_${acc.id}`. (RF-5, RF-6)
- `calculateOverview(accounts, recentContent)`: Calcula audiencia total, crecimiento 24h, total de reproducciones y engagement promedio ponderado.

## Decisiones técnicas justificadas
1. **Persistencia dual en disco (`data/settings.json`) y base de datos:**
   - *Alternativa descartada:* Guardar únicamente en variables de entorno `.env.local`.
   - *Justificación:* `.env.local` requiere reiniciar servidores de desarrollo para reflejarse en ciertos procesos y no es apto para listas complejas de objetos como canales con avatars y colores. `settings.json` ofrece lectura y escritura instantánea en tiempo de ejecución.
2. **Generación dinámica de series en Recharts:**
   - *Alternativa descartada:* Mantener identificadores estáticos `views_yt1`, `views_yt2`.
   - *Justificación:* Limitaría la app a exactamente 2 canales fijos de nombres predeterminados. La iteración dinámica permite 1, 4 o N canales con colores personalizados.
3. **Aislamiento de módulos con Node `fs` en el backend:**
   - *Alternativa descartada:* Importar `settings.ts` directamente desde componentes cliente de React.
   - *Justificación:* Turbopack y Webpack en Next.js fallan al intentar empaquetar módulos nativos de Node (`fs`, `path`) en el bundle del navegador. Al usar una ruta API `/api/settings`, el cliente se mantiene 100% desacoplado.

## Estrategia de tests con `node --test`
- Crear suite `tests/metrics.test.js` con el runner nativo de Node.js.
- Casos de prueba:
  1. Generación de 14 puntos cronológicos exactos para N cuentas.
  2. Preservación de identificadores dinámicos `views_${acc.id}` y `subs_${acc.id}`.
  3. Cálculo correcto de métricas consolidadas sin valores NaN o infinitos.
  4. Agrupación por fecha en zona horaria local.
