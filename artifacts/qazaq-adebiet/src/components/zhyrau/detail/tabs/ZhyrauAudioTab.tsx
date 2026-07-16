import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';

function AudioPlayer({ title, url, duration }: { title: string; url: string; duration: string }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); } else { audio.play(); }
    setPlaying(!playing);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    setProgress((audio.currentTime / audio.duration) * 100);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !audio.duration) return;
    const val = Number(e.target.value);
    audio.currentTime = (val / 100) * audio.duration;
    setProgress(val);
  };

  const handleSpeed = (s: number) => {
    setSpeed(s);
    if (audioRef.current) audioRef.current.playbackRate = s;
  };

  return (
    <div className="glass-card p-5 rounded-xl flex flex-col gap-4">
      <audio ref={audioRef} src={url} onTimeUpdate={handleTimeUpdate} onEnded={() => setPlaying(false)} />
      <div className="flex items-center gap-4">
        <button onClick={toggle} className="w-11 h-11 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center text-white shadow-lg shrink-0">
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate mb-1">{title}</p>
          <p className="text-white/50 text-xs">{duration}</p>
        </div>
      </div>
      <input type="range" min={0} max={100} value={progress} onChange={handleSeek} className="w-full accent-primary h-1 cursor-pointer" />
      <div className="flex items-center gap-2">
        <span className="text-white/50 text-xs">Жылдамдық:</span>
        {[0.5, 1, 1.5, 2].map(s => (
          <button
            key={s}
            onClick={() => handleSpeed(s)}
            className={`px-2 py-0.5 rounded text-xs transition-colors border ${speed === s ? 'bg-primary text-white border-primary' : 'bg-white/5 text-white/60 border-white/10 hover:bg-white/10'}`}
          >
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}

export default function ZhyrauAudioTab({ zhyrau }: { zhyrau: Zhyrau }) {
  if (!zhyrau.audio || zhyrau.audio.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">Аудио жазбалар жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {zhyrau.audio.map(a => <AudioPlayer key={a.id} title={a.title} url={a.url} duration={a.duration} />)}
    </div>
  );
}
