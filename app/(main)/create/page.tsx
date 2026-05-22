"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Upload, Plus, X, ChevronRight, ChevronLeft, Eye } from "lucide-react";
import { CATEGORIES, DIFFICULTIES } from "@/lib/utils";
import { GamificationToast } from "@/components/gamification/GamificationToast";
import { useRouter } from "next/navigation";

const STEPS_FORM = ["Fotos", "Info general", "Materiales", "Detalles", "Tutorial"];

const MATERIALS_LIST = [
  "Botellas de plástico", "Cartón", "Tarros de vidrio", "Tela y ropa vieja",
  "Papel y periódicos", "Tapones", "Paletas de madera", "CDs y DVDs",
  "Latas de metal", "Neumáticos",
];

type TutorialStep = { title: string; description: string };

export default function CreatePage() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [toast, setToast] = useState(false);
  const [preview, setPreview] = useState(false);

  // Form state
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [selectedMats, setSelectedMats] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState("");
  const [time, setTime] = useState(30);
  const [ageGroup, setAgeGroup] = useState("todos");
  const [tutorialSteps, setTutorialSteps] = useState<TutorialStep[]>([{ title: "", description: "" }]);

  const toggleMat = (m: string) => setSelectedMats(p => p.includes(m) ? p.filter(x => x !== m) : [...p, m]);

  const addStep = () => setTutorialSteps(p => [...p, { title: "", description: "" }]);
  const removeStep = (i: number) => setTutorialSteps(p => p.filter((_, idx) => idx !== i));
  const updateStep = (i: number, field: keyof TutorialStep, val: string) =>
    setTutorialSteps(p => p.map((s, idx) => idx === i ? { ...s, [field]: val } : s));

  const handlePublish = () => {
    setToast(true);
    setTimeout(() => {
      setToast(false);
      router.push("/");
    }, 2500);
  };

  const canNext = [
    !!imageUrl || true, // allow empty for demo
    !!title && !!description && !!category,
    selectedMats.length > 0,
    !!difficulty,
    tutorialSteps.some(s => s.title),
  ][step];

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <GamificationToast points={10} action="¡Manualidad publicada!" visible={toast} />

      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Subir manualidad ✨</h1>
        <p className="text-gray-500 text-sm mt-1">Comparte tu creación con la comunidad</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center gap-1 mb-8 overflow-x-auto pb-1">
        {STEPS_FORM.map((s, i) => (
          <div key={s} className="flex items-center gap-1 flex-shrink-0">
            <button
              onClick={() => i < step && setStep(i)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                i === step ? "bg-[#2F5D3A] text-white" :
                i < step ? "bg-[#2F5D3A]/20 text-[#2F5D3A] cursor-pointer" :
                "bg-gray-100 text-gray-400"
              }`}
            >
              <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${i === step ? "bg-white/30" : i < step ? "bg-[#2F5D3A] text-white" : "bg-gray-200"}`}>
                {i < step ? "✓" : i + 1}
              </span>
              {s}
            </button>
            {i < STEPS_FORM.length - 1 && <div className={`w-4 h-0.5 ${i < step ? "bg-[#2F5D3A]" : "bg-gray-200"}`} />}
          </div>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4"
        >
          {/* STEP 0: Photos */}
          {step === 0 && (
            <div>
              <h2 className="font-semibold text-lg text-[#1A1A1A] mb-4">Foto de tu creación</h2>
              <div className="border-2 border-dashed border-gray-200 rounded-2xl p-8 text-center mb-4 hover:border-[#2F5D3A]/40 transition-colors">
                <Upload className="w-10 h-10 text-gray-300 mx-auto mb-3" />
                <p className="text-sm text-gray-500 mb-2">Arrastra una foto o haz click para subir</p>
                <p className="text-xs text-gray-400">PNG, JPG hasta 10MB</p>
                <button className="mt-3 px-4 py-2 bg-[#F5F0E8] text-[#2F5D3A] rounded-xl text-sm font-medium">
                  Seleccionar archivo
                </button>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">O usa una URL de imagen (para demo)</label>
                <input
                  type="url"
                  value={imageUrl}
                  onChange={e => setImageUrl(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]/30"
                />
              </div>
            </div>
          )}

          {/* STEP 1: General info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-[#1A1A1A]">Información general</h2>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Título *</label>
                <input
                  type="text"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="Ej: Maceta con botella reciclada"
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]/30"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Descripción *</label>
                <textarea
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Describe brevemente tu manualidad..."
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]/30 resize-none"
                />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Categoría *</label>
                <div className="flex flex-wrap gap-2">
                  {CATEGORIES.map(c => (
                    <button key={c} onClick={() => setCategory(c)} className={`px-3 py-1.5 rounded-full text-xs font-medium border transition-all ${category === c ? "bg-[#2F5D3A] text-white border-[#2F5D3A]" : "border-gray-200 text-gray-600 hover:border-[#2F5D3A]"}`}>
                      {c}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: Materials */}
          {step === 2 && (
            <div>
              <h2 className="font-semibold text-lg text-[#1A1A1A] mb-1">Materiales usados</h2>
              <p className="text-xs text-gray-500 mb-4">Selecciona los materiales reciclados que usaste</p>
              <div className="grid grid-cols-2 gap-2">
                {MATERIALS_LIST.map(m => (
                  <button
                    key={m}
                    onClick={() => toggleMat(m)}
                    className={`flex items-center gap-2 p-3 rounded-xl border text-left text-sm transition-all ${
                      selectedMats.includes(m) ? "border-[#2F5D3A] bg-[#2F5D3A]/10 text-[#2F5D3A] font-medium" : "border-gray-200 text-gray-600 hover:border-[#2F5D3A]/40"
                    }`}
                  >
                    <span className="text-base">{["🍶","📦","🫙","🧵","📰","🔘","🪵","💿","🥫","🔧"][MATERIALS_LIST.indexOf(m)]}</span>
                    <span className="text-xs leading-tight">{m}</span>
                    {selectedMats.includes(m) && <span className="ml-auto text-xs">✓</span>}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* STEP 3: Details */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="font-semibold text-lg text-[#1A1A1A]">Detalles del proyecto</h2>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Dificultad *</label>
                <div className="flex gap-2">
                  {DIFFICULTIES.map(d => (
                    <button key={d} onClick={() => setDifficulty(d)} className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all ${difficulty === d ? "border-[#2F5D3A] bg-[#2F5D3A] text-white" : "border-gray-200 text-gray-600"}`}>
                      {d === "Fácil" ? "🟢" : d === "Medio" ? "🟡" : "🔴"} {d}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">Tiempo estimado: <strong>{time} minutos</strong></label>
                <input type="range" min={5} max={300} step={5} value={time} onChange={e => setTime(Number(e.target.value))} className="w-full accent-[#2F5D3A]" />
                <div className="flex justify-between text-xs text-gray-400 mt-1"><span>5 min</span><span>5 horas</span></div>
              </div>
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-2">Rango de edad</label>
                <div className="flex gap-2">
                  {[["todos", "👨‍👩‍👧 Todos"], ["niños", "🧒 Niños"], ["adultos", "🧑 Adultos"]].map(([v, l]) => (
                    <button key={v} onClick={() => setAgeGroup(v)} className={`flex-1 py-2 rounded-xl text-xs font-medium border transition-all ${ageGroup === v ? "border-[#2F5D3A] bg-[#2F5D3A]/10 text-[#2F5D3A]" : "border-gray-200 text-gray-600"}`}>
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* STEP 4: Tutorial steps */}
          {step === 4 && (
            <div>
              <h2 className="font-semibold text-lg text-[#1A1A1A] mb-4">Pasos del tutorial</h2>
              <div className="space-y-3">
                {tutorialSteps.map((s, i) => (
                  <div key={i} className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                      <span className="w-6 h-6 bg-[#2F5D3A] text-white rounded-full flex items-center justify-center text-xs font-bold">{i + 1}</span>
                      {tutorialSteps.length > 1 && (
                        <button onClick={() => removeStep(i)} className="p-1 text-gray-400 hover:text-red-400 transition-colors" aria-label="Eliminar paso">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={s.title}
                      onChange={e => updateStep(i, "title", e.target.value)}
                      placeholder={`Título del paso ${i + 1}`}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm mb-2 focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]/30"
                    />
                    <textarea
                      value={s.description}
                      onChange={e => updateStep(i, "description", e.target.value)}
                      placeholder="Describe este paso..."
                      rows={2}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]/30 resize-none"
                    />
                  </div>
                ))}
              </div>
              <button
                onClick={addStep}
                className="mt-3 flex items-center gap-2 text-sm text-[#2F5D3A] font-medium hover:underline"
              >
                <Plus className="w-4 h-4" /> Añadir paso
              </button>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Navigation */}
      <div className="flex gap-3">
        {step > 0 && (
          <button onClick={() => setStep(s => s - 1)} className="flex items-center gap-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
            <ChevronLeft className="w-4 h-4" /> Anterior
          </button>
        )}
        {step < STEPS_FORM.length - 1 ? (
          <button
            onClick={() => setStep(s => s + 1)}
            disabled={!canNext}
            className="flex items-center gap-1 px-6 py-2.5 bg-[#2F5D3A] text-white rounded-xl text-sm font-semibold disabled:opacity-40 hover:bg-[#3D7A4A] transition-colors ml-auto"
          >
            Siguiente <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <div className="flex gap-2 ml-auto">
            <button onClick={() => setPreview(true)} className="flex items-center gap-1 px-4 py-2.5 bg-gray-100 rounded-xl text-sm font-medium hover:bg-gray-200 transition-colors">
              <Eye className="w-4 h-4" /> Vista previa
            </button>
            <button
              onClick={handlePublish}
              className="flex items-center gap-2 px-6 py-2.5 bg-[#FF6B35] text-white rounded-xl text-sm font-semibold hover:bg-[#e55a2b] transition-colors"
            >
              🚀 Publicar
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
