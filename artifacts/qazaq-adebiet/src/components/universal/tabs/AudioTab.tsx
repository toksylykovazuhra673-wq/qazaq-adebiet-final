import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Play, Pause, SkipBack, SkipForward } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_ACCENT } from '@/hooks/useUniversalAuthor';

interface Props { author: UniversalAuthor }

export default function AudioTab({ author }: Props) {
  const [playing, setPlaying] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const accent = CATEGORY_ACCENT[author.category];
  const items = author.audio ?? [];

  const toggle = (id: number, url?: string) => {
    if (!url) return;
    if (playing === id) {
      audioRef.current?.pause();
      setPlaying(null);
    } else {
      audioRef.current?.pause();
      const audio = new Audio(url);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => setPlaying(null);
      setPlaying(id);
    }
  };

  const typeLabel: Record<string, string> = {
    reading: 'Оқылым',
    music: 'Музыка',
    documentary: 'Деректі',
    lecture: 'Дәріс',
  };

  if (!items.length) return <EmptyState />;

  return (
    <div>
      <h2 className={`text-lg font-semibold ${accent} mb-6`}>Аудио материалдар ({items.length})</h2>
      <div className="space-y-3">
        {items.map((item, i) => {
          const isPlaying = playing === item.id;
          const hasUrl = !!item.url;
          return (
            <motion.div key={item.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              className={`flex items-center gap-4 bg-white/3 border rounded-xl p-4 transition-all ${isPlaying ? 'border-violet-500/40 bg-violet-500/5' : 'border-white/8 hover:bg-white/5'}`}>
              {/* Play button */}
              <button onClick={() => toggle(item.id, item.url)}
                disabled={!hasUrl}
                className={`w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${
                  hasUrl ? 'bg-violet-500 hover:bg-violet-400 cursor-pointer' : 'bg-gray-700 cursor-not-allowed opacity-40'
                }`}>
                {isPlaying ? <Pause size={16} className="text-white" fill="white" /> : <Play size={16} className="text-white" fill="white" />}
              </button>

              <div className="flex-1 min-w-0">
                <h3 className="text-white font-medium text-sm truncate">{item.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  {item.type && (
                    <span className="text-xs px-2 py-0.5 rounded-full bg-violet-500/10 text-violet-300 border border-violet-500/20">
                      {typeLabel[item.type] ?? item.type}
                    </span>
                  )}
                  {item.duration && <span className="text-gray-500 text-xs">{item.duration}</span>}
                </div>
                {item.description && <p className="text-gray-400 text-xs mt-1 truncate">{item.description}</p>}
              </div>

              {/* Animated bars when playing */}
              {isPlaying && (
                <div className="flex gap-0.5 items-end h-5 flex-shrink-0">
                  {[1, 2, 3, 4].map(b => (
                    <motion.div key={b}
                      animate={{ height: ['40%', '100%', '60%', '80%', '40%'] }}
                      transition={{ duration: 0.8, repeat: Infinity, delay: b * 0.15 }}
                      className="w-1 bg-violet-400 rounded-full" />
                  ))}
                </div>
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-16 text-gray-500">
      <Headphones size={40} className="mx-auto mb-3 opacity-30" />
      <p>Аудио деректері жоқ</p>
    </div>
  );
}
