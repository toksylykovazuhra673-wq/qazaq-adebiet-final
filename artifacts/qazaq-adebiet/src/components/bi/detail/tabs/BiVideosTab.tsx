import React from 'react';
import { Play, Video, Youtube } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';
import TeacherLinkSection from '@/components/bi/detail/TeacherLinkSection';

export default function BiVideosTab({ bi }: { bi: BiSheshen }) {
  const ytSearch = `https://www.youtube.com/results?search_query=${encodeURIComponent(bi.fullName + ' би шешен')}`;

  if (!bi.videos || bi.videos.length === 0) {
    return (
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-8 border border-white/5">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center justify-center mb-5">
              <Video className="w-9 h-9 text-red-400/50" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Бейнематериалдар жоқ</h3>
            <p className="text-white/50 text-sm max-w-sm mb-6">{bi.fullName} тұлғасына арналған дәрістер мен деректі фильмдер жақын арада қосылады.</p>
            <a href={ytSearch} target="_blank" rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-red-400 hover:text-red-300 text-sm font-medium transition-colors">
              <Youtube className="w-4 h-4" /> YouTube-тан іздеу
            </a>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[`${bi.fullName} туралы деректі фильм`, `${bi.fullName} шешендік сөздері — дәріс`, `${bi.era} билері мен шешендері`].map((title, i) => (
            <div key={i} className="glass-card rounded-xl overflow-hidden opacity-40">
              <div className="aspect-video bg-gradient-to-br from-white/5 to-white/2 flex items-center justify-center relative">
                <div className="absolute inset-0 opacity-20" style={{ background: `linear-gradient(135deg, hsl(${175+i*20},60%,20%) 0%, hsl(${40+i*20},50%,15%) 100%)` }} />
                <div className="relative w-12 h-12 rounded-full bg-white/10 flex items-center justify-center"><Play className="w-5 h-5 text-white/50 ml-0.5" /></div>
              </div>
              <div className="p-4"><p className="text-white/50 text-sm font-medium line-clamp-2">{title}</p><p className="text-white/25 text-xs mt-1">Жақын арада...</p></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {bi.videos.map(v => (
          <div key={v.id} className="glass-card rounded-xl overflow-hidden group">
            <a href={v.url} target="_blank" rel="noopener noreferrer">
              <div className="relative aspect-video bg-white/5 flex items-center justify-center cursor-pointer">
                {v.thumbnail ? <img src={v.thumbnail} alt={v.title} className="w-full h-full object-cover" /> : <div className="w-full h-full bg-gradient-to-br from-teal-500/20 to-amber-500/10" />}
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 group-hover:bg-black/10 transition-colors">
                  <div className="w-14 h-14 rounded-full bg-red-600/80 flex items-center justify-center shadow-lg"><Play className="w-6 h-6 text-white ml-1" /></div>
                </div>
              </div>
              <div className="p-4"><h3 className="text-white font-semibold mb-1">{v.title}</h3><p className="text-white/50 text-sm">{v.duration}</p></div>
            </a>
          </div>
        ))}
      </div>
      <TeacherLinkSection biSlug={bi.slug} category="video" />
    </div>
  );
}
