"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { GamificationToast } from "@/components/gamification/GamificationToast";
import { PageLoader } from "@/components/ui/LoadingSpinner";

type Question = {
  id: number;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: string;
  explanation: string;
};

const OPTIONS = ["A", "B", "C", "D"] as const;

export default function QuizPage() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [answers, setAnswers] = useState<{ correct: boolean; selected: string }[]>([]);
  const [showResult, setShowResult] = useState(false);
  const [toast, setToast] = useState(false);

  const fetchQuestions = async () => {
    setLoading(true);
    const res = await fetch("/api/quiz");
    const data = await res.json();
    setQuestions(Array.isArray(data) ? data : []);
    setLoading(false);
    setCurrent(0);
    setSelected(null);
    setAnswers([]);
    setShowResult(false);
  };

  useEffect(() => { fetchQuestions(); }, []);

  const q = questions[current];
  const optionLabels: Record<string, string> = q
    ? { A: q.optionA, B: q.optionB, C: q.optionC, D: q.optionD }
    : {};

  const handleSelect = (opt: string) => {
    if (selected) return;
    setSelected(opt);
    const correct = opt === q.correctOption;
    setAnswers(prev => [...prev, { correct, selected: opt }]);
  };

  const handleNext = () => {
    if (current + 1 >= questions.length) {
      setShowResult(true);
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } else {
      setCurrent(c => c + 1);
      setSelected(null);
    }
  };

  const score = answers.filter(a => a.correct).length;

  if (loading) return <PageLoader />;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <GamificationToast points={20} action="¡Quiz completado!" visible={toast} />

      <div className="mb-6">
        <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Quiz de Reciclaje 🎯</h1>
        <p className="text-gray-500 text-sm mt-1">Pon a prueba tus conocimientos sobre reciclaje y sostenibilidad</p>
      </div>

      {!showResult ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={current}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.25 }}
          >
            {/* Progress */}
            <div className="flex items-center gap-3 mb-5">
              <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-[#2F5D3A] rounded-full"
                  animate={{ width: `${((current + 1) / questions.length) * 100}%` }}
                  transition={{ duration: 0.4 }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-500 flex-shrink-0">
                {current + 1} / {questions.length}
              </span>
            </div>

            {/* Question card */}
            <div className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm mb-4">
              <div className="flex items-center gap-2 mb-4">
                <span className="w-8 h-8 bg-[#2F5D3A] text-white rounded-xl flex items-center justify-center text-sm font-bold flex-shrink-0">
                  {current + 1}
                </span>
                <h2 className="font-semibold text-[#1A1A1A] text-base leading-snug">{q?.question}</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {OPTIONS.map(opt => {
                  const isSelected = selected === opt;
                  const isCorrect = opt === q?.correctOption;
                  const showFeedback = !!selected;

                  return (
                    <button
                      key={opt}
                      onClick={() => handleSelect(opt)}
                      disabled={!!selected}
                      className={cn(
                        "flex items-center gap-3 p-4 rounded-xl border-2 text-left text-sm font-medium transition-all",
                        !showFeedback && "border-gray-200 bg-gray-50 hover:border-[#2F5D3A] hover:bg-[#2F5D3A]/5",
                        showFeedback && isCorrect && "border-green-400 bg-green-50 text-green-800",
                        showFeedback && isSelected && !isCorrect && "border-red-400 bg-red-50 text-red-800",
                        showFeedback && !isSelected && !isCorrect && "border-gray-100 bg-gray-50 text-gray-400"
                      )}
                    >
                      <span className={cn(
                        "w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0",
                        !showFeedback && "bg-white border border-gray-200",
                        showFeedback && isCorrect && "bg-green-500 text-white",
                        showFeedback && isSelected && !isCorrect && "bg-red-500 text-white",
                        showFeedback && !isSelected && !isCorrect && "bg-gray-200 text-gray-400"
                      )}>
                        {opt}
                      </span>
                      <span>{optionLabels[opt]}</span>
                      {showFeedback && isCorrect && <CheckCircle className="w-4 h-4 text-green-500 ml-auto" />}
                      {showFeedback && isSelected && !isCorrect && <XCircle className="w-4 h-4 text-red-500 ml-auto" />}
                    </button>
                  );
                })}
              </div>

              {/* Explanation */}
              <AnimatePresence>
                {selected && q?.explanation && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-xl"
                  >
                    <p className="text-xs text-blue-800 leading-relaxed">
                      <span className="font-semibold">💡 Explicación: </span>{q.explanation}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {selected && (
              <motion.button
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={handleNext}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#2F5D3A] text-white rounded-xl font-semibold hover:bg-[#3D7A4A] transition-colors"
              >
                {current + 1 >= questions.length ? "Ver resultado 🏆" : "Siguiente pregunta"}
                <ChevronRight className="w-4 h-4" />
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm text-center"
        >
          <div className="text-6xl mb-4">
            {score >= 8 ? "🏆" : score >= 5 ? "🌿" : "🌱"}
          </div>
          <h2 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-1">
            {score} / {questions.length}
          </h2>
          <p className="text-gray-500 mb-2">
            {score >= 8 ? "¡Eres un experto en reciclaje!" : score >= 5 ? "¡Buen trabajo! Sigue aprendiendo" : "¡Sigue practicando!"}
          </p>

          {score === questions.length && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold mb-4">
              <Trophy className="w-4 h-4" /> Badge: Quiz Maestro 🏅
            </div>
          )}

          <div className="grid grid-cols-5 gap-2 my-6">
            {answers.map((a, i) => (
              <div key={i} className={cn("h-8 rounded-lg flex items-center justify-center text-sm", a.correct ? "bg-green-100 text-green-600" : "bg-red-100 text-red-500")}>
                {a.correct ? "✓" : "✗"}
              </div>
            ))}
          </div>

          <div className="flex gap-3">
            <button
              onClick={fetchQuestions}
              className="flex-1 flex items-center justify-center gap-2 py-3 bg-[#2F5D3A] text-white rounded-xl font-semibold hover:bg-[#3D7A4A] transition-colors"
            >
              <RotateCcw className="w-4 h-4" /> Jugar de nuevo
            </button>
          </div>
        </motion.div>
      )}
    </div>
  );
}
