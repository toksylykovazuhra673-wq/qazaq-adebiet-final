import { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, BookOpen, Eye, MapPin, Award, Share2, Star, Download, Printer } from 'lucide-react';
import { Link } from 'wouter';
import type { Writer } from '@/types/writer';

function formatDate(d: string) {
  const [y, m, day] = d.split('-');
  const months = ['қаңтар','ақпан','наурыз','сәуір','мамыр','маусым','шілде','тамыз','қыркүйек','қазан','қараша','желтоқсан'];
  if (m && day) return `${parseInt(day)} ${months[parseInt(m)-1]} ${y}`;
  return y;
}

function formatYears(birthDate: string, deathDate: string | null): string {
  return `${birthDate.split('-')[0]} – ${deathDate ? deathDate.split('-')[0] : 'б.з.'}`;
}

export default function WriterDetailHero({ writer }: { writer: Writer }) {
  const [favorited, setFavorited] = useState(() => {
    try { return JSON.parse(localStorage.getItem('writer_favorites') || '[]').includes(writer.slug); }
    catch { return false; }
  });
  const [copied, setCopied] = useState(false);

  const toggleFavorite = useCallback(() => {
    setFavorited((prev) => {
      const next = !prev;
      try {
        const favs: string[] = JSON.parse(localStorage.getItem('writer_favorites') || '[]');
        const updated = next ? [...favs, writer.slug] : favs.filter((s) => s !== writer.slug);
        localStorage.setItem('writer_favorites', JSON.stringify(updated));
      } catch {}
      return next;
    });
  }, [writer.slug]);

  const share = useCallback(async () => {
    const url = `${location.origin}/writers/${writer.slug}`;
    const text = `${writer.fullName} — Қазақ жазушысы`;
    if (navigator.share) {
      await navigator.share({ title: text, url }).catch(() => {});
    } else {
      navigator.clipboard.writeText(url).catch(() => {});
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }, [writer]);

  const print = useCallback(() => window.print(), []);

  return (
    <div className="relative w-full overflow-hidden">
      {/* ── Full-width banner ─────────────────────────────────────────────── */}
      <div className="absolute inset-0 -z-0">
        {writer.photo ? (
          <img src={writer.photo} alt="" className="w-full h-full object-cover object-top scale-105 blur-sm opacity-15" />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-violet-900/40 to-indigo-900/40" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/70 via-slate-950/85 to-slate-950" />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/50 to-transparent" />
      </div>

      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-[500px] h-[400px] bg-violet-700/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative z-10 container mx-auto px-4 lg:px-8 pt-10 pb-14">
        {/* Back link */}
        <Link
          href="/writers"
          className="inline-flex items-center gap-2 text-white/50 hover:text-white mb-8 transition-colors text-sm group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Барлық жазушылар
        </Link>

        <div className="flex flex-col lg:flex-row gap-10 lg:gap-14 items-start">
          {/* ── Portrait ───────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="shrink-0 flex flex-col items-center gap-4"
          >
            <div className="relative w-[220px] h-[280px] lg:w-[260px] lg:h-[320px] rounded-3xl overflow-hidden shadow-[0_0_60px_rgba(139,92,246,0.3)] border border-white/10">
              {writer.photo ? (
                <img src={writer.photo} alt={writer.fullName} className="w-full h-full object-cover object-top" />
              ) : (
                <div className="w-full h-full bg-gradient-to-br from-violet-700 to-indigo-900 flex items-center justify-center">
                  <span className="text-9xl font-serif text-white/70">{writer.fullName.charAt(0)}</span>
                </div>
              )}
              {/* Subtle inner shadow */}
              <div className="absolute inset-0 shadow-[inset_0_-60px_40px_rgba(15,10,30,0.7)]" />
            </div>

            {/* Action buttons below portrait */}
            <div className="flex gap-2">
              <button
                onClick={toggleFavorite}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-medium transition-all ${
                  favorited
                    ? 'bg-amber-500/20 border-amber-400/40 text-amber-300'
                    : 'bg-white/6 border-white/12 text-white/55 hover:bg-white/10 hover:text-white'
                }`}
              >
                <Star size={13} fill={favorited ? 'currentColor' : 'none'} />
                {favorited ? 'Таңдаулы' : 'Сақтау'}
              </button>
              <button
                onClick={share}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/12 bg-white/6 text-white/55 hover:bg-white/10 hover:text-white text-xs font-medium transition-all"
              >
                <Share2 size={13} />
                {copied ? 'Көшірілді!' : 'Бөлісу'}
              </button>
              <button
                onClick={print}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-white/12 bg-white/6 text-white/55 hover:bg-white/10 hover:text-white text-xs font-medium transition-all"
              >
                <Printer size={13} />
              </button>
            </div>
          </motion.div>

          {/* ── Info ───────────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex-1 min-w-0"
          >
            {/* Profession badges */}
            <div className="flex flex-wrap gap-2 mb-4">
              {writer.profession.map((p) => (
                <span key={p} className="px-3 py-1 rounded-full bg-white/6 border border-white/12 text-xs text-white/70">
                  {p}
                </span>
              ))}
              <span className="px-3 py-1 rounded-full bg-violet-500/15 border border-violet-500/30 text-xs text-violet-300">
                {writer.era}
              </span>
              <span className="px-3 py-1 rounded-full bg-blue-500/12 border border-blue-500/25 text-xs text-blue-300">
                {writer.literaryMovement}
              </span>
            </div>

            {/* Name */}
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif text-white font-bold mb-1 leading-tight">
              {writer.fullName}
            </h1>
            {writer.nickname && (
              <p className="text-white/45 text-lg italic font-serif mb-3">«{writer.nickname}»</p>
            )}

            {/* Life years */}
            <p className="text-violet-300 text-2xl font-semibold mb-6">
              {formatYears(writer.birthDate, writer.deathDate)}
            </p>

            {/* Genre chips */}
            <div className="flex flex-wrap gap-2 mb-6">
              {writer.genre.map((g) => (
                <span key={g} className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-white/55 text-sm">
                  {g}
                </span>
              ))}
            </div>

            {/* Awards */}
            {writer.awards?.length > 0 && (
              <div className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/8 border border-amber-500/20 mb-6">
                <Award className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-x-4 gap-y-1">
                  {writer.awards.map((a, i) => (
                    <span key={i} className="text-sm text-white/70">{a}</span>
                  ))}
                </div>
              </div>
            )}

            {/* 4-stat grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
              {[
                { icon: <Calendar size={16} />, label: 'Туылды', value: formatDate(writer.birthDate), sub: writer.birthPlace, color: 'text-blue-400' },
                { icon: <Calendar size={16} />, label: 'Қайтыс болды', value: writer.deathDate ? formatDate(writer.deathDate) : 'Тіршілікте', sub: writer.deathPlace ?? '', color: 'text-rose-400' },
                { icon: <BookOpen size={16} />, label: 'Шығармашылығы', value: `${writer.worksCount} шығарма`, sub: `${writer.quotesCount} нақыл`, color: 'text-emerald-400' },
                { icon: <Eye size={16} />, label: 'Қаралым', value: writer.viewCount.toLocaleString('kk-KZ'), sub: 'рет қаралды', color: 'text-violet-400' },
              ].map((s) => (
                <div key={s.label} className="p-4 rounded-2xl bg-white/5 border border-white/8 flex items-start gap-3">
                  <span className={s.color}>{s.icon}</span>
                  <div className="min-w-0">
                    <p className="text-white/35 text-xs mb-0.5">{s.label}</p>
                    <p className="text-white text-sm font-semibold leading-snug">{s.value}</p>
                    {s.sub && <p className="text-white/40 text-xs mt-0.5 truncate">{s.sub}</p>}
                  </div>
                </div>
              ))}
            </div>

            {/* Description */}
            <p className="text-white/65 text-base leading-relaxed">{writer.description}</p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
