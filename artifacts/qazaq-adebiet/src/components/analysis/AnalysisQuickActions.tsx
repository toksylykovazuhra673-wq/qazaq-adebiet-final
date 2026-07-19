import React from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, Headphones, FileText, Play, Sparkles,
  ClipboardList, Presentation, Trophy, Star, Share2,
} from 'lucide-react';
import type { Analysis } from '@/types/analysis';

interface Props {
  analysis: Analysis;
  onTabChange: (tab: string) => void;
}

const ACTIONS = [
  { id: 'read',      icon: BookOpen,       label: 'Оқу',            color: 'from-emerald-500 to-teal-500',    tab: null },
  { id: 'listen',    icon: Headphones,     label: 'Тыңдау',         color: 'from-amber-500 to-orange-500',    tab: 'media' },
  { id: 'pdf',       icon: FileText,       label: 'PDF',            color: 'from-blue-500 to-indigo-500',     tab: 'media' },
  { id: 'video',     icon: Play,           label: 'Бейне',          color: 'from-red-500 to-pink-500',        tab: 'media' },
  { id: 'analysis',  icon: Sparkles,       label: 'Автоматты талдау', color: 'from-violet-500 to-purple-500', tab: 'auto' },
  { id: 'synopsis',  icon: ClipboardList,  label: 'Конспект',       color: 'from-cyan-500 to-blue-500',       tab: 'synopsis' },
  { id: 'lesson',    icon: Presentation,   label: 'Сабақ жоспары',  color: 'from-lime-500 to-green-500',      tab: 'teacher' },
  { id: 'olympiad',  icon: Trophy,         label: 'Олимпиада',      color: 'from-yellow-500 to-amber-500',    tab: 'olympiad' },
  { id: 'favorite',  icon: Star,           label: 'Таңдаулы',       color: 'from-pink-500 to-rose-500',       tab: null },
  { id: 'share',     icon: Share2,         label: 'Бөлісу',         color: 'from-slate-500 to-gray-500',      tab: null },
];

export default function AnalysisQuickActions({ analysis, onTabChange }: Props) {
  const handleAction = (id: string, tab: string | null) => {
    if (id === 'read') {
      window.open(`/reader/${analysis.workSlug}`, '_blank');
      return;
    }
    if (id === 'favorite') {
      // Toggle favorite in localStorage
      const favs: string[] = JSON.parse(localStorage.getItem('qa-favs') || '[]');
      const idx = favs.indexOf(analysis.workSlug);
      if (idx === -1) favs.push(analysis.workSlug);
      else favs.splice(idx, 1);
      localStorage.setItem('qa-favs', JSON.stringify(favs));
      return;
    }
    if (id === 'share') {
      navigator.clipboard.writeText(window.location.href);
      return;
    }
    if (tab) onTabChange(tab);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 print:hidden">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 lg:grid-cols-10 gap-3">
        {ACTIONS.map((action, i) => {
          const Icon = action.icon;
          return (
            <motion.button
              key={action.id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => handleAction(action.id, action.tab)}
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/8 hover:border-white/15 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${action.color} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                <Icon size={18} className="text-white" />
              </div>
              <span className="text-white/70 text-xs font-medium text-center leading-tight group-hover:text-white transition-colors">
                {action.label}
              </span>
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
