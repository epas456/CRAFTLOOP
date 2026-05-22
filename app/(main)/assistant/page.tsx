import { Bot, Sparkles } from "lucide-react";
import Link from "next/link";

export default function AssistantPage() {
  return (
    <div className="max-w-xl mx-auto px-4 py-20 flex flex-col items-center text-center">
      <div className="w-20 h-20 bg-[#F5F0E8] rounded-3xl flex items-center justify-center mb-5">
        <span className="text-4xl">🌿</span>
      </div>
      <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-2">Loopi — Próximamente</h1>
      <p className="text-gray-500 text-sm leading-relaxed mb-6 max-w-sm">
        El asistente IA ecológico estará disponible muy pronto.<br/>
        Mientras tanto, explora las manualidades de la comunidad.
      </p>
      <Link href="/" className="btn-primary flex items-center gap-2 px-6 py-3">
        <Sparkles className="w-4 h-4" /> Explorar manualidades
      </Link>
    </div>
  );
}
