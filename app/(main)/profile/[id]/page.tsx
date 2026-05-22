"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Grid3X3, Heart, Star, Settings } from "lucide-react";
import { getLevel } from "@/lib/utils";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { CraftCard } from "@/components/craft/CraftCard";

const MOCK_USERS: Record<string, {
  id: string; name: string; bio: string; image: string;
  points: number; level: number; badges: string[];
  followers: number; following: number;
}> = {
  user1: { id: "user1", name: "María García", bio: "Apasionada del upcycling y las manualidades con cartón 🌿", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=maria", points: 850, level: 4, badges: ["primera-manualidad", "10-likes", "5-seguidores"], followers: 234, following: 78 },
  user2: { id: "user2", name: "Carlos López", bio: "Ingeniero reconvertido en artesano DIY ♻️", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=carlos", points: 420, level: 3, badges: ["primera-manualidad"], followers: 89, following: 45 },
  user3: { id: "user3", name: "Ana Martínez", bio: "Profesora de arte, enseño a mis alumnos a reciclar 🎨", image: "https://api.dicebear.com/9.x/avataaars/svg?seed=ana", points: 1200, level: 5, badges: ["primera-manualidad", "10-likes", "quiz-maestro", "semana-activa", "5-seguidores"], followers: 567, following: 123 },
};

const BADGE_INFO: Record<string, { label: string; emoji: string }> = {
  "primera-manualidad": { label: "Primera manualidad", emoji: "🎨" },
  "10-likes": { label: "10 likes recibidos", emoji: "❤️" },
  "quiz-maestro": { label: "Quiz Maestro", emoji: "🏆" },
  "semana-activa": { label: "Semana activa", emoji: "🔥" },
  "5-seguidores": { label: "5 seguidores", emoji: "👥" },
};

type Craft = { id: number; title: string; image: string; likes: number; saves: number; difficulty: string; timeMinutes: number; materials: string; category: string };

export default function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const { data: session } = useSession();
  const [crafts, setCrafts] = useState<Craft[]>([]);
  const [loading, setLoading] = useState(true);
  const [following, setFollowing] = useState(false);

  // Determine actual user ID
  const userId = id === "me" ? (session?.user as { id?: string })?.id ?? "user1" : id;
  const user = MOCK_USERS[userId] ?? MOCK_USERS["user1"];
  const isOwnProfile = id === "me" || userId === (session?.user as { id?: string })?.id;

  const levelInfo = getLevel(user.points);

  useEffect(() => {
    fetch("/api/crafts").then(r => r.json()).then(d => {
      const all: Craft[] = Array.isArray(d) ? d : [];
      setCrafts(all.slice(0, 6));
      setLoading(false);
    });
  }, []);

  // Progress to next level
  const prevPoints = [0, 100, 300, 600, 1000][levelInfo.level - 1] ?? 0;
  const nextPoints = levelInfo.next ?? user.points;
  const progress = levelInfo.next ? ((user.points - prevPoints) / (nextPoints - prevPoints)) * 100 : 100;

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Cover + Avatar */}
      <div className="relative mb-16">
        <div className="h-40 bg-gradient-to-r from-[#2F5D3A] to-[#4A9B5A] rounded-2xl" />
        <div className="absolute -bottom-12 left-6 flex items-end gap-4">
          <div className="w-24 h-24 rounded-2xl border-4 border-white overflow-hidden bg-white shadow-md">
            <Image
              src={user.image}
              alt={user.name}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
        {isOwnProfile && (
          <Link href="/create" className="absolute bottom-3 right-3 flex items-center gap-1.5 px-3 py-1.5 bg-white rounded-xl text-xs font-semibold text-[#2F5D3A] shadow hover:shadow-md transition-shadow">
            <Settings className="w-3.5 h-3.5" /> Editar perfil
          </Link>
        )}
      </div>

      {/* Profile info */}
      <div className="mb-6">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h1 className="font-serif text-2xl font-bold text-[#1A1A1A]">{user.name}</h1>
            <p className="text-gray-500 text-sm mt-0.5">{user.bio}</p>
          </div>
          {!isOwnProfile && (
            <button
              onClick={() => setFollowing(f => !f)}
              className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${following ? "bg-gray-100 text-gray-700 hover:bg-gray-200" : "bg-[#2F5D3A] text-white hover:bg-[#3D7A4A]"}`}
            >
              {following ? "Siguiendo ✓" : "Seguir"}
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="flex gap-6 mt-4">
          <div className="text-center">
            <p className="font-bold text-lg text-[#1A1A1A]">{crafts.length}</p>
            <p className="text-xs text-gray-500">Manualidades</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-[#1A1A1A]">{user.followers + (following ? 1 : 0)}</p>
            <p className="text-xs text-gray-500">Seguidores</p>
          </div>
          <div className="text-center">
            <p className="font-bold text-lg text-[#1A1A1A]">{user.following}</p>
            <p className="text-xs text-gray-500">Siguiendo</p>
          </div>
        </div>
      </div>

      {/* Level & points */}
      <div className="bg-white rounded-2xl p-4 border border-gray-100 mb-6">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-2xl">{levelInfo.emoji}</span>
            <div>
              <p className="font-semibold text-sm text-[#1A1A1A]">Nivel {levelInfo.level} · {levelInfo.name}</p>
              <p className="text-xs text-gray-500">{user.points} puntos ecológicos</p>
            </div>
          </div>
          {levelInfo.next && (
            <span className="text-xs text-gray-400">{levelInfo.next - user.points} pts para nivel {levelInfo.level + 1}</span>
          )}
        </div>
        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#2F5D3A] to-[#4A9B5A] rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${Math.min(progress, 100)}%` }}
            transition={{ duration: 0.8, delay: 0.2 }}
          />
        </div>
      </div>

      {/* Badges */}
      {user.badges.length > 0 && (
        <div className="mb-6">
          <h2 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
            <Star className="w-4 h-4 text-yellow-500" /> Logros obtenidos
          </h2>
          <div className="flex flex-wrap gap-2">
            {user.badges.map(b => {
              const info = BADGE_INFO[b];
              if (!info) return null;
              return (
                <div key={b} className="flex items-center gap-1.5 px-3 py-1.5 bg-yellow-50 border border-yellow-200 rounded-full text-sm">
                  <span>{info.emoji}</span>
                  <span className="text-xs font-medium text-yellow-800">{info.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Crafts grid */}
      <div>
        <h2 className="font-semibold text-sm text-gray-600 mb-3 flex items-center gap-2">
          <Grid3X3 className="w-4 h-4" /> Mis creaciones
        </h2>
        {loading ? <PageLoader /> : (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {crafts.map(c => (
              <CraftCard
                key={c.id}
                id={c.id}
                title={c.title}
                image={c.image}
                likes={c.likes}
                saves={c.saves}
                difficulty={c.difficulty}
                timeMinutes={c.timeMinutes}
                materials={JSON.parse(c.materials || "[]")}
                category={c.category}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
