import { useState, useRef, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Repeat1, Shuffle, Clock, ChevronUp, ChevronDown,
  Headphones, Bookmark, BookmarkCheck,
} from 'lucide-react';
import type { Book, DrBookmark } from '@/types/book';

interface Props {
  book: Book;
  savedTime: number;
  onTimeUpdate: (t: number) => void;
  onAddBookmark: (bm: Omit<DrBookmark, 'id' | 'createdAt'>) => void;
  isBookmarked: (type: DrBookmark['type'], value: number) => boolean;
}

const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
const SLEEP_TIMERS = [15, 30, 45, 60]; // minutes

function fmtTime(s: number) {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const m = Math.floor(s / 60), sec = Math.floor(s % 60);
  return `${m}:${sec.toString().padStart(2, '0')}`;
}

export default function AudioPlayerTab({ book, savedTime, onTimeUpdate, onAddBookmark, isBookmarked }: Props) {
  const audioRef     = useRef<HTMLAudioElement>(null);
  const [playing,  setPlaying]  = useState(false);
  const [currentT, setCurrentT] = useState(savedTime);
  const [duration, setDuration] = useState(0);
  const [volume,   setVolume]   = useState(1);
  const [muted,    setMuted]    = useState(false);
  const [speed,    setSpeed]    = useState(1);
  const [repeat,   setRepeat]   = useState<'none' | 'one' | 'all'>('none');
  const [shuffle,  setShuffle]  = useState(false);
  const [sleepTimer, setSleepTimer] = useState<number | null>(null); // seconds remaining
  const [sleepActive, setSleepActive] = useState(false);
  const [showSleep, setShowSleep] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const sleepIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const noAudio = !book.audio;

  // Sync volume/speed to audio element
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = muted ? 0 : volume;
    a.playbackRate = speed;
  }, [volume, muted, speed]);

  // Restore saved time
  useEffect(() => {
    const a = audioRef.current;
    if (!a || !savedTime) return;
    a.currentTime = savedTime;
    setCurrentT(savedTime);
  }, []); // eslint-disable-line

  // Sleep timer countdown
  useEffect(() => {
    if (!sleepActive || sleepTimer === null) return;
    sleepIntervalRef.current = setInterval(() => {
      setSleepTimer(t => {
        if (t === null || t <= 1) {
          clearInterval(sleepIntervalRef.current!);
          setPlaying(false);
          audioRef.current?.pause();
          setSleepActive(false);
          return null;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(sleepIntervalRef.current!);
  }, [sleepActive]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else         { a.play().catch(() => {}); setPlaying(true); }
  };

  const seek = (val: number) => {
    const a = audioRef.current;
    if (!a) return;
    a.currentTime = val;
    setCurrentT(val);
  };

  const skip = (delta: number) => seek(Math.max(0, Math.min(duration, currentT + delta)));

  const onTimeUpdateHandler = () => {
    const t = audioRef.current?.currentTime ?? 0;
    setCurrentT(t);
    onTimeUpdate(t);
  };

  const startSleep = (min: number) => {
    setSleepTimer(min * 60);
    setSleepActive(true);
    setShowSleep(false);
  };

  const cancelSleep = () => {
    clearInterval(sleepIntervalRef.current!);
    setSleepActive(false);
    setSleepTimer(null);
  };

  const bookmarkHere = () => {
    const t = Math.round(currentT);
    if (isBookmarked('audio', t)) return;
    onAddBookmark({ type: 'audio', label: `${fmtTime(t)} · ${book.title}`, value: t });
  };

  const progress = duration > 0 ? (currentT / duration) * 100 : 0;

  // No audio fallback
  if (noAudio) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
          <Headphones size={36} className="text-indigo-400" />
        </div>
        <h3 className="text-white font-semibold text-xl mb-2">Аудиокітап жоқ</h3>
        <p className="text-gray-400 text-sm">
          Бұл шығарманың аудио нұсқасы әлі қосылмаған.
        </p>
        <p className="text-gray-600 text-xs mt-3 font-mono">
          books.json ішіне <span className="text-gray-400">«audio»</span> өрісін қосыңыз
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <audio
        ref={audioRef}
        src={`/audio/${book.audio}`}
        onTimeUpdate={onTimeUpdateHandler}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); if (repeat === 'one') { seek(0); togglePlay(); } }}
      />

      {/* Album art */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="relative mb-8">
        <div className={`w-56 h-56 mx-auto rounded-3xl bg-gradient-to-br ${book.cover} shadow-2xl flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <Headphones size={52} className="text-white/30 relative" />
          {playing && (
            <motion.div
              className="absolute inset-0 rounded-3xl border-2 border-white/20"
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            />
          )}
        </div>
        <div className="text-center mt-5">
          <h2 className="text-white font-bold text-xl">{book.title}</h2>
          <p className="text-gray-400">{book.author}</p>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-6">
        <input
          type="range" min={0} max={duration || 0} value={currentT} step={1}
          onChange={e => seek(Number(e.target.value))}
          className="w-full h-1.5 rounded-full accent-violet-500 cursor-pointer mb-2"
          style={{ background: `linear-gradient(to right, #8b5cf6 ${progress}%, #374151 ${progress}%)` }}
        />
        <div className="flex justify-between text-gray-500 text-xs">
          <span>{fmtTime(currentT)}</span>
          <span>{fmtTime(duration)}</span>
        </div>
      </div>

      {/* Main controls */}
      <div className="flex items-center justify-center gap-4 mb-6">
        <button onClick={() => setShuffle(v => !v)}
          className={`p-2.5 rounded-xl transition-colors ${shuffle ? 'text-violet-400 bg-violet-500/10' : 'text-gray-500 hover:text-white'}`}>
          <Shuffle size={18} />
        </button>

        <button onClick={() => skip(-10)}
          className="p-3 rounded-2xl text-gray-300 hover:text-white hover:bg-white/8 transition-colors">
          <SkipBack size={22} />
        </button>

        <button onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-violet-500 hover:bg-violet-400 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 transition-all active:scale-95">
          {playing ? <Pause size={26} /> : <Play size={26} className="translate-x-0.5" />}
        </button>

        <button onClick={() => skip(10)}
          className="p-3 rounded-2xl text-gray-300 hover:text-white hover:bg-white/8 transition-colors">
          <SkipForward size={22} />
        </button>

        <button onClick={() => setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none')}
          className={`p-2.5 rounded-xl transition-colors ${repeat !== 'none' ? 'text-violet-400 bg-violet-500/10' : 'text-gray-500 hover:text-white'}`}>
          {repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
        </button>
      </div>

      {/* Secondary controls */}
      <div className="flex items-center justify-between">
        {/* Volume */}
        <div className="flex items-center gap-2 flex-1">
          <button onClick={() => setMuted(v => !v)} className="text-gray-400 hover:text-white transition-colors">
            {muted || volume === 0 ? <VolumeX size={17} /> : <Volume2 size={17} />}
          </button>
          <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={e => { setVolume(Number(e.target.value)); setMuted(false); }}
            className="w-20 accent-violet-500 cursor-pointer" />
        </div>

        {/* Speed */}
        <div className="relative">
          <button onClick={() => setShowSpeed(v => !v)}
            className="px-3 py-1.5 rounded-xl bg-white/8 border border-white/10 text-white text-sm font-semibold hover:bg-white/12 transition-colors">
            {speed}×
          </button>
          {showSpeed && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 rounded-2xl p-2 flex flex-col gap-1 z-10 min-w-[80px]">
              {SPEEDS.map(s => (
                <button key={s} onClick={() => { setSpeed(s); setShowSpeed(false); }}
                  className={`px-3 py-1.5 rounded-xl text-sm transition-colors ${speed === s ? 'bg-violet-500/20 text-violet-300' : 'text-gray-300 hover:bg-white/8'}`}>
                  {s}×
                </button>
              ))}
            </motion.div>
          )}
        </div>

        {/* Bookmark */}
        <button onClick={bookmarkHere} className={`p-2 transition-colors ${isBookmarked('audio', Math.round(currentT)) ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
          {isBookmarked('audio', Math.round(currentT)) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
        </button>

        {/* Sleep timer */}
        <div className="relative">
          <button onClick={() => sleepActive ? cancelSleep() : setShowSleep(v => !v)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs transition-colors ${
              sleepActive ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' : 'border-white/10 text-gray-400 hover:text-white'
            }`}>
            <Clock size={13} />
            {sleepActive && sleepTimer !== null ? fmtTime(sleepTimer) : 'Ұйқы'}
          </button>
          {showSleep && !sleepActive && (
            <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className="absolute bottom-10 right-0 bg-gray-900 border border-white/10 rounded-2xl p-2 flex flex-col gap-1 z-10">
              {SLEEP_TIMERS.map(m => (
                <button key={m} onClick={() => startSleep(m)}
                  className="px-3 py-1.5 rounded-xl text-sm text-gray-300 hover:bg-white/8 whitespace-nowrap transition-colors">
                  {m} мин
                </button>
              ))}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
