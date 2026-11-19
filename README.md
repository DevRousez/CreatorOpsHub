# CreatorOps Hub 🚀 (Analytics Dashboard Multicuenta)

Un dashboard analítico unificado para creadores de contenido que gestionan múltiples canales de **YouTube** y cuentas de **TikTok** en un solo lugar. 

Diseñado para eliminar la fricción de tener que iniciar sesión en cada plataforma y cuenta por separado cada mañana al encender tu PC.

---

## ⚡ Características Principales

- **Configuración 100% Visual desde el Dashboard (Sin tocar código):**
  - Cualquier persona sin conocimientos de programación puede agregar, editar o eliminar canales de YouTube y cuentas de TikTok.
  - Interfaz gráfica para ingresar claves API de YouTube y credenciales de Supabase con prueba de conexión en vivo.
  - Herramienta de detección automática de canales: ingresas tu handle (`@Canal`) o Channel ID y el sistema autocompleta nombre, logo y estadísticas.
- **Rendimiento Histórico Comparativo (Últimos 14 días) Dinámico & Real:**
  - Gráfica comparativa que mapea de forma dinámica las cuentas configuradas con sus nombres reales, colores personalizados e historial real de Supabase / APIs.
  - Alterna entre vistas de Reproducciones acumuladas y Nuevos Seguidores diarios.
- **Morning Snapshot (Resumen Matutino):**
  - Resumen automático de rendimiento en 24h al encender tu PC (+seguidores ganados, reproducciones y video más viral).
- **Métricas Consolidadas:**
  - Audiencia combinada (suscriptores + seguidores), vistas diarias, tasa de engagement y radar de crecimiento.
- **Radar de Contenido Reciente:**
  - Feed unificado de los últimos videos publicados con métricas de tracción (vistas, likes, comentarios, shares) e indicadores de desempeño (`VIRAL 🔥`, `SOBRE PROMEDIO 🚀`).
- **Modo Demo & Modo Real con 1 Clic:**
  - Permite probar la aplicación con datos de prueba o cambiar a modo real conectado a Supabase y YouTube APIs con un solo interruptor.

---

## 🛠️ Cómo Ejecutar en Tu PC

1. Abre tu terminal en la carpeta del proyecto:
   ```bash
   cd "C:\Users\carlo\Documents\desarrollo\dashboart-analicts"
   ```

2. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

3. Abre tu navegador en:
   👉 **http://localhost:3000**

---

## ⚙️ Configuración desde la Interfaz Gráfica

No necesitas abrir archivos de código ni `.env.local` si no lo deseas:

1. Haz clic en el botón superior **"⚙️ Configuración"**.
2. **Pestaña 1 (Canales y Cuentas):**
   - Agrega tus canales de YouTube (puedes detectarlos automáticamente con el botón "Detectar").
   - Agrega tus cuentas de TikTok con sus nombres y colores representativos.
3. **Pestaña 2 (Claves API):**
   - Ingresa tu `YouTube API Key` y dale a "Probar Clave" para verificar que funcione.
   - Ingresa tu `Project URL` y `Anon Key` de Supabase y dale a "Probar Conexión".
4. **Pestaña 3 (Modo y Sincronización):**
   - Selecciona **Modo Real** y haz clic en **"Guardar y Sincronizar Ahora"**.
   - ¡Tu dashboard quedará actualizado con tus cuentas y métricas reales al instante!

---

## ☁️ Despliegue en Vercel

Como está construido sobre **Next.js 16 (App Router)**:
1. Sube este repositorio a tu GitHub personal.
2. Entra a [vercel.com](https://vercel.com) e importa el repositorio con 1 clic.
3. Agrega tus variables de entorno o deja que el sistema use la configuración guardada.
4. ¡Listo! Tendrás tu dashboard disponible 24/7 en tu PC y celular.
