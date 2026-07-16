import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Headphones, Play, Pause, Clock } from 'lucide-react';
import type { Educator } from '@/types/educator';

function AudioRow({ audio, index }: { audio: Educator['audio'][number]; index: number }) {
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = () => {
    if (!audio.url) return;
    if (!audioRef.current) {
      audioRef.current = new Audio(audio.url);
      audioRef.current.onended = () => setPlaying(false);
    }
    if (playing) {
      audioRef.current.pause();
      setPlaying(false);
    } else {
      audioRef.current.play().catch(() => {});
      setPlaying(true);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -12 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.05 }}
      className="flex items-center gap-4 glass-panel rounded-xl px-5 py-4 border border-white/6 hover:border-violet-500/20 transition-colors"
    >
      <button
        onClick={toggle}
        disabled={!audio.url}
        className={`shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
          audio.url
            ? 'bg-violet-500/20 hover:bg-violet-500/35 border border-violet-500/35 text-violet-300'
            : 'bg-white/5 border border-white/10 text-white/20 cursor-not-allowed'
        }`}
        title={audio.url ? undefined : 'Аудио файл жоқ'}
      >
        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
      </button>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{audio.title}</p>
        {!audio.url && <p className="text-white/30 text-xs">Файл қолжетімді емес</p>}
      </div>
      <div className="flex items-center gap-1 text-white/35 text-xs shrink-0">
        <Clock className="w-3 h-3" />
        {audio.duration}
      </div>
    </motion.div>
  );
}

export default function EducatorAudioTab({ educator: e }: { educator: Educator }) {
  if (!e.audio?.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Headphones className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40 mb-2">Аудио материалдар жоқ</p>
        <p className="text-white/25 text-sm">Жақын арада қосылады</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {e.audio.map((a, i) => (
        <AudioRow key={a.id} audio={a} index={i} />
      ))}
    </div>
  );
}
