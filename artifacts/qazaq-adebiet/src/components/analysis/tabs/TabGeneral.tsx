import React from 'react';
import { motion } from 'framer-motion';
import { BookOpen, Hash, BarChart2, Globe, Sparkles } from 'lucide-react';
import type { Analysis } from '@/types/analysis';

function Card({ title, value, sub }: { title: string; value: string; sub?: string }) {
  return (
    <div className="bg-white/[0.04] border border-white/8 rounded-2xl p-5">
      <p className="text-white/40 text-xs uppercase tracking-wider mb-1">{title}</p>
      <p className="text-white font-semibold text-base leading-snug">{value}</p>
      {sub && <p className="text-white/40 text-xs mt-1">{sub}</p>}
    </div>
  );
}

export default function TabGeneral({ analysis }: { analysis: Analysis }) {
  const wordCount = analysis.keyWords?.reduce((s, w) => s + w.count, 0) ?? 0;

  return (
    <div className="space-y-8">
      {/* Core metadata */}
      <section>
        <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
          <BookOpen size={12} /> Жалпы ақпарат
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          <Card title="Автор" value={analysis.author} />
          <Card title="Жанр" value={analysis.genre} />
          <Card title="Кезең" value={analysis.period} />
          <Card title="Бағыт" value={analysis.direction} />
          <Card title="Ағым" value={analysis.literaryMovement} />
          <Card title="Тип" value={analysis.type} />
          {analysis.pageCount && <Card title="Бет саны" value={`${analysis.pageCount} бет`} />}
          {analysis.readingTime && <Card title="Оқу уақыты" value={analysis.readingTime} />}
          {analysis.readingLevel && <Card title="Деңгейі" value={analysis.readingLevel} />}
          {analysis.language && <Card title="Тілі" value={analysis.language} />}
          {analysis.rating != null && <Card title="Рейтинг" value={`${analysis.rating} / 5`} />}
          {analysis.downloadCount != null && <Card title="Жүктеу" value={analysis.downloadCount.toLocaleString()} sub="рет" />}
        </div>
      </section>

      {/* Theme block */}
      <section>
        <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
          <Sparkles size={12} /> Тақырып, идея, негізгі ой
        </h3>
        <div className="space-y-3">
          {[
            { label: 'Тақырып', text: analysis.theme },
            { label: 'Идея', text: analysis.idea },
            { label: 'Негізгі ой', text: analysis.mainThought },
          ].map(item => (
            <div key={item.label} className="bg-white/[0.03] border border-white/8 rounded-2xl p-5">
              <p className="text-violet-300 text-xs font-semibold uppercase tracking-wider mb-2">{item.label}</p>
              <p className="text-white/80 text-sm leading-relaxed">{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Device stats */}
      {analysis.deviceStatistics && (
        <section>
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <BarChart2 size={12} /> Бейнелеу құралдары статистикасы
          </h3>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-5 space-y-3">
            {Object.entries(analysis.deviceStatistics)
              .sort((a, b) => b[1] - a[1])
              .map(([name, count]) => {
                const max = Math.max(...Object.values(analysis.deviceStatistics!));
                const pct = (count / max) * 100;
                return (
                  <div key={name}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-white/70">{name}</span>
                      <span className="text-violet-400 font-medium">{count}</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${pct}%` }}
                        transition={{ duration: 0.6, ease: 'easeOut' }}
                        className="h-full bg-gradient-to-r from-violet-500 to-purple-400 rounded-full"
                      />
                    </div>
                  </div>
                );
              })}
          </div>
        </section>
      )}

      {/* Word cloud */}
      {analysis.keyWords && analysis.keyWords.length > 0 && (
        <section>
          <h3 className="text-white/40 text-xs uppercase tracking-widest mb-4 flex items-center gap-2">
            <Hash size={12} /> Маңызды сөздер (Word Cloud)
          </h3>
          <div className="bg-white/[0.03] border border-white/8 rounded-2xl p-6">
            <div className="flex flex-wrap gap-2 justify-center">
              {analysis.keyWords.map(({ word, count }) => {
                const maxCount = Math.max(...analysis.keyWords!.map(w => w.count));
                const size = 12 + Math.round((count / maxCount) * 20);
                const opacity = 0.4 + (count / maxCount) * 0.6;
                return (
                  <span
                    key={word}
                    className="text-violet-300 font-medium transition-transform hover:scale-110 cursor-default"
                    style={{ fontSize: `${size}px`, opacity }}
                    title={`${count} рет кездескен`}
                  >
                    {word}
                  </span>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
