import React, { useState, useRef } from 'react';
import { Play, Pause, Headphones, Music2 } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';

function AudioPlayer({
  title,
  url,
  duration,
}: {
  title: string;
  url: string;
  duration: string;
}) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) {
      audio.pause();
    } else {
      audio.play().catch(() => {});
    }
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
      <audio
        ref={audioRef}
        src={url}
        onTimeUpdate={handleTimeUpdate}
        onEnded={() => { setPlaying(false); setProgress(0); }}
      />
      <div className="flex items-center gap-4">
        <button
          onClick={toggle}
          className="w-11 h-11 rounded-full bg-primary/80 hover:bg-primary flex items-center justify-center text-white shadow-lg shrink-0 transition-colors"
        >
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate mb-1">{title}</p>
          <p className="text-white/50 text-xs">{duration}</p>
        </div>
        <Music2 className="w-4 h-4 text-white/20 shrink-0" />
      </div>

      {/* Progress bar */}
      <div className="space-y-1">
        <input
          type="range"
          min={0}
          max={100}
          value={progress}
          onChange={handleSeek}
          className="w-full accent-primary h-1.5 cursor-pointer rounded-full"
        />
        <div className="flex justify-between text-xs text-white/30">
          <span>{Math.round(progress)}%</span>
          <span>{duration}</span>
        </div>
      </div>

      {/* Speed */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/40 text-xs">Жылдамдық:</span>
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map((s) => (
          <button
            key={s}
            onClick={() => handleSpeed(s)}
            className={`px-2 py-0.5 rounded text-xs transition-colors border ${
              speed === s
                ? 'bg-primary text-white border-primary'
                : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10 hover:text-white'
            }`}
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
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-8 border border-white/5">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-emerald-500/15 to-teal-600/10 border border-emerald-500/20 flex items-center justify-center mb-5">
              <Headphones className="w-9 h-9 text-emerald-400/60" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">Аудио жазбалар жоқ</h3>
            <p className="text-white/50 text-sm max-w-sm">
              {zhyrau.fullName} жырауының толғаулары мен жырларының аудио жазбалары жақын арада қосылады.
            </p>
          </div>
        </div>

        {/* Placeholder audio players */}
        <div className="flex flex-col gap-4">
          {[
            { title: `${zhyrau.fullName} — Толғау #1`, dur: '—:——' },
            { title: `${zhyrau.fullName} — Толғау #2`, dur: '—:——' },
            { title: `${zhyrau.fullName} — Жыр үзіндісі`, dur: '—:——' },
          ].map((item, i) => (
            <div key={i} className="glass-card p-5 rounded-xl flex flex-col gap-4 opacity-35 pointer-events-none">
              <div className="flex items-center gap-4">
                <div className="w-11 h-11 rounded-full bg-white/10 flex items-center justify-center shrink-0">
                  <Play className="w-5 h-5 text-white/30 ml-0.5" />
                </div>
                <div className="flex-1">
                  <p className="text-white/60 font-medium text-sm">{item.title}</p>
                  <p className="text-white/30 text-xs mt-0.5">Жақын арада қосылады</p>
                </div>
              </div>
              <div className="h-1.5 bg-white/10 rounded-full" />
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-xs">Жылдамдық:</span>
                {[0.5, 1, 1.5, 2].map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded text-xs bg-white/5 text-white/20 border border-white/5">
                    {s}x
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {zhyrau.audio.map((a) => (
        <AudioPlayer key={a.id} title={a.title} url={a.url} duration={a.duration} />
      ))}
    </div>
  );
}
