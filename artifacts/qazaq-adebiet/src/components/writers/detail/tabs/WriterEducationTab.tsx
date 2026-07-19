import { motion } from 'framer-motion';
import { GraduationCap } from 'lucide-react';
import type { Writer, WriterEducationItem } from '@/types/writer';
import WriterPdfLinkSection from '@/components/writers/detail/WriterPdfLinkSection';

function EducationCard({ item, index }: { item: WriterEducationItem; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.07 }}
      className="flex gap-5"
    >
      {/* Connector */}
      <div className="flex flex-col items-center">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-600 to-blue-600 flex items-center justify-center flex-shrink-0 shadow-[0_0_16px_rgba(139,92,246,0.35)]">
          <GraduationCap size={16} className="text-white" />
        </div>
        {/* line */}
        <div className="w-0.5 flex-1 bg-gradient-to-b from-violet-500/30 to-transparent mt-2 mb-0" />
      </div>

      <div className="pb-8 flex-1 min-w-0">
        <div className="flex items-center gap-3 mb-1">
          <span className="text-violet-300 text-xs font-semibold">{item.years}</span>
          {item.city && <span className="text-white/35 text-xs">· {item.city}</span>}
        </div>
        <h4 className="text-white font-bold text-base mb-0.5">{item.institution}</h4>
        <p className="text-white/55 text-sm mb-2">{item.degree}</p>
        {item.note && (
          <p className="text-white/45 text-sm leading-relaxed bg-white/4 border border-white/8 rounded-xl px-4 py-3">
            {item.note}
          </p>
        )}
      </div>
    </motion.div>
  );
}

export default function WriterEducationTab({ writer }: { writer: Writer }) {
  const items = writer.education ?? [];

  if (items.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <GraduationCap size={40} className="text-white/15 mb-4" />
          <p className="text-white/30">Білімі туралы мәлімет толықтырылуда</p>
        </div>
        <WriterPdfLinkSection writerSlug={writer.slug} section="education" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-xl font-bold mb-6">Білімі</h2>
      <div>
        {items.map((item, i) => <EducationCard key={i} item={item} index={i} />)}
      </div>
      <WriterPdfLinkSection writerSlug={writer.slug} section="education" />
    </div>
  );
}
