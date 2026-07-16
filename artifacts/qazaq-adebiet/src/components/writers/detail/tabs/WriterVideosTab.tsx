import React from 'react';
import { Play } from 'lucide-react';
import type { Writer } from '@/types/writer';

export default function WriterVideosTab({ writer }: { writer: Writer }) {
  if (!writer.videos || writer.videos.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Бейнематериалдар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {writer.videos.map((video) => (
        <div key={video.id} className="glass-card rounded-xl overflow-hidden border border-white/10 group">
          <div className="relative aspect-video bg-black/40">
            {video.thumbnail ? (
              <img src={video.thumbnail} alt={video.title} className="w-full h-full object-cover opacity-70 group-hover:opacity-100 transition-opacity" />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-white/5">
                <Play className="w-12 h-12 text-white/20" />
              </div>
            )}
            <div className="absolute inset-0 flex items-center justify-center">
              <button className="w-16 h-16 rounded-full bg-primary/80 text-white flex items-center justify-center pl-1 group-hover:bg-primary transition-colors shadow-lg group-hover:scale-110">
                <Play className="w-6 h-6" />
              </button>
            </div>
            <div className="absolute bottom-2 right-2 bg-black/80 px-2 py-1 rounded text-xs text-white">
              {video.duration}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-white font-medium line-clamp-2">{video.title}</h3>
            <a 
              href={video.url} 
              target="_blank" 
              rel="noreferrer"
              className="inline-block mt-3 text-sm text-primary hover:text-primary/80 transition-colors"
            >
              Қарау →
            </a>
          </div>
        </div>
      ))}
    </div>
  );
}