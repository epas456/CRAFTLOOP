"use client";
import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Leaf, Mail, Lock, Loader2 } from "lucide-react";

function LoginForm() {
  const [email,    setEmail]    = useState("");
  const [password, setPassword] = useState("demo");
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const router       = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl  = searchParams.get("callbackUrl") ?? "/";

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) { setError("Introduce un email válido"); return; }
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl,
    });

    setLoading(false);

    if (res?.ok) {
      // Small delay to let cookie settle, then navigate
      setTimeout(() => router.push(callbackUrl), 100);
    } else {
      setError("No se pudo iniciar sesión. Inténtalo de nuevo.");
    }
  };

  const loginDemo = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword("demo");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2F5D3A] via-[#3D7A4A] to-[#1F3D28] flex items-center justify-center p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M20 18v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4z'/%3E%3C/g%3E%3C/svg%3E")` }}
      />

      <div className="w-full max-w-sm relative z-10">
        {/* Logo */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-3 shadow-lg">
            <Leaf className="w-8 h-8 text-[#2F5D3A]" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-white">CRAFTLOOP</h1>
          <p className="text-white/70 text-sm mt-1">Crea con lo que tienes 🌿</p>
        </motion.div>

        {/* Card */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-3xl p-6 shadow-2xl">
          <h2 className="font-serif text-xl font-bold text-[#1A1A1A] mb-1">Bienvenido</h2>
          <p className="text-sm text-gray-500 mb-5">Usa cualquier email para entrar</p>

          {/* Demo quick-access */}
          <div className="flex gap-2 mb-4">
            {["demo@craftloop.app", "maria@craftloop.app"].map(e => (
              <button
                key={e}
                type="button"
                onClick={() => loginDemo(e)}
                className="flex-1 text-[11px] py-1.5 px-2 bg-[#F5F0E8] text-[#2F5D3A] rounded-lg font-medium hover:bg-[#e8e3d8] transition-colors truncate"
              >
                {e.split("@")[0]} →
              </button>
            ))}
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]/30 focus:border-[#2F5D3A]"
                  placeholder="tu@email.com"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-gray-600 block mb-1">Contraseña</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                  className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]/30 focus:border-[#2F5D3A]"
                  placeholder="cualquier contraseña"
                />
              </div>
            </div>

            {error && (
              <div className="text-xs text-red-600 bg-red-50 border border-red-200 p-3 rounded-xl">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-[#2F5D3A] text-white rounded-xl font-semibold hover:bg-[#3D7A4A] transition-colors disabled:opacity-60 text-sm"
            >
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
              {loading ? "Entrando..." : "Entrar →"}
            </button>
          </form>

          <p className="text-center text-xs text-gray-400 mt-4">
            Prototipo demo · cualquier email + contraseña
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-6 flex justify-center gap-6 text-white/70 text-xs">
          <span>♻️ Reutiliza</span>
          <span>🎨 Crea</span>
          <span>🌍 Impacta</span>
        </motion.div>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#2F5D3A] flex items-center justify-center"><span className="text-white text-4xl animate-spin">🌿</span></div>}>
      <LoginForm />
    </Suspense>
  );
}
