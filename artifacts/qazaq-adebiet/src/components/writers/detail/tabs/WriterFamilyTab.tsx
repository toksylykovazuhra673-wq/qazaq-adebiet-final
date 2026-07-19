import { motion } from 'framer-motion';
import { Users } from 'lucide-react';
import type { Writer, WriterFamilyMember } from '@/types/writer';
import WriterPdfLinkSection from '@/components/writers/detail/WriterPdfLinkSection';

const RELATION_ICONS: Record<string, string> = {
  'Әкесі': '👨', 'Анасы': '👩', 'Зайыбы': '💑', 'Жары': '💑',
  'Ұлы': '👦', 'Қызы': '👧', 'Немере': '🧒', 'Ағасы': '👨', 'Інісі': '👦',
  'Апасы': '👩', 'Қарындасы': '👧',
};

function FamilyCard({ member }: { member: WriterFamilyMember }) {
  const icon = RELATION_ICONS[member.relation] ?? '👤';
  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl bg-white/5 border border-white/8 hover:bg-white/8 transition-colors">
      <div className="w-11 h-11 rounded-2xl bg-violet-500/15 border border-violet-500/25 flex items-center justify-center text-2xl flex-shrink-0">
        {icon}
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2 flex-wrap mb-0.5">
          <h4 className="text-white font-semibold text-sm">{member.name}</h4>
          <span className="px-2 py-0.5 rounded-full bg-violet-500/12 border border-violet-500/22 text-violet-300 text-xs">{member.relation}</span>
          {member.years && <span className="text-white/35 text-xs">{member.years}</span>}
        </div>
        {member.note && <p className="text-white/55 text-sm leading-relaxed">{member.note}</p>}
      </div>
    </div>
  );
}

export default function WriterFamilyTab({ writer }: { writer: Writer }) {
  const members = writer.family ?? [];

  if (members.length === 0) {
    return (
      <div className="max-w-2xl">
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Users size={40} className="text-white/15 mb-4" />
          <p className="text-white/30">Отбасы туралы мәлімет толықтырылуда</p>
        </div>
        <WriterPdfLinkSection writerSlug={writer.slug} section="family" />
      </div>
    );
  }

  return (
    <div className="max-w-2xl">
      <h2 className="text-white text-xl font-bold mb-6">Отбасы</h2>
      <div className="space-y-3">
        {members.map((m, i) => (
          <motion.div key={i} initial={{ opacity: 0, x: -12 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}>
            <FamilyCard member={m} />
          </motion.div>
        ))}
      </div>
      <WriterPdfLinkSection writerSlug={writer.slug} section="family" />
    </div>
  );
}
