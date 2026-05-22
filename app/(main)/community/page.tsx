"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart, MessageCircle, Bookmark, Share2, TrendingUp } from "lucide-react";
import { PageLoader } from "@/components/ui/LoadingSpinner";
import { timeAgo } from "@/lib/utils";

type Post = { id: number; content: string; images: string; tags: string; likes: number; comments: number; createdAt: number; authorName?: string; authorImage?: string; authorId?: string };

const STORIES = [
  { name: "María G.", emoji: "🌿", color: "bg-green-100" },
  { name: "Carlos L.", emoji: "♻️", color: "bg-blue-100" },
  { name: "Ana M.", emoji: "🎨", color: "bg-purple-100" },
  { name: "Pedro S.", emoji: "🪴", color: "bg-yellow-100" },
  { name: "Laura F.", emoji: "🌍", color: "bg-red-100" },
  { name: "Rosa B.", emoji: "✂️", color: "bg-pink-100" },
];

const TRENDING = ["#jardínvertical", "#upcycling", "#cerobasurafácil", "#diyrecicla", "#manualidades2025", "#sostenible"];

export default function CommunityPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [likedPosts, setLikedPosts] = useState<Set<number>>(new Set());

  useEffect(() => {
    fetch("/api/posts").then(r => r.json()).then(d => {
      setPosts(Array.isArray(d) ? d : []);
      setLoading(false);
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex gap-6">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          <h1 className="font-serif text-3xl font-bold text-[#1A1A1A] mb-4">Comunidad</h1>

          {/* Stories */}
          <div className="bg-white rounded-2xl p-4 mb-4 border border-gray-100">
            <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
              {STORIES.map((s, i) => (
                <div key={i} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
                  <div className={`w-14 h-14 ${s.color} rounded-full flex items-center justify-center text-2xl ring-2 ring-[#2F5D3A] ring-offset-2`}>
                    {s.emoji}
                  </div>
                  <span className="text-[10px] text-gray-500 text-center w-14 truncate">{s.name}</span>
                </div>
              ))}
            </div>
          </div>

          {loading ? <PageLoader /> : (
            <div className="space-y-4">
              {posts.map((post, i) => {
                const images: string[] = JSON.parse(post.images || "[]");
                const tags: string[] = JSON.parse(post.tags || "[]");
                const liked = likedPosts.has(post.id);
                return (
                  <motion.div
                    key={post.id}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm"
                  >
                    {/* Author */}
                    <div className="flex items-center gap-3 p-4 pb-3">
                      <div className="w-9 h-9 rounded-full bg-[#2F5D3A] flex items-center justify-center text-white font-bold text-sm flex-shrink-0">
                        {(post.authorName ?? "U")[0]}
                      </div>
                      <div>
                        <p className="font-semibold text-sm text-[#1A1A1A]">{post.authorName ?? "Usuario"}</p>
                        <p className="text-xs text-gray-400">{timeAgo(post.createdAt)}</p>
                      </div>
                    </div>

                    {/* Image */}
                    {images[0] && (
                      <div className="relative aspect-[4/3] bg-gray-100">
                        <Image src={images[0]} alt="Post" fill className="object-cover" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-4">
                      <p className="text-sm text-gray-800 mb-3 leading-relaxed">{post.content}</p>
                      {tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mb-3">
                          {tags.map(t => (
                            <span key={t} className="text-xs text-[#2F5D3A] font-medium">#{t}</span>
                          ))}
                        </div>
                      )}
                      <div className="flex items-center gap-4 pt-2 border-t border-gray-50">
                        <button
                          onClick={() => setLikedPosts(prev => { const n = new Set(prev); liked ? n.delete(post.id) : n.add(post.id); return n; })}
                          className={`flex items-center gap-1.5 text-sm transition-colors ${liked ? "text-[#FF6B35]" : "text-gray-500 hover:text-[#FF6B35]"}`}
                        >
                          <Heart className={`w-4 h-4 ${liked ? "fill-current" : ""}`} />
                          {post.likes + (liked ? 1 : 0)}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2F5D3A] transition-colors">
                          <MessageCircle className="w-4 h-4" />
                          {post.comments}
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2F5D3A] transition-colors ml-auto">
                          <Bookmark className="w-4 h-4" />
                        </button>
                        <button className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-[#2F5D3A] transition-colors">
                          <Share2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar - Trending */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <div className="bg-white rounded-2xl p-4 border border-gray-100 sticky top-20">
            <div className="flex items-center gap-2 mb-3">
              <TrendingUp className="w-4 h-4 text-[#FF6B35]" />
              <h3 className="font-semibold text-sm">Trending topics</h3>
            </div>
            <div className="space-y-2">
              {TRENDING.map((t, i) => (
                <div key={t} className="flex items-center gap-2 text-sm">
                  <span className="text-xs text-gray-400 w-4">{i + 1}</span>
                  <span className="text-[#2F5D3A] font-medium hover:underline cursor-pointer">{t}</span>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-4 border-t border-gray-100">
              <h3 className="font-semibold text-sm mb-3">🌿 Dato del día</h3>
              <p className="text-xs text-gray-500 leading-relaxed">
                El 80% de los residuos domésticos puede reciclarse o reutilizarse. ¡Cada manualidad que haces es un residuo menos!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
