"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Send, Bot, User, Sparkles, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

type Message = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Tengo botellas de plástico y cartón",
  "¿Qué hago con latas de conserva viejas?",
  "Tengo CDs en desuso y pintura",
  "Quiero hacer algo con tapones de corcho",
];

export default function AssistantPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const content = text ?? input.trim();
    if (!content || loading) return;

    const userMsg: Message = { role: "user", content };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });

      if (!res.ok) throw new Error("API error");

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      setMessages(prev => [...prev, { role: "assistant", content: "" }]);

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantText += decoder.decode(value, { stream: true });
          setMessages(prev => {
            const updated = [...prev];
            updated[updated.length - 1] = { role: "assistant", content: assistantText };
            return updated;
          });
        }
      }
    } catch (err) {
      setMessages(prev => [
        ...prev,
        { role: "assistant", content: "⚠️ Lo siento, hubo un error. Asegúrate de configurar la ANTHROPIC_API_KEY en `.env.local`." },
      ]);
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-6 flex flex-col h-[calc(100vh-64px)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-[#2F5D3A] rounded-2xl flex items-center justify-center">
            <span className="text-xl">🌿</span>
          </div>
          <div>
            <h1 className="font-serif text-xl font-bold text-[#1A1A1A]">Loopi</h1>
            <p className="text-xs text-green-500 flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block animate-pulse" /> Asistente ecológico activo
            </p>
          </div>
        </div>
        {messages.length > 0 && (
          <button
            onClick={() => setMessages([])}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-[#2F5D3A] transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" /> Nueva conversación
          </button>
        )}
      </div>

      {/* Chat area */}
      <div className="flex-1 overflow-y-auto space-y-4 mb-4 pr-1">
        {messages.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-8"
          >
            <div className="text-6xl mb-4">🌿</div>
            <h2 className="font-serif text-2xl font-bold text-[#1A1A1A] mb-2">¡Hola! Soy Loopi</h2>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
              Tu asistente ecológico de CRAFTLOOP. Dime qué materiales tienes en casa y te sugiero manualidades increíbles para reutilizarlos ♻️
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-w-md mx-auto">
              {SUGGESTIONS.map(s => (
                <button
                  key={s}
                  onClick={() => sendMessage(s)}
                  className="flex items-center gap-2 p-3 bg-white border border-gray-200 rounded-xl text-sm text-left hover:border-[#2F5D3A] hover:bg-[#2F5D3A]/5 transition-all group"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#FF6B35] flex-shrink-0" />
                  {s}
                </button>
              ))}
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn("flex gap-3", msg.role === "user" ? "flex-row-reverse" : "flex-row")}
            >
              <div className={cn(
                "w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0",
                msg.role === "user" ? "bg-[#FF6B35]/20" : "bg-[#2F5D3A]"
              )}>
                {msg.role === "user"
                  ? <User className="w-4 h-4 text-[#FF6B35]" />
                  : <span className="text-sm">🌿</span>}
              </div>
              <div className={cn(
                "max-w-[80%] px-4 py-3 rounded-2xl text-sm leading-relaxed",
                msg.role === "user"
                  ? "bg-[#2F5D3A] text-white rounded-tr-sm"
                  : "bg-white border border-gray-100 text-[#1A1A1A] rounded-tl-sm shadow-sm"
              )}>
                {msg.content || (
                  <span className="flex items-center gap-1 text-gray-400">
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border border-gray-200 rounded-2xl p-3 shadow-sm">
        <textarea
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Escribe qué materiales tienes o qué quieres crear... (Enter para enviar)"
          rows={2}
          className="w-full text-sm text-[#1A1A1A] placeholder-gray-400 resize-none focus:outline-none"
        />
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className="text-xs text-gray-400">Powered by Claude claude-sonnet-4-20250514</span>
          <button
            onClick={() => sendMessage()}
            disabled={!input.trim() || loading}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#2F5D3A] text-white rounded-xl text-sm font-medium disabled:opacity-40 hover:bg-[#3D7A4A] transition-colors"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <Send className="w-3.5 h-3.5" />
            )}
            Enviar
          </button>
        </div>
      </div>
    </div>
  );
}
