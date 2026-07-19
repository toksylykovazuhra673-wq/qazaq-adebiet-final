import React, { useState, useRef } from 'react';
import { Play, Pause, Headphones, Music2 } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';
import TeacherLinkSection from '@/components/bi/detail/TeacherLinkSection';

function AudioPlayer({ title, url, duration }: { title: string; url: string; duration: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const ref = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const a = ref.current; if (!a) return;
    if (playing) { a.pause(); } else { a.play().catch(() => {}); }
    setPlaying(!playing);
  };
  const onTime = () => { const a = ref.current; if (!a || !a.duration) return; setProgress((a.currentTime / a.duration) * 100); };
  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => { const a = ref.current; if (!a || !a.duration) return; const v = +e.target.value; a.currentTime = (v / 100) * a.duration; setProgress(v); };
  const onSpeed = (s: number) => { setSpeed(s); if (ref.current) ref.current.playbackRate = s; };

  return (
    <div className="glass-card p-5 rounded-xl flex flex-col gap-4">
      <audio ref={ref} src={url} onTimeUpdate={onTime} onEnded={() => { setPlaying(false); setProgress(0); }} />
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="w-11 h-11 rounded-full bg-teal-500/70 hover:bg-teal-500 flex items-center justify-center text-white shadow-lg shrink-0 transition-colors">
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate mb-1">{title}</p>
          <p className="text-white/50 text-xs">{duration}</p>
        </div>
        <Music2 className="w-4 h-4 text-white/20 shrink-0" />
      </div>
      <input type="range" min={0} max={100} value={progress} onChange={onSeek} className="w-full accent-teal-500 h-1.5 cursor-pointer rounded-full" />
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/40 text-xs">Жылдамдық:</span>
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
          <button key={s} onClick={() => onSpeed(s)} className={`px-2 py-0.5 rounded text-xs border ${speed === s ? 'bg-teal-500 text-white border-teal-500' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'}`}>{s}x</button>
        ))}
      </div>
    </div>
  );
}

export default function BiAudioTab({ bi }: { bi: BiSheshen }) {
  if (!bi.audio || bi.audio.length === 0) {
    return (
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-8 border border-white/5">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mb-5">
              <Headphones className="w-9 h-9 text-emerald-400/50" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Аудио жазбалар жоқ</h3>
            <p className="text-white/50 text-sm max-w-sm">{bi.fullName} шешендік сөздерінің аудио жазбалары жақын арада қосылады.</p>
          </div>
        </div>
        <TeacherLinkSection biSlug={bi.slug} category="audio" />
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-4">
      {bi.audio.map(a => <AudioPlayer key={a.id} title={a.title} url={a.url} duration={a.duration} />)}
      <TeacherLinkSection biSlug={bi.slug} category="audio" />
    </div>
  );
}
