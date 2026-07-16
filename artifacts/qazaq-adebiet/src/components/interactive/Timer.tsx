import { useEffect, useState, useRef } from 'react';
import { Timer as TimerIcon } from 'lucide-react';

interface Props {
  seconds: number;      // 0 = unlimited
  onExpire: () => void;
  paused?: boolean;
}

export default function Timer({ seconds, onExpire, paused = false }: Props) {
  const [remaining, setRemaining] = useState(seconds === 0 ? Infinity : seconds);
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const expiredRef = useRef(false);

  useEffect(() => {
    setRemaining(seconds === 0 ? Infinity : seconds);
    setElapsed(0);
    expiredRef.current = false;
  }, [seconds]);

  useEffect(() => {
    if (paused) {
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    intervalRef.current = setInterval(() => {
      setElapsed((e) => e + 1);
      if (seconds > 0) {
        setRemaining((r) => {
          const next = r - 1;
          if (next <= 0 && !expiredRef.current) {
            expiredRef.current = true;
            onExpire();
          }
          return Math.max(0, next);
        });
      }
    }, 1000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [paused, seconds, onExpire]);

  const fmt = (s: number) => {
    if (!isFinite(s)) return '∞';
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return m > 0 ? `${m}:${String(sec).padStart(2, '0')}` : `${sec}с`;
  };

  const pct = seconds > 0 ? (remaining / seconds) * 100 : 100;
  const danger = seconds > 0 && remaining <= 10;

  return (
    <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border transition-colors ${
      danger ? 'border-red-500/40 bg-red-500/10' : 'border-white/10 bg-white/5'
    }`}>
      <TimerIcon size={14} className={danger ? 'text-red-400 animate-pulse' : 'text-white/40'} />
      <span className={`text-sm font-mono font-semibold ${danger ? 'text-red-300' : 'text-white/70'}`}>
        {seconds === 0 ? fmt(elapsed) : fmt(remaining)}
      </span>
      {seconds > 0 && (
        <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              danger ? 'bg-red-500' : pct > 50 ? 'bg-emerald-500' : 'bg-amber-500'
            }`}
            style={{ width: `${pct}%` }}
          />
        </div>
      )}
    </div>
  );
}

// export elapsed getter so TaskRunner can capture time spent
export function useElapsed() {
  const [elapsed, setElapsed] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const start = () => {
    setElapsed(0);
    intervalRef.current = setInterval(() => setElapsed((e) => e + 1), 1000);
  };
  const stop = () => { if (intervalRef.current) clearInterval(intervalRef.current); };

  useEffect(() => () => stop(), []);

  return { elapsed, start, stop };
}
