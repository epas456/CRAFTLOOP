"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Bookmark, Clock, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useState } from "react";

type CraftCardProps = {
  id: number;
  title: string;
  image: string;
  author?: { name: string; image?: string };
  likes: number;
  saves: number;
  difficulty: string;
  timeMinutes: number;
  materials?: string[];
  category?: string;
  className?: string;
};

const DIFF_COLORS: Record<string, string> = {
  Fácil: "bg-green-100 text-green-700",
  Medio: "bg-yellow-100 text-yellow-700",
  Difícil: "bg-red-100 text-red-700",
};

export function CraftCard({ id, title, image, author, likes, saves, difficulty, timeMinutes, materials = [], category, className }: CraftCardProps) {
  const [liked, setLiked] = useState(false);
  const [saved, setSaved] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={cn("craft-card group", className)}
    >
      <Link href={`/craft/${id}`} className="block">
        <div className="relative overflow-hidden bg-gray-100">
          <Image
            src={image}
            alt={title}
            width={600}
            height={400}
            className="w-full object-cover aspect-[4/3] group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          <div className="absolute top-2 right-2 flex flex-col gap-1">
            <span className={cn("badge text-[10px]", DIFF_COLORS[difficulty] ?? "bg-gray-100 text-gray-600")}>
              {difficulty}
            </span>
          </div>
          {category && (
            <div className="absolute bottom-2 left-2">
              <span className="badge bg-black/50 text-white text-[10px] backdrop-blur-sm">{category}</span>
            </div>
          )}
        </div>
      </Link>

      <div className="p-3">
        <Link href={`/craft/${id}`}>
          <h3 className="font-semibold text-[#1A1A1A] text-sm leading-tight mb-2 line-clamp-2 hover:text-[#2F5D3A] transition-colors">
            {title}
          </h3>
        </Link>

        {materials.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-2">
            {materials.slice(0, 3).map(m => (
              <span key={m} className="text-[10px] bg-[#F5F0E8] text-[#2F5D3A] px-2 py-0.5 rounded-full border border-[#2F5D3A]/20">
                {m.split(" ")[0]}
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {timeMinutes}min</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setLiked(!liked)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#FF6B35] transition-colors"
              aria-label="Me gusta"
            >
              <Heart className={cn("w-4 h-4", liked && "fill-[#FF6B35] text-[#FF6B35]")} />
              <span>{likes + (liked ? 1 : 0)}</span>
            </button>
            <button
              onClick={() => setSaved(!saved)}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-[#2F5D3A] transition-colors"
              aria-label="Guardar"
            >
              <Bookmark className={cn("w-4 h-4", saved && "fill-[#2F5D3A] text-[#2F5D3A]")} />
            </button>
          </div>
        </div>

        {author && (
          <div className="flex items-center gap-1.5 mt-2 pt-2 border-t border-gray-50">
            <div className="w-5 h-5 rounded-full bg-[#2F5D3A]/20 flex items-center justify-center text-[8px] font-bold text-[#2F5D3A]">
              {author.name[0]}
            </div>
            <span className="text-[11px] text-gray-500">{author.name}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
}
