import { NextResponse } from "next/server";

const MOCK_NOTIFICATIONS = [
  { id: 1, type: "like", message: "María García le ha dado like a tu manualidad", read: false, createdAt: Date.now() / 1000 - 300, link: "/craft/1" },
  { id: 2, type: "follow", message: "Carlos López te ha empezado a seguir", read: false, createdAt: Date.now() / 1000 - 3600, link: "/profile/user2" },
  { id: 3, type: "comment", message: "Ana Martínez ha comentado: ¡Increíble trabajo! 🌿", read: false, createdAt: Date.now() / 1000 - 7200, link: "/craft/3" },
  { id: 4, type: "achievement", message: "¡Has ganado el badge Primera manualidad! 🏅", read: true, createdAt: Date.now() / 1000 - 86400, link: "/profile/me" },
  { id: 5, type: "like", message: "Pedro Sánchez y 5 más han dado like a tu post", read: true, createdAt: Date.now() / 1000 - 172800, link: "/" },
  { id: 6, type: "quiz", message: "¡Felicidades! Has completado el quiz con 8/10 🎉", read: true, createdAt: Date.now() / 1000 - 259200, link: "/quiz" },
];

export async function GET() {
  return NextResponse.json(MOCK_NOTIFICATIONS);
}
