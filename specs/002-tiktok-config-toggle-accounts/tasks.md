# Tareas 002 — Configuración Oficial de TikTok y Activación/Desactivación de Cuentas

- [x] **T1. Tipos de datos para `enabled` y credenciales de TikTok.** RF-1, RF-5
  - Hecho cuando: `src/types/settings.ts` y `src/types/index.ts` incluyen `enabled?: boolean` y campos de TikTok API.

- [x] **T2. Persistencia y sincronización de TikTok y `enabled` en settings.** RF-1, RF-3, RF-5
  - Hecho cuando: `src/lib/settings.ts` lee y guarda `enabled` para cada cuenta y las credenciales de TikTok en `data/settings.json` y `.env.local`.

- [x] **T3. Endpoint de prueba de conexión para TikTok API.** RF-6
  - Hecho cuando: `POST /api/settings/test-connection` con `type: 'tiktok'` valida credenciales y retorna feedback en español.

- [x] **T4. Filtrado de cuentas activas en servidor (`server-data.ts`).** RF-4, RF-7
  - Hecho cuando: El overview y las gráficas solo computan cuentas con `enabled !== false`.

- [x] **T5. Interfaz de activación/desactivación y panel de TikTok en SettingsModal.** RF-2, RF-5, RF-6
  - Hecho cuando: `SettingsModal.tsx` incluye el switch toggle por cuenta y el panel de TikTok for Developers con botón de prueba.

- [x] **T6. Pruebas unitarias con node --test.** RF-4, RF-7
  - Hecho cuando: `tests/metrics.test.js` prueba el comportamiento con cuentas desactivadas y pasa en verde.
