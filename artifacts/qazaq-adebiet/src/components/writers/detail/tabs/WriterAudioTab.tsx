import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Pause, SkipBack, SkipForward, Volume2, Headphones, Timer, Bookmark, BookmarkCheck, Repeat } from 'lucide-react';
import type { Writer } from '@/types/writer';

interface Props { writer: Writer }

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SLEEP_OPTIONS = [
  { label: 'Өшірулі', value: 0 },
  { label: '5 мин',   value: 5 },
  { label: '10 мин',  value: 10 },
  { label: '15 мин',  value: 15 },
  { label: '30 мин',  value: 30 },
  { label: '60 мин',  value: 60 },
];

function WaveAnimation({ playing }: { playing: boolean }) {
  return (
    <div className="flex items-end gap-0.5 h-8">
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-violet-400"
          animate={playing
            ? { height: ['6px', `${8 + Math.random() * 24}px`, '6px'] }
            : { height: '4px' }
          }
          transition={{
            duration: 0.4 + Math.random() * 0.4,
            repeat: Infinity,
            delay: i * 0.04,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  );
}

function formatTime(s: number) {
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function WriterAudioTab({ writer }: Props) {
  const audioList = writer.audio ?? [];
  const [activeIdx, setActiveIdx] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [speedIdx, setSpeedIdx] = useState(2); // 1.0x
  const [sleepMin, setSleepMin] = useState(0);
  const [sleepRemaining, setSleepRemaining] = useState(0);
  const [bookmarked, setBookmarked] = useState<Set<number>>(new Set());
  const [volume, setVolume] = useState(1);
  const audioRef = useRef<HTMLAudioElement>(null);
  const sleepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sleep timer countdown
  useEffect(() => {
    if (sleepMin > 0) {
      setSleepRemaining(sleepMin * 60);
      sleepRef.current = setInterval(() => {
        setSleepRemaining((prev) => {
          if (prev <= 1) {
            setPlaying(false);
            audioRef.current?.pause();
            clearInterval(sleepRef.current!);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (sleepRef.current) clearInterval(sleepRef.current);
      setSleepRemaining(0);
    }
    return () => { if (sleepRef.current) clearInterval(sleepRef.current); };
  }, [sleepMin]);

  // Audio element events
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const handleTime = () => setCurrentTime(audio.currentTime);
    const handleMeta = () => setDuration(audio.duration || 0);
    const handleEnd = () => {
      setPlaying(false);
      if (activeIdx < audioList.length - 1) {
        setActiveIdx((i) => i + 1);
      }
    };
    audio.addEventListener('timeupdate', handleTime);
    audio.addEventListener('loadedmetadata', handleMeta);
    audio.addEventListener('ended', handleEnd);
    return () => {
      audio.removeEventListener('timeupdate', handleTime);
      audio.removeEventListener('loadedmetadata', handleMeta);
      audio.removeEventListener('ended', handleEnd);
    };
  }, [activeIdx, audioList.length]);

  // Playback rate
  useEffect(() => {
    if (audioRef.current) audioRef.current.playbackRate = SPEEDS[speedIdx];
  }, [speedIdx]);

  // Volume
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing) { audio.pause(); setPlaying(false); }
    else { audio.play().catch(() => {}); setPlaying(true); }
  }, [playing]);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    setCurrentTime(t);
    if (audioRef.current) audioRef.current.currentTime = t;
  }, []);

  const toggleBookmark = useCallback((id: number) => {
    setBookmarked((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }, []);

  const activeAudio = audioList[activeIdx];
  const activeHasUrl = !!(activeAudio?.url);

  if (audioList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Headphones size={40} className="text-white/15 mb-4" />
        <p className="text-white/30">Аудиокітаптар толықтырылуда</p>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-white text-xl font-bold mb-6">Аудиокітаптар</h2>

      {/* ── Player ───────────────────────────────────────────────────────────── */}
      {activeAudio && (
        <div className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-slate-900 to-slate-950 p-6 mb-8 shadow-[0_0_40px_rgba(139,92,246,0.15)]">
          {/* Real audio element — only when URL present */}
          {activeHasUrl && (
            <audio ref={audioRef} src={activeAudio.url} preload="metadata" />
          )}

          {/* No-URL notice */}
          {!activeHasUrl && (
            <div className="mb-4 flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500/10 border border-amber-500/25 text-amber-300 text-sm">
              <Headphones size={15} className="shrink-0" />
              Аудио файл уақытша қолжетімсіз — жақын арада қосылады
            </div>
          )}

          {/* Wave + title */}
          <div className="flex items-center gap-5 mb-5">
            <div className="w-16 h-16 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center flex-shrink-0">
              <Headphones size={24} className="text-violet-300" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-bold text-base truncate">{activeAudio.title}</h3>
              {activeAudio.narrator && <p className="text-white/45 text-sm">Дауыс: {activeAudio.narrator}</p>}
              <p className="text-white/30 text-xs">{activeAudio.duration}</p>
            </div>
            <WaveAnimation playing={playing && activeHasUrl} />
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <input
              type="range"
              min={0}
              max={duration || 100}
              value={currentTime}
              onChange={activeHasUrl ? seek : undefined}
              disabled={!activeHasUrl}
              className="w-full h-1.5 accent-violet-500 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            />
            <div className="flex justify-between text-xs text-white/30 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{duration ? formatTime(duration) : activeAudio.duration}</span>
            </div>
          </div>

          {/* Controls */}
          <div className="flex items-center justify-center gap-4 mb-5">
            <button
              onClick={() => { if (activeIdx > 0) { setActiveIdx(i => i - 1); setPlaying(false); } }}
              disabled={activeIdx === 0}
              className="p-2 rounded-xl hover:bg-white/8 text-white/45 hover:text-white disabled:opacity-25 transition-all"
            >
              <SkipBack size={20} />
            </button>

            <motion.button
              whileHover={{ scale: activeHasUrl ? 1.05 : 1 }}
              whileTap={{ scale: activeHasUrl ? 0.95 : 1 }}
              onClick={activeHasUrl ? togglePlay : undefined}
              title={activeHasUrl ? undefined : 'Аудио файл жоқ'}
              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${
                activeHasUrl
                  ? 'bg-gradient-to-br from-violet-600 to-blue-600 shadow-[0_0_24px_rgba(139,92,246,0.45)] hover:shadow-[0_0_32px_rgba(139,92,246,0.6)] cursor-pointer'
                  : 'bg-white/10 cursor-not-allowed opacity-50'
              }`}
            >
              {playing ? <Pause size={22} className="text-white" /> : <Play size={22} className="text-white ml-0.5" />}
            </motion.button>

            <button
              onClick={() => { if (activeIdx < audioList.length - 1) { setActiveIdx(i => i + 1); setPlaying(false); } }}
              disabled={activeIdx === audioList.length - 1}
              className="p-2 rounded-xl hover:bg-white/8 text-white/45 hover:text-white disabled:opacity-25 transition-all"
            >
              <SkipForward size={20} />
            </button>
          </div>

          {/* Settings row */}
          <div className="flex flex-wrap items-center justify-center gap-3">
            {/* Speed */}
            <div className="flex items-center gap-1 bg-white/5 rounded-xl px-1 border border-white/8">
              <Repeat size={13} className="text-white/35 ml-2" />
              {SPEEDS.map((s, i) => (
                <button
                  key={s}
                  onClick={() => setSpeedIdx(i)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all ${speedIdx === i ? 'bg-violet-600 text-white' : 'text-white/40 hover:text-white'}`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {/* Sleep timer */}
            <div className="relative flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/8">
              <Timer size={13} className={sleepRemaining > 0 ? 'text-amber-400' : 'text-white/35'} />
              <select
                value={sleepMin}
                onChange={(e) => setSleepMin(+e.target.value)}
                className="bg-transparent text-white/60 text-xs outline-none cursor-pointer"
              >
                {SLEEP_OPTIONS.map((o) => <option key={o.value} value={o.value} className="bg-slate-900">{o.label}</option>)}
              </select>
              {sleepRemaining > 0 && (
                <span className="text-amber-300 text-xs font-mono">{formatTime(sleepRemaining)}</span>
              )}
            </div>

            {/* Volume */}
            <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2 border border-white/8">
              <Volume2 size={13} className="text-white/35" />
              <input
                type="range" min={0} max={1} step={0.05} value={volume}
                onChange={(e) => setVolume(+e.target.value)}
                className="w-16 h-1 accent-violet-500 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* ── Track list ─────────────────────────────────────────────────────── */}
      <div className="space-y-2">
        {audioList.map((audio, i) => {
          const isActive = i === activeIdx;
          const isBookmarked = bookmarked.has(audio.id);
          return (
            <motion.div
              key={audio.id}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-4 p-4 rounded-2xl border transition-all cursor-pointer ${
                isActive ? 'border-violet-500/40 bg-violet-500/10' : 'border-white/8 bg-white/4 hover:bg-white/6 hover:border-white/12'
              }`}
              onClick={() => { setActiveIdx(i); setPlaying(false); setCurrentTime(0); }}
            >
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${isActive ? 'bg-violet-600' : 'bg-white/8'}`}>
                {isActive && playing
                  ? <Pause size={16} className="text-white" />
                  : <Play size={16} className={isActive ? 'text-white ml-0.5' : 'text-white/40 ml-0.5'} />
                }
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium truncate ${isActive ? 'text-white' : 'text-white/75'}`}>{audio.title}</p>
                {audio.narrator && <p className="text-white/30 text-xs">{audio.narrator}</p>}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-xs whitespace-nowrap">{audio.duration}</span>
                <button
                  onClick={(e) => { e.stopPropagation(); toggleBookmark(audio.id); }}
                  className={`p-1.5 rounded-lg transition-all ${isBookmarked ? 'text-amber-400' : 'text-white/25 hover:text-amber-400'}`}
                >
                  {isBookmarked ? <BookmarkCheck size={14} /> : <Bookmark size={14} />}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
