# MEMORY.md — CreatorOps Hub
Memoria del proyecto entre sesiones. Máximo ~50 líneas: resume o elimina lo que ya no aporte.

## Estado actual
- v1.2 con SDD: Panel completo de TikTok for Developers (Client Key, Secret, Access Token con prueba de conexión).
- Activación/desactivación de cuentas individuales con switch Toggle sin borrarlas, enfocando el dashboard y las gráficas en los canales activos.
- Logo oficial en alta resolución (`/logo.jpg`) integrado en Header, modal de configuración, pantalla de carga y favicon del navegador.
- 6/6 tests unitarios en verde (`node --test tests/metrics.test.js`) y tipado estricto sin errores.

## Decisiones (y por qué)
- **Separación Client/Server en settings:** Los módulos con Node `fs` residen exclusivamente en `/api/*` y `src/lib/server-data.ts`. `data-provider.ts` en cliente consulta `/api/dashboard` vía HTTP y en `next.config.ts` se añadió fallback de `fs: false` para el cliente, eliminando cualquier error de empaquetado de Turbopack/Webpack.
- **SDD Spec-Anchored:** Las specs viven en `specs/` (`spec.md`, `plan.md`, `tasks.md`) y guían la evolución del código para evitar desincronizaciones entre intención y código.
- **Agentes especializados:** Se estructuró `.opencode/agents/` con `coordinator`, `planner`, `implementer` y `reviewer` para garantizar control y calidad por fases.
- **Tests con node --test nativo:** Pruebas unitarias de cálculo de métricas y fechas sin sobrecargar dependencias de testing.

## Aprendizajes y errores a evitar
- Nunca usar `toISOString()` para agrupar días de analítica local; usar fechas de calendario en zona horaria del usuario.
- En Windows / Turbopack: no importar archivos de servidor que usen `fs` desde componentes `'use client'`.
- Validar siempre el formato JSON en `data/settings.json` para evitar excepciones en arranque.

## Próximos pasos
- [ ] Implementar soporte OAuth2 oficial para TikTok for Developers cuando el usuario reciba sus claves.
- [ ] Integrar alertas matutinas automáticas por email o Telegram al detectar un video viral en las primeras 24h.
