"use client";
import { motion, AnimatePresence } from "framer-motion";
import { Leaf } from "lucide-react";

type GamificationToastProps = {
  points: number;
  action: string;
  visible: boolean;
};

export function GamificationToast({ points, action, visible }: GamificationToastProps) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.9 }}
          className="fixed bottom-24 right-6 z-50 bg-[#2F5D3A] text-white px-4 py-3 rounded-2xl shadow-xl flex items-center gap-3"
        >
          <div className="w-8 h-8 bg-white/20 rounded-xl flex items-center justify-center">
            <Leaf className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs text-white/70">{action}</p>
            <p className="font-bold text-sm">+{points} puntos 🌿</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
