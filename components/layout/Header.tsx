"use client";
import { Search, Bell, Sun, Moon, Leaf } from "lucide-react";
import { useTheme } from "next-themes";
import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

export function Header() {
  const { theme, setTheme } = useTheme();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const dropRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) router.push(`/?q=${encodeURIComponent(query)}`);
  };

  return (
    <header className="sticky top-0 z-20 bg-white/80 backdrop-blur-md border-b border-gray-100 px-4 py-3 flex items-center gap-4">
      {/* Mobile logo */}
      <Link href="/" className="md:hidden flex items-center gap-1.5">
        <div className="w-7 h-7 bg-[#2F5D3A] rounded-lg flex items-center justify-center">
          <Leaf className="w-4 h-4 text-white" />
        </div>
        <span className="font-serif font-bold text-[#2F5D3A] text-lg">CL</span>
      </Link>

      {/* Search */}
      <form onSubmit={handleSearch} className="flex-1 max-w-xl">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Buscar manualidades, materiales..."
            className="w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-[#2F5D3A]/30 focus:border-[#2F5D3A]"
          />
        </div>
      </form>

      <div className="flex items-center gap-2 ml-auto">
        {/* Theme toggle */}
        <button
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
          aria-label="Cambiar tema"
        >
          {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications */}
        <Link href="/notifications" className="relative p-2 rounded-xl hover:bg-gray-100 transition-colors" aria-label="Notificaciones">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-[#FF6B35] rounded-full" />
        </Link>

        {/* Avatar */}
        {session ? (
          <div className="relative" ref={dropRef}>
            <button onClick={() => setOpen(!open)} className="w-8 h-8 rounded-full overflow-hidden border-2 border-[#2F5D3A]/20 hover:border-[#2F5D3A] transition-colors">
              {session.user?.image ? (
                <Image src={session.user.image} alt={session.user.name ?? ""} width={32} height={32} />
              ) : (
                <div className="w-full h-full bg-[#2F5D3A] flex items-center justify-center text-white text-xs font-bold">
                  {(session.user?.name ?? "U")[0].toUpperCase()}
                </div>
              )}
            </button>
            {open && (
              <div className="absolute right-0 top-10 w-48 bg-white border border-gray-100 rounded-xl shadow-lg overflow-hidden z-50">
                <Link href="/profile/me" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50" onClick={() => setOpen(false)}>
                  Mi perfil
                </Link>
                <Link href="/create" className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-gray-50" onClick={() => setOpen(false)}>
                  Nueva manualidad
                </Link>
                <hr className="border-gray-100" />
                <button onClick={() => signOut({ callbackUrl: "/login" })} className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-red-50">
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        ) : (
          <Link href="/login" className="btn-primary text-xs">Entrar</Link>
        )}
      </div>
    </header>
  );
}
