import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { BiSheshen, BiMapRegion } from '@/types/bi';

function toSvg(lat: number, lng: number): [number, number] {
  const x = ((lng - 45) / (87 - 45)) * 800;
  const y = ((55 - lat) / (55 - 40)) * 500;
  return [Math.round(x), Math.round(y)];
}

const KZ_PATH =
  'M 45,390 L 90,370 L 130,350 L 165,325 L 195,295 L 220,270 L 250,248 ' +
  'L 285,232 L 325,218 L 368,210 L 408,206 L 448,210 L 490,216 ' +
  'L 528,226 L 565,238 L 598,252 L 625,268 L 645,288 L 658,312 ' +
  'L 655,338 L 640,358 L 618,373 L 592,383 L 560,390 L 526,396 ' +
  'L 490,400 L 455,404 L 418,408 L 384,420 L 356,438 L 325,450 ' +
  'L 292,450 L 262,443 L 232,432 L 200,424 L 168,418 L 140,410 ' +
  'L 110,400 L 78,392 Z';

interface Tip { x: number; y: number; label: string; }

export default function BiMapTab({ bi }: { bi: BiSheshen }) {
  const [tip, setTip] = useState<Tip | null>(null);
  const { mapLocation: m } = bi;
  const [bx, by] = toSvg(m.birthLat, m.birthLng);
  const [dx, dy] = toSvg(m.deathLat, m.deathLng);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="relative">
        <svg viewBox="0 0 800 500" className="w-full" style={{ height: 400 }}>
          <path d={KZ_PATH} fill="rgba(20,184,166,0.07)" stroke="rgba(20,184,166,0.28)" strokeWidth="2" />
          {[1,2,3,4].map(i => <line key={`h${i}`} x1="0" y1={i*100} x2="800" y2={i*100} stroke="rgba(255,255,255,0.025)" strokeWidth="1" />)}
          {[1,2,3,4,5,6,7].map(i => <line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="500" stroke="rgba(255,255,255,0.025)" strokeWidth="1" />)}

          {m.livedRegions.map((r: BiMapRegion, i: number) => {
            const [rx, ry] = toSvg(r.lat, r.lng);
            return (
              <g key={i} onMouseEnter={() => setTip({ x: rx, y: ry, label: r.name })} onMouseLeave={() => setTip(null)} className="cursor-pointer">
                <circle cx={rx} cy={ry} r={12} fill="rgba(20,184,166,0.2)" stroke="rgba(20,184,166,0.55)" strokeWidth="2" />
                <circle cx={rx} cy={ry} r={4} fill="rgba(20,184,166,0.8)" />
              </g>
            );
          })}

          <g onMouseEnter={() => setTip({ x: dx, y: dy, label: m.deathLabel })} onMouseLeave={() => setTip(null)} className="cursor-pointer">
            <circle cx={dx} cy={dy} r={10} fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.6)" strokeWidth="2" />
            <circle cx={dx} cy={dy} r={4} fill="rgba(239,68,68,0.8)" />
          </g>

          <g onMouseEnter={() => setTip({ x: bx, y: by, label: m.birthLabel })} onMouseLeave={() => setTip(null)} className="cursor-pointer">
            <circle cx={bx} cy={by} r={14} fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.65)" strokeWidth="2" />
            <text x={bx} y={by + 5} textAnchor="middle" fontSize="14" fill="rgba(245,158,11,0.95)">★</text>
          </g>

          {tip && (
            <g>
              <rect x={tip.x - 65} y={tip.y - 36} width={130} height={26} rx={6} fill="rgba(10,6,24,0.92)" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <text x={tip.x} y={tip.y - 18} textAnchor="middle" fontSize="11" fill="white">{tip.label}</text>
            </g>
          )}
        </svg>

        <div className="absolute top-4 right-4 glass-card p-3 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2"><span className="text-amber-400 text-base">★</span><span className="text-white/70">Туған жері</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" /><span className="text-white/70">Қайтыс болды</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-teal-500/70 inline-block" /><span className="text-white/70">Қызмет аймағы</span></div>
        </div>
      </div>

      <div className="p-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-amber-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Туған жері</p>
            <p className="text-white text-sm">{bi.birthPlace}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Қайтыс болды</p>
            <p className="text-white text-sm">{bi.deathPlace ?? 'Белгісіз'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Қызмет аймақтары</p>
            <p className="text-white text-sm">{m.livedRegions.map((r: BiMapRegion) => r.name).join(', ') || bi.region}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
