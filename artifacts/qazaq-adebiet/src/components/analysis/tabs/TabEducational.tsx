import React from 'react';
import { GraduationCap, Heart, Flag, Globe } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

function Section({ icon, label, color, text }: { icon: React.ReactNode; label: string; color: string; text?: string }) {
  if (!text) return null;
  return (
    <div className={`rounded-2xl border p-5 ${color}`}>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h3 className="font-semibold text-sm uppercase tracking-wide">{label}</h3>
      </div>
      <p className="text-white/80 text-sm leading-relaxed">{text}</p>
    </div>
  );
}

export default function TabEducational({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-4 max-w-3xl">
      <Section
        icon={<GraduationCap size={16} className="text-green-400" />}
        label="Тәрбиелік мәні"
        color="bg-green-500/10 border-green-500/20"
        text={analysis.educationalValue}
      />
      <Section
        icon={<Flag size={16} className="text-cyan-400" />}
        label="Ұлттық құндылығы"
        color="bg-cyan-500/10 border-cyan-500/20"
        text={analysis.nationalValue}
      />
      <Section
        icon={<Globe size={16} className="text-indigo-400" />}
        label="Әлемдік құндылығы"
        color="bg-indigo-500/10 border-indigo-500/20"
        text={analysis.globalValue}
      />

      {/* Key educational takeaways */}
      <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Heart size={14} className="text-rose-400" />
          <h3 className="text-rose-300 text-sm font-semibold uppercase tracking-wide">Оқушы не үйренеді?</h3>
        </div>
        <ul className="space-y-2">
          {[
            'Ар-ождан мен адамгершіліктің адам өміріндегі рөлін түсінеді',
            'Ізгілік пен білімге ұмтылудың маңызын сезінеді',
            'Сыни ойлауды дамытады: қоғамдық кемшіліктерді аңғарады',
            'Қазақ тілі мен мәдениетіне деген сүйіспеншілік оянады',
            'Бейнелеу құралдарын мәтіннен табуды үйренеді',
          ].map((item, i) => (
            <li key={i} className="flex items-start gap-2 text-white/70 text-sm">
              <span className="text-rose-400 mt-0.5">✦</span> {item}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
