"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, UserPlus, MessageCircle, Trophy, Check, CheckCheck } from "lucide-react";
import Link from "next/link";
import { timeAgo, cn } from "@/lib/utils";
import { PageLoader } from "@/components/ui/LoadingSpinner";

type Notif = { id: number; type: string; message: string; read: boolean; createdAt: number; link?: string };

const TYPE_ICON: Record<string, React.ReactNode> = {
  like: <Heart className="w-4 h-4 text-[#FF6B35]" />,
  follow: <UserPlus className="w-4 h-4 text-[#2F5D3A]" />,
  comment: <MessageCircle className="w-4 h-4 text-blue-500" />,
  achievement: <Trophy className="w-4 h-4 text-yellow-500" />,
  quiz: <span className="text-sm">🎯</span>,
};

const TYPE_BG: Record<string, string> = {
  like: "bg-[#FF6B35]/10",
  follow: "bg-[#2F5D3A]/10",
  comment: "bg-blue-50",
  achievement: "bg-yellow-50",
  quiz: "bg-purple-50",
};

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Notif[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/notifications").then(r => r.json()).then(d => {
      setNotifs(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, []);

  const markAllRead = () => setNotifs(n => n.map(x => ({ ...x, read: true })));
  const markRead = (id: number) => setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));

  const unread = notifs.filter(n => !n.read).length;

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A]">Notificaciones</h1>
          {unread > 0 && (
            <p className="text-sm text-[#FF6B35] font-medium mt-0.5">{unread} sin leer</p>
          )}
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 text-sm text-[#2F5D3A] font-medium hover:underline"
          >
            <CheckCheck className="w-4 h-4" /> Marcar todas leídas
          </button>
        )}
      </div>

      {loading ? <PageLoader /> : (
        <div className="space-y-2">
          <AnimatePresence>
            {notifs.map((n, i) => (
              <motion.div
                key={n.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-2xl border transition-colors",
                  n.read ? "bg-white border-gray-100" : "bg-[#F5F0E8] border-[#2F5D3A]/20"
                )}
              >
                <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", TYPE_BG[n.type] ?? "bg-gray-50")}>
                  {TYPE_ICON[n.type] ?? <span>🔔</span>}
                </div>
                <div className="flex-1 min-w-0">
                  {n.link ? (
                    <Link href={n.link} onClick={() => markRead(n.id)} className="text-sm text-[#1A1A1A] hover:text-[#2F5D3A] transition-colors leading-snug">
                      {n.message}
                    </Link>
                  ) : (
                    <p className="text-sm text-[#1A1A1A] leading-snug">{n.message}</p>
                  )}
                  <p className="text-xs text-gray-400 mt-0.5">{timeAgo(n.createdAt)}</p>
                </div>
                {!n.read && (
                  <button
                    onClick={() => markRead(n.id)}
                    className="flex-shrink-0 p-1.5 rounded-lg hover:bg-white transition-colors"
                    aria-label="Marcar como leída"
                  >
                    <Check className="w-3.5 h-3.5 text-[#2F5D3A]" />
                  </button>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {notifs.length === 0 && (
            <div className="text-center py-16">
              <p className="text-5xl mb-3">🔔</p>
              <p className="font-semibold text-gray-700">Sin notificaciones</p>
              <p className="text-sm text-gray-400 mt-1">Te avisaremos cuando haya novedades</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
