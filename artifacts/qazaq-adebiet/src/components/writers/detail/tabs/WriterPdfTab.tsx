import React, { useState } from 'react';
import { FileText, Download, Printer, X, ZoomIn, ZoomOut } from 'lucide-react';
import type { Writer, WriterPdf } from '@/types/writer';
import { motion, AnimatePresence } from 'framer-motion';

export default function WriterPdfTab({ writer }: { writer: Writer }) {
  const [selectedPdf, setSelectedPdf] = useState<WriterPdf | null>(null);

  if (!writer.pdf || writer.pdf.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">PDF кітаптар тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {writer.pdf.map((doc) => (
          <div key={doc.id} className="glass-card p-5 rounded-xl border border-white/10 flex items-center justify-between group">
            <div className="flex items-center gap-4 flex-1">
              <div className="w-12 h-12 rounded-lg bg-red-500/10 flex items-center justify-center shrink-0 border border-red-500/20">
                <FileText className="w-6 h-6 text-red-400" />
              </div>
              <div>
                <h3 className="text-white font-medium mb-1 line-clamp-1 group-hover:text-primary transition-colors">{doc.title}</h3>
                <p className="text-white/50 text-xs">
                  {doc.pages} бет • {doc.size}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <button 
                onClick={() => setSelectedPdf(doc)}
                className="px-3 py-1.5 bg-primary/20 hover:bg-primary text-white text-xs rounded transition-colors"
              >
                Ашу
              </button>
              <button 
                className="p-1.5 bg-white/5 hover:bg-white/10 text-white/70 rounded transition-colors"
                title="Жүктеу"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* PDF Modal Simulator */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex flex-col p-4 md:p-8"
          >
            <div className="flex items-center justify-between bg-[#1a1a1a] p-4 rounded-t-xl border-b border-white/10">
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-red-400" />
                <h3 className="text-white font-medium">{selectedPdf.title}</h3>
                <span className="text-white/40 text-sm hidden md:inline">({selectedPdf.pages} бет)</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2 border-r border-white/10 pr-4">
                  <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                    <ZoomOut className="w-4 h-4" />
                  </button>
                  <span className="text-white/80 text-sm">100%</span>
                  <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                    <ZoomIn className="w-4 h-4" />
                  </button>
                </div>
                <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                  <Printer className="w-4 h-4" />
                </button>
                <button className="p-2 text-white/60 hover:text-white hover:bg-white/10 rounded transition-colors">
                  <Download className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setSelectedPdf(null)}
                  className="p-2 text-white/60 hover:text-white hover:bg-red-500/20 rounded transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div className="flex-1 bg-[#2a2a2a] rounded-b-xl flex items-center justify-center p-8 overflow-auto relative">
              <div className="bg-white w-full max-w-3xl aspect-[1/1.4] shadow-2xl flex flex-col items-center justify-center text-black/20 text-xl font-serif">
                <FileText className="w-20 h-20 mb-4 opacity-20" />
                {selectedPdf.title}
                <p className="text-sm mt-4">Бұл жерде PDF құжат мазмұны көрсетіледі</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}