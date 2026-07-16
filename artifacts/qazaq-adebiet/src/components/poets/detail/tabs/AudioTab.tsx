import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Music, Volume2, FastForward } from 'lucide-react';
import type { Poet, PoetAudio } from '@/types/poet';

function AudioPlayer({ audio, isActive, onPlay }: { audio: PoetAudio, isActive: boolean, onPlay: () => void }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);

  // Parse duration string like "3:45" to seconds for fallback
  const fallbackDuration = audio.duration.split(':').reduce((acc, time) => (60 * acc) + +time, 0);

  useEffect(() => {
    if (!isActive && isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    }
  }, [isActive, isPlaying]);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.playbackRate = playbackRate;
    }
  }, [playbackRate]);

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current?.pause();
      setIsPlaying(false);
    } else {
      onPlay(); // notifies parent this is the active one
      // If we don't have a real URL, just fake it for UI demo
      if (!audio.url) {
        setIsPlaying(true);
        if (!duration) setDuration(fallbackDuration);
        return;
      }
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setProgress(audioRef.current.currentTime);
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const time = Number(e.target.value);
    if (audioRef.current && audio.url) {
      audioRef.current.currentTime = time;
    }
    setProgress(time);
  };

  const formatTime = (time: number) => {
    if (isNaN(time)) return "0:00";
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Fake progress interval for demo when no URL is provided
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !audio.url) {
      interval = setInterval(() => {
        setProgress(p => {
          if (p >= fallbackDuration) {
            setIsPlaying(false);
            return 0;
          }
          return p + 1;
        });
      }, 1000 / playbackRate);
    }
    return () => clearInterval(interval);
  }, [isPlaying, audio.url, fallbackDuration, playbackRate]);

  const speeds = [0.75, 1, 1.25, 1.5, 2];

  return (
    <div className={`glass-card rounded-2xl p-5 transition-all ${isActive ? 'border-primary/50 bg-primary/5' : ''}`}>
      <div className="flex items-center gap-4">
        {audio.url && (
          <audio 
            ref={audioRef} 
            src={audio.url} 
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            onLoadedMetadata={() => setDuration(audioRef.current?.duration || 0)}
          />
        )}
        
        <button 
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center shrink-0 transition-colors ${
            isPlaying ? 'bg-primary text-white' : 'bg-white/10 text-white hover:bg-primary hover:text-white'
          }`}
        >
          {isPlaying ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-1" />}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-medium text-white truncate text-base">{audio.title}</h4>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => {
                  const currentIndex = speeds.indexOf(playbackRate);
                  setPlaybackRate(speeds[(currentIndex + 1) % speeds.length]);
                }}
                className="px-2 py-0.5 rounded bg-white/5 hover:bg-white/10 text-[10px] text-white/70 font-mono transition-colors"
                title="Жылдамдық"
              >
                {playbackRate}x
              </button>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-white/50 font-mono w-10 text-right">{formatTime(progress)}</span>
            <div className="flex-1 relative flex items-center">
              <input 
                type="range" 
                min="0" 
                max={duration || fallbackDuration || 100} 
                value={progress}
                onChange={handleSeek}
                className="w-full h-1.5 bg-white/10 rounded-full appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-primary [&::-webkit-slider-thumb]:rounded-full cursor-pointer relative z-10"
              />
              <div 
                className="absolute left-0 h-1.5 bg-primary rounded-full pointer-events-none" 
                style={{ width: `${(progress / (duration || fallbackDuration || 100)) * 100}%` }}
              />
            </div>
            <span className="text-xs text-white/50 font-mono w-10">{audio.duration}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AudioTab({ poet }: { poet: Poet }) {
  const [activeAudioId, setActiveAudioId] = useState<number | null>(null);

  if (!poet.audio || poet.audio.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <Music className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-2xl font-serif text-white mb-3">Аудиокітаптар</h3>
        <p className="text-white/60">Бұл бөлімде әзірге аудио материалдар жоқ.</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-4">
      {poet.audio.map((item) => (
        <AudioPlayer 
          key={item.id} 
          audio={item} 
          isActive={activeAudioId === item.id}
          onPlay={() => setActiveAudioId(item.id)}
        />
      ))}
    </div>
  );
}
