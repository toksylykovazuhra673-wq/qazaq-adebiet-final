import { Link } from 'wouter';
import { motion } from 'framer-motion';
import { Gamepad2, ChevronRight, Zap, Trophy, Clock } from 'lucide-react';
import type { Writer } from '@/types/writer';

const TASK_TYPES = [
  { emoji: '✅', label: 'Тест сұрақтары' },
  { emoji: '🔗', label: 'Сәйкестендіру' },
  { emoji: '📝', label: 'Бос орын толтыру' },
  { emoji: '📋', label: 'Реттеу' },
  { emoji: '🃏', label: 'Жады ойыны' },
  { emoji: '🎡', label: 'Бақыт дөңгелегі' },
];

export default function WriterInteractiveTab({ writer }: { writer: Writer }) {
  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-xl font-bold mb-2">Интерактивті тапсырмалар</h2>
      <p className="text-white/40 text-sm mb-8">
        {writer.shortName} туралы ойын форматындағы тапсырмалар — XP жинаңыз, деңгей көтеріңіз
      </p>

      {/* Hero card */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-3xl border border-emerald-500/25 bg-gradient-to-br from-emerald-900/25 to-teal-900/15 p-8 text-center mb-6"
      >
        <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4">
          <Gamepad2 size={28} className="text-emerald-300" />
        </div>

        <div className="flex justify-center gap-6 mb-5">
          {[
            { icon: <Zap size={14} />, label: 'XP жинау', color: 'text-amber-300' },
            { icon: <Trophy size={14} />, label: 'Жетістіктер', color: 'text-violet-300' },
            { icon: <Clock size={14} />, label: 'Таймер режимі', color: 'text-blue-300' },
          ].map((s) => (
            <div key={s.label} className={`flex items-center gap-1.5 text-xs font-medium ${s.color}`}>
              {s.icon}
              {s.label}
            </div>
          ))}
        </div>

        <h3 className="text-white font-bold text-lg mb-2">{writer.shortName} туралы тапсырмалар</h3>
        <p className="text-white/45 text-sm mb-6">Білімді тест арқылы тексеріп, жетістіктер жинаңыз</p>

        <Link
          href={`/interactive?author=${writer.shortName}`}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-semibold text-sm transition-all shadow-[0_4px_20px_rgba(5,150,105,0.3)]"
        >
          <Gamepad2 size={16} />
          Тапсырмаларды ашу
          <ChevronRight size={15} />
        </Link>
      </motion.div>

      {/* Task type chips */}
      <div className="grid grid-cols-3 gap-2">
        {TASK_TYPES.map((t) => (
          <div key={t.label} className="flex items-center gap-2 p-3 rounded-xl bg-white/5 border border-white/8 text-sm">
            <span>{t.emoji}</span>
            <span className="text-white/60 text-xs">{t.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
