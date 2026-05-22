"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Lightbulb } from "lucide-react";
import Link from "next/link";

type RecycleItem = { id: number; name: string; container: string; containerColor: string; explanation: string; tip: string };

const CONTAINERS = [
  { color: "amarillo", label: "Amarillo", subtitle: "Envases y plásticos", emoji: "🟡", bg: "bg-yellow-100 border-yellow-300", text: "text-yellow-800" },
  { color: "azul", label: "Azul", subtitle: "Papel y cartón", emoji: "🔵", bg: "bg-blue-100 border-blue-300", text: "text-blue-800" },
  { color: "verde", label: "Verde", subtitle: "Vidrio", emoji: "🟢", bg: "bg-green-100 border-green-300", text: "text-green-800" },
  { color: "marron", label: "Marrón", subtitle: "Orgánico", emoji: "🟤", bg: "bg-amber-100 border-amber-300", text: "text-amber-800" },
  { color: "gris", label: "Gris", subtitle: "Resto", emoji: "⚫", bg: "bg-gray-100 border-gray-300", text: "text-gray-800" },
];

const CURIOSIDADES = [
  "♻️ Reciclar 1 tonelada de papel salva 17 árboles y 26.000 litros de agua",
  "🍶 Una botella de plástico tarda 500 años en descomponerse",
  "💡 El aluminio se puede reciclar infinitas veces sin perder calidad",
  "🌍 España recicla el 70% del vidrio que consume",
  "📦 El cartón puede reciclarse hasta 7 veces",
];

export default function RecyclePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<RecycleItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeContainer, setActiveContainer] = useState<string | null>(null);
  const [curiosidad, setCuriosidad] = useState(0);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    setActiveContainer(null);
    const res = await fetch(`/api/recycle?q=${encodeURIComponent(query)}`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const handleContainer = async (color: string) => {
    setActiveContainer(color === activeContainer ? null : color);
    setQuery("");
    if (color === activeContainer) { setResults([]); return; }
    setLoading(true);
    const res = await fetch(`/api/recycle?container=${color}`);
    const data = await res.json();
    setResults(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  const CONT_COLORS: Record<string, string> = {
    amarillo: "bg-yellow-100 text-yellow-800 border-yellow-300",
    azul: "bg-blue-100 text-blue-800 border-blue-300",
    verde: "bg-green-100 text-green-800 border-green-300",
    marron: "bg-amber-100 text-amber-800 border-amber-300",
    gris: "bg-gray-100 text-gray-800 border-gray-300",
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">¿Dónde lo tiro? ♻️</h1>
        <p className="text-gray-500 text-sm mt-1">Busca cualquier objeto y te decimos en qué contenedor va</p>
      </div>

      {/* Big search */}
      <div className="bg-[#2F5D3A] rounded-3xl p-6 mb-6 text-white">
        <p className="font-serif text-xl mb-4">¿Dónde tiro una botella de vidrio?</p>
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/60" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && handleSearch()}
              placeholder="Ej: tapón de corcho, cáscara de naranja..."
              className="w-full pl-12 pr-4 py-3 bg-white/20 rounded-2xl text-white placeholder-white/60 focus:outline-none focus:ring-2 focus:ring-white/30 text-sm"
            />
          </div>
          <button
            onClick={handleSearch}
            className="px-6 py-3 bg-[#FF6B35] rounded-2xl text-white font-semibold text-sm hover:bg-[#e55a2b] transition-colors"
          >
            Buscar
          </button>
        </div>
      </div>

      {/* Containers */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mb-6">
        {CONTAINERS.map(c => (
          <button
            key={c.color}
            onClick={() => handleContainer(c.color)}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all ${
              activeContainer === c.color ? `${c.bg} ${c.text} border-current shadow-md scale-105` : "bg-white border-gray-200 hover:border-gray-300"
            }`}
          >
            <span className="text-3xl">{c.emoji}</span>
            <span className="font-semibold text-sm">{c.label}</span>
            <span className="text-[10px] text-gray-500 text-center">{c.subtitle}</span>
          </button>
        ))}
      </div>

      {/* Results */}
      <AnimatePresence>
        {results.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="mb-6"
          >
            <h2 className="font-serif text-xl font-bold mb-3">{results.length} resultado{results.length > 1 ? "s" : ""}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {results.map(item => (
                <div key={item.id} className={`p-4 rounded-2xl border ${CONT_COLORS[item.containerColor] ?? "bg-gray-100 text-gray-800 border-gray-300"}`}>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <h3 className="font-semibold">{item.name}</h3>
                    <span className="text-xs px-2 py-0.5 bg-white/60 rounded-full flex-shrink-0">{item.container}</span>
                  </div>
                  <p className="text-xs leading-relaxed opacity-80 mb-2">{item.explanation}</p>
                  {item.tip && (
                    <div className="flex items-start gap-1.5 mt-2 p-2 bg-white/40 rounded-xl">
                      <Lightbulb className="w-3 h-3 flex-shrink-0 mt-0.5" />
                      <p className="text-[11px] leading-relaxed">{item.tip}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        )}
        {query && !loading && results.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            <p className="text-4xl mb-3">🤔</p>
            <p className="font-semibold">No encontramos "{query}"</p>
            <p className="text-sm">Prueba con otro nombre o usa los contenedores de arriba</p>
          </div>
        )}
      </AnimatePresence>

      {/* ¿Sabías que...? */}
      <div className="bg-[#F5F0E8] rounded-2xl p-5 border border-[#2F5D3A]/20">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xl">💡</span>
          <h3 className="font-semibold text-[#1A1A1A]">¿Sabías que...?</h3>
        </div>
        <p className="text-sm text-gray-700 leading-relaxed mb-3">{CURIOSIDADES[curiosidad]}</p>
        <div className="flex gap-2">
          <button
            onClick={() => setCuriosidad(c => (c + 1) % CURIOSIDADES.length)}
            className="text-xs text-[#2F5D3A] font-medium hover:underline"
          >
            Siguiente curiosidad →
          </button>
          <Link href="/quiz" className="text-xs text-[#FF6B35] font-medium hover:underline ml-auto">
            Pon a prueba tu conocimiento en el Quiz →
          </Link>
        </div>
      </div>
    </div>
  );
}
