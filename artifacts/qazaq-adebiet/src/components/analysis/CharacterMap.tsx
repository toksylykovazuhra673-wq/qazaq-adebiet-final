import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Share2 } from 'lucide-react';
import AccordionSection from './AccordionSection';
import type { AnalysisCharacter, CharacterRelation } from '@/types/analysis';

const RELATION_COLORS: Record<string, string> = {
  positive: '#34d399',
  negative: '#f87171',
  neutral: '#94a3b8',
  complex: '#f59e0b',
};

const RELATION_LABELS: Record<string, string> = {
  positive: 'Оң',
  negative: 'Теріс',
  neutral: 'Бейтарап',
  complex: 'Күрделі',
};

// Static layout positions for up to 6 nodes in a 700×340 viewport
const POSITIONS: Array<{ x: number; y: number }> = [
  { x: 350, y: 80 },   // center top (main)
  { x: 150, y: 200 },  // left
  { x: 550, y: 200 },  // right
  { x: 350, y: 295 },  // center bottom
  { x: 90,  y: 310 },  // far left bottom
  { x: 610, y: 310 },  // far right bottom
];

interface Props {
  characters: AnalysisCharacter[];
  relations: CharacterRelation[];
}

export default function CharacterMap({ characters, relations }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const nodes = useMemo(() =>
    characters.slice(0, 6).map((ch, i) => ({
      ...ch,
      pos: POSITIONS[i],
      initials: ch.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase(),
    })),
  [characters]);

  const nodeMap = useMemo(() => Object.fromEntries(nodes.map((n) => [n.id, n])), [nodes]);

  const filteredRelations = useMemo(() =>
    relations.filter((r) => nodeMap[r.from] && nodeMap[r.to]),
  [relations, nodeMap]);

  const highlightedEdges = useMemo(() => {
    if (!hovered) return new Set<string>();
    return new Set(
      filteredRelations
        .filter((r) => r.from === hovered || r.to === hovered)
        .map((r) => `${r.from}-${r.to}`)
    );
  }, [hovered, filteredRelations]);

  return (
    <AccordionSection
      id="character-map"
      title="Кейіпкерлер картасы"
      icon={<Share2 size={18} />}
      accentColor="from-rose-500 to-pink-600"
    >
      {/* legend */}
      <div className="flex flex-wrap gap-3 mb-4">
        {Object.entries(RELATION_LABELS).map(([key, label]) => (
          <div key={key} className="flex items-center gap-1.5 text-xs text-white/50">
            <div
              className="w-6 h-0.5 rounded-full"
              style={{ backgroundColor: RELATION_COLORS[key] }}
            />
            {label}
          </div>
        ))}
      </div>

      {/* SVG graph */}
      <div className="rounded-xl bg-white/3 border border-white/8 overflow-hidden">
        <svg
          viewBox="0 0 700 370"
          className="w-full"
          style={{ maxHeight: 370 }}
        >
          {/* edges */}
          {filteredRelations.map((rel) => {
            const fromNode = nodeMap[rel.from];
            const toNode = nodeMap[rel.to];
            if (!fromNode || !toNode) return null;
            const key = `${rel.from}-${rel.to}`;
            const isHl = highlightedEdges.has(key);
            const isDim = hovered && !isHl;
            const color = RELATION_COLORS[rel.type] ?? '#94a3b8';

            const mx = (fromNode.pos.x + toNode.pos.x) / 2;
            const my = (fromNode.pos.y + toNode.pos.y) / 2 - 30;

            return (
              <g key={key}>
                <path
                  d={`M${fromNode.pos.x},${fromNode.pos.y} Q${mx},${my} ${toNode.pos.x},${toNode.pos.y}`}
                  fill="none"
                  stroke={color}
                  strokeWidth={isHl ? 2.5 : 1.5}
                  strokeOpacity={isDim ? 0.12 : isHl ? 0.9 : 0.4}
                  strokeDasharray={rel.type === 'complex' ? '6 3' : undefined}
                />
                {/* midpoint label */}
                {isHl && (
                  <text
                    x={mx}
                    y={my - 6}
                    textAnchor="middle"
                    fill={color}
                    fontSize={9}
                    opacity={0.9}
                  >
                    {rel.label}
                  </text>
                )}
              </g>
            );
          })}

          {/* nodes */}
          {nodes.map((node) => {
            const isHl = hovered === node.id;
            const isDim = hovered && !isHl;
            const isMain = node.type === 'main';

            return (
              <motion.g
                key={node.id}
                style={{ cursor: 'pointer' }}
                onHoverStart={() => setHovered(node.id)}
                onHoverEnd={() => setHovered(null)}
                opacity={isDim ? 0.3 : 1}
                animate={{ opacity: isDim ? 0.3 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {/* glow ring when hovered */}
                {isHl && (
                  <circle
                    cx={node.pos.x}
                    cy={node.pos.y}
                    r={isMain ? 34 : 28}
                    fill="none"
                    stroke="white"
                    strokeWidth={1.5}
                    strokeOpacity={0.25}
                  />
                )}
                {/* circle */}
                <circle
                  cx={node.pos.x}
                  cy={node.pos.y}
                  r={isMain ? 28 : 22}
                  fill={
                    node.type === 'main'
                      ? '#7c3aed'
                      : node.type === 'secondary'
                      ? '#1d4ed8'
                      : '#334155'
                  }
                  fillOpacity={isHl ? 1 : 0.85}
                />
                {/* initials */}
                <text
                  x={node.pos.x}
                  y={node.pos.y + 5}
                  textAnchor="middle"
                  fill="white"
                  fontSize={isMain ? 13 : 10}
                  fontWeight="bold"
                >
                  {node.initials}
                </text>
                {/* name label below */}
                <text
                  x={node.pos.x}
                  y={node.pos.y + (isMain ? 46 : 38)}
                  textAnchor="middle"
                  fill="rgba(255,255,255,0.75)"
                  fontSize={9}
                  fontWeight={isHl ? 'bold' : 'normal'}
                >
                  {node.name.split(' ')[0]}
                </text>
              </motion.g>
            );
          })}
        </svg>
      </div>

      <p className="text-white/30 text-xs text-center mt-2">
        Кейіпкерге апарыңыз — байланыстары жанады
      </p>
    </AccordionSection>
  );
}
