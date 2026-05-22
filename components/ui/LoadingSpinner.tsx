"use client";
import { motion } from "framer-motion";

export function LoadingSpinner({ size = 24 }: { size?: number }) {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        style={{ width: size, height: size }}
        className="text-[#2F5D3A]"
      >
        🌿
      </motion.div>
    </div>
  );
}

export function PageLoader() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="text-5xl"
      >
        🌿
      </motion.div>
      <p className="text-gray-500 text-sm">Cargando...</p>
    </div>
  );
}
