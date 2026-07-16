import React from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, BookOpen } from 'lucide-react';
import type { Educator } from '@/types/educator';

export default function EducatorPdfTab({ educator: e }: { educator: Educator }) {
  if (!e.pdf?.length) {
    return (
      <div className="flex flex-col items-center py-24 text-center">
        <FileText className="w-12 h-12 text-white/15 mb-3" />
        <p className="text-white/40 mb-2">PDF материалдар жоқ</p>
        <p className="text-white/25 text-sm">Жақын арада қосылады</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
      {e.pdf.map((p, i) => (
        <motion.div
          key={p.id}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.05 }}
          className="glass-panel rounded-2xl border border-white/8 hover:border-violet-500/20 transition-colors p-5 flex gap-4"
        >
          <div className="shrink-0 w-12 h-16 rounded-lg bg-red-500/10 border border-red-500/20 flex flex-col items-center justify-center gap-1">
            <FileText className="w-5 h-5 text-red-400" />
            <span className="text-[9px] text-red-400/80 font-bold">PDF</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-medium text-sm leading-snug mb-1">{p.title}</p>
            <div className="flex gap-3 text-white/35 text-xs mb-3">
              <span className="flex items-center gap-1">
                <BookOpen className="w-3 h-3" />
                {p.pages} бет
              </span>
              <span>{p.size}</span>
            </div>
            <a
              href={p.url || '#'}
              target={p.url ? '_blank' : undefined}
              rel="noopener noreferrer"
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                p.url
                  ? 'bg-violet-500/15 text-violet-300 border border-violet-500/25 hover:bg-violet-500/25'
                  : 'bg-white/5 text-white/25 border border-white/8 cursor-not-allowed'
              }`}
            >
              <ExternalLink className="w-3 h-3" />
              {p.url ? 'Оқу' : 'Қолжетімді емес'}
            </a>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
