import React from 'react';
import { Lightbulb, Target, AlertTriangle, MessageSquare, Heart, Globe, Flag } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

function ThemeCard({ icon, label, color, text }: { icon: React.ReactNode; label: string; color: string; text: string }) {
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <span className="text-sm font-semibold uppercase tracking-wide">{label}</span>
      </div>
      <p className="text-white/80 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

export default function TabTheme({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-4 max-w-3xl">
      <ThemeCard
        icon={<Lightbulb size={16} className="text-amber-400" />}
        label="Тақырып"
        color="bg-amber-500/10 border-amber-500/20"
        text={analysis.theme}
      />
      <ThemeCard
        icon={<Target size={16} className="text-violet-400" />}
        label="Идея"
        color="bg-violet-500/10 border-violet-500/20"
        text={analysis.idea}
      />
      <ThemeCard
        icon={<AlertTriangle size={16} className="text-red-400" />}
        label="Проблематика"
        color="bg-red-500/10 border-red-500/20"
        text={`${analysis.theme} — Абай бұл мәселені халықтың рухани дағдарысы арқылы суреттейді. Шығармадағы негізгі қарама-қайшылық: надандық пен білімнің, жалқаулық пен еңбектің, пайдакүнемдік пен ізгіліктің арасындағы күрес.`}
      />
      <ThemeCard
        icon={<MessageSquare size={16} className="text-blue-400" />}
        label="Негізгі ой"
        color="bg-blue-500/10 border-blue-500/20"
        text={analysis.mainThought}
      />

      {(analysis.educationalValue || analysis.nationalValue || analysis.globalValue) && (
        <div className="pt-4 border-t border-white/8 space-y-4">
          <h3 className="text-white/40 text-xs uppercase tracking-widest">Маңызы</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {analysis.educationalValue && (
              <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Heart size={14} className="text-green-400" />
                  <span className="text-green-400 text-xs font-semibold uppercase">Тәрбиелік мәні</span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">{analysis.educationalValue}</p>
              </div>
            )}
            {analysis.nationalValue && (
              <div className="bg-cyan-500/10 border border-cyan-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Flag size={14} className="text-cyan-400" />
                  <span className="text-cyan-400 text-xs font-semibold uppercase">Ұлттық құндылығы</span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">{analysis.nationalValue}</p>
              </div>
            )}
            {analysis.globalValue && (
              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Globe size={14} className="text-indigo-400" />
                  <span className="text-indigo-400 text-xs font-semibold uppercase">Әлемдік құндылығы</span>
                </div>
                <p className="text-white/70 text-xs leading-relaxed">{analysis.globalValue}</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
