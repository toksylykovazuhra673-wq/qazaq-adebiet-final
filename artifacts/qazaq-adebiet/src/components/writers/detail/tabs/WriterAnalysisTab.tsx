import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { BarChart2, ChevronRight, Sparkles } from 'lucide-react';
import type { Writer } from '@/types/writer';

export default function WriterAnalysisTab({ writer }: { writer: Writer }) {
  // Link to the analysis page using the writer's first main work slug
  const analysisSlug = writer.works[0]
    ? writer.slug
    : 'abay-qara-sozder';

  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-xl font-bold mb-2">Әдеби талдау</h2>
      <p className="text-white/40 text-sm mb-8">Шығармаларды автоматты түрде талдау жүйесі</p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-violet-500/25 bg-gradient-to-br from-violet-900/30 to-indigo-900/20 p-8 text-center mb-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-violet-500/20 border border-violet-500/30 flex items-center justify-center mx-auto mb-4">
          <BarChart2 size={28} className="text-violet-300" />
        </div>
        <h3 className="text-white font-bold text-xl mb-2">«{writer.works[0]?.title ?? 'Шығармалар'}» талдауы</h3>
        <p className="text-white/50 text-sm mb-6 leading-relaxed max-w-sm mx-auto">
          Композиция, сюжет, кейіпкерлер, стилистика, эмоционалды хронология және толық әдеби талдау
        </p>
        <Link
          href={`/analysis/${analysisSlug}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-violet-600 to-blue-600 hover:from-violet-500 hover:to-blue-500 text-white font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(139,92,246,0.35)]"
        >
          <Sparkles size={16} />
          Талдауды ашу
          <ChevronRight size={15} />
        </Link>
      </motion.div>

      {/* Feature cards */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { icon: '📐', label: 'Композиция', desc: '6 бөлімді талдау' },
          { icon: '🎭', label: 'Кейіпкерлер', desc: 'Байланыс картасы' },
          { icon: '💬', label: 'Стилистика', desc: '13 тәсіл' },
          { icon: '📈', label: 'Эмоция', desc: 'Интерактив графика' },
          { icon: '🗺️', label: 'Хронология', desc: 'Оқиғалар желісі' },
          { icon: '📍', label: 'Орындар', desc: 'Қазақстан картасы' },
        ].map((f) => (
          <div key={f.label} className="flex items-center gap-3 p-4 rounded-2xl bg-white/5 border border-white/8">
            <span className="text-2xl">{f.icon}</span>
            <div>
              <p className="text-white text-sm font-medium">{f.label}</p>
              <p className="text-white/40 text-xs">{f.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
