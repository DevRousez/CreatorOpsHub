<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — CreatorOps Hub
Dashboard analítico unificado para creadores multicuenta (YouTube & TikTok).
Permite monitorear rendimiento, historial de 14 días y configurar cuentas desde la interfaz sin programar.

## Stack y estructura
- Next.js 16 (App Router), React 19, Tailwind CSS v4, Recharts, Supabase JS.
- `src/app/`: Rutas, páginas y endpoints API (`/api/settings`, `/api/dashboard`, `/api/sync`).
- `src/components/`: Componentes modulares (`AnalyticsCharts`, `SettingsModal`, `AccountCards`, etc.).
- `src/lib/`: Lógica de datos, conectores y configuración (`settings.ts`, `server-data.ts`, `supabase.ts`).
- `data/settings.json`: Persistencia de configuración visual del dashboard.
- `specs/`: Especificaciones SDD (`specs/NNN-nombre/` con `spec.md`, `plan.md`, `tasks.md`).
- `docs/constitution.md`: Principios innegociables del proyecto.
- `tests/`: Pruebas de lógica pura con runner nativo `node --test`.

## Comandos
- Dev: `npm run dev` (servidor en http://localhost:3000)
- Tests: `node --test tests/*.test.js`
- Typecheck: `npx tsc --noEmit`
- Sync CLI: `node scripts/sync.js`

## Convenciones
- Interfaz y documentación en español; nombres de código en inglés/camelCase claro.
- Componentes cliente llevan `'use client'`; lógica con acceso a Node `fs` solo en backend (`src/lib/settings.ts`, endpoints).
- No acoplar cálculos temporales ni transformaciones numéricas directamente en el DOM: extraer funciones puras.

## Reglas de dominio / trampas conocidas
- Fechas locales: usar siempre la fecha local del usuario (`es-MX`), nunca `toISOString()` para agrupar por día (desplaza el día por UTC).
- Historial dinámico: mapear siempre `views_${acc.id}` y `subs_${acc.id}` según las cuentas configuradas, nunca nombres ficticios fijos.
- No romper `data/settings.json`: debe mantener compatibilidad hacia atrás si se añaden campos.

## Memoria
- Al empezar, lee `MEMORY.md` para conocer el estado del proyecto y las decisiones tomadas.
- Al terminar una tarea, actualízalo: estado actual, decisiones importantes (con su porqué) y errores a evitar.
- Mantenlo breve (máximo ~50 líneas): resume o elimina lo que ya no aporte.
- No guardes nunca claves o datos sensibles reales en `MEMORY.md`.

## Forma de trabajar (SDD)
- Lee `docs/constitution.md` y la spec activa (`specs/NNN-*/`) antes de tocar código.
- Sigue el flujo SDD: Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación.
- Una sola tarea a la vez: tests primero, código después, verificar y marcar en `tasks.md`.

## Límites
- ✅ Siempre: respetar la constitución, mantener `MEMORY.md` al día, verificar con `node --test` y `npx tsc --noEmit`.
- ⚠️ Pregunta antes: agregar dependencias nuevas, cambiar el esquema de base de datos o la estructura de `data/settings.json`.
- 🚫 Nunca: escribir código sin una spec aprobada previa o dejar tests en rojo.

## Verificación
- Ejecutar `node --test tests/*.test.js` para asegurar que las funciones puras pasen.
- Ejecutar `npx tsc --noEmit` para garantizar tipado estricto.
- Verificar interfaz con Chrome DevTools o navegador en `http://localhost:3000`.
