import React from 'react';
import { motion } from 'framer-motion';
import { Scale, Users, CheckCircle2, Gavel } from 'lucide-react';
import type { BiSheshen } from '@/types/bi';
import TeacherPdfUploader from '@/components/bi/detail/TeacherPdfUploader';

export default function BiCourtCasesTab({ bi }: { bi: BiSheshen }) {
  if (!bi.courtCases || bi.courtCases.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <div className="flex flex-col items-center py-8">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-4">
            <Scale className="w-8 h-8 text-amber-400/50" />
          </div>
          <p className="text-white/60 text-lg">Билік айтқан даулар жақын арада қосылады.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {bi.courtCases.map((c, i) => (
        <motion.div
          key={c.id}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="glass-panel rounded-2xl overflow-hidden border border-white/5 hover:border-amber-500/20 transition-colors"
        >
          {/* Header */}
          <div className="flex items-center gap-4 px-6 py-4 border-b border-white/8 bg-white/2">
            <div className="w-10 h-10 rounded-full bg-amber-500/15 border border-amber-500/25 flex items-center justify-center shrink-0">
              <Gavel className="w-4 h-4 text-amber-400" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold font-serif">{c.title}</h3>
              <span className="text-amber-400 text-xs font-medium">{c.year} жыл</span>
            </div>
          </div>

          {/* Body */}
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-start gap-3">
              <Users className="w-4 h-4 text-teal-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Тараптар</p>
                <p className="text-white/80 text-sm">{c.parties}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Scale className="w-4 h-4 text-white/40 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Жағдай</p>
                <p className="text-white/70 text-sm">{c.description}</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
              <div>
                <p className="text-xs text-white/40 uppercase tracking-wider mb-1">Шешім</p>
                <p className="text-emerald-400/90 text-sm font-medium">{c.verdict}</p>
              </div>
            </div>
          </div>
        </motion.div>
      ))}

      {/* Teacher PDF uploader */}
      <TeacherPdfUploader biSlug={bi.slug} category="dauly" />
    </div>
  );
}
