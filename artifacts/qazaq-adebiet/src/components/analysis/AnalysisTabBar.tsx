import React, { useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  BookOpen, AlignLeft, Lightbulb, Layers, GitBranch, Users,
  User, Type, Palette, Music2, Microscope, Clock, Brain,
  GraduationCap, Globe, Star, CheckSquare, Puzzle, Trophy,
  FileText, Presentation, BookMarked, Film,
} from 'lucide-react';

export interface TabDef {
  id: string;
  label: string;
  icon: React.ReactNode;
  group?: string;
}

export const TABS: TabDef[] = [
  { id: 'general',     label: 'Жалпы мәлімет',         icon: <BookOpen size={14} />,      group: 'info' },
  { id: 'summary',     label: 'Қысқаша мазмұны',        icon: <AlignLeft size={14} />,     group: 'info' },
  { id: 'theme',       label: 'Тақырып',                icon: <Lightbulb size={14} />,     group: 'analysis' },
  { id: 'composition', label: 'Композиция',             icon: <Layers size={14} />,        group: 'analysis' },
  { id: 'plot',        label: 'Сюжет',                  icon: <GitBranch size={14} />,     group: 'analysis' },
  { id: 'characters',  label: 'Кейіпкерлер',            icon: <Users size={14} />,         group: 'analysis' },
  { id: 'author',      label: 'Автор бейнесі',          icon: <User size={14} />,          group: 'analysis' },
  { id: 'language',    label: 'Тілдік ерекшеліктер',    icon: <Type size={14} />,          group: 'analysis' },
  { id: 'devices',     label: 'Көркемдегіш құралдар',   icon: <Palette size={14} />,       group: 'analysis' },
  { id: 'poem',        label: 'Өлең құрылысы',          icon: <Music2 size={14} />,        group: 'analysis' },
  { id: 'theory',      label: 'Әдеби теория',           icon: <Microscope size={14} />,    group: 'analysis' },
  { id: 'historical',  label: 'Тарихи негізі',          icon: <Clock size={14} />,         group: 'context' },
  { id: 'philosophy',  label: 'Философиялық мәні',       icon: <Brain size={14} />,         group: 'context' },
  { id: 'educational', label: 'Тәрбиелік мәні',         icon: <GraduationCap size={14} />, group: 'context' },
  { id: 'modern',      label: 'Қазіргі қоғам',          icon: <Globe size={14} />,         group: 'context' },
  { id: 'facts',       label: 'Қызықты деректер',       icon: <Star size={14} />,          group: 'context' },
  { id: 'test',        label: 'Тест',                   icon: <CheckSquare size={14} />,   group: 'practice' },
  { id: 'interactive', label: 'Интерактив',             icon: <Puzzle size={14} />,        group: 'practice' },
  { id: 'olympiad',    label: 'Олимпиада',              icon: <Trophy size={14} />,        group: 'practice' },
  { id: 'synopsis',    label: 'Конспект',               icon: <FileText size={14} />,      group: 'practice' },
  { id: 'teacher',     label: 'Мұғалімге',              icon: <Presentation size={14} />,  group: 'practice' },
  { id: 'student',     label: 'Оқушыға',                icon: <BookMarked size={14} />,    group: 'practice' },
  { id: 'media',       label: 'PDF · Аудио · Бейне',   icon: <Film size={14} />,          group: 'media' },
];

interface Props {
  activeTab: string;
  onTabChange: (id: string) => void;
}

export default function AnalysisTabBar({ activeTab, onTabChange }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Scroll active tab into view
  useEffect(() => {
    const el = scrollRef.current?.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement | null;
    el?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeTab]);

  return (
    <div className="sticky top-14 z-30 bg-black/70 backdrop-blur-xl border-b border-white/8 print:hidden">
      <div
        ref={scrollRef}
        className="flex gap-0.5 overflow-x-auto scrollbar-hide max-w-6xl mx-auto px-2"
        style={{ scrollbarWidth: 'none' }}
      >
        {TABS.map(tab => (
          <button
            key={tab.id}
            data-tab={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`relative flex items-center gap-1.5 px-3 py-3 text-xs font-medium whitespace-nowrap transition-colors shrink-0 ${
              activeTab === tab.id
                ? 'text-violet-300'
                : 'text-white/40 hover:text-white/70'
            }`}
          >
            {tab.icon}
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="tab-indicator"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-400 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
}
