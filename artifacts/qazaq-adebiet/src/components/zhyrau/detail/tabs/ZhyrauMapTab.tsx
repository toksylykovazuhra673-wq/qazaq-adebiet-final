import React, { useState } from 'react';
import { MapPin } from 'lucide-react';
import type { Zhyrau, ZhyrauMapRegion } from '@/types/zhyrau';

// Kazakhstan SVG coordinate transformer
// KZ spans roughly lat 40–55°N, lng 45–87°E → SVG 0 0 800 500
function toSvg(lat: number, lng: number): [number, number] {
  const x = ((lng - 45) / (87 - 45)) * 800;
  const y = ((55 - lat) / (55 - 40)) * 500;
  return [Math.round(x), Math.round(y)];
}

// Simplified Kazakhstan outline polygon (approximate)
const KZ_PATH =
  'M 45,390 L 90,370 L 130,350 L 165,325 L 195,295 L 220,270 L 250,248 ' +
  'L 285,232 L 325,218 L 368,210 L 408,206 L 448,210 L 490,216 ' +
  'L 528,226 L 565,238 L 598,252 L 625,268 L 645,288 L 658,312 ' +
  'L 655,338 L 640,358 L 618,373 L 592,383 L 560,390 L 526,396 ' +
  'L 490,400 L 455,404 L 418,408 L 384,420 L 356,438 L 325,450 ' +
  'L 292,450 L 262,443 L 232,432 L 200,424 L 168,418 L 140,410 ' +
  'L 110,400 L 78,392 Z';

interface TooltipState { x: number; y: number; label: string; } 

export default function ZhyrauMapTab({ zhyrau }: { zhyrau: Zhyrau }) {
  const [tooltip, setTooltip] = useState<TooltipState | null>(null);
  const { mapLocation } = zhyrau;

  const [bx, by] = toSvg(mapLocation.birthLat, mapLocation.birthLng);
  const [dx, dy] = toSvg(mapLocation.deathLat, mapLocation.deathLng);

  return (
    <div className="glass-panel rounded-2xl overflow-hidden">
      <div className="relative">
        <svg
          viewBox="0 0 800 500"
          className="w-full"
          style={{ height: 400, background: 'transparent' }}
        >
          {/* KZ silhouette */}
          <path d={KZ_PATH} fill="rgba(139,92,246,0.08)" stroke="rgba(139,92,246,0.3)" strokeWidth="2" />

          {/* Grid lines */}
          {[1,2,3,4].map(i => (
            <line key={`h${i}`} x1="0" y1={i*100} x2="800" y2={i*100} stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}
          {[1,2,3,4,5,6,7].map(i => (
            <line key={`v${i}`} x1={i*100} y1="0" x2={i*100} y2="500" stroke="rgba(255,255,255,0.03)" strokeWidth="1" />
          ))}

          {/* Lived regions */}
          {mapLocation.livedRegions.map((region: ZhyrauMapRegion, i: number) => {
            const [rx, ry] = toSvg(region.lat, region.lng);
            return (
              <g key={i}>
                <circle
                  cx={rx} cy={ry} r={12}
                  fill="rgba(139,92,246,0.25)" stroke="rgba(139,92,246,0.6)" strokeWidth="2"
                  className="cursor-pointer"
                  onMouseEnter={() => setTooltip({ x: rx, y: ry, label: region.name })}
                  onMouseLeave={() => setTooltip(null)}
                />
                <circle cx={rx} cy={ry} r={4} fill="rgba(139,92,246,0.8)" />
              </g>
            );
          })}

          {/* Death location */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setTooltip({ x: dx, y: dy, label: mapLocation.deathLabel })}
            onMouseLeave={() => setTooltip(null)}
          >
            <circle cx={dx} cy={dy} r={10} fill="rgba(239,68,68,0.2)" stroke="rgba(239,68,68,0.6)" strokeWidth="2" />
            <circle cx={dx} cy={dy} r={4} fill="rgba(239,68,68,0.8)" />
          </g>

          {/* Birth location (star) */}
          <g
            className="cursor-pointer"
            onMouseEnter={() => setTooltip({ x: bx, y: by, label: mapLocation.birthLabel })}
            onMouseLeave={() => setTooltip(null)}
          >
            <circle cx={bx} cy={by} r={14} fill="rgba(245,158,11,0.2)" stroke="rgba(245,158,11,0.7)" strokeWidth="2" />
            <text x={bx} y={by + 5} textAnchor="middle" fontSize="14" fill="rgba(245,158,11,0.95)">★</text>
          </g>

          {/* Tooltip */}
          {tooltip && (
            <g>
              <rect
                x={tooltip.x - 60} y={tooltip.y - 35}
                width={120} height={26} rx={6}
                fill="rgba(10,6,24,0.9)" stroke="rgba(255,255,255,0.1)" strokeWidth="1"
              />
              <text x={tooltip.x} y={tooltip.y - 17} textAnchor="middle" fontSize="11" fill="white">
                {tooltip.label}
              </text>
            </g>
          )}
        </svg>

        {/* Legend */}
        <div className="absolute top-4 right-4 glass-card p-3 rounded-xl text-xs space-y-2">
          <div className="flex items-center gap-2"><span className="text-accent text-base">★</span><span className="text-white/70">Туған жері</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-red-500/70 inline-block" /><span className="text-white/70">Қайтыс болды</span></div>
          <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary/70 inline-block" /><span className="text-white/70">Өмір сүрген өңір</span></div>
        </div>
      </div>

      {/* Info panel */}
      <div className="p-6 border-t border-white/10 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-accent mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Туған жері</p>
            <p className="text-white text-sm">{zhyrau.birthPlace}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Қайтыс болды</p>
            <p className="text-white text-sm">{zhyrau.deathPlace ?? 'Белгісіз'}</p>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <MapPin className="w-4 h-4 text-primary mt-0.5 shrink-0" />
          <div>
            <p className="text-xs text-white/50 uppercase tracking-wider mb-1">Өмір сүрген өңірлер</p>
            <p className="text-white text-sm">{mapLocation.livedRegions.map((r: ZhyrauMapRegion) => r.name).join(', ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
