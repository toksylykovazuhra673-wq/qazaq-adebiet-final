import React from 'react';
import { motion } from 'framer-motion';
import { Play, Clock, Video } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorVideosTab({ educator: e }: { educator: Educator }) {
  if (!e.videos?.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Video className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40 mb-2">Бейнематериалдар жоқ</p>
        <p className="text-white/25 text-sm">Жақын арада қосылады</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
      {e.videos.map((v, i) => (
        <motion.a
          key={v.id}
          href={v.url || '#'}
          target={v.url ? '_blank' : undefined}
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="group glass-card rounded-2xl border border-white/8 hover:border-violet-500/25 transition-all overflow-hidden"
        >
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gradient-to-br from-violet-600/20 to-teal-600/10 flex items-center justify-center overflow-hidden">
            {v.thumbnail ? (
              <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
            ) : (
              <Video className="w-10 h-10 text-white/20" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="w-14 h-14 rounded-full bg-white/20 border-2 border-white/40 flex items-center justify-center">
                <Play className="w-6 h-6 text-white fill-white" />
              </div>
            </div>
            <div className="absolute bottom-2 right-2 flex items-center gap-1 px-2 py-0.5 bg-black/60 rounded text-xs text-white">
              <Clock className="w-3 h-3" />{v.duration}
            </div>
          </div>
          <div className="p-4">
            <p className="text-white text-sm font-medium leading-snug group-hover:text-violet-200 transition-colors line-clamp-2">
              {v.title}
            </p>
          </div>
        </motion.a>
      ))}
    </div>
  );
}
