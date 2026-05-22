"use client";
import { useEffect, useState, useCallback } from "react";
import { CraftCard } from "@/components/craft/CraftCard";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { EmptyState } from "@/components/ui/EmptyState";
import { CATEGORIES, DIFFICULTIES } from "@/lib/utils";
import { motion } from "framer-motion";
import { SlidersHorizontal, Plus } from "lucide-react";
import Link from "next/link";
import Masonry from "react-masonry-css";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

type Craft = {
  id: number; title: string; image: string; likes: number; saves: number;
  difficulty: string; timeMinutes: number; materials: string; category: string;
  authorName?: string; authorImage?: string;
};

const BREAKPOINTS = { default: 3, 1100: 2, 640: 1 };

function HomeContent() {
  const [crafts, setCrafts] = useState<Craft[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("Todos");
  const [difficulty, setDifficulty] = useState("Todos");
  const searchParams = useSearchParams();
  const q = searchParams.get("q");

  const fetchCrafts = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (q) params.set("q", q);
      if (category !== "Todos") params.set("category", category);
      if (difficulty !== "Todos") params.set("difficulty", difficulty);
      const res = await fetch(`/api/crafts?${params}`);
      const data = await res.json();
      setCrafts(Array.isArray(data) ? data : []);
    } catch {
      setCrafts([]);
    } finally {
      setLoading(false);
    }
  }, [q, category, difficulty]);

  useEffect(() => { fetchCrafts(); }, [fetchCrafts]);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-1">
          {q ? `"${q}"` : "Explorar Manualidades"}
        </h1>
        <p className="text-gray-500 text-sm">Inspírate con {crafts.length} proyectos DIY ecológicos</p>
      </div>

      {/* Filters */}
      <div className="sticky top-[61px] z-10 bg-cream/80 backdrop-blur-sm pb-3 mb-4 -mx-4 px-4">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-hide">
          <SlidersHorizontal className="w-4 h-4 text-gray-400 flex-shrink-0" />
          <div className="flex gap-2 flex-nowrap">
            <span className="text-xs text-gray-500 flex items-center mr-1">Categoría:</span>
            {["Todos", ...CATEGORIES].map(c => (
              <button
                key={c}
                onClick={() => setCategory(c)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  category === c ? "bg-[#2F5D3A] text-white border-[#2F5D3A]" : "bg-white text-gray-600 border-gray-200 hover:border-[#2F5D3A]"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
          <div className="flex gap-2 flex-nowrap ml-3 pl-3 border-l border-gray-200">
            <span className="text-xs text-gray-500 flex items-center mr-1">Dificultad:</span>
            {["Todos", ...DIFFICULTIES].map(d => (
              <button
                key={d}
                onClick={() => setDifficulty(d)}
                className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all border ${
                  difficulty === d ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "bg-white text-gray-600 border-gray-200 hover:border-[#FF6B35]"
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </div>
      </div>

      {loading ? (
        <PageLoader />
      ) : crafts.length === 0 ? (
        <EmptyState
          title="No hay manualidades"
          description="Sé el primero en subir un proyecto con estos filtros"
          emoji="🎨"
          action={<Link href="/create" className="btn-primary">Crear manualidad</Link>}
        />
      ) : (
        <Masonry breakpointCols={BREAKPOINTS} className="masonry-grid" columnClassName="masonry-grid_column">
          {crafts.map(craft => (
            <CraftCard
              key={craft.id}
              id={craft.id}
              title={craft.title}
              image={craft.image}
              likes={craft.likes}
              saves={craft.saves}
              difficulty={craft.difficulty}
              timeMinutes={craft.timeMinutes}
              materials={JSON.parse(craft.materials || "[]")}
              category={craft.category}
              author={craft.authorName ? { name: craft.authorName } : undefined}
            />
          ))}
        </Masonry>
      )}

      {/* Floating create button */}
      <Link
        href="/create"
        className="fixed bottom-20 md:bottom-6 right-6 w-14 h-14 bg-[#FF6B35] text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-[#e55a2b] transition-colors z-20"
        aria-label="Crear nueva manualidad"
      >
        <Plus className="w-6 h-6" />
      </Link>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<PageLoader />}>
      <HomeContent />
    </Suspense>
  );
}
