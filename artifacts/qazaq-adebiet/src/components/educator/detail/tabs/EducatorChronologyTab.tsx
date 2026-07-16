import React from 'react';
import { motion } from 'framer-motion';
import { Calendar } from 'lucide-react';
import type { Educator } from '@/types/educator';

const DECADES: Record<string, string> = {
  '1830': '#7c3aed',
  '1840': '#6d28d9',
  '1850': '#5b21b6',
  '1860': '#4c1d95',
  '1870': '#7c3aed',
  '1880': '#0d9488',
  '1890': '#059669',
  '1900': '#0284c7',
  '1910': '#0369a1',
  '1920': '#1d4ed8',
  '1930': '#6d28d9',
  '1940': '#7c2d12',
};

function getDecadeColor(year: string) {
  const d = Math.floor(Number(year) / 10) * 10;
  return DECADES[String(d)] ?? '#6d28d9';
}

export default function EducatorChronologyTab({ educator: e }: { educator: Educator }) {
  const allEvents = [
    ...e.timeline.map((t) => ({ year: t.year, title: t.title, description: t.description, type: 'timeline' })),
    ...e.books.map((b) => ({ year: b.year, title: b.title, description: b.description, type: 'book' })),
    ...e.scientificWorks.map((w) => ({ year: w.year, title: w.title, description: w.description, type: 'work' })),
    ...e.articles.map((a) => ({ year: a.year, title: a.title, description: a.description, type: 'article' })),
  ].sort((a, b) => Number(a.year) - Number(b.year));

  const TYPE_EMOJI: Record<string, string> = {
    timeline: '⏳',
    book: '📚',
    work: '🔬',
    article: '📰',
  };

  if (!allEvents.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <Calendar className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40">Хронология мəліметтері жоқ</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {allEvents.map((ev, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: -16 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.04 }}
          className="flex gap-4 items-start group"
        >
          {/* Year column */}
          <div className="shrink-0 w-16 text-right">
            <span
              className="inline-block px-2 py-0.5 rounded text-xs font-bold tabular-nums"
              style={{ background: getDecadeColor(ev.year) + '33', color: getDecadeColor(ev.year), border: `1px solid ${getDecadeColor(ev.year)}55` }}
            >
              {ev.year}
            </span>
          </div>

          {/* Connector */}
          <div className="shrink-0 flex flex-col items-center pt-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-white/25 group-hover:bg-violet-400 transition-colors" />
            {i < allEvents.length - 1 && <div className="w-px flex-1 bg-white/8 mt-1" style={{ minHeight: 24 }} />}
          </div>

          {/* Content */}
          <div className="flex-1 pb-4 glass-panel rounded-xl px-4 py-3 hover:border-violet-500/20 border border-white/6 transition-colors">
            <div className="flex items-center gap-2 mb-0.5">
              <span className="text-sm">{TYPE_EMOJI[ev.type]}</span>
              <p className="text-white font-medium text-sm">{ev.title}</p>
            </div>
            <p className="text-white/50 text-xs leading-relaxed">{ev.description}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
