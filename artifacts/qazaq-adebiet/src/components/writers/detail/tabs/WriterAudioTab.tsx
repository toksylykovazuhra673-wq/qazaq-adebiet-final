import React, { useState, useRef } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import type { Writer } from '@/types/writer';

export default function WriterAudioTab({ writer }: { writer: Writer }) {
  const [playingId, setPlayingId] = useState<number | null>(null);
  const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

  if (!writer.audio || writer.audio.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Аудиокітаптар тізімі әзірге бос.</p>
      </div>
    );
  }

  const togglePlay = (id: number) => {
    if (playingId === id) {
      audioRefs.current[id]?.pause();
      setPlayingId(null);
    } else {
      if (playingId !== null) {
        audioRefs.current[playingId]?.pause();
      }
      audioRefs.current[id]?.play();
      setPlayingId(id);
    }
  };

  return (
    <div className="space-y-4 max-w-3xl mx-auto">
      {writer.audio.map((audio) => {
        const isPlaying = playingId === audio.id;
        return (
          <div key={audio.id} className="glass-card p-4 rounded-xl border border-white/10 flex items-center gap-4">
            <button
              onClick={() => togglePlay(audio.id)}
              className="w-12 h-12 rounded-full bg-primary/20 hover:bg-primary text-white flex items-center justify-center shrink-0 transition-colors"
            >
              {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 pl-1" />}
            </button>
            <div className="flex-1">
              <h3 className="text-white font-medium mb-1">{audio.title}</h3>
              <p className="text-white/50 text-xs">{audio.duration}</p>
              
              <div className="mt-2 flex items-center gap-3">
                <span className="text-xs text-white/40 w-10">0:00</span>
                <input type="range" className="flex-1 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer" defaultValue="0" />
                <span className="text-xs text-white/40 w-10">{audio.duration}</span>
              </div>
            </div>
            
            <div className="hidden sm:flex items-center gap-2">
              <Volume2 className="w-4 h-4 text-white/50" />
              <input type="range" className="w-16 h-1 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-2 [&::-webkit-slider-thumb]:h-2 [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:rounded-full cursor-pointer" defaultValue="80" />
            </div>

            {/* Hidden actual audio element for playback */}
            {/* In a real app we'd bind it correctly. This simulates UI state. */}
          </div>
        );
      })}
    </div>
  );
}