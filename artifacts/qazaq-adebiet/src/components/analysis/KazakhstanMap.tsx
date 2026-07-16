import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MapPin } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { Place } from '@/types/analysis';

// Kazakhstan simplified SVG path (clockwise from NW)
// viewBox: 0 0 800 520
const KZ_PATH = `
M 60,190
L 85,140 L 110,120 L 155,115 L 195,90 L 235,75 L 268,68
L 300,55 L 340,50 L 380,52 L 415,48 L 455,50 L 490,55
L 525,60 L 558,58 L 585,65 L 615,75 L 640,90 L 660,108
L 678,128 L 692,150 L 705,175 L 718,200 L 725,228
L 730,258 L 728,288 L 720,315 L 708,338 L 695,358
L 678,372 L 660,382 L 640,390 L 618,398 L 595,408
L 572,418 L 548,425 L 522,432 L 495,440 L 468,448
L 440,455 L 412,460 L 385,462 L 358,462 L 332,460
L 305,456 L 278,450 L 252,442 L 228,432 L 205,420
L 183,408 L 162,395 L 142,380 L 122,363 L 105,344
L 88,322 L 73,298 L 62,272 L 55,245 L 52,218
Z
`;

// Lat/lon → SVG coords
// lat: 41–56, lon: 51–87 → SVG 800×520
function toSVG(lat: number, lon: number): { x: number; y: number } {
  const x = ((lon - 51) / (87 - 51)) * 740 + 30;
  const y = ((56 - lat) / (56 - 41)) * 450 + 35;
  return { x, y };
}

interface Props {
  places: Place[];
}

export default function KazakhstanMap({ places }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  if (!places.length) return null;

  return (
    <AccordionSection
      id="map"
      title="Географиялық карта"
      icon={<MapPin size={18} />}
      badge={places.length}
      accentColor="from-sky-500 to-blue-600"
    >
      <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden relative">
        <svg viewBox="0 0 800 520" className="w-full" style={{ maxHeight: 380 }}>
          {/* Kazakhstan outline */}
          <path
            d={KZ_PATH}
            fill="rgba(99,102,241,0.08)"
            stroke="rgba(99,102,241,0.35)"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />

          {/* place markers */}
          {places.map((place) => {
            const { x, y } = toSVG(place.lat, place.lon);
            const isHl = hovered === place.name;

            return (
              <g
                key={place.name}
                style={{ cursor: 'pointer' }}
                onMouseEnter={() => setHovered(place.name)}
                onMouseLeave={() => setHovered(null)}
              >
                {/* pulse ring */}
                {isHl && (
                  <circle cx={x} cy={y} r={18} fill="rgba(239,68,68,0.15)" stroke="rgba(239,68,68,0.4)" strokeWidth={1} />
                )}
                {/* dot */}
                <circle
                  cx={x}
                  cy={y}
                  r={isHl ? 7 : 5}
                  fill={isHl ? '#ef4444' : '#f87171'}
                  stroke="white"
                  strokeWidth={1.5}
                />
                {/* name */}
                <text
                  x={x}
                  y={y - 12}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.8)"
                  fontSize={isHl ? 11 : 9}
                  fontWeight={isHl ? 'bold' : 'normal'}
                >
                  {place.name}
                </text>
              </g>
            );
          })}

          {/* compass */}
          <text x={760} y={50} textAnchor="middle" fill="rgba(255,255,255,0.3)" fontSize={12} fontWeight="bold">N</text>
          <line x1={760} y1={55} x2={760} y2={75} stroke="rgba(255,255,255,0.2)" strokeWidth={1} />
        </svg>
      </div>

      {/* tooltip / info panel */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 6 }}
            className="mt-4 rounded-xl border border-red-500/20 bg-red-500/10 p-4"
          >
            {places
              .filter((p) => p.name === hovered)
              .map((p) => (
                <div key={p.name}>
                  <div className="flex items-center gap-2 mb-1">
                    <MapPin size={14} className="text-red-400" />
                    <span className="text-white font-semibold">{p.name}</span>
                    <span className="text-white/40 text-xs">
                      {p.lat.toFixed(2)}°N, {p.lon.toFixed(2)}°E
                    </span>
                  </div>
                  <p className="text-white/65 text-sm leading-relaxed">{p.description}</p>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* place list */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {places.map((p, i) => (
          <button
            key={p.name}
            onMouseEnter={() => setHovered(p.name)}
            onMouseLeave={() => setHovered(null)}
            className={`rounded-xl border p-3 text-left transition-all duration-200 ${
              hovered === p.name
                ? 'border-red-500/40 bg-red-500/15'
                : 'border-white/8 bg-white/5 hover:border-white/20'
            }`}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-2 h-2 rounded-full bg-red-400" />
              <span className="text-white text-sm font-medium">{p.name}</span>
            </div>
            <p className="text-white/40 text-xs leading-snug line-clamp-2">{p.description}</p>
          </button>
        ))}
      </div>
    </AccordionSection>
  );
}
