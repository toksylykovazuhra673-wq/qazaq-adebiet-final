import React, { useState } from 'react';
import { FileText, Download, Printer, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { Zhyrau } from '@/types/zhyrau';

export default function ZhyrauPdfTab({ zhyrau }: { zhyrau: Zhyrau }) {
  const [openPdf, setOpenPdf] = useState<string | null>(null);
  const [zoom, setZoom] = useState(100);

  if (!zhyrau.pdf || zhyrau.pdf.length === 0) {
    return (
      <div className="glass-panel p-10 rounded-2xl text-center">
        <p className="text-white/60 text-lg">PDF кітаптар жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col gap-4">
        {zhyrau.pdf.map(p => (
          <div key={p.id} className="glass-card p-5 rounded-xl flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-accent/20 flex items-center justify-center shrink-0">
              <FileText className="w-6 h-6 text-accent" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="text-white font-semibold">{p.title}</h3>
              <p className="text-white/50 text-sm">{p.pages} бет • {p.size}</p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button onClick={() => setOpenPdf(p.url)} className="px-4 py-2 bg-primary/20 hover:bg-primary/30 text-primary rounded-lg text-sm transition-colors">Ашу</button>
              <a href={p.url} download className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors" title="Жүктеу"><Download className="w-4 h-4" /></a>
              <button onClick={() => { setOpenPdf(p.url); setTimeout(() => window.print(), 500); }} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/70 transition-colors" title="Басып шығару"><Printer className="w-4 h-4" /></button>
            </div>
          </div>
        ))}
      </div>

      {openPdf && (
        <div className="fixed inset-0 z-[100] bg-black/90 flex flex-col">
          <div className="flex items-center justify-between px-6 py-3 bg-white/5 border-b border-white/10">
            <div className="flex items-center gap-3">
              <button onClick={() => setZoom(z => Math.max(50, z - 25))} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"><ZoomOut className="w-4 h-4" /></button>
              <span className="text-white text-sm">{zoom}%</span>
              <button onClick={() => setZoom(z => Math.min(200, z + 25))} className="p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white"><ZoomIn className="w-4 h-4" /></button>
            </div>
            <button onClick={() => setOpenPdf(null)} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white"><X className="w-5 h-5" /></button>
          </div>
          <div className="flex-1 overflow-auto p-4">
            <iframe src={openPdf} title="PDF" style={{ width: `${zoom}%`, height: '80vh', margin: '0 auto', display: 'block', borderRadius: 8 }} />
          </div>
        </div>
      )}
    </>
  );
}
