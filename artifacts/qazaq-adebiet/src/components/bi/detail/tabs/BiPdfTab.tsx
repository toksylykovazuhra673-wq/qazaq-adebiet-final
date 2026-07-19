import React, { useState } from 'react';
import { FileText, Download, Printer, ZoomIn, ZoomOut, X, BookOpen } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { BiSheshen } from '@/types/bi';
import TeacherLinkSection from '@/components/bi/detail/TeacherLinkSection';

function PdfViewer({ url, title, onClose }: { url: string; title: string; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0618]/90 border-b border-white/10 shrink-0">
        <p className="text-white text-sm font-medium truncate max-w-xs">{title}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><ZoomOut className="w-4 h-4" /></button>
          <span className="text-white/60 text-sm w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><Printer className="w-4 h-4" /></button>
          <a href={url} download className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><Download className="w-4 h-4" /></a>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors ml-2"><X className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <iframe src={url} title={title} style={{ width: `${zoom}%`, minWidth: 600, height: '90vh' }} className="rounded-xl border border-white/10 shadow-2xl bg-white" />
      </div>
    </motion.div>
  );
}

export default function BiPdfTab({ bi }: { bi: BiSheshen }) {
  const [openPdf, setOpenPdf] = useState<{ url: string; title: string } | null>(null);

  if (!bi.pdf || bi.pdf.length === 0) {
    return (
      <div className="space-y-6">
        <div className="glass-panel rounded-2xl p-8 border border-white/5">
          <div className="flex flex-col items-center text-center py-8">
            <div className="w-20 h-20 rounded-2xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mb-5">
              <BookOpen className="w-9 h-9 text-amber-400/50" />
            </div>
            <h3 className="text-xl font-serif text-white mb-2">PDF кітаптар жоқ</h3>
            <p className="text-white/50 text-sm max-w-sm">{bi.fullName} тұлғасына арналған оқу құралдары PDF нұсқасы жақын арада қосылады.</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {[`${bi.fullName} — Шығармалар жинағы`, `${bi.fullName} туралы зерттеу`, `${bi.era} билері мен шешендері`].map((title, i) => (
            <div key={i} className="glass-card rounded-xl p-5 flex gap-4 opacity-35 pointer-events-none">
              <div className="w-12 h-16 rounded-lg bg-gradient-to-b from-amber-600/30 to-amber-800/20 border border-amber-500/20 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-amber-400/50" /></div>
              <div className="flex-1 min-w-0"><p className="text-white/50 text-sm font-medium line-clamp-2 mb-1">{title}</p><p className="text-white/30 text-xs">Жақын арада қосылады</p></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {bi.pdf.map(p => (
          <div key={p.id} className="glass-card rounded-xl p-5 flex gap-4">
            <div className="w-12 h-16 rounded-lg bg-gradient-to-b from-amber-600/30 to-amber-800/20 border border-amber-500/20 flex items-center justify-center shrink-0"><FileText className="w-5 h-5 text-amber-400" /></div>
            <div className="flex-1 min-w-0">
              <p className="text-white text-sm font-medium line-clamp-2 mb-1">{p.title}</p>
              <div className="flex gap-3 mb-3"><span className="text-white/40 text-xs">{p.pages} бет</span><span className="text-white/40 text-xs">{p.size}</span></div>
              <div className="flex gap-2">
                <button onClick={() => setOpenPdf({ url: p.url, title: p.title })} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 border border-teal-500/20 transition-colors"><ZoomIn className="w-3.5 h-3.5" />Қарау</button>
                <a href={p.url} download className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/20 transition-colors"><Download className="w-3.5 h-3.5" />Жүктеу</a>
              </div>
            </div>
          </div>
        ))}
      </div>
      <AnimatePresence>
        {openPdf && <PdfViewer url={openPdf.url} title={openPdf.title} onClose={() => setOpenPdf(null)} />}
      </AnimatePresence>
      <TeacherLinkSection biSlug={bi.slug} category="pdf" />
    </>
  );
}
