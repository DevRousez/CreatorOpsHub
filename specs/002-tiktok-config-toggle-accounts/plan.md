# Plan 002 — Configuración Oficial de TikTok y Activación/Desactivación de Cuentas

## Archivos y responsabilidades
- `src/types/settings.ts`: Extender `ConfigAccount` con `enabled?: boolean` y `AppSettings.tiktok` con `clientKey?: string`, `clientSecret?: string`, `accessToken?: string`. (RF-1, RF-5)
- `src/types/index.ts`: Añadir `enabled?: boolean` a la interfaz `Account`. (RF-1, RF-4)
- `src/lib/settings.ts`: Lectura, serialización y compatibilidad con `enabled` y credenciales de TikTok. (RF-1, RF-3, RF-5)
- `src/lib/server-data.ts`: Filtrar cuentas activas (`a.enabled !== false`) antes de calcular overview, gráficas y feed. (RF-4, RF-7)
- `src/app/api/settings/test-connection/route.ts`: Manejar `type: 'tiktok'` con verificación de credenciales oficiales o formato de tokens. (RF-6)
- `src/components/SettingsModal.tsx`:
  - En pestaña 1: Añadir switch Toggle (Activar/Pausar) con estado visual por cada cuenta. (RF-2)
  - En pestaña 2: Añadir panel de TikTok for Developers con inputs para `Client Key`, `Client Secret`, `Access Token` y botón de prueba. (RF-5, RF-6)
- `src/components/AccountCards.tsx`: Reflejar badge o estado en caso de mostrarse cuentas pausadas o solo cuentas activas. (RF-4)
- `tests/metrics.test.js`: Suite de pruebas para funciones puras con cuentas activadas y desactivadas.

## Funciones puras
- `filterActiveAccounts(accounts)`: Filtra un arreglo de cuentas retornando solo aquellas con `enabled !== false`.
- `calculateOverview(accounts)`: Procesa únicamente cuentas activas.
- `generateDynamicHistory(accounts)`: Genera series de 14 días únicamente para cuentas activas.

## Decisiones técnicas justificadas
1. **Propiedad `enabled?: boolean` con valor implícito `true`:**
   - *Alternativa descartada:* Eliminar cuentas no deseadas del JSON y requerir volver a escribirlas para reactivarlas.
   - *Justificación:* Almacenar `enabled: false` preserva IDs, nombres, avatars, colores y estadísticas pasadas sin destruirlas.
2. **Prueba de conexión TikTok:**
   - Si se ingresa un `accessToken`, prueba contra `https://open.tiktokapis.com/v2/user/info/`. Si solo se ingresan `clientKey` y `clientSecret`, prueba la solicitud de client credentials o valida longitud y formato de credenciales oficiales.
