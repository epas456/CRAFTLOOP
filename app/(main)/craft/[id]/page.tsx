"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { motion } from "framer-motion";
import { ArrowLeft, Heart, Bookmark, Share2, CheckSquare, Square, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { cn, getLevel } from "@/lib/utils";
import { GamificationToast } from "@/components/gamification/GamificationToast";

type Step = { title: string; description: string; image?: string };
type Craft = {
  id: number; title: string; description: string; image: string; category: string;
  difficulty: string; timeMinutes: number; ageGroup: string; materials: string;
  steps: string; likes: number; saves: number; authorName?: string; authorImage?: string; tags: string;
};

export default function CraftDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [craft, setCraft] = useState<Craft | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState(0);
  const [checkedMaterials, setCheckedMaterials] = useState<Set<number>>(new Set());
  const [completed, setCompleted] = useState(false);
  const [toast, setToast] = useState(false);

  useEffect(() => {
    fetch(`/api/crafts/${id}`).then(r => r.json()).then(d => {
      setCraft(d);
      setLoading(false);
    });
  }, [id]);

  const handleComplete = () => {
    setCompleted(true);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

  if (loading) return <PageLoader />;
  if (!craft) return <div className="p-8 text-center">No encontrado</div>;

  const materials: string[] = JSON.parse(craft.materials || "[]");
  const steps: Step[] = JSON.parse(craft.steps || "[]");
  const tags: string[] = JSON.parse(craft.tags || "[]");

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <GamificationToast points={10} action="¡Manualidad completada!" visible={toast} />

      {/* Back */}
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm text-gray-500 hover:text-[#2F5D3A] mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" /> Volver
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: image and info */}
        <div>
          <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-gray-100 mb-4">
            <Image src={craft.image} alt={craft.title} fill className="object-cover" />
            <div className="absolute top-3 left-3 flex flex-wrap gap-2">
              <span className="badge bg-white/90 text-[#2F5D3A] text-xs backdrop-blur-sm">{craft.category}</span>
              <span className={cn("badge text-xs", craft.difficulty === "Fácil" ? "bg-green-100 text-green-700" : craft.difficulty === "Medio" ? "bg-yellow-100 text-yellow-700" : "bg-red-100 text-red-700")}>
                {craft.difficulty}
              </span>
            </div>
          </div>

          <h1 className="font-serif text-2xl lg:text-3xl font-bold text-[#1A1A1A] mb-2">{craft.title}</h1>
          <p className="text-gray-600 text-sm mb-4 leading-relaxed">{craft.description}</p>

          <div className="flex items-center gap-4 mb-4 text-sm text-gray-600">
            <span className="flex items-center gap-1"><Clock className="w-4 h-4 text-[#2F5D3A]" /> {craft.timeMinutes} min</span>
            <span>👤 {craft.ageGroup}</span>
            <span>❤️ {craft.likes} likes</span>
          </div>

          {craft.authorName && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-[#F5F0E8] rounded-xl">
              <div className="w-8 h-8 rounded-full bg-[#2F5D3A] flex items-center justify-center text-white text-sm font-bold">
                {craft.authorName[0]}
              </div>
              <div>
                <p className="text-xs text-gray-500">Creado por</p>
                <p className="text-sm font-semibold text-[#1A1A1A]">{craft.authorName}</p>
              </div>
            </div>
          )}

          {/* Materials checklist */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h3 className="font-semibold text-sm text-gray-700 mb-3">📦 Materiales necesarios</h3>
            <div className="space-y-2">
              {materials.map((m, i) => (
                <button
                  key={i}
                  onClick={() => setCheckedMaterials(prev => {
                    const next = new Set(prev);
                    next.has(i) ? next.delete(i) : next.add(i);
                    return next;
                  })}
                  className="flex items-center gap-2 w-full text-left text-sm text-gray-700 hover:text-[#2F5D3A] transition-colors"
                >
                  {checkedMaterials.has(i)
                    ? <CheckSquare className="w-4 h-4 text-[#2F5D3A] flex-shrink-0" />
                    : <Square className="w-4 h-4 text-gray-300 flex-shrink-0" />}
                  <span className={cn(checkedMaterials.has(i) && "line-through text-gray-400")}>{m}</span>
                </button>
              ))}
            </div>
            <div className="mt-3 text-xs text-gray-400">
              {checkedMaterials.size}/{materials.length} preparados
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex gap-3 mt-4">
            <button className="flex items-center gap-2 flex-1 justify-center py-2.5 bg-[#F5F0E8] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <Heart className="w-4 h-4 text-[#FF6B35]" /> Me gusta
            </button>
            <button className="flex items-center gap-2 flex-1 justify-center py-2.5 bg-[#F5F0E8] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <Bookmark className="w-4 h-4 text-[#2F5D3A]" /> Guardar
            </button>
            <button className="flex items-center gap-2 flex-1 justify-center py-2.5 bg-[#F5F0E8] rounded-xl text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors">
              <Share2 className="w-4 h-4" /> Compartir
            </button>
          </div>
        </div>

        {/* Right: steps */}
        <div>
          <div className="bg-white rounded-2xl p-5 border border-gray-100 mb-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-serif text-xl font-bold text-[#1A1A1A]">Pasos del tutorial</h3>
              <span className="text-sm text-gray-500">{currentStep + 1} / {steps.length}</span>
            </div>

            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-100 rounded-full mb-5">
              <motion.div
                className="h-2 bg-[#2F5D3A] rounded-full"
                animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
                transition={{ duration: 0.3 }}
              />
            </div>

            {/* Current step */}
            {steps[currentStep] && (
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="mb-4"
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-7 h-7 bg-[#2F5D3A] text-white rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0">
                    {currentStep + 1}
                  </div>
                  <h4 className="font-semibold text-[#1A1A1A]">{steps[currentStep].title}</h4>
                </div>
                <p className="text-sm text-gray-600 ml-9 leading-relaxed">{steps[currentStep].description}</p>
                {steps[currentStep].image && (
                  <div className="ml-9 mt-3 rounded-xl overflow-hidden aspect-video bg-gray-100">
                    <Image src={steps[currentStep].image!} alt={steps[currentStep].title} width={400} height={225} className="w-full h-full object-cover" />
                  </div>
                )}
              </motion.div>
            )}

            {/* Navigation */}
            <div className="flex gap-3 mt-4">
              <button
                onClick={() => setCurrentStep(s => Math.max(0, s - 1))}
                disabled={currentStep === 0}
                className="flex items-center gap-1 px-4 py-2 bg-gray-100 rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-gray-200 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" /> Anterior
              </button>
              {currentStep < steps.length - 1 ? (
                <button
                  onClick={() => setCurrentStep(s => s + 1)}
                  className="flex items-center gap-1 px-4 py-2 bg-[#2F5D3A] text-white rounded-xl text-sm font-medium hover:bg-[#3D7A4A] transition-colors ml-auto"
                >
                  Siguiente <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={handleComplete}
                  disabled={completed}
                  className={cn(
                    "flex items-center gap-1 px-4 py-2 rounded-xl text-sm font-medium ml-auto transition-colors",
                    completed ? "bg-green-100 text-green-700" : "bg-[#FF6B35] text-white hover:bg-[#e55a2b]"
                  )}
                >
                  {completed ? "✅ ¡Completado!" : "🎉 ¡Ya lo hice!"}
                </button>
              )}
            </div>
          </div>

          {/* All steps list */}
          <div className="bg-white rounded-2xl p-4 border border-gray-100">
            <h4 className="font-semibold text-sm text-gray-600 mb-3">Todos los pasos</h4>
            <div className="space-y-2">
              {steps.map((step, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentStep(i)}
                  className={cn(
                    "flex items-center gap-3 w-full text-left p-2 rounded-xl transition-colors text-sm",
                    currentStep === i ? "bg-[#2F5D3A]/10 text-[#2F5D3A]" : "hover:bg-gray-50 text-gray-600"
                  )}
                >
                  <span className={cn("w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0", currentStep === i ? "bg-[#2F5D3A] text-white" : i < currentStep ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400")}>
                    {i < currentStep ? "✓" : i + 1}
                  </span>
                  {step.title}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mt-4">
              {tags.map(t => (
                <span key={t} className="text-xs bg-[#F5F0E8] text-[#2F5D3A] px-2 py-1 rounded-full">#{t}</span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
