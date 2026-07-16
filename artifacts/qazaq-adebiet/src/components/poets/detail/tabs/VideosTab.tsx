import React from 'react';
import { Play, Clock, Video } from 'lucide-react';
import type { Poet } from '@/types/poet';

export default function VideosTab({ poet }: { poet: Poet }) {
  if (!poet.videos || poet.videos.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Video className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-2xl font-serif text-white mb-3">Бейнематериалдар</h3>
        <p className="text-white/60">Бейнематериалдар жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {poet.videos.map((video) => (
        <div key={video.id} className="glass-card rounded-2xl overflow-hidden flex flex-col group">
          <div className="relative aspect-video bg-black/40 border-b border-white/10">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
            ) : (
              <div className="absolute inset-0 bg-gradient-to-br from-[#0f0520] to-primary/20" />
            )}
            
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover:bg-black/10 transition-colors"
            >
              <div className="w-16 h-16 rounded-full bg-primary/80 text-white flex items-center justify-center backdrop-blur-md transform group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(139,92,246,0.6)]">
                <Play className="w-6 h-6 ml-1" />
              </div>
            </a>
            
            <div className="absolute bottom-4 right-4 px-3 py-1 bg-black/80 backdrop-blur-md rounded-lg flex items-center gap-1.5 text-xs text-white font-medium border border-white/10">
              <Clock className="w-3 h-3 text-primary" />
              {video.duration}
            </div>
          </div>
          
          <div className="p-6">
            <h4 className="text-lg font-medium text-white mb-4 line-clamp-2 leading-snug group-hover:text-primary transition-colors">
              {video.title}
            </h4>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white text-sm font-medium transition-colors"
            >
              YouTube-та қарау
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}
