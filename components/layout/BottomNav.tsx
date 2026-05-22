"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, Package, Plus, Users, User } from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", icon: Compass, label: "Explorar" },
  { href: "/materials", icon: Package, label: "Materiales" },
  { href: "/create", icon: Plus, label: "Crear", special: true },
  { href: "/community", icon: Users, label: "Comunidad" },
  { href: "/profile/me", icon: User, label: "Perfil" },
];

export function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-100 flex items-center justify-around px-2 pb-safe">
      {TABS.map(({ href, icon: Icon, label, special }) => {
        const isActive = pathname === href;
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-colors",
              special
                ? "bg-[#2F5D3A] text-white -mt-4 w-12 h-12 flex items-center justify-center rounded-2xl shadow-lg"
                : isActive
                ? "text-[#2F5D3A]"
                : "text-gray-400"
            )}
            aria-label={label}
          >
            <Icon className={cn("w-5 h-5", special && "w-6 h-6")} />
            {!special && <span className="text-[10px] font-medium">{label}</span>}
          </Link>
        );
      })}
    </nav>
  );
}
