import { useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, Award, BookOpen, Trophy, Flame, Star, Printer } from 'lucide-react';
import type { Certificate } from '@/types/student';

interface Props {
  certificates: Certificate[];
  studentName: string;
  grade: string;
}

const TYPE_META: Record<string, { color: string; bgColor: string; Icon: React.ElementType; label: string }> = {
  book_read:   { color: 'from-indigo-600 to-blue-500',    bgColor: 'bg-indigo-500/10 border-indigo-500/20',   Icon: BookOpen, label: 'Оқу' },
  test_ace:    { color: 'from-amber-500 to-yellow-400',   bgColor: 'bg-amber-500/10 border-amber-500/20',     Icon: Trophy,   label: 'Тест' },
  achievement: { color: 'from-violet-600 to-purple-500',  bgColor: 'bg-violet-500/10 border-violet-500/20',   Icon: Award,    label: 'Жетістік' },
  streak:      { color: 'from-orange-500 to-amber-400',   bgColor: 'bg-orange-500/10 border-orange-500/20',   Icon: Flame,    label: 'Серия' },
};

function CertCard({ cert, name, grade, index }: { cert: Certificate; name: string; grade: string; index: number }) {
  const meta = TYPE_META[cert.type] ?? TYPE_META.achievement;
  const Icon = meta.Icon;
  const dateStr = new Date(cert.earnedAt).toLocaleDateString('kk-KZ', {
    year: 'numeric', month: 'long', day: 'numeric',
  });

  const printCertificate = () => {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`<!DOCTYPE html><html><head>
<meta charset="utf-8">
<title>${cert.title} — ${name}</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;900&display=swap');
  * { margin: 0; padding: 0; box-sizing: border-box; }
  body { font-family: Inter, sans-serif; background: #fff; padding: 60px; display: flex; flex-direction: column; align-items: center; justify-content: center; min-height: 100vh; }
  .border-frame { border: 6px double #7c3aed; border-radius: 24px; padding: 48px 60px; width: 700px; text-align: center; position: relative; background: #fafafa; }
  .seal { width: 80px; height: 80px; border-radius: 50%; background: linear-gradient(135deg, #7c3aed, #a855f7); display: flex; align-items: center; justify-content: center; margin: 0 auto 24px; font-size: 36px; }
  .org { font-size: 11px; text-transform: uppercase; letter-spacing: 3px; color: #7c3aed; margin-bottom: 24px; }
  .cert-title-label { font-size: 12px; text-transform: uppercase; letter-spacing: 4px; color: #6b7280; margin-bottom: 8px; }
  h1 { font-size: 32px; font-weight: 900; color: #1f2937; margin-bottom: 32px; }
  .recipient { font-size: 13px; color: #6b7280; margin-bottom: 8px; }
  .name { font-size: 28px; font-weight: 700; color: #7c3aed; margin-bottom: 8px; }
  .grade-text { font-size: 14px; color: #6b7280; margin-bottom: 32px; }
  .achievement-label { font-size: 13px; color: #6b7280; margin-bottom: 8px; }
  .achievement-title { font-size: 20px; font-weight: 700; color: #1f2937; margin-bottom: 4px; }
  .achievement-desc { font-size: 13px; color: #6b7280; margin-bottom: 32px; }
  hr { border: none; border-top: 1px dashed #d1d5db; margin: 32px 0; }
  .date { font-size: 12px; color: #9ca3af; }
  .stars { font-size: 24px; letter-spacing: 8px; color: #7c3aed; margin-top: 16px; }
  @media print { body { padding: 0; } .border-frame { width: 100%; border: 4px double #7c3aed; } }
</style>
</head><body>
<div class="border-frame">
  <div class="seal">${cert.icon ?? '🏆'}</div>
  <div class="org">QazaqAdebiet · Қазақ Әдебиеті Платформасы</div>
  <div class="cert-title-label">Сертификат</div>
  <h1>${cert.title}</h1>
  <div class="recipient">Осы сертификат берілді:</div>
  <div class="name">${name}</div>
  <div class="grade-text">${grade}</div>
  <div class="achievement-label">Жетістігі үшін:</div>
  <div class="achievement-title">${cert.subtitle}</div>
  <hr>
  <div class="date">${dateStr}</div>
  <div class="stars">★ ★ ★</div>
</div>
<script>window.onload = () => { window.print(); }<\/script>
</body></html>`);
    win.document.close();
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.06 * index }}
      className="group relative bg-white/4 border border-white/10 rounded-2xl overflow-hidden hover:border-white/18 transition-all">
      {/* Color stripe */}
      <div className={`h-1.5 bg-gradient-to-r ${meta.color}`} />

      <div className="p-5">
        <div className="flex items-start gap-4">
          {/* Icon */}
          <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${meta.color} flex items-center justify-center flex-shrink-0 shadow-lg text-2xl`}>
            {cert.icon ? (
              <span>{cert.icon}</span>
            ) : (
              <Icon size={22} className="text-white" />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full border text-[10px] font-medium mb-2 ${meta.bgColor}`}>
              <Icon size={9} />
              <span className="text-gray-400">{meta.label}</span>
            </div>
            <h3 className="text-white font-bold text-base leading-tight">{cert.title}</h3>
            <p className="text-gray-400 text-sm mt-0.5">{cert.subtitle}</p>
            <p className="text-gray-600 text-xs mt-1.5">{dateStr}</p>
          </div>
        </div>

        {/* Certificate mini preview */}
        <div className={`mt-4 rounded-xl border ${meta.bgColor.replace('bg-', 'bg-').replace('/10', '/5')} p-3 text-center`}>
          <div className="text-[10px] text-gray-600 uppercase tracking-widest mb-1">QazaqAdebiet</div>
          <div className="text-white text-xs font-semibold">{cert.title}</div>
          <div className="text-gray-500 text-[11px] mt-1">— {name} —</div>
          <div className="flex justify-center gap-1 mt-1.5">
            {[...Array(3)].map((_, i) => <Star key={i} size={8} className="text-amber-400 fill-current" />)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-2 mt-3">
          <button
            onClick={printCertificate}
            className="flex-1 flex items-center justify-center gap-2 py-2 rounded-xl
              bg-white/6 border border-white/10 text-gray-400 hover:text-white hover:bg-white/10
              transition-all text-xs font-medium">
            <Printer size={13} />
            Басып шығару
          </button>
          <button
            onClick={printCertificate}
            className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl
              bg-gradient-to-r ${meta.color} text-white text-xs font-medium
              opacity-80 hover:opacity-100 transition-all`}>
            <Download size={13} />
            Жүктеу
          </button>
        </div>
      </div>
    </motion.div>
  );
}

export default function CabCertificates({ certificates, studentName, grade }: Props) {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-amber-500/15 border border-amber-500/20 flex items-center justify-center">
          <Award size={18} className="text-amber-400" />
        </div>
        <div>
          <h2 className="text-white font-bold">Сертификаттар</h2>
          <p className="text-gray-500 text-xs">{certificates.length} сертификат алынды</p>
        </div>
      </div>

      <AnimatePresence>
        {certificates.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            className="text-center py-20 bg-white/3 border border-white/6 rounded-2xl">
            <Award size={48} className="mx-auto mb-4 text-gray-700" />
            <h3 className="text-gray-400 font-semibold mb-2">Сертификат жоқ</h3>
            <p className="text-gray-600 text-sm max-w-xs mx-auto">
              Кітап оқы, тест тапсыр немесе жетістіктерге жет —
              сертификаттар автоматты жасалады.
            </p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {certificates.map((cert, i) => (
              <CertCard
                key={cert.id}
                cert={cert}
                name={studentName}
                grade={grade}
                index={i}
              />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Info box */}
      <div className="bg-violet-500/5 border border-violet-500/15 rounded-2xl p-4 text-xs text-gray-500 leading-relaxed">
        <strong className="text-gray-400">Сертификаттар қалай алынады?</strong>
        <ul className="mt-2 space-y-1 list-disc list-inside">
          <li>Кітапты 90%-дан астам оқы</li>
          <li>3+ тестте 80%-дан астам ұпай жина</li>
          <li>Жетістіктерді аш (XP жина)</li>
          <li>7 күн қатарынан белсенді бол</li>
        </ul>
      </div>
    </div>
  );
}
