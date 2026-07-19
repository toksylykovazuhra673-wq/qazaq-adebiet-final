import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, Clock, Layers, Sparkles, Heart } from 'lucide-react';
import type { Analysis } from '@/types/analysis';
import ExportButtons from './ExportButtons';

interface AnalysisHeaderProps {
  analysis: Analysis;
}

const META_CARDS = (a: Analysis) => [
  { label: 'Жанр', value: a.genre, icon: <BookOpen size={14} /> },
  { label: 'Кезең', value: a.period, icon: <Clock size={14} /> },
  { label: 'Бағыт', value: a.direction, icon: <Layers size={14} /> },
  { label: 'Ағым', value: a.literaryMovement, icon: <Sparkles size={14} /> },
];

export default function AnalysisHeader({ analysis }: AnalysisHeaderProps) {
  const initials = analysis.author
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="print:hidden">
      {/* back + export row */}
      <div className="flex items-center justify-between mb-6 flex-wrap gap-4">
        <button
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-white/50 hover:text-white transition-colors text-sm group"
        >
          <ArrowLeft size={16} className="group-hover:-translate-x-0.5 transition-transform" />
          Артқа
        </button>
        <ExportButtons analysis={analysis} />
      </div>

      {/* hero card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm p-6 md:p-8 mb-6"
      >
        <div className="flex gap-6 flex-col sm:flex-row">
          {/* cover */}
          <div className="w-28 h-40 rounded-xl bg-gradient-to-br from-violet-600 to-purple-800 flex items-center justify-center flex-shrink-0 shadow-xl shadow-violet-900/40 mx-auto sm:mx-0">
            <span className="text-white font-bold text-2xl">{initials}</span>
          </div>

          {/* info */}
          <div className="flex-1 min-w-0">
            {/* type badge */}
            <div className="flex items-center gap-2 mb-3 flex-wrap">
              <span className="px-3 py-1 rounded-full bg-violet-500/20 border border-violet-500/30 text-violet-300 text-xs font-medium">
                {analysis.type}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/30 text-blue-300 text-xs font-medium flex items-center gap-1">
                <Sparkles size={10} />
                Автоматты талдау
              </span>
            </div>

            <h1 className="text-2xl md:text-3xl font-bold text-white leading-tight mb-1">
              {analysis.title}
            </h1>
            <p className="text-white/50 mb-4">{analysis.author}</p>

            {/* meta grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {META_CARDS(analysis).map((card) => (
                <div
                  key={card.label}
                  className="rounded-xl bg-white/5 border border-white/8 p-3"
                >
                  <div className="flex items-center gap-1.5 text-white/40 text-xs mb-1">
                    {card.icon}
                    {card.label}
                  </div>
                  <p className="text-white text-sm font-medium leading-tight">{card.value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* theme / idea / mainThought */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          {[
            { label: 'Тақырып', value: analysis.theme, color: 'from-violet-500/20 to-purple-500/20 border-violet-500/20' },
            { label: 'Идея', value: analysis.idea, color: 'from-blue-500/20 to-cyan-500/20 border-blue-500/20' },
            { label: 'Негізгі ой', value: analysis.mainThought, color: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/20' },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-xl bg-gradient-to-br ${item.color} border p-4`}
            >
              <div className="flex items-center gap-1.5 mb-2">
                <Heart size={12} className="text-white/40" />
                <span className="text-white/50 text-xs uppercase tracking-wider">{item.label}</span>
              </div>
              <p className="text-white/85 text-sm leading-relaxed">{item.value}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
