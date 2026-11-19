---
name: local-dates
description: Úsala siempre que escribas, modifiques o revises código que trabaje con fechas, días, rangos de 14 días o métricas temporales en CreatorOps Hub.
---

# Fechas locales en CreatorOps Hub

Las fechas son una fuente común de bugs en dashboards analíticos debido al desplazamiento de UTC frente a la hora local. Sigue esta guía siempre que toques código con fechas.

## Reglas
- Las fechas en el historial se agrupan en formato "AAAA-MM-DD" o etiquetas legibles ("18 Nov") calculadas con la fecha local del usuario.
- Para agrupar o mostrar fechas, usa `toLocaleDateString('es-MX', ...)` o construye cadenas locales con `getFullYear()`, `getMonth() + 1` y `getDate()`.
- Nunca uses `toISOString()` directo para obtener el día calendario del usuario: desplaza la fecha a UTC y puede mostrar datos del día anterior o siguiente.
- Para restar o sumar días (ej. los últimos 14 días), usa `d.setDate(d.getDate() - i)`, nunca sumas fijas de 86,400,000 milisegundos.
- Mantén la consistencia entre las marcas de tiempo (`timestamp`) y las etiquetas para que las gráficas de Recharts ordenen cronológicamente de izquierda a derecha.

## Checklist de revisión
- [ ] ¿Hay algún `toISOString()` usado como clave de agrupación en hora local?
- [ ] ¿Los 14 días se calculan desde la fecha de hoy hacia atrás con `setDate(getDate() - i)`?
- [ ] ¿Los nombres de las series corresponden a `views_${acc.id}` y `subs_${acc.id}`?
- [ ] ¿El orden del arreglo es ascendente (el día más antiguo a la izquierda, hoy a la derecha)?
