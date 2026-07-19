import React from 'react';
import { motion } from 'framer-motion';
import { Search, BookOpen, GraduationCap } from 'lucide-react';
import { Link } from 'wouter';

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden pt-20">

      {/* ── Rich background glow blobs ─────────────────────────────────── */}
      <div className="absolute inset-0 z-0">
        {/* Large violet center bloom */}
        <motion.div
          animate={{ x: [0, 40, 0], y: [0, -40, 0], scale: [1, 1.15, 1] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[15%] left-[10%] w-[32rem] h-[32rem]
            rounded-full blur-[140px]"
          style={{ background: 'radial-gradient(circle, rgba(139,92,246,0.55) 0%, rgba(109,40,217,0.30) 60%, transparent 100%)' }}
        />
        {/* Gold right bloom */}
        <motion.div
          animate={{ x: [0, -50, 0], y: [0, 55, 0], scale: [1, 1.2, 1] }}
          transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[5%] right-[5%] w-[36rem] h-[36rem]
            rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(circle, rgba(245,158,11,0.35) 0%, rgba(217,119,6,0.15) 60%, transparent 100%)' }}
        />
        {/* Indigo top-right accent */}
        <motion.div
          animate={{ x: [0, 30, -20, 0], y: [0, -30, 20, 0] }}
          transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[5%] right-[20%] w-72 h-72 rounded-full blur-[100px]"
          style={{ background: 'radial-gradient(circle, rgba(99,102,241,0.50) 0%, transparent 70%)' }}
        />
        {/* Subtle cross-hatch pattern */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '30px 30px',
          }}
        />
      </div>

      <div className="container mx-auto px-4 z-10 relative">
        <div className="max-w-5xl mx-auto text-center">

          {/* ── Badge ──────────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <span className="inline-flex items-center gap-2 py-2 px-5 rounded-full
              border border-white/25 bg-white/10 backdrop-blur-md
              text-white text-sm font-medium tracking-wide shadow-lg">
              <BookOpen size={14} className="text-amber-300" />
              Цифрлық білім беру платформасы
            </span>
          </motion.div>

          {/* ── Title ──────────────────────────────────────────────────── */}
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="font-serif font-bold leading-[1.1] mb-6"
          >
            {/* Quoted brand name */}
            <span className="block text-5xl md:text-7xl lg:text-8xl text-white drop-shadow-xl">
              «Қазақ әдебиеті»
            </span>
            {/* Subtitle line */}
            <span className="block text-3xl md:text-5xl lg:text-6xl mt-3
              text-white/90 font-light tracking-wide">
              цифрлық білім беру
            </span>
            {/* Accent line */}
            <span className="block text-3xl md:text-5xl lg:text-6xl mt-1
              text-gradient text-gradient-gold font-bold">
              платформасы
            </span>
          </motion.h1>

          {/* ── Subtitle ───────────────────────────────────────────────── */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-white/80 mb-10 max-w-2xl mx-auto font-light leading-relaxed"
          >
            Ұлы ақындар, жазушылар мен жыраулардың мұрасы — бір жерде.
            <br className="hidden md:block" />
            Оқы, үйрен, дамы.
          </motion.p>

          {/* ── Search bar ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="max-w-2xl mx-auto relative mb-10"
          >
            <div className="flex items-center relative overflow-hidden group
              bg-white/12 border border-white/25 backdrop-blur-md rounded-full
              shadow-xl shadow-black/20 focus-within:border-white/40
              focus-within:bg-white/16 transition-all">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/15
                to-accent/15 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <Search className="w-5 h-5 text-white/60 ml-5 relative z-10 flex-shrink-0" />
              <input
                type="text"
                placeholder="Ақын немесе шығарма іздеңіз..."
                className="flex-1 bg-transparent border-none text-white px-4 py-3.5
                  focus:outline-none focus:ring-0 placeholder-white/45 text-base
                  relative z-10"
              />
              <button className="m-1.5 bg-white text-purple-700 hover:bg-white/90
                px-7 py-3 rounded-full font-semibold text-sm transition-all
                shadow-lg relative z-10">
                Іздеу
              </button>
            </div>
          </motion.div>

          {/* ── Quick CTAs ─────────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 mb-8"
          >
            <Link href="/cabinet"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full
                bg-violet-500/20 border border-violet-400/40 text-white text-sm
                font-medium hover:bg-violet-500/35 transition-all backdrop-blur-sm">
              <GraduationCap size={15} /> Оқушы кабинеті
            </Link>
            <Link href="/mugalim"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full
                bg-emerald-500/20 border border-emerald-400/40 text-white text-sm
                font-medium hover:bg-emerald-500/35 transition-all backdrop-blur-sm">
              <GraduationCap size={15} /> Мұғалім кабинеті
            </Link>
          </motion.div>

          {/* ── Category links ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-3"
          >
            {[
              { label: 'Ақындар',      href: '/aqyndar' },
              { label: 'Жазушылар',   href: '/zhazushylar' },
              { label: 'Жыраулар',    href: '/zhyraudar' },
              { label: 'Билер',        href: '/bi-sheshender' },
              { label: 'Ағартушылар', href: '/educators' },
            ].map((cat, i, arr) => (
              <React.Fragment key={cat.label}>
                <Link
                  href={cat.href}
                  className="text-sm text-white/70 hover:text-white transition-colors px-2 py-1">
                  {cat.label}
                </Link>
                {i < arr.length - 1 && <span className="text-white/25">•</span>}
              </React.Fragment>
            ))}
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ───────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5, duration: 1 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-white/40 text-xs tracking-widest uppercase">Төменге</span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          className="w-5 h-8 border border-white/25 rounded-full flex justify-center pt-2"
        >
          <div className="w-1 h-1 bg-white/60 rounded-full" />
        </motion.div>
      </motion.div>
    </section>
  );
}
