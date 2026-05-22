"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { CraftCard } from "@/components/craft/CraftCard";
import { Filter, ChevronRight } from "lucide-react";

type Material = { id: number; name: string; icon: string; description: string; projectCount: number; color: string };
type Craft = { id: number; title: string; image: string; likes: number; saves: number; difficulty: string; timeMinutes: number; materials: string; category: string; authorName?: string };

export default function MaterialsPage() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [selected, setSelected] = useState<string[]>([]);
  const [crafts, setCrafts] = useState<Craft[]>([]);
  const [loadingMats, setLoadingMats] = useState(true);
  const [loadingCrafts, setLoadingCrafts] = useState(false);
  const [difficulty, setDifficulty] = useState("Todos");
  const [time, setTime] = useState("Todos");
  const [age, setAge] = useState("Todos");

  useEffect(() => {
    fetch("/api/materials").then(r => r.json()).then(d => {
      setMaterials(Array.isArray(d) ? d : []);
      setLoadingMats(false);
    });
  }, []);

  const handleToggle = (name: string) => {
    setSelected(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);
  };

  const searchCrafts = async () => {
    setLoadingCrafts(true);
    const params = new URLSearchParams();
    if (difficulty !== "Todos") params.set("difficulty", difficulty);
    const res = await fetch(`/api/crafts?${params}`);
    const data = await res.json();
    const all: Craft[] = Array.isArray(data) ? data : [];
    const filtered = selected.length > 0
      ? all.filter(c => {
          const mats: string[] = JSON.parse(c.materials || "[]");
          return selected.some(s => mats.some(m => m.toLowerCase().includes(s.toLowerCase().split(" ")[0])));
        })
      : all;
    setCrafts(filtered);
    setLoadingCrafts(false);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Biblioteca de Materiales</h1>
        <p className="text-gray-500 text-sm mt-1">¿Qué tienes en casa? Selecciona y encuentra proyectos compatibles</p>
      </div>

      {loadingMats ? <PageLoader /> : (
        <>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-6">
            {materials.map((mat, i) => (
              <motion.button
                key={mat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                onClick={() => handleToggle(mat.name)}
                className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
                  selected.includes(mat.name)
                    ? "border-[#2F5D3A] bg-[#2F5D3A]/10 shadow-md"
                    : "border-gray-200 bg-white hover:border-[#2F5D3A]/40"
                }`}
              >
                <span className="text-4xl">{mat.icon}</span>
                <span className="text-xs font-semibold text-center text-gray-700 leading-tight">{mat.name}</span>
                <span className="text-[10px] text-gray-400">{mat.projectCount} proyectos</span>
                {selected.includes(mat.name) && (
                  <span className="text-[10px] bg-[#2F5D3A] text-white px-2 py-0.5 rounded-full">✓ Seleccionado</span>
                )}
              </motion.button>
            ))}
          </div>

          {/* Extra Filters */}
          <div className="bg-white rounded-2xl p-4 mb-6 border border-gray-100">
            <div className="flex items-center gap-2 mb-3">
              <Filter className="w-4 h-4 text-[#2F5D3A]" />
              <span className="font-semibold text-sm text-gray-700">Filtros adicionales</span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Dificultad</label>
                <div className="flex gap-2 flex-wrap">
                  {["Todos", "Fácil", "Medio", "Difícil"].map(d => (
                    <button key={d} onClick={() => setDifficulty(d)} className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${difficulty === d ? "bg-[#2F5D3A] text-white border-[#2F5D3A]" : "border-gray-200 text-gray-600"}`}>{d}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Tiempo</label>
                <div className="flex gap-2 flex-wrap">
                  {["Todos", "< 30min", "30–60min", "+1h"].map(t => (
                    <button key={t} onClick={() => setTime(t)} className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${time === t ? "bg-[#FF6B35] text-white border-[#FF6B35]" : "border-gray-200 text-gray-600"}`}>{t}</button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Edad</label>
                <div className="flex gap-2 flex-wrap">
                  {["Todos", "Niños", "Adultos"].map(a => (
                    <button key={a} onClick={() => setAge(a)} className={`px-2.5 py-1 rounded-full text-xs border transition-colors ${age === a ? "bg-[#8B5CF6] text-white border-[#8B5CF6]" : "border-gray-200 text-gray-600"}`}>{a}</button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={searchCrafts}
            disabled={loadingCrafts}
            className="w-full sm:w-auto flex items-center justify-center gap-2 btn-primary px-8 py-3 text-base mb-8"
          >
            {loadingCrafts ? "Buscando..." : `Ver proyectos compatibles ${selected.length > 0 ? `(${selected.length} materiales)` : ""}`}
            <ChevronRight className="w-5 h-5" />
          </button>

          {crafts.length > 0 && (
            <div>
              <h2 className="font-serif text-2xl font-bold mb-4">Proyectos para ti ({crafts.length})</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {crafts.map(c => (
                  <CraftCard key={c.id} id={c.id} title={c.title} image={c.image} likes={c.likes} saves={c.saves} difficulty={c.difficulty} timeMinutes={c.timeMinutes} materials={JSON.parse(c.materials || "[]")} category={c.category} author={c.authorName ? { name: c.authorName } : undefined} />
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
