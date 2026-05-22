import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLevel(points: number) {
  if (points < 100) return { level: 1, name: "Semilla", emoji: "🌱", next: 100 };
  if (points < 300) return { level: 2, name: "Brote", emoji: "🌿", next: 300 };
  if (points < 600) return { level: 3, name: "Planta", emoji: "🪴", next: 600 };
  if (points < 1000) return { level: 4, name: "Árbol", emoji: "🌳", next: 1000 };
  return { level: 5, name: "Bosque", emoji: "🌲", next: null };
}

export function formatDate(date: Date | number) {
  const d = typeof date === "number" ? new Date(date * 1000) : date;
  return d.toLocaleDateString("es-ES", { day: "numeric", month: "short", year: "numeric" });
}

export function timeAgo(date: Date | number) {
  const d = typeof date === "number" ? new Date(date * 1000) : date;
  const now = new Date();
  const diff = (now.getTime() - d.getTime()) / 1000;
  if (diff < 60) return "ahora mismo";
  if (diff < 3600) return `hace ${Math.floor(diff / 60)}m`;
  if (diff < 86400) return `hace ${Math.floor(diff / 3600)}h`;
  return `hace ${Math.floor(diff / 86400)}d`;
}

export const CATEGORIES = [
  "Decoración", "Juguetes", "Jardín", "Moda", "Hogar", "Arte", "Cocina", "Educación"
];

export const DIFFICULTIES = ["Fácil", "Medio", "Difícil"];

export const CONTAINER_COLORS: Record<string, { label: string; bg: string; text: string }> = {
  amarillo: { label: "Amarillo (Envases)", bg: "#FEF08A", text: "#713F12" },
  azul: { label: "Azul (Papel/Cartón)", bg: "#BFDBFE", text: "#1E3A5F" },
  verde: { label: "Verde (Vidrio)", bg: "#BBF7D0", text: "#14532D" },
  marron: { label: "Marrón (Orgánico)", bg: "#D4A96A", text: "#431407" },
  gris: { label: "Gris (Resto)", bg: "#E5E7EB", text: "#374151" },
};
