# Tareas 001 — Configuración Visual y Rendimiento Histórico Real (14 Días)

- [x] **T1. Tipos de datos y configuración centralizada.** RF-1, RF-4
  - Hecho cuando: `src/types/settings.ts` define `ConfigAccount`, `AppSettings` y `DEFAULT_ACCOUNTS` con tipado estricto.

- [x] **T2. Persistencia en servidor y sincronización con .env.local.** RF-4
  - Hecho cuando: `src/lib/settings.ts` lee y escribe `data/settings.json` y mantiene sincronizado `.env.local` sin corromper el formato.

- [x] **T3. Endpoints REST de configuración y pruebas de conexión.** RF-2, RF-3, RF-4
  - Hecho cuando: `GET /api/settings`, `POST /api/settings` y `POST /api/settings/test-connection` responden con códigos 200 y validan credenciales de Supabase y YouTube API.

- [x] **T4. Servicio de datos de servidor y agregación de métricas de 14 días.** RF-5, RF-6
  - Hecho cuando: `src/lib/server-data.ts` consulta `daily_metrics` de Supabase o genera los 14 puntos dinámicos con claves reales `views_${acc.id}` y `subs_${acc.id}`.

- [x] **T5. Componente de visualización gráfica dinámica.** RF-5, RF-6, RF-7
  - Hecho cuando: `src/components/AnalyticsCharts.tsx` itera sobre `accounts`, genera gradientes SVG con los colores de cada cuenta y responde al filtro de cuenta seleccionada.

- [x] **T6. Panel visual de configuración (SettingsModal).** RF-1, RF-2, RF-3, RF-4
  - Hecho cuando: `src/components/SettingsModal.tsx` permite añadir/editar/eliminar canales, autodetectar canales de YouTube y probar conexiones de Supabase directamente desde la UI.

- [x] **T7. Suite de pruebas unitarias puras con node --test.** RF-5, RF-6
  - Hecho cuando: `node --test tests/*.test.js` ejecuta y pasa todos los tests en verde sin librerías externas.
