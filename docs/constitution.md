# Constitución — CreatorOps Hub

Principios innegociables. Toda spec, plan y tarea debe cumplirlos.

1. **Configuración sin código para el usuario**: Toda opción o cuenta debe poder gestionarse visualmente desde el dashboard. Prohibido requerir edición manual de código para usar la app.
2. **La spec manda**: Nada se implementa si no está en la spec activa (`specs/NNN-*/`). Si falta una decisión o hay ambigüedad, se para y se pregunta.
3. **Lógica separada de la interfaz**: Las transformaciones de analítica, cálculos de historial y proyecciones son funciones puras independientes del DOM y de React.
4. **Tests como puerta**: La lógica de negocio y cálculos se valida con `node --test` nativo. Prohibido dar por terminada una tarea con tests en rojo o errores de TypeScript.
5. **Los datos de las cuentas son sagrados**: `data/settings.json` y Supabase mantienen compatibilidad hacia atrás. Nunca se pierden las credenciales ni el histórico de métricas.
6. **Idioma**: Código e identificadores técnicos en inglés consistente; interfaz de usuario, textos y documentación en español.
