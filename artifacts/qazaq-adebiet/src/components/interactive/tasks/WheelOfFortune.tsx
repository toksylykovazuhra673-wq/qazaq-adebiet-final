import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import type { Task } from '@/types/task';

interface Props { task: Task; onSubmit: (correct: boolean) => void }

const WHEEL_COLORS = ['#7c3aed','#2563eb','#059669','#d97706','#dc2626','#7c3aed','#0891b2','#9333ea'];

export default function WheelOfFortune({ task, onSubmit }: Props) {
  const options = task.options as string[];
  const correct = task.correctAnswer as number;

  const [spinning, setSpinning] = useState(false);
  const [spun, setSpun] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [rotation, setRotation] = useState(0);
  const [answered, setAnswered] = useState(false);
  const spinRef = useRef(false);

  const N = options.length;
  const slice = 360 / N;

  const spin = () => {
    if (spinning || spun) return;
    spinRef.current = true;
    setSpinning(true);

    // Land on a random option (not necessarily correct)
    const targetIndex = Math.floor(Math.random() * N);
    const baseSpins = 5 + Math.floor(Math.random() * 3); // 5–7 full rotations
    const targetAngle = baseSpins * 360 + (360 - targetIndex * slice - slice / 2);
    setRotation(targetAngle);

    setTimeout(() => {
      const finalAngle = targetAngle % 360;
      // which segment is at top (0°)?
      const landed = Math.round((360 - finalAngle) / slice) % N;
      setSelected(landed);
      setSpun(true);
      setSpinning(false);
    }, 3500);
  };

  const handleAnswer = (idx: number) => {
    if (answered) return;
    setAnswered(true);
    setTimeout(() => onSubmit(idx === correct), 800);
  };

  // Build SVG wheel paths
  const buildPath = (i: number) => {
    const r = 130;
    const cx = 140; const cy = 140;
    const startAngle = (i * slice - 90) * (Math.PI / 180);
    const endAngle = ((i + 1) * slice - 90) * (Math.PI / 180);
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const midAngle = ((i + 0.5) * slice - 90) * (Math.PI / 180);
    const tx = cx + (r * 0.65) * Math.cos(midAngle);
    const ty = cy + (r * 0.65) * Math.sin(midAngle);
    const large = slice > 180 ? 1 : 0;
    return { path: `M${cx},${cy} L${x1},${y1} A${r},${r} 0 ${large} 1 ${x2},${y2} Z`, tx, ty, midAngle };
  };

  return (
    <div>
      <p className="text-white/80 text-base leading-relaxed mb-6 text-center">{task.question}</p>

      <div className="flex flex-col items-center gap-6">
        {/* Wheel */}
        <div className="relative">
          {/* pointer */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-2 z-10 w-0 h-0"
            style={{ borderLeft: '10px solid transparent', borderRight: '10px solid transparent', borderTop: '22px solid white' }}
          />

          <motion.svg
            width={280} height={280} viewBox="0 0 280 280"
            animate={{ rotate: rotation }}
            transition={{ duration: 3.5, ease: [0.17, 0.67, 0.12, 0.99] }}
          >
            {options.map((opt, i) => {
              const { path, tx, ty, midAngle } = buildPath(i);
              const textAngle = (midAngle * 180 / Math.PI) + 90;
              return (
                <g key={i}>
                  <path d={path} fill={WHEEL_COLORS[i % WHEEL_COLORS.length]} stroke="white" strokeWidth={2} />
                  <text
                    x={tx} y={ty}
                    textAnchor="middle"
                    dominantBaseline="middle"
                    fill="white"
                    fontSize={N > 6 ? 9 : 11}
                    fontWeight="bold"
                    transform={`rotate(${textAngle}, ${tx}, ${ty})`}
                  >
                    {opt.length > 12 ? opt.slice(0, 12) + '…' : opt}
                  </text>
                </g>
              );
            })}
            <circle cx={140} cy={140} r={18} fill="white" stroke="#1e1b4b" strokeWidth={3} />
          </motion.svg>
        </div>

        {/* Spin button */}
        {!spun && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={spin}
            disabled={spinning}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 text-white font-bold text-lg shadow-lg disabled:opacity-50 transition-all"
          >
            {spinning ? '🎡 Айналуда...' : '🎡 Айналдыру!'}
          </motion.button>
        )}

        {/* After spin — show question and answer buttons */}
        {spun && selected !== null && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-md"
          >
            <div className="rounded-2xl border border-violet-500/30 bg-violet-500/10 p-4 mb-4 text-center">
              <p className="text-white/50 text-xs mb-1">Тиген бөлік:</p>
              <p className="text-white font-bold">{options[selected]}</p>
            </div>

            {!answered && (
              <div>
                <p className="text-white/60 text-sm text-center mb-3">Дұрыс жауапты таңдаңыз:</p>
                <div className="space-y-2">
                  {options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswer(i)}
                      className="w-full px-4 py-3 rounded-xl border border-white/15 bg-white/5 hover:bg-white/10 text-white text-sm text-left transition-all"
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {answered && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="flex items-center justify-center gap-2 p-4 rounded-2xl bg-white/5"
              >
                <CheckCircle size={18} className="text-emerald-400" />
                <span className="text-emerald-300 font-semibold">Дұрыс жауап: {options[correct]}</span>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}
