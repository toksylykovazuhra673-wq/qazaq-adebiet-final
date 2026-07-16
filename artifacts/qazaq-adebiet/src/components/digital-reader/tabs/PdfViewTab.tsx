import { useRef, useState } from 'react';
import { FileText, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, RotateCw, Maximize2 } from 'lucide-react';
import PdfCanvas, { type PdfCanvasHandle } from '@/components/reader/PdfCanvas';
import type { Book } from '@/types/book';

interface Props {
  book: Book;
  currentPage: number;
  onPageChange: (p: number) => void;
}

export default function PdfViewTab({ book, currentPage, onPageChange }: Props) {
  const canvasRef = useRef<PdfCanvasHandle>(null);
  const [zoom,     setZoom]      = useState(1.0);
  const [rotation, setRotation]  = useState(0);
  const [total,    setTotal]     = useState(0);

  const pdfUrl = book.pdf ? `/pdf/${book.pdf}` : '';

  if (!book.pdf) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-4">
          <FileText size={28} className="text-blue-400" />
        </div>
        <h3 className="text-white font-semibold text-lg mb-2">PDF нұсқасы жоқ</h3>
        <p className="text-gray-400 text-sm">
          Бұл шығарманың PDF файлы қосылмаған.
        </p>
        <p className="text-gray-600 text-xs mt-3 font-mono">
          books.json ішіне <span className="text-gray-400">«pdf»</span> өрісін қосыңыз
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col" style={{ height: 'calc(100vh - 280px)' }}>
      {/* Mini toolbar */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-white/8 bg-gray-950/60 backdrop-blur-sm flex-shrink-0">
        <div className="flex items-center gap-1">
          <NavBtn onClick={() => { const p = Math.max(1, currentPage - 1); onPageChange(p); canvasRef.current?.goToPage(p); }} disabled={currentPage <= 1}>
            <ChevronLeft size={15} />
          </NavBtn>
          <span className="text-white text-xs px-2">{currentPage} / {total || '—'}</span>
          <NavBtn onClick={() => { const p = Math.min(total || 9999, currentPage + 1); onPageChange(p); canvasRef.current?.goToPage(p); }} disabled={total > 0 && currentPage >= total}>
            <ChevronRight size={15} />
          </NavBtn>
        </div>

        <div className="flex items-center gap-1">
          <NavBtn onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} title="Кішірейту">
            <ZoomOut size={14} />
          </NavBtn>
          <span className="text-gray-400 text-xs w-12 text-center">{Math.round(zoom * 100)}%</span>
          <NavBtn onClick={() => setZoom(z => Math.min(3, z + 0.25))} title="Үлкейту">
            <ZoomIn size={14} />
          </NavBtn>
          <NavBtn onClick={() => setRotation(r => (r + 90) % 360)} title="Бұру">
            <RotateCw size={14} />
          </NavBtn>
          <NavBtn onClick={() => window.open(`/reader/pdf/${book.slug}`, '_blank')} title="Толық экран">
            <Maximize2 size={14} />
          </NavBtn>
        </div>
      </div>

      {/* Canvas */}
      <div className="flex-1 overflow-auto bg-gray-900">
        <PdfCanvas
          ref={canvasRef}
          pdfUrl={pdfUrl}
          currentPage={currentPage}
          zoom={zoom}
          rotation={rotation}
          readingMode="single"
          onDocumentLoad={(pages) => { setTotal(pages); }}
          onPageChange={onPageChange}
          onTextExtracted={() => {}}
        />
      </div>
    </div>
  );
}

function NavBtn({ children, onClick, disabled, title }: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  title?: string;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      title={title}
      className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/8 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
    >
      {children}
    </button>
  );
}
