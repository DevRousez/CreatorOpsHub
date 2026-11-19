---
name: sdd
description: Úsala siempre que trabajes con Spec-Driven Development en este proyecto (docs/constitution.md o cualquier archivo dentro de specs/) - redactar, revisar o cambiar specs, planes y tareas, o implementar y validar tareas de una spec.
---

# Spec-Driven Development (SDD)

## Flujo
Constitución → Spec → Clarificación → Plan → Tareas → Implementación → Validación → Cambio.

- Nunca pases a la siguiente fase sin la aprobación explícita del usuario.
- La spec manda: si algo no está en la spec, no se implementa. Si falta una decisión, para y pregunta.
- Un cambio de requisitos se hace primero en la spec, luego en el plan y las tareas, y por último en el código.
- Cada spec vive en su carpeta: `specs/NNN-nombre/` con `spec.md`, `plan.md` y `tasks.md`.
- Al terminar cada fase, actualiza `MEMORY.md`.

## Plantilla de spec (spec.md)
```markdown
# Spec NNN — <Nombre>

Estado: borrador | aprobada | implementada

## Contexto y objetivo
<Qué problema resuelve y por qué merece la pena. Un párrafo.>

## Usuarios / actores
<Quién lo usa.>

## Historias de usuario
- HU-1. Como <rol>, quiero <acción> para <beneficio>.

## Definiciones (solo si hay términos que puedan interpretarse de varias formas)

## Requisitos funcionales (criterios de aceptación en EARS)
- RF-1: CUANDO <evento>, EL SISTEMA <respuesta>.
- RF-2: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- RF-3: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- RF-4: EL SISTEMA <comportamiento permanente>.

## Requisitos no funcionales
<Rendimiento, seguridad, compatibilidad, idioma...>

## Casos límite
<Vacíos, duplicados, datos corruptos, límites de red...>

## Fuera de alcance
<Lo que explícitamente NO se hace en esta iteración.>

## Criterios de finalización
<Ej.: todos los RF con test en verde + verificación en UI.>

## Dudas abiertas
- [NECESITA ACLARACIÓN] <duda>
```

La spec describe el QUÉ y el POR QUÉ. Nada de stack, arquitectura ni nombres de archivos: eso va en el plan.

## Requisitos en EARS (en español)
- RF-x: CUANDO <evento>, EL SISTEMA <respuesta>.
- RF-x: SI <condición no deseada>, ENTONCES EL SISTEMA <respuesta>.
- RF-x: MIENTRAS <estado>, EL SISTEMA <respuesta>.
- RF-x: EL SISTEMA <comportamiento permanente>.

Cada RF debe ser verificable con criterios cuantitativos y medibles.

## Plan (plan.md)
Archivos y responsabilidades · Funciones puras (con fechas o parámetros inyectados) · Algoritmos y lógica · Interfaz y componentes · Decisiones justificadas con alternativas descartadas · Estrategia de tests con `node --test`. Indica qué RF cubre cada parte.

## Tareas (tasks.md)
```markdown
- [ ] **T1. <Descripción>.** RF-1, RF-2
  - Hecho cuando: <comprobación verificable>.
```
Máximo 20-30 min por tarea, en orden estricto de dependencia. Si salen más de 10 tareas, propón dividir la spec.

## Implementación
Una sola tarea cada vez: tests primero (en rojo), después el código, `node --test` en verde, marcar la tarea y parar.
