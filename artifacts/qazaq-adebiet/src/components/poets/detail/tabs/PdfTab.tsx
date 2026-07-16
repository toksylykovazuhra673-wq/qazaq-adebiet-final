import React, { useState } from 'react';
import { FileText, Download, Printer, X, FileSearch } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Poet } from '@/types/poet';

export default function PdfTab({ poet }: { poet: Poet }) {
  const [selectedPdf, setSelectedPdf] = useState<string | null>(null);

  if (!poet.pdf || poet.pdf.length === 0) {
    return (
      <div className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center max-w-md mx-auto">
        <div className="w-16 h-16 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-6">
          <FileText className="w-8 h-8 text-white/30" />
        </div>
        <h3 className="text-2xl font-serif text-white mb-3">PDF кітаптар</h3>
        <p className="text-white/60">Электронды кітаптар жақын арада қосылады.</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {poet.pdf.map((item) => (
        <div key={item.id} className="glass-card rounded-2xl p-6 flex flex-col">
          <div className="w-12 h-12 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center mb-5 border border-blue-500/20">
            <FileText className="w-6 h-6" />
          </div>
          
          <h4 className="text-lg font-medium text-white mb-2 leading-snug flex-1">
            {item.title}
          </h4>
          
          <div className="flex items-center gap-4 text-sm text-white/50 mb-6 font-mono">
            <span>{item.pages} бет</span>
            <span className="w-1 h-1 rounded-full bg-white/20"></span>
            <span>{item.size}</span>
          </div>
          
          <div className="flex gap-2">
            <button 
              onClick={() => item.url ? setSelectedPdf(item.url) : alert("Файл сілтемесі жоқ")}
              className="flex-1 bg-primary hover:bg-primary/90 text-white py-2 rounded-xl text-sm font-medium transition-colors flex justify-center items-center gap-2"
            >
              <FileSearch className="w-4 h-4" /> Ашу
            </button>
            <button 
              className="w-10 flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center transition-colors"
              title="Жүктеу"
            >
              <Download className="w-4 h-4 text-white/70" />
            </button>
            <button 
              className="w-10 flex-shrink-0 bg-white/5 hover:bg-white/10 border border-white/10 text-white rounded-xl flex items-center justify-center transition-colors"
              title="Басып шығару"
            >
              <Printer className="w-4 h-4 text-white/70" />
            </button>
          </div>
        </div>
      ))}

      {/* Embedded PDF Viewer Modal */}
      <AnimatePresence>
        {selectedPdf && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex flex-col p-4 md:p-8"
          >
            <div className="flex justify-between items-center mb-4 text-white">
              <h3 className="font-medium text-lg flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-400" />
                Кітапты оқу
              </h3>
              <button 
                onClick={() => setSelectedPdf(null)}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center relative">
              <iframe 
                src={`${selectedPdf}#toolbar=0`} 
                className="w-full h-full bg-white"
                title="PDF Viewer"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
