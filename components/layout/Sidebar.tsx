"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import {
  Compass, Package, Users, HelpCircle, RecycleIcon, User, Bot,
  Bell, Plus, ChevronLeft, ChevronRight, Leaf
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";
import { useSession } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/", icon: Compass, label: "Explorar" },
  { href: "/materials", icon: Package, label: "Materiales" },
  { href: "/community", icon: Users, label: "Comunidad" },
  { href: "/quiz", icon: HelpCircle, label: "Quiz" },
  { href: "/recycle", icon: RecycleIcon, label: "Reciclar" },
  { href: "/profile/me", icon: User, label: "Perfil" },
  { href: "/assistant", icon: Bot, label: "Asistente IA" },
  { href: "/notifications", icon: Bell, label: "Notificaciones" },
];

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const { data: session } = useSession();

  return (
    <motion.aside
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.2, ease: "easeInOut" }}
      className="hidden md:flex flex-col h-screen bg-white border-r border-gray-100 sticky top-0 z-30 overflow-hidden flex-shrink-0"
    >
      {/* Logo */}
      <div className="flex items-center gap-2 px-4 py-5 border-b border-gray-100">
        <div className="w-9 h-9 bg-[#2F5D3A] rounded-xl flex items-center justify-center flex-shrink-0">
          <Leaf className="w-5 h-5 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-serif text-xl font-bold text-[#2F5D3A]"
          >
            CRAFTLOOP
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map(({ href, icon: Icon, label }) => {
          const isActive = pathname === href || (href !== "/" && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                "sidebar-link",
                isActive && "active",
                collapsed && "justify-center px-2"
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && <span>{label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Create button */}
      <div className="px-2 py-3 border-t border-gray-100">
        <Link
          href="/create"
          className={cn(
            "flex items-center gap-2 w-full px-3 py-2.5 bg-[#2F5D3A] text-white rounded-xl text-sm font-semibold hover:bg-[#3D7A4A] transition-colors",
            collapsed && "justify-center px-2"
          )}
        >
          <Plus className="w-5 h-5 flex-shrink-0" />
          {!collapsed && <span>Nueva manualidad</span>}
        </Link>
      </div>

      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="flex items-center justify-center p-3 hover:bg-gray-50 transition-colors border-t border-gray-100"
        aria-label={collapsed ? "Expandir sidebar" : "Colapsar sidebar"}
      >
        {collapsed ? <ChevronRight className="w-4 h-4 text-gray-400" /> : <ChevronLeft className="w-4 h-4 text-gray-400" />}
      </button>
    </motion.aside>
  );
}
