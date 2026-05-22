import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import * as schema from "./schema";

const sqlite = new Database("./craftloop.db");
const db = drizzle(sqlite, { schema });

// Create tables
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    name TEXT,
    email TEXT UNIQUE,
    email_verified INTEGER,
    image TEXT,
    bio TEXT DEFAULT '',
    points INTEGER DEFAULT 0,
    level INTEGER DEFAULT 1,
    badges TEXT DEFAULT '[]',
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS accounts (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    type TEXT NOT NULL,
    provider TEXT NOT NULL,
    provider_account_id TEXT NOT NULL,
    refresh_token TEXT,
    access_token TEXT,
    expires_at INTEGER,
    token_type TEXT,
    scope TEXT,
    id_token TEXT,
    session_state TEXT
  );

  CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    session_token TEXT NOT NULL UNIQUE,
    user_id TEXT NOT NULL,
    expires INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS verification_tokens (
    identifier TEXT NOT NULL,
    token TEXT NOT NULL UNIQUE,
    expires INTEGER NOT NULL
  );

  CREATE TABLE IF NOT EXISTS materials (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    icon TEXT NOT NULL,
    description TEXT DEFAULT '',
    project_count INTEGER DEFAULT 0,
    color TEXT DEFAULT '#2F5D3A'
  );

  CREATE TABLE IF NOT EXISTS crafts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    description TEXT DEFAULT '',
    image TEXT NOT NULL,
    author_id TEXT,
    category TEXT NOT NULL,
    difficulty TEXT NOT NULL,
    time_minutes INTEGER DEFAULT 30,
    age_group TEXT DEFAULT 'todos',
    materials TEXT DEFAULT '[]',
    steps TEXT DEFAULT '[]',
    likes INTEGER DEFAULT 0,
    saves INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    tags TEXT DEFAULT '[]',
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS craft_likes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    craft_id INTEGER,
    user_id TEXT
  );

  CREATE TABLE IF NOT EXISTS craft_saves (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    craft_id INTEGER,
    user_id TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    author_id TEXT,
    content TEXT NOT NULL,
    images TEXT DEFAULT '[]',
    tags TEXT DEFAULT '[]',
    likes INTEGER DEFAULT 0,
    comments INTEGER DEFAULT 0,
    craft_id INTEGER,
    created_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS follows (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    follower_id TEXT,
    following_id TEXT
  );

  CREATE TABLE IF NOT EXISTS quiz_questions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    question TEXT NOT NULL,
    option_a TEXT NOT NULL,
    option_b TEXT NOT NULL,
    option_c TEXT NOT NULL,
    option_d TEXT NOT NULL,
    correct_option TEXT NOT NULL,
    explanation TEXT DEFAULT '',
    category TEXT DEFAULT 'reciclaje'
  );

  CREATE TABLE IF NOT EXISTS quiz_scores (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    score INTEGER NOT NULL,
    total INTEGER NOT NULL,
    completed_at INTEGER DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS recycle_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    aliases TEXT DEFAULT '[]',
    container TEXT NOT NULL,
    container_color TEXT NOT NULL,
    explanation TEXT DEFAULT '',
    tip TEXT DEFAULT ''
  );

  CREATE TABLE IF NOT EXISTS notifications (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    read INTEGER DEFAULT 0,
    link TEXT,
    created_at INTEGER DEFAULT (unixepoch())
  );
`);

// --- USERS ---
const usersData = [
  { id: "user1", name: "María García", email: "maria@craftloop.app", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=maria", bio: "Apasionada del upcycling y las manualidades con cartón 🌿", points: 850, level: 4, badges: JSON.stringify(["primera-manualidad", "10-likes", "5-seguidores"]) },
  { id: "user2", name: "Carlos López", email: "carlos@craftloop.app", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos", bio: "Ingeniero reconvertido en artesano DIY ♻️", points: 420, level: 3, badges: JSON.stringify(["primera-manualidad"]) },
  { id: "user3", name: "Ana Martínez", email: "ana@craftloop.app", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana", bio: "Profesora de arte, enseño a mis alumnos a reciclar 🎨", points: 1200, level: 5, badges: JSON.stringify(["primera-manualidad", "10-likes", "quiz-maestro", "semana-activa", "5-seguidores"]) },
  { id: "user4", name: "Pedro Sánchez", email: "pedro@craftloop.app", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=pedro", bio: "Fan del jardín y los proyectos sostenibles 🪴", points: 230, level: 2, badges: JSON.stringify(["primera-manualidad"]) },
  { id: "user5", name: "Laura Fernández", email: "laura@craftloop.app", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=laura", bio: "Diseñadora gráfica que ama transformar residuos en arte 🌍", points: 680, level: 4, badges: JSON.stringify(["primera-manualidad", "10-likes"]) },
];

for (const u of usersData) {
  const exists = sqlite.prepare("SELECT id FROM users WHERE id = ?").get(u.id);
  if (!exists) {
    sqlite.prepare(`INSERT INTO users (id, name, email, image, bio, points, level, badges) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`).run(u.id, u.name, u.email, u.image, u.bio, u.points, u.level, u.badges);
  }
}

// --- MATERIALS ---
const materialsData = [
  { name: "Botellas de plástico", icon: "🍶", description: "PET, HDPE y otros plásticos reciclables", project_count: 47, color: "#3B82F6" },
  { name: "Cartón", icon: "📦", description: "Cajas y tubos de cartón", project_count: 63, color: "#F59E0B" },
  { name: "Tarros de vidrio", icon: "🫙", description: "Tarros y botellas de vidrio", project_count: 38, color: "#10B981" },
  { name: "Tela y ropa vieja", icon: "🧵", description: "Retazos de tela y prendas en desuso", project_count: 29, color: "#8B5CF6" },
  { name: "Papel y periódicos", icon: "📰", description: "Papel, revistas y periódicos", project_count: 52, color: "#6B7280" },
  { name: "Tapones", icon: "🔘", description: "Tapones de plástico y corcho", project_count: 21, color: "#EC4899" },
  { name: "Paletas de madera", icon: "🪵", description: "Paletas y madera reciclada", project_count: 34, color: "#92400E" },
  { name: "CDs y DVDs", icon: "💿", description: "Discos ópticos en desuso", project_count: 15, color: "#6366F1" },
  { name: "Latas de metal", icon: "🥫", description: "Latas de conservas y bebidas", project_count: 28, color: "#D97706" },
  { name: "Neumáticos", icon: "🔧", description: "Neumáticos y gomas recicladas", project_count: 12, color: "#374151" },
];

const existingMats = sqlite.prepare("SELECT COUNT(*) as c FROM materials").get() as { c: number };
if (existingMats.c === 0) {
  for (const m of materialsData) {
    sqlite.prepare(`INSERT INTO materials (name, icon, description, project_count, color) VALUES (?, ?, ?, ?, ?)`).run(m.name, m.icon, m.description, m.project_count, m.color);
  }
}

// --- CRAFTS ---
const craftsData = [
  { title: "Maceta con botella de plástico", description: "Transforma una botella PET en una hermosa maceta colgante para tu balcón.", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", author_id: "user1", category: "Jardín", difficulty: "Fácil", time_minutes: 20, age_group: "todos", materials: JSON.stringify(["Botellas de plástico", "Pintura acrílica", "Cordón"]), steps: JSON.stringify([{title:"Cortar la botella", description:"Corta la botella por la mitad con tijeras", image:"https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400"},{title:"Hacer agujeros", description:"Perfora 3 agujeros en la base para el drenaje"},{title:"Pintar", description:"Pinta con colores vivos y deja secar 2h"},{title:"Rellenar y colgar", description:"Añade tierra y tu planta favorita"}]), likes: 124, saves: 87, views: 1203, tags: JSON.stringify(["jardín", "plástico", "macetas", "fácil"]) },
  { title: "Lámpara de tarros de vidrio", description: "Crea una lámpara vintage con tarros de mermelada y luces LED.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", author_id: "user2", category: "Decoración", difficulty: "Medio", time_minutes: 45, age_group: "adultos", materials: JSON.stringify(["Tarros de vidrio", "Luces LED", "Cable eléctrico"]), steps: JSON.stringify([{title:"Preparar los tarros", description:"Limpiar bien los tarros y quitar etiquetas"},{title:"Hacer agujero en la tapa", description:"Con un taladro hacer un agujero central"},{title:"Pasar el cable", description:"Introducir el portalámparas por el agujero"},{title:"Decorar", description:"Puedes pintar con pintura para vidrio"}]), likes: 89, saves: 156, views: 2100, tags: JSON.stringify(["decoración", "vidrio", "luz", "vintage"]) },
  { title: "Bolso de tela reciclada", description: "Dale nueva vida a esa camiseta vieja transformándola en un bolso de tela resistente.", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&q=80", author_id: "user3", category: "Moda", difficulty: "Fácil", time_minutes: 30, age_group: "todos", materials: JSON.stringify(["Tela y ropa vieja", "Aguja e hilo", "Tijeras"]), steps: JSON.stringify([{title:"Cortar la camiseta", description:"Corta las mangas y el cuello de la camiseta"},{title:"Coser la base", description:"Cose el dobladillo inferior para cerrar el bolso"},{title:"Hacer las asas", description:"Usa las mangas cortadas como asas"},{title:"Decorar", description:"Añade parches o bordados para personalizarlo"}]), likes: 203, saves: 178, views: 3400, tags: JSON.stringify(["moda", "tela", "bolso", "camiseta"]) },
  { title: "Organizador de escritorio con cartón", description: "Organiza tu escritorio con este práctico porta-lápices hecho con rollos de cartón.", image: "https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600&q=80", author_id: "user4", category: "Hogar", difficulty: "Fácil", time_minutes: 25, age_group: "niños", materials: JSON.stringify(["Cartón", "Papel de colores", "Pegamento"]), steps: JSON.stringify([{title:"Recolectar tubos", description:"Junta varios tubos de papel higiénico"},{title:"Cortar a medida", description:"Corta los tubos a diferentes alturas"},{title:"Pegar los tubos", description:"Pégalos entre sí formando el organizador"},{title:"Decorar", description:"Forrar con papel o tela de colores"}]), likes: 67, saves: 45, views: 890, tags: JSON.stringify(["hogar", "cartón", "organización", "escritorio"]) },
  { title: "Jardín vertical con botellas PET", description: "Crea un espectacular jardín vertical para interiores usando botellas recicladas.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80", author_id: "user1", category: "Jardín", difficulty: "Medio", time_minutes: 60, age_group: "adultos", materials: JSON.stringify(["Botellas de plástico", "Cuerda", "Tierra"]), steps: JSON.stringify([{title:"Preparar las botellas", description:"Corta la parte superior de 6-8 botellas"},{title:"Hacer agujeros", description:"Perfora la base para drenaje y los lados para colgar"},{title:"Montar el sistema", description:"Conecta las botellas con cuerda formando columnas"},{title:"Plantar", description:"Añade tierra y tus plantas favoritas"}]), likes: 312, saves: 267, views: 5600, tags: JSON.stringify(["jardín", "vertical", "botellas", "plantas"]) },
  { title: "Mosaico con CDs reciclados", description: "Crea arte brillante con esos CDs que ya no usas. Efecto espejo increíble.", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80", author_id: "user5", category: "Arte", difficulty: "Medio", time_minutes: 90, age_group: "todos", materials: JSON.stringify(["CDs y DVDs", "Pegamento especial", "Base de madera"]), steps: JSON.stringify([{title:"Romper los CDs", description:"Con guantes, rompe los CDs en piezas"},{title:"Preparar la base", description:"Dibuja el diseño deseado en la base"},{title:"Pegar los fragmentos", description:"Pega los trozos siguiendo el diseño"},{title:"Grouting", description:"Rellena los huecos con pasta de yeso"}]), likes: 156, saves: 98, views: 2800, tags: JSON.stringify(["arte", "mosaico", "cds", "decoración"]) },
  { title: "Colgador de ropa con paletas", description: "Convierte una paleta de madera en un elegante perchero para el recibidor.", image: "https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600&q=80", author_id: "user2", category: "Hogar", difficulty: "Medio", time_minutes: 120, age_group: "adultos", materials: JSON.stringify(["Paletas de madera", "Ganchos metálicos", "Barniz"]), steps: JSON.stringify([{title:"Lijar la paleta", description:"Lija toda la superficie para evitar astillas"},{title:"Pintar o barnizar", description:"Aplica el color deseado o barniz natural"},{title:"Instalar ganchos", description:"Atornilla los ganchos metálicos en las ranuras"},{title:"Montar en pared", description:"Fija la paleta a la pared con anclajes fuertes"}]), likes: 87, saves: 134, views: 1900, tags: JSON.stringify(["hogar", "paletas", "perchero", "madera"]) },
  { title: "Juguetes con tapones de colores", description: "Crea animales y figuras divertidas para los más pequeños con tapones reciclados.", image: "https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=600&q=80", author_id: "user3", category: "Juguetes", difficulty: "Fácil", time_minutes: 30, age_group: "niños", materials: JSON.stringify(["Tapones", "Pinturas", "Pegamento"]), steps: JSON.stringify([{title:"Clasificar tapones", description:"Agrupa por colores y tamaños"},{title:"Diseñar el animal", description:"Dibuja en papel cómo conectar los tapones"},{title:"Pegar y unir", description:"Une los tapones con cola caliente"},{title:"Pintar detalles", description:"Añade ojos, boca y otros detalles con pintura"}]), likes: 234, saves: 189, views: 4200, tags: JSON.stringify(["juguetes", "tapones", "niños", "animales"]) },
  { title: "Porta-plantas de latas decoradas", description: "Las latas de conservas se convierten en macetas artísticas con un poco de pintura.", image: "https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600&q=80", author_id: "user4", category: "Jardín", difficulty: "Fácil", time_minutes: 20, age_group: "todos", materials: JSON.stringify(["Latas de metal", "Pintura spray", "Plantas pequeñas"]), steps: JSON.stringify([{title:"Limpiar las latas", description:"Quita etiquetas y lava bien las latas"},{title:"Hacer agujeros", description:"Perfora la base con un clavo para drenaje"},{title:"Pintar", description:"Aplica pintura spray en colores vivos"},{title:"Plantar", description:"Añade sustrato y tus suculentas favoritas"}]), likes: 145, saves: 112, views: 2300, tags: JSON.stringify(["jardín", "latas", "suculentas", "pintura"]) },
  { title: "Cuadro de papel periódico trenzado", description: "El papel periódico enrollado crea texturas y formas increíbles en este cuadro decorativo.", image: "https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=600&q=80", author_id: "user5", category: "Arte", difficulty: "Difícil", time_minutes: 180, age_group: "adultos", materials: JSON.stringify(["Papel y periódicos", "Pegamento", "Pintura"]), steps: JSON.stringify([{title:"Enrollar el papel", description:"Enrolla tiras de periódico formando cilindros finos"},{title:"Crear la trama", description:"Entrelaza los cilindros creando un patrón"},{title:"Fijar la estructura", description:"Pega los bordes y deja secar 24h"},{title:"Pintar y barnizar", description:"Pinta en tonos naturales y aplica barniz protector"}]), likes: 78, saves: 56, views: 1450, tags: JSON.stringify(["arte", "papel", "periódico", "cuadro"]) },
  { title: "Estantería con tubos de PVC", description: "Crea una moderna estantería flotante con tubos de PVC reciclados.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", author_id: "user1", category: "Hogar", difficulty: "Difícil", time_minutes: 150, age_group: "adultos", materials: JSON.stringify(["Botellas de plástico", "Pintura acrílica"]), steps: JSON.stringify([{title:"Cortar los tubos", description:"Corta los tubos a la longitud deseada"},{title:"Lijar los cortes", description:"Lija bien para eliminar bordes afilados"},{title:"Pintar", description:"Aplica pintura en colores a elegir"},{title:"Montar", description:"Conecta con codos y fija a la pared"}]), likes: 56, saves: 78, views: 1100, tags: JSON.stringify(["hogar", "estantería", "moderno"]) },
  { title: "Peluche de calcetines", description: "Transforma calcetines sin pareja en adorables peluches para regalar.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", author_id: "user2", category: "Juguetes", difficulty: "Fácil", time_minutes: 40, age_group: "niños", materials: JSON.stringify(["Tela y ropa vieja", "Relleno", "Botones"]), steps: JSON.stringify([{title:"Seleccionar calcetines", description:"Elige calcetines limpios sin agujeros"},{title:"Diseñar el animal", description:"Decide qué animal quieres crear"},{title:"Coser y rellenar", description:"Cose y rellena con trozos de tela viejos"},{title:"Añadir detalles", description:"Cose botones para los ojos y bordados para la boca"}]), likes: 189, saves: 145, views: 3100, tags: JSON.stringify(["juguetes", "calcetines", "peluche", "costura"]) },
  { title: "Portavelas con botellas de vino", description: "Las botellas de vino cortadas son el portavelas más elegante y sostenible.", image: "https://images.unsplash.com/photo-1544233726-9f1d2b27be8b?w=600&q=80", author_id: "user3", category: "Decoración", difficulty: "Difícil", time_minutes: 90, age_group: "adultos", materials: JSON.stringify(["Tarros de vidrio", "Cuerda"]), steps: JSON.stringify([{title:"Cortar la botella", description:"Usa hilo mojado y fuego para cortar el vidrio"},{title:"Lijar el borde", description:"Lija cuidadosamente el borde cortado"},{title:"Decorar", description:"Envuelve con cordel o pinta con colores"},{title:"Añadir la vela", description:"Coloca una vela de té en el interior"}]), likes: 112, saves: 89, views: 1800, tags: JSON.stringify(["decoración", "velas", "vidrio", "romántico"]) },
  { title: "Mini invernadero con botellas PET", description: "Crea un mini invernadero para germinar semillas con botellas de plástico.", image: "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600&q=80", author_id: "user4", category: "Jardín", difficulty: "Fácil", time_minutes: 15, age_group: "todos", materials: JSON.stringify(["Botellas de plástico", "Tierra", "Semillas"]), steps: JSON.stringify([{title:"Cortar la botella", description:"Corta la botella dejando conectada la tapa"},{title:"Hacer agujeros", description:"Perfora la base inferior para drenaje"},{title:"Añadir tierra y semillas", description:"Llena con sustrato y planta las semillas"},{title:"Cerrar y ubicar", description:"Cierra la botella para crear efecto invernadero"}]), likes: 276, saves: 223, views: 4800, tags: JSON.stringify(["jardín", "semillas", "invernadero", "sostenible"]) },
  { title: "Móvil decorativo de CD", description: "Crea un espectacular móvil colgante con CDs que refleja la luz del sol.", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80", author_id: "user5", category: "Decoración", difficulty: "Fácil", time_minutes: 30, age_group: "todos", materials: JSON.stringify(["CDs y DVDs", "Cuerda", "Pintura"]), steps: JSON.stringify([{title:"Preparar los CDs", description:"Limpia los CDs y crea agujeros para colgarlos"},{title:"Pintar algunos", description:"Pinta la mitad con colores translúcidos"},{title:"Ensartar", description:"Une los CDs con hilo transparente a diferentes alturas"},{title:"Colgar", description:"Cuelga del techo o ventana donde llegue la luz"}]), likes: 167, saves: 134, views: 2900, tags: JSON.stringify(["decoración", "cds", "luz", "móvil"]) },
  { title: "Cesta de papel de periódico", description: "Teje una resistente cesta de almacenamiento con tiras de periódico enrolladas.", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", author_id: "user1", category: "Hogar", difficulty: "Medio", time_minutes: 120, age_group: "adultos", materials: JSON.stringify(["Papel y periódicos", "Pegamento", "Barniz"]), steps: JSON.stringify([{title:"Preparar las tiras", description:"Enrolla periódicos en cilindros de 3-4mm de diámetro"},{title:"Crear la base", description:"Teje los cilindros formando una base cuadrada"},{title:"Subir los lados", description:"Dobla las tiras hacia arriba y continúa tejiendo"},{title:"Acabar y barnizar", description:"Cierra los bordes y aplica barniz protector"}]), likes: 134, saves: 167, views: 2700, tags: JSON.stringify(["hogar", "cesta", "periódico", "tejido"]) },
  { title: "Lámpara de botella de vidrio", description: "Convierte una bonita botella de vidrio en una lámpara de mesa artesanal.", image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80", author_id: "user2", category: "Decoración", difficulty: "Medio", time_minutes: 60, age_group: "adultos", materials: JSON.stringify(["Tarros de vidrio", "Cable eléctrico", "Bombilla LED"]), steps: JSON.stringify([{title:"Preparar la botella", description:"Limpiar y quitar etiquetas de la botella"},{title:"Taladrar la base", description:"Con broca especial para vidrio, hacer agujero"},{title:"Instalar el cable", description:"Pasar el cable por dentro con cuidado"},{title:"Conectar y probar", description:"Instalar portalámparas y bombilla LED"}]), likes: 98, saves: 123, views: 2100, tags: JSON.stringify(["decoración", "lámpara", "vidrio", "botella"]) },
  { title: "Reloj de cartón reciclado", description: "Diseña un reloj de pared único con cartón grueso y maquinaria de reloj económica.", image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600&q=80", author_id: "user3", category: "Decoración", difficulty: "Medio", time_minutes: 90, age_group: "adultos", materials: JSON.stringify(["Cartón", "Maquinaria de reloj", "Pintura"]), steps: JSON.stringify([{title:"Cortar el cartón", description:"Corta círculos de cartón de doble grosor"},{title:"Diseñar la esfera", description:"Diseña el estilo del reloj y marca las horas"},{title:"Taladrar el centro", description:"Haz un agujero para la maquinaria"},{title:"Instalar y decorar", description:"Monta la maquinaria y decora al gusto"}]), likes: 45, saves: 67, views: 890, tags: JSON.stringify(["decoración", "reloj", "cartón"]) },
  { title: "Tapete de tapones de corcho", description: "Los tapones de botellas de vino crean un tapete antihumedad perfecto para el baño.", image: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&q=80", author_id: "user4", category: "Hogar", difficulty: "Fácil", time_minutes: 45, age_group: "todos", materials: JSON.stringify(["Tapones", "Pegamento fuerte", "Base antideslizante"]), steps: JSON.stringify([{title:"Recolectar tapones", description:"Necesitarás unos 200 tapones de corcho"},{title:"Preparar la base", description:"Corta la base antideslizante del tamaño deseado"},{title:"Pegar los tapones", description:"Pega los tapones en filas o en patrón decorativo"},{title:"Dejar secar", description:"Presiona bien y deja secar 24 horas"}]), likes: 178, saves: 145, views: 3200, tags: JSON.stringify(["hogar", "baño", "corcho", "tapetes"]) },
  { title: "Arte con latas de aluminio", description: "Recorta y moldea latas de aluminio para crear esculturas metálicas brillantes.", image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600&q=80", author_id: "user5", category: "Arte", difficulty: "Medio", time_minutes: 75, age_group: "adultos", materials: JSON.stringify(["Latas de metal", "Tijeras de metal", "Pintura"]), steps: JSON.stringify([{title:"Abrir las latas", description:"Con cuidado, abre las latas por los extremos"},{title:"Cortar formas", description:"Recorta las formas deseadas con tijeras especiales"},{title:"Moldear", description:"Da forma con los dedos y herramientas suaves"},{title:"Ensamblar y pintar", description:"Une las piezas y aplica pintura metálica"}]), likes: 89, saves: 78, views: 1600, tags: JSON.stringify(["arte", "metal", "latas", "escultura"]) },
];

const existingCrafts = sqlite.prepare("SELECT COUNT(*) as c FROM crafts").get() as { c: number };
if (existingCrafts.c === 0) {
  for (const c of craftsData) {
    sqlite.prepare(`INSERT INTO crafts (title, description, image, author_id, category, difficulty, time_minutes, age_group, materials, steps, likes, saves, views, tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`).run(c.title, c.description, c.image, c.author_id, c.category, c.difficulty, c.time_minutes, c.age_group, c.materials, c.steps, c.likes, c.saves, c.views, c.tags);
  }
}

// --- POSTS ---
const postsData = [
  { author_id: "user1", content: "¡Acabo de terminar mi jardín vertical con 20 botellas PET! Lleva mis hierbas aromáticas perfectamente 🌿🍃 ¿Quién se anima?", images: JSON.stringify(["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600"]), tags: JSON.stringify(["jardínvertical", "reciclar", "hierbas"]), likes: 89, comments: 23 },
  { author_id: "user2", content: "Antes: una caja de cartón vieja. Después: el organizador perfecto para mi escritorio ♻️ Tutorial en el link de bio", images: JSON.stringify(["https://images.unsplash.com/photo-1456324504439-367cee3b3c32?w=600"]), tags: JSON.stringify(["cartón", "organizador", "oficina"]), likes: 156, comments: 45 },
  { author_id: "user3", content: "Mis alumnos de 3ro han hecho estos increíbles animales con tapones de colores 🐸🐢 ¡Estoy tan orgullosa de ellos!", images: JSON.stringify(["https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=600"]), tags: JSON.stringify(["educación", "tapones", "niños", "escuela"]), likes: 234, comments: 67 },
  { author_id: "user4", content: "El mejor proyecto de fin de semana: transformé 6 latas viejas en un centro de mesa increíble 🥫🌸", images: JSON.stringify(["https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600"]), tags: JSON.stringify(["latas", "decoración", "centromesa"]), likes: 78, comments: 19 },
  { author_id: "user5", content: "Mosaico terminado después de 2 semanas de trabajo con CDs reciclados ✨ El efecto de la luz es mágico", images: JSON.stringify(["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600"]), tags: JSON.stringify(["mosaico", "cds", "arte", "luz"]), likes: 312, comments: 89 },
  { author_id: "user1", content: "Mini invernadero casero para mis semillas de tomate 🍅 Temperatura perfecta con solo una botella PET cortada", images: JSON.stringify(["https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?w=600"]), tags: JSON.stringify(["semillas", "invernadero", "tomates", "huerto"]), likes: 145, comments: 34 },
  { author_id: "user2", content: "Lámpara de tarros de mermelada lista 💡 Costó 0€ en materiales y quedó mejor que las de las tiendas", images: JSON.stringify(["https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600"]), tags: JSON.stringify(["lámpara", "tarros", "cero-residuos"]), likes: 267, comments: 78 },
  { author_id: "user3", content: "¿Sabíais que los periódicos se pueden convertir en resistentes cestas? Llevo 3 meses usando esta y sigue perfecta 📰", images: JSON.stringify(["https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=600"]), tags: JSON.stringify(["periódico", "cesta", "tejido", "diy"]), likes: 189, comments: 56 },
  { author_id: "user4", content: "El tapete de tapones de corcho del baño es simplemente perfecto 🍾 Antihumedad y muy original", images: JSON.stringify(["https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600"]), tags: JSON.stringify(["corcho", "baño", "tapete"]), likes: 134, comments: 28 },
  { author_id: "user5", content: "Bolso terminado con mi camisa de cuadros que ya no usaba 👜 Zero waste fashion está de moda", images: JSON.stringify(["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600"]), tags: JSON.stringify(["moda", "upcycling", "bolso", "costura"]), likes: 223, comments: 61 },
  { author_id: "user1", content: "Reto del mes de abril: solo usar materiales reciclados para decorar 🏠 Ya llevo 5 proyectos y me encanta el resultado", images: JSON.stringify(["https://images.unsplash.com/photo-1464820453369-31d2c0b651af?w=600"]), tags: JSON.stringify(["reto", "decoración", "reciclaje", "abril"]), likes: 456, comments: 123 },
  { author_id: "user2", content: "Perchero nuevo con paleta de madera rescatada de la calle 🪵 Lijado, pintado y listo en un tarde", images: JSON.stringify(["https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=600"]), tags: JSON.stringify(["paleta", "perchero", "madera", "upcycling"]), likes: 167, comments: 45 },
  { author_id: "user3", content: "Workshop de manualidades ecológicas este sábado ♻️🎨 ¿Quién se apunta? Comentad abajo", images: JSON.stringify(["https://images.unsplash.com/photo-1566140967404-b8b3932483f5?w=600"]), tags: JSON.stringify(["workshop", "taller", "comunidad"]), likes: 389, comments: 145 },
  { author_id: "user4", content: "Cada lata que reciclo para plantas es una lata menos en el vertedero 🌍 Ya voy por 50!", images: JSON.stringify(["https://images.unsplash.com/photo-1501004318641-b39e6451bec6?w=600"]), tags: JSON.stringify(["impacto", "medioambiente", "50proyectos"]), likes: 234, comments: 67 },
  { author_id: "user5", content: "Cuando el arte y la sostenibilidad se encuentran ✨ Nueva serie de esculturas con latas de aluminio", images: JSON.stringify(["https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=600"]), tags: JSON.stringify(["arte", "escultura", "aluminio", "sostenible"]), likes: 178, comments: 52 },
];

const existingPosts = sqlite.prepare("SELECT COUNT(*) as c FROM posts").get() as { c: number };
if (existingPosts.c === 0) {
  for (const p of postsData) {
    sqlite.prepare(`INSERT INTO posts (author_id, content, images, tags, likes, comments) VALUES (?, ?, ?, ?, ?, ?)`).run(p.author_id, p.content, p.images, p.tags, p.likes, p.comments);
  }
}

// --- QUIZ QUESTIONS ---
const quizData = [
  { question: "¿En qué contenedor va la cáscara de naranja?", option_a: "Amarillo", option_b: "Verde", option_c: "Marrón", option_d: "Azul", correct_option: "C", explanation: "Los residuos orgánicos como cáscaras de frutas van al contenedor marrón para compostaje." },
  { question: "¿Dónde debes depositar una botella de vidrio vacía?", option_a: "Amarillo", option_b: "Verde (iglú)", option_c: "Azul", option_d: "Gris", correct_option: "B", explanation: "El vidrio tiene su propio contenedor verde (iglú) para poder reciclarse correctamente." },
  { question: "¿Qué contenedor es el correcto para el papel y cartón?", option_a: "Amarillo", option_b: "Verde", option_c: "Azul", option_d: "Gris", correct_option: "C", explanation: "El papel y cartón van al contenedor azul para reciclarse como materia prima." },
  { question: "¿En qué contenedor van las latas de conserva?", option_a: "Azul", option_b: "Amarillo", option_c: "Verde", option_d: "Gris", correct_option: "B", explanation: "Las latas y envases metálicos van al contenedor amarillo junto con los plásticos." },
  { question: "¿Dónde van los restos de comida?", option_a: "Gris", option_b: "Verde", option_c: "Marrón", option_d: "Amarillo", correct_option: "C", explanation: "Los restos orgánicos van al contenedor marrón para producir compost y biogás." },
  { question: "¿Cuántos años tarda en descomponerse una bolsa de plástico?", option_a: "10 años", option_b: "100 años", option_c: "500 años", option_d: "1000 años", correct_option: "C", explanation: "Una bolsa de plástico puede tardar entre 100 y 1000 años en descomponerse, con una media de ~500 años." },
  { question: "¿Qué porcentaje del vidrio reciclado se puede volver a usar?", option_a: "25%", option_b: "50%", option_c: "75%", option_d: "100%", correct_option: "D", explanation: "El vidrio puede reciclarse al 100% sin perder calidad, siendo uno de los materiales más reciclables." },
  { question: "¿En qué contenedor van los medicamentos caducados?", option_a: "Gris", option_b: "Amarillo", option_c: "Punto SIGRE (farmacia)", option_d: "Verde", correct_option: "C", explanation: "Los medicamentos van a los puntos SIGRE en farmacias, nunca a la basura normal." },
  { question: "¿Qué es el upcycling?", option_a: "Reciclar bajando la calidad del material", option_b: "Transformar residuos en productos de mayor valor", option_c: "Compostar residuos orgánicos", option_d: "Quemar residuos de forma controlada", correct_option: "B", explanation: "El upcycling consiste en reutilizar materiales transformándolos en productos de igual o mayor valor." },
  { question: "¿Cuánta energía ahorra reciclar una lata de aluminio?", option_a: "20%", option_b: "50%", option_c: "75%", option_d: "95%", correct_option: "D", explanation: "Reciclar aluminio ahorra hasta el 95% de la energía necesaria para producirlo desde cero." },
  { question: "¿Dónde van las pilas usadas?", option_a: "Contenedor gris", option_b: "Contenedor amarillo", option_c: "Punto limpio o tienda", option_d: "Contenedor verde", correct_option: "C", explanation: "Las pilas tienen metales pesados contaminantes y deben depositarse en puntos limpios o en las tiendas que las venden." },
  { question: "¿Qué significa la flecha circular de reciclaje (♻️)?", option_a: "El producto es biodegradable", option_b: "El producto puede reciclarse", option_c: "El producto está hecho de material reciclado", option_d: "El producto es ecológico", correct_option: "B", explanation: "El símbolo de ♻️ indica que el material puede reciclarse, aunque no garantiza que se vaya a reciclar." },
  { question: "¿Cuánto tiempo dura en la naturaleza un cigarrillo?", option_a: "1 año", option_b: "5 años", option_c: "10 años", option_d: "25 años", correct_option: "C", explanation: "Los filtros de cigarrillo son de acetato de celulosa y pueden tardar hasta 10-12 años en degradarse." },
  { question: "¿En qué contenedor va el aceite usado de cocina?", option_a: "Por el desagüe", option_b: "Gris (basura normal)", option_c: "Punto limpio o contenedor específico", option_d: "Amarillo", correct_option: "C", explanation: "El aceite nunca debe tirarse por el desagüe ya que contamina el agua. Debe llevarse a puntos limpios." },
  { question: "¿Cuántos árboles salva reciclar 1 tonelada de papel?", option_a: "5 árboles", option_b: "10 árboles", option_c: "17 árboles", option_d: "30 árboles", correct_option: "C", explanation: "Reciclar 1 tonelada de papel salva aproximadamente 17 árboles adultos." },
  { question: "¿Qué residuo contamina más el suelo?", option_a: "Papel", option_b: "Vidrio", option_c: "Plástico", option_d: "Cartón", correct_option: "C", explanation: "El plástico es uno de los mayores contaminantes del suelo ya que no se degrada y puede fragmentarse en microplásticos." },
  { question: "¿En qué contenedor va el cartón de pizza con restos de comida?", option_a: "Azul (papel/cartón)", option_b: "Marrón (orgánico)", option_c: "Gris (resto)", option_d: "Amarillo", correct_option: "C", explanation: "El cartón manchado con grasa no puede reciclarse como papel, va al contenedor gris." },
  { question: "¿Qué porcentaje de los residuos domésticos puede reciclarse?", option_a: "20%", option_b: "40%", option_c: "60%", option_d: "80%", correct_option: "D", explanation: "Se estima que hasta el 80% de los residuos domésticos pueden reciclarse o compostarse." },
  { question: "¿Dónde van los envases de tetrabrik?", option_a: "Azul", option_b: "Verde", option_c: "Amarillo", option_d: "Gris", correct_option: "C", explanation: "Los tetrabriks van al contenedor amarillo de envases, junto con plásticos y latas." },
  { question: "¿Qué es la regla de las 3R?", option_a: "Reciclar, Reusar, Renovar", option_b: "Reducir, Reutilizar, Reciclar", option_c: "Recuperar, Reciclar, Reparar", option_d: "Reducir, Reciclar, Reparar", correct_option: "B", explanation: "Las 3R son Reducir (menos consumo), Reutilizar (más de una vez) y Reciclar (dar nueva vida al material)." },
];

const existingQuiz = sqlite.prepare("SELECT COUNT(*) as c FROM quiz_questions").get() as { c: number };
if (existingQuiz.c === 0) {
  for (const q of quizData) {
    sqlite.prepare(`INSERT INTO quiz_questions (question, option_a, option_b, option_c, option_d, correct_option, explanation) VALUES (?, ?, ?, ?, ?, ?, ?)`).run(q.question, q.option_a, q.option_b, q.option_c, q.option_d, q.correct_option, q.explanation);
  }
}

// --- RECYCLE ITEMS ---
const recycleData = [
  { name: "Botella de plástico", aliases: JSON.stringify(["botella PET", "botella agua", "botella refresco"]), container: "Amarillo (Envases)", container_color: "amarillo", explanation: "Las botellas de plástico PET y HDPE van al contenedor amarillo de envases.", tip: "Aplástala para ocupar menos espacio" },
  { name: "Cartón de pizza", aliases: JSON.stringify(["caja pizza", "cartón sucio"]), container: "Gris (Resto)", container_color: "gris", explanation: "El cartón manchado con grasa no puede reciclarse en el contenedor azul.", tip: "Si solo la parte superior está limpia, sepárala y ponla en el azul" },
  { name: "Botella de vidrio", aliases: JSON.stringify(["botella vino", "botella aceite", "frasco vidrio"]), container: "Verde (Vidrio)", container_color: "verde", explanation: "El vidrio tiene su propio contenedor para reciclarse eficientemente.", tip: "No tires tapas metálicas en el iglú del vidrio" },
  { name: "Periódico", aliases: JSON.stringify(["diario", "revista", "papel"]), container: "Azul (Papel/Cartón)", container_color: "azul", explanation: "El papel limpio y el cartón van al contenedor azul.", tip: "Dóblalo para ocupar menos espacio" },
  { name: "Lata de conserva", aliases: JSON.stringify(["lata atún", "lata tomate", "lata aluminio"]), container: "Amarillo (Envases)", container_color: "amarillo", explanation: "Las latas de metal van al contenedor amarillo de envases.", tip: "Enjuágalas antes de tirarlas" },
  { name: "Restos de comida", aliases: JSON.stringify(["sobras", "cáscaras", "fruta podrida"]), container: "Marrón (Orgánico)", container_color: "marron", explanation: "Los residuos orgánicos van al contenedor marrón para hacer compost.", tip: "No metas plásticos ni papel junto a los orgánicos" },
  { name: "Bolsa de plástico", aliases: JSON.stringify(["bolsa supermercado", "bolsa basura"]), container: "Amarillo (Envases)", container_color: "amarillo", explanation: "Las bolsas de plástico van al contenedor amarillo.", tip: "Reduce el uso de bolsas de plástico usando bolsas reutilizables" },
  { name: "Tapón de corcho", aliases: JSON.stringify(["corcho vino", "tapón botella"]), container: "Gris (Resto)", container_color: "gris", explanation: "El corcho no tiene sistema de reciclaje generalizado. Mejor reutilizarlo.", tip: "¡Úsalo para manualidades! Perfectos para tapetes y tableros" },
  { name: "Medicamentos caducados", aliases: JSON.stringify(["pastillas viejas", "medicinas"]), container: "Punto SIGRE (Farmacia)", container_color: "gris", explanation: "Los medicamentos tienen metales y compuestos que contaminan. Van a farmacias.", tip: "Nunca tires medicamentos por el inodoro" },
  { name: "Pila", aliases: JSON.stringify(["batería", "pila alcalina", "pila botón"]), container: "Punto Limpio / Tienda", container_color: "gris", explanation: "Las pilas contienen metales pesados muy contaminantes.", tip: "Muchas tiendas tienen contenedores específicos para pilas" },
  { name: "Ropa vieja", aliases: JSON.stringify(["ropa usada", "textil"]), container: "Contenedor Textil", container_color: "gris", explanation: "La ropa va en contenedores de recogida textil específicos.", tip: "También puedes donarla si está en buen estado" },
  { name: "Tetrabrik", aliases: JSON.stringify(["cartón de leche", "brik zumo"]), container: "Amarillo (Envases)", container_color: "amarillo", explanation: "Los tetrabriks son envases mixtos que van al contenedor amarillo.", tip: "Aplástalo y deja el tapón puesto" },
  { name: "Aceite de cocina usado", aliases: JSON.stringify(["aceite frito", "aceite viejo"]), container: "Punto Limpio", container_color: "gris", explanation: "El aceite nunca debe tirarse por el desagüe. Contamina mucho el agua.", tip: "Guárdalo en una botella y llévalo al punto limpio" },
  { name: "Cartón limpio", aliases: JSON.stringify(["caja cartón", "rollo papel higiénico"]), container: "Azul (Papel/Cartón)", container_color: "azul", explanation: "El cartón limpio y sin grasas va al contenedor azul.", tip: "Aplástalo para ahorrar espacio" },
  { name: "Envase de yogur", aliases: JSON.stringify(["tarrina yogur", "tarro plástico"]), container: "Amarillo (Envases)", container_color: "amarillo", explanation: "Los envases de plástico de alimentación van al amarillo.", tip: "Enjuágalos ligeramente antes de tirarlos" },
  { name: "Bolígrafo", aliases: JSON.stringify(["boli", "pluma"]), container: "Gris (Resto)", container_color: "gris", explanation: "Los bolígrafos van al contenedor gris. Hay iniciativas de reciclaje específicas.", tip: "Algunas tiendas de papelería recogen bolígrafos usados" },
  { name: "Teléfono móvil viejo", aliases: JSON.stringify(["móvil roto", "smartphone viejo"]), container: "Punto Limpio / RAEE", container_color: "gris", explanation: "Los dispositivos electrónicos contienen materiales preciosos y tóxicos.", tip: "Si funciona, dónalo. Si no, llévalo a un punto limpio o tienda de electrónica" },
  { name: "Cáscara de huevo", aliases: JSON.stringify(["huevo", "cáscara"]), container: "Marrón (Orgánico)", container_color: "marron", explanation: "Las cáscaras de huevo son orgánicas y van al contenedor marrón.", tip: "Son excelente abono para el jardín" },
  { name: "Espejo roto", aliases: JSON.stringify(["espejo", "cristal roto"]), container: "Gris (Resto)", container_color: "gris", explanation: "El espejo tiene tratamientos especiales y no puede reciclarse como vidrio normal.", tip: "Envuélvelo en papel antes de tirarlo para evitar cortes" },
  { name: "CD / DVD", aliases: JSON.stringify(["disco", "dvd"]), container: "Gris (Resto)", container_color: "gris", explanation: "Los discos ópticos no tienen sistema de reciclaje generalizado.", tip: "¡Úsalos para manualidades! Perfectos para mosaicos y móviles decorativos" },
  { name: "Plástico film", aliases: JSON.stringify(["film transparente", "papel film"]), container: "Gris (Resto)", container_color: "gris", explanation: "El film plástico no puede reciclarse en el contenedor amarillo normal.", tip: "Algunos supermercados tienen puntos de recogida de film" },
  { name: "Ramas y restos de poda", aliases: JSON.stringify(["hojas", "hierba cortada", "poda"]), container: "Punto Limpio / Contenedor Vegetal", container_color: "marron", explanation: "Los residuos vegetales van a puntos de compostaje o punto limpio.", tip: "Puedes hacer tu propio compostador en casa" },
  { name: "Cartón de huevos", aliases: JSON.stringify(["docena huevos", "cartón huevos"]), container: "Azul (Papel/Cartón)", container_color: "azul", explanation: "El cartón de huevos es papel/cartón y va al contenedor azul.", tip: "Si está hecho de plástico o poliestireno, va al amarillo" },
  { name: "Aerosol vacío", aliases: JSON.stringify(["spray", "desodorante vacío"]), container: "Amarillo (Envases)", container_color: "amarillo", explanation: "Los aerosoles vacíos van al contenedor amarillo. Deben estar completamente vacíos.", tip: "Asegúrate de que esté vacío antes de tirarlo" },
  { name: "Bote de pintura vacío", aliases: JSON.stringify(["bote barniz", "bote laca"]), container: "Punto Limpio", container_color: "gris", explanation: "Los envases de pintura con restos van al punto limpio por sus componentes tóxicos.", tip: "Si está completamente limpio y seco, puede ir al amarillo" },
  { name: "Papel de aluminio", aliases: JSON.stringify(["albal", "papel plata"]), container: "Amarillo (Envases)", container_color: "amarillo", explanation: "El papel de aluminio va al contenedor amarillo de envases.", tip: "Apriétalo en una bola para que no vuele" },
  { name: "Restos de poda de jardín", aliases: JSON.stringify(["flores secas", "plantas muertas"]), container: "Marrón (Orgánico)", container_color: "marron", explanation: "Los restos vegetales pueden compostarse.", tip: "Perfecto para hacer compost casero" },
  { name: "Tóner de impresora", aliases: JSON.stringify(["cartucho tinta", "tóner"]), container: "Punto Limpio / Tienda", container_color: "gris", explanation: "Los cartuchos de tinta y tóner contienen sustancias químicas.", tip: "Muchas tiendas de informática los recogen para reciclaje" },
  { name: "Neumático viejo", aliases: JSON.stringify(["rueda", "cubierta"]), container: "Punto Limpio / Taller", container_color: "gris", explanation: "Los neumáticos tienen gestión específica en talleres y puntos limpios.", tip: "Los talleres tienen obligación de recogerlos" },
  { name: "Frasco de perfume", aliases: JSON.stringify(["botella colonia", "frasco cristal"]), container: "Verde (Vidrio)", container_color: "verde", explanation: "Los frascos de perfume de vidrio van al contenedor verde.", tip: "Quita el tapón metálico o plástico antes de tirarlo" },
];

const existingRecycle = sqlite.prepare("SELECT COUNT(*) as c FROM recycle_items").get() as { c: number };
if (existingRecycle.c === 0) {
  for (const r of recycleData) {
    sqlite.prepare(`INSERT INTO recycle_items (name, aliases, container, container_color, explanation, tip) VALUES (?, ?, ?, ?, ?, ?)`).run(r.name, r.aliases, r.container, r.container_color, r.explanation, r.tip);
  }
}

console.log("✅ Seed completado! Base de datos inicializada con datos de ejemplo.");
console.log("   - 5 usuarios");
console.log("   - 10 materiales");
console.log("   - 20 manualidades");
console.log("   - 15 posts de comunidad");
console.log("   - 20 preguntas de quiz");
console.log("   - 30 objetos de reciclaje");
