# 🌿 CRAFTLOOP

**Plataforma social ecológica centrada en manualidades DIY con materiales reciclados.**

Estética: Pinterest + TikTok + Duolingo. Diseño limpio, amigable y orientado a comunidad.

---

## 🎨 Pantallas principales

| Pantalla | Descripción |
|---|---|
| **/** | Feed masonry de manualidades con filtros por categoría y dificultad |
| **/materials** | Biblioteca de materiales reciclables — selecciona lo que tienes |
| **/craft/[id]** | Tutorial paso a paso con checklist de materiales y barra de progreso |
| **/community** | Feed vertical de posts con stories, likes y trending topics |
| **/recycle** | Buscador de reciclaje: "¿Dónde tiro esto?" + 5 contenedores visuales |
| **/quiz** | 10 preguntas sobre reciclaje con feedback inmediato y badges |
| **/profile/[id]** | Perfil con nivel ecológico, puntos, badges y grid de creaciones |
| **/notifications** | Centro de notificaciones con badges de no leídas |
| **/create** | Formulario multi-paso para subir una manualidad |
| **/assistant** | Chat con Loopi, el asistente IA powered by Claude |

---

## 🚀 Instalación

```bash
git clone https://github.com/tuusuario/craftloop
cd craftloop
npm install
```

### Configurar variables de entorno

Crea `.env.local`:

```env
ANTHROPIC_API_KEY=sk-ant-TUKEY
NEXTAUTH_SECRET=una-clave-secreta-aleatoria
NEXTAUTH_URL=http://localhost:3000
DATABASE_URL=./craftloop.db
```

### Inicializar base de datos y seed

```bash
npm run db:push   # Crear tablas SQLite
npm run db:seed   # Insertar datos de ejemplo
npm run dev       # Iniciar en http://localhost:3000
```

---

## 🔑 Variables de entorno

| Variable | Descripción | Obligatoria |
|---|---|---|
| `ANTHROPIC_API_KEY` | Clave API de Anthropic para el asistente Loopi | ✅ para /assistant |
| `NEXTAUTH_SECRET` | Clave secreta para JWT de NextAuth | ✅ |
| `NEXTAUTH_URL` | URL base de la app | ✅ |
| `DATABASE_URL` | Ruta al archivo SQLite | Opcional (default: `./craftloop.db`) |

---

## 📁 Estructura de carpetas

```
app/
  (auth)/login/        ← Pantalla de login
  (main)/              ← Layout con sidebar + header compartido
    page.tsx           ← Home / Explorar (feed masonry)
    materials/         ← Biblioteca de materiales
    craft/[id]/        ← Tutorial paso a paso
    community/         ← Feed comunidad
    recycle/           ← Educación reciclaje
    quiz/              ← Quiz y juegos
    profile/[id]/      ← Perfil de usuario
    notifications/     ← Notificaciones
    create/            ← Subir manualidad
    assistant/         ← Asistente IA Loopi
  api/                 ← API Routes (Next.js)

components/
  craft/               ← CraftCard, MaterialBadge
  gamification/        ← GamificationToast
  layout/              ← Sidebar, Header, BottomNav
  ui/                  ← LoadingSpinner, EmptyState

lib/
  db.ts                ← Drizzle ORM + SQLite
  auth.ts              ← NextAuth configuration
  ai.ts                ← Anthropic API wrapper
  utils.ts             ← Helpers (getLevel, timeAgo, cn)

db/
  schema.ts            ← Tablas: users, crafts, materials, posts, quiz...
  seed.ts              ← 20 manualidades, 15 posts, 20 quiz, 30 reciclaje
```

---

## 🛠️ Stack técnico

- **Framework**: Next.js 14 (App Router) + TypeScript
- **Estilos**: Tailwind CSS
- **Base de datos**: SQLite + Drizzle ORM (prototipo local)
- **Auth**: NextAuth.js (credentials)
- **IA**: Anthropic SDK (claude-sonnet-4-20250514) — streaming
- **Animaciones**: Framer Motion
- **Iconos**: Lucide React

---

## 🎮 Sistema de gamificación

### Puntos por acción
| Acción | Puntos |
|---|---|
| Publicar una manualidad | +10 |
| Recibir un like | +2 |
| Completar un quiz | +20 |
| Primer seguidor | +15 |

### Niveles ecológicos
| Nivel | Nombre | Puntos |
|---|---|---|
| 1 | 🌱 Semilla | 0–99 |
| 2 | 🌿 Brote | 100–299 |
| 3 | 🪴 Planta | 300–599 |
| 4 | 🌳 Árbol | 600–999 |
| 5 | 🌲 Bosque | 1000+ |

---

## 🗺️ Roadmap v1 (futuro)

- [ ] **Subida real de imágenes/vídeos** — integrar Cloudinary o Vercel Blob
- [ ] **Supabase** — migrar de SQLite a Supabase (PostgreSQL + Auth + Storage)
- [ ] **App móvil** — Expo (React Native) reutilizando la lógica de negocio
- [ ] **Login con Google** — OAuth via NextAuth
- [ ] **Comentarios en tiempo real** — WebSockets o Server-Sent Events
- [ ] **Búsqueda semántica** — embeddings para encontrar manualidades similares
- [ ] **Modo offline** — PWA con Service Worker

---

*CRAFTLOOP v0 · Hecho con ♻️ y 💚*
