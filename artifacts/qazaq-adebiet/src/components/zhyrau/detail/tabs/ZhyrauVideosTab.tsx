import React from 'react';
import { Play } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauVideosTab({ zhyrau }: { zhyrau: Zhyrau }) {
  if (!zhyrau.videos || zhyrau.videos.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Бейнематериалдар жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {zhyrau.videos.map(v => (
        <div key={v.id} className="glass-card rounded-xl overflow-hidden group">
          <div className="relative aspect-video bg-white/5 flex items-center justify-center cursor-pointer">
            {v.thumbnail ? (
              <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-gradient-to-br from-primary/20 to-accent/10" />
            )}
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
              <div className="w-14 h-14 rounded-full bg-primary/80 flex items-center justify-center shadow-lg">
                <Play className="w-6 h-6 text-white ml-1" />
              </div>
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-semibold mb-1">{v.title}</h3>
            <p className="text-white/50 text-sm">{v.duration}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
