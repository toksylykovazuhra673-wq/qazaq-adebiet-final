import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play, Pause, SkipBack, SkipForward, Volume2, VolumeX,
  Repeat, Repeat1, Shuffle, Clock, Headphones,
  Bookmark, BookmarkCheck, Download, ChevronUp, ChevronDown,
  ListMusic,
} from 'lucide-react';
import type { Book, DrBookmark } from '@/types/book';

interface Props {
  book: Book;
  savedTime: number;
  onTimeUpdate: (t: number) => void;
  onAddBookmark: (bm: Omit<DrBookmark, 'id' | 'createdAt'>) => void;
  isBookmarked: (type: DrBookmark['type'], value: number) => boolean;
}

const SPEEDS       = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2];
const SLEEP_TIMERS = [10, 15, 30, 45, 60];

function fmtTime(s: number) {
  if (!isFinite(s) || isNaN(s)) return '0:00';
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const sec = Math.floor(s % 60);
  if (h > 0) return `${h}:${m.toString().padStart(2,'0')}:${sec.toString().padStart(2,'0')}`;
  return `${m}:${sec.toString().padStart(2,'0')}`;
}

export default function AudioPlayerTab({ book, savedTime, onTimeUpdate, onAddBookmark, isBookmarked }: Props) {
  const audioRef      = useRef<HTMLAudioElement>(null);
  const [playing,   setPlaying]   = useState(false);
  const [currentT,  setCurrentT]  = useState(savedTime);
  const [duration,  setDuration]  = useState(0);
  const [volume,    setVolume]    = useState(1);
  const [muted,     setMuted]     = useState(false);
  const [speed,     setSpeed]     = useState(1);
  const [repeat,    setRepeat]    = useState<'none' | 'one' | 'all'>('none');
  const [shuffle,   setShuffle]   = useState(false);
  const [sleepSecs, setSleepSecs] = useState<number | null>(null);
  const [sleepOn,   setSleepOn]   = useState(false);
  const [showSleep, setShowSleep] = useState(false);
  const [showSpeed, setShowSpeed] = useState(false);
  const [showQueue, setShowQueue] = useState(false);
  const sleepRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Sync audio properties
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

  // Sleep timer
  useEffect(() => {
    if (!sleepOn || sleepSecs === null) return;
    sleepRef.current = setInterval(() => {
      setSleepSecs(t => {
        if (t === null || t <= 1) {
          clearInterval(sleepRef.current!);
          setPlaying(false);
          audioRef.current?.pause();
          setSleepOn(false);
          return null;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(sleepRef.current!);
  }, [sleepOn]);

  const togglePlay = () => {
    const a = audioRef.current;
    if (!a) return;
    if (playing) { a.pause(); setPlaying(false); }
    else { a.play().catch(() => {}); setPlaying(true); }
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
    setSleepSecs(min * 60);
    setSleepOn(true);
    setShowSleep(false);
  };

  const cancelSleep = () => {
    clearInterval(sleepRef.current!);
    setSleepOn(false);
    setSleepSecs(null);
  };

  const bookmarkHere = () => {
    const t = Math.round(currentT);
    if (isBookmarked('audio', t)) return;
    onAddBookmark({ type: 'audio', label: `${fmtTime(t)} · ${book.title}`, value: t });
  };

  const progress = duration > 0 ? (currentT / duration) * 100 : 0;
  const noAudio  = !book.audio;

  if (noAudio) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-20 h-20 rounded-3xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mx-auto mb-5">
          <Headphones size={36} className="text-indigo-400" />
        </div>
        <h3 className="text-white font-semibold text-xl mb-2">Аудиокітап жоқ</h3>
        <p className="text-gray-400 text-sm">Бұл шығарманың аудио нұсқасы әлі қосылмаған.</p>
        <p className="text-gray-600 text-xs mt-3 font-mono">
          books.json ішіне <span className="text-gray-400">«audio»</span> өрісін қосып,
          <br />файлды <span className="text-gray-400">public/audio/</span> папкасына салыңыз
        </p>
      </div>
    );
  }

  const audioUrl = `/audio/${book.audio}`;

  return (
    <div className="max-w-lg mx-auto px-4 py-8">
      <audio ref={audioRef} src={audioUrl}
        onTimeUpdate={onTimeUpdateHandler}
        onLoadedMetadata={e => setDuration(e.currentTarget.duration)}
        onEnded={() => { setPlaying(false); if (repeat === 'one') { seek(0); togglePlay(); } }}
      />

      {/* Album art */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="relative mb-8">
        <div className={`w-52 h-52 mx-auto rounded-3xl bg-gradient-to-br ${book.cover} shadow-2xl flex items-center justify-center relative overflow-hidden`}>
          <div className="absolute inset-0 bg-black/20" />
          <Headphones size={48} className="text-white/25 relative" />
          <AnimatePresence>
            {playing && (
              <motion.div
                key="pulse"
                className="absolute inset-0 rounded-3xl border-2 border-white/20"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
              />
            )}
          </AnimatePresence>
        </div>
        <div className="text-center mt-5">
          <h2 className="text-white font-bold text-xl">{book.title}</h2>
          <p className="text-gray-400">{book.author}</p>
          <div className="flex items-center justify-center gap-3 mt-2">
            <span className="text-gray-600 text-xs">Аудиокітап</span>
            <span className="text-gray-700">·</span>
            <span className="text-gray-600 text-xs">{fmtTime(duration)}</span>
          </div>
        </div>
      </motion.div>

      {/* Progress bar */}
      <div className="mb-5">
        <input type="range" min={0} max={duration || 0} value={currentT} step={0.5}
          onChange={e => seek(Number(e.target.value))}
          className="w-full h-1.5 rounded-full accent-violet-500 cursor-pointer mb-2"
          style={{ background: `linear-gradient(to right, #8b5cf6 ${progress}%, #1f2937 ${progress}%)` }}
        />
        <div className="flex justify-between text-gray-500 text-xs">
          <span>{fmtTime(currentT)}</span>
          <span className="text-gray-600 text-[11px]">{Math.round(progress)}%</span>
          <span>{fmtTime(duration)}</span>
        </div>
      </div>

      {/* Main controls */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <button onClick={() => setShuffle(v => !v)}
          className={`p-2.5 rounded-xl transition-colors ${shuffle ? 'text-violet-400 bg-violet-500/10' : 'text-gray-500 hover:text-white'}`}>
          <Shuffle size={18} />
        </button>

        <button onClick={() => skip(-10)} title="-10 сек"
          className="p-3 rounded-2xl text-gray-300 hover:text-white hover:bg-white/8 transition-colors relative">
          <SkipBack size={22} />
          <span className="absolute bottom-0.5 right-0.5 text-[8px] text-gray-500">10</span>
        </button>

        <button onClick={togglePlay}
          className="w-16 h-16 rounded-full bg-violet-500 hover:bg-violet-400 text-white flex items-center justify-center shadow-lg shadow-violet-500/30 transition-all active:scale-95">
          {playing ? <Pause size={26} /> : <Play size={26} className="translate-x-0.5" />}
        </button>

        <button onClick={() => skip(10)} title="+10 сек"
          className="p-3 rounded-2xl text-gray-300 hover:text-white hover:bg-white/8 transition-colors relative">
          <SkipForward size={22} />
          <span className="absolute bottom-0.5 right-0.5 text-[8px] text-gray-500">10</span>
        </button>

        <button onClick={() => setRepeat(r => r === 'none' ? 'all' : r === 'all' ? 'one' : 'none')}
          className={`p-2.5 rounded-xl transition-colors ${repeat !== 'none' ? 'text-violet-400 bg-violet-500/10' : 'text-gray-500 hover:text-white'}`}>
          {repeat === 'one' ? <Repeat1 size={18} /> : <Repeat size={18} />}
        </button>
      </div>

      {/* Secondary controls */}
      <div className="grid grid-cols-5 gap-2 items-center mb-4">
        {/* Volume */}
        <div className="col-span-2 flex items-center gap-2">
          <button onClick={() => setMuted(v => !v)} className="text-gray-400 hover:text-white transition-colors flex-shrink-0">
            {muted || volume === 0 ? <VolumeX size={16} /> : <Volume2 size={16} />}
          </button>
          <input type="range" min={0} max={1} step={0.05} value={muted ? 0 : volume}
            onChange={e => { setVolume(Number(e.target.value)); setMuted(false); }}
            className="flex-1 accent-violet-500 cursor-pointer h-1" />
        </div>

        {/* Speed */}
        <div className="flex justify-center relative">
          <button onClick={() => setShowSpeed(v => !v)}
            className="px-2.5 py-1.5 rounded-xl bg-white/8 border border-white/10 text-white text-sm font-bold hover:bg-white/12 transition-colors">
            {speed}×
          </button>
          <AnimatePresence>
            {showSpeed && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                className="absolute bottom-full mb-1 left-1/2 -translate-x-1/2 bg-gray-900 border border-white/10 rounded-2xl p-1.5 flex flex-col gap-0.5 z-20 min-w-[72px]">
                {SPEEDS.map(s => (
                  <button key={s} onClick={() => { setSpeed(s); setShowSpeed(false); }}
                    className={`px-3 py-1.5 rounded-xl text-xs transition-colors ${speed === s ? 'bg-violet-500/20 text-violet-300' : 'text-gray-300 hover:bg-white/8'}`}>
                    {s}×
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bookmark */}
        <div className="flex justify-center">
          <button onClick={bookmarkHere} title="Белгі қою"
            className={`p-2 transition-colors ${isBookmarked('audio', Math.round(currentT)) ? 'text-violet-400' : 'text-gray-500 hover:text-white'}`}>
            {isBookmarked('audio', Math.round(currentT)) ? <BookmarkCheck size={18} /> : <Bookmark size={18} />}
          </button>
        </div>

        {/* Sleep */}
        <div className="flex justify-center relative">
          <button onClick={() => sleepOn ? cancelSleep() : setShowSleep(v => !v)}
            className={`flex items-center gap-1.5 px-2 py-1.5 rounded-xl border text-xs transition-colors ${
              sleepOn ? 'bg-orange-500/15 border-orange-500/30 text-orange-400' : 'border-white/10 text-gray-400 hover:text-white'
            }`}>
            <Clock size={12} />
            {sleepOn && sleepSecs !== null ? fmtTime(sleepSecs) : 'Ұйқы'}
          </button>
          <AnimatePresence>
            {showSleep && !sleepOn && (
              <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 6 }}
                className="absolute bottom-full mb-1 right-0 bg-gray-900 border border-white/10 rounded-2xl p-1.5 flex flex-col gap-0.5 z-20">
                {SLEEP_TIMERS.map(m => (
                  <button key={m} onClick={() => startSleep(m)}
                    className="px-3 py-1.5 rounded-xl text-xs text-gray-300 hover:bg-white/8 whitespace-nowrap transition-colors">
                    {m} мин
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Extra actions */}
      <div className="flex items-center justify-center gap-3 pt-4 border-t border-white/8">
        {/* Download audio */}
        <a href={audioUrl} download={book.audio}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white hover:bg-white/8 transition-colors text-sm">
          <Download size={14} />
          Жүктеу
        </a>

        {/* Chapters (if book has TOC) */}
        {(book.tableOfContents?.length ?? 0) > 0 && (
          <button onClick={() => setShowQueue(v => !v)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-sm transition-colors ${
              showQueue ? 'bg-violet-500/15 border-violet-500/30 text-violet-300' : 'bg-white/5 border-white/10 text-gray-400 hover:text-white hover:bg-white/8'
            }`}>
            <ListMusic size={14} />
            Тараулар
          </button>
        )}
      </div>

      {/* Chapters drawer */}
      <AnimatePresence>
        {showQueue && book.tableOfContents && (
          <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden mt-4">
            <div className="bg-gray-900/80 border border-white/8 rounded-2xl overflow-hidden">
              <div className="px-4 py-3 border-b border-white/8 flex items-center justify-between">
                <span className="text-white text-sm font-semibold">Тараулар</span>
                <button onClick={() => setShowQueue(false)} className="text-gray-500 hover:text-white transition-colors">
                  <ChevronUp size={14} />
                </button>
              </div>
              <div className="max-h-56 overflow-y-auto py-1">
                {book.tableOfContents.map((ch, i) => (
                  <button key={i}
                    className="w-full text-left px-4 py-2.5 hover:bg-white/6 transition-colors flex items-center gap-2">
                    <span className="text-gray-500 text-[11px] w-5 text-right flex-shrink-0">{i + 1}</span>
                    <span className="text-gray-300 text-xs">{ch.title}</span>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
