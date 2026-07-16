import React, { useRef } from 'react';
import { Link } from 'wouter';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function RelatedEducators({ educatorList }: { educatorList: Educator[] }) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const scroll = (dir: -1 | 1) =>
    scrollRef.current?.scrollBy({ left: dir * 280, behavior: 'smooth' });

  if (!educatorList.length) return null;

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-serif text-white font-semibold">Ұқсас ағартушылар</h2>
        <div className="flex gap-2">
          <button
            onClick={() => scroll(-1)}
            className="p-2 rounded-full bg-white/8 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={() => scroll(1)}
            className="p-2 rounded-full bg-white/8 hover:bg-white/15 text-white/60 hover:text-white transition-colors"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {educatorList.map((e) => (
          <Link
            key={e.id}
            href={`/educators/${e.slug}`}
            className="group flex flex-col items-center gap-3 p-4 rounded-2xl glass-card border border-white/8 hover:border-violet-500/30 transition-all shrink-0 w-44"
          >
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-violet-600/30 to-teal-700/20 border border-white/10 flex items-center justify-center overflow-hidden group-hover:border-violet-500/40 transition-colors">
              {e.photo ? (
                <img src={e.photo} alt={e.fullName} className="w-full h-full object-cover" />
              ) : (
                <span className="text-2xl font-serif text-white/80">{e.fullName.charAt(0)}</span>
              )}
            </div>
            <div className="text-center">
              <p className="text-white text-sm font-semibold font-serif group-hover:text-violet-200 transition-colors line-clamp-2">
                {e.fullName}
              </p>
              <p className="text-white/40 text-xs mt-0.5">{e.century} ғасыр</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
