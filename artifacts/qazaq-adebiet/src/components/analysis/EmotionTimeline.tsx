import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { EmotionPoint } from '@/types/analysis';

interface Props {
  timeline: EmotionPoint[];
}

export default function EmotionTimeline({ timeline }: Props) {
  const [active, setActive] = useState<number | null>(null);

  const W = 680;
  const H = 160;
  const PAD = { left: 40, right: 20, top: 20, bottom: 40 };
  const plotW = W - PAD.left - PAD.right;
  const plotH = H - PAD.top - PAD.bottom;

  const points = timeline.map((pt, i) => ({
    ...pt,
    x: PAD.left + (i / (timeline.length - 1)) * plotW,
    y: PAD.top + plotH - (pt.intensity / 100) * plotH,
  }));

  // build smooth polyline path
  const polyline = points.map((p, i) => (i === 0 ? `M${p.x},${p.y}` : `L${p.x},${p.y}`)).join(' ');
  // area fill
  const areaPath = `${polyline} L${points[points.length - 1].x},${PAD.top + plotH} L${points[0].x},${PAD.top + plotH} Z`;

  return (
    <AccordionSection
      id="emotion-timeline"
      title="Эмоциялық карта"
      icon={<Heart size={18} />}
      badge={timeline.length}
      accentColor="from-pink-500 to-rose-600"
    >
      <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden p-2">
        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ maxHeight: H }}>
          {/* grid lines */}
          {[25, 50, 75, 100].map((pct) => {
            const y = PAD.top + plotH - (pct / 100) * plotH;
            return (
              <g key={pct}>
                <line
                  x1={PAD.left}
                  y1={y}
                  x2={W - PAD.right}
                  y2={y}
                  stroke="rgba(255,255,255,0.05)"
                  strokeWidth={1}
                />
                <text x={PAD.left - 6} y={y + 4} textAnchor="end" fill="rgba(255,255,255,0.25)" fontSize={8}>
                  {pct}
                </text>
              </g>
            );
          })}

          {/* area fill */}
          <path d={areaPath} fill="url(#emotionGrad)" fillOpacity={0.3} />

          {/* gradient def */}
          <defs>
            <linearGradient id="emotionGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f472b6" stopOpacity={0.8} />
              <stop offset="100%" stopColor="#f472b6" stopOpacity={0} />
            </linearGradient>
          </defs>

          {/* line */}
          <path d={polyline} fill="none" stroke="#f472b6" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />

          {/* points */}
          {points.map((pt, i) => (
            <g key={i} style={{ cursor: 'pointer' }} onClick={() => setActive(active === i ? null : i)}>
              <circle cx={pt.x} cy={pt.y} r={active === i ? 7 : 5} fill={pt.color} stroke="white" strokeWidth={1.5} />
              {/* x label */}
              <text
                x={pt.x}
                y={PAD.top + plotH + 14}
                textAnchor="middle"
                fill="rgba(255,255,255,0.35)"
                fontSize={7.5}
              >
                {pt.label}
              </text>
            </g>
          ))}
        </svg>
      </div>

      {/* active tooltip */}
      {active !== null && timeline[active] && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 rounded-xl border p-4"
          style={{
            borderColor: timeline[active].color + '40',
            backgroundColor: timeline[active].color + '12',
          }}
        >
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: timeline[active].color }} />
            <span className="text-white font-semibold text-sm">{timeline[active].label}</span>
            <span className="text-white/50 text-sm">— {timeline[active].emotion}</span>
            <span
              className="ml-auto text-sm font-bold"
              style={{ color: timeline[active].color }}
            >
              {timeline[active].intensity}%
            </span>
          </div>
          <p className="text-white/65 text-sm leading-relaxed">{timeline[active].description}</p>
        </motion.div>
      )}

      {active === null && (
        <p className="text-white/30 text-xs text-center mt-3">
          Нүктені басыңыз — толық ақпарат шығады
        </p>
      )}
    </AccordionSection>
  );
}
