import { useEffect, useRef, useState, forwardRef, useImperativeHandle } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { Loader2, AlertCircle, FileText } from 'lucide-react';

// pdf.js v6 — use local worker served from /public
pdfjsLib.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.mjs';

export interface PdfCanvasHandle {
  search: (query: string) => Promise<number[]>;
  renderThumbnail: (page: number, canvas: HTMLCanvasElement) => Promise<void>;
}

interface Props {
  pdfUrl: string;
  currentPage: number;
  zoom: number;
  rotation: number;
  searchQuery?: string;
  onDocumentLoad?: (pages: number, hasText: boolean) => void;
  readingMode?: 'dark' | 'sepia' | 'light';
  layout?: 'single' | 'double' | 'continuous';
}

const modeFilter: Record<string, string> = {
  dark:  'invert(1) hue-rotate(180deg) brightness(0.85)',
  sepia: 'sepia(0.8) brightness(0.9)',
  light: 'none',
};

const PdfCanvas = forwardRef<PdfCanvasHandle, Props>(({
  pdfUrl, currentPage, zoom, rotation,
  onDocumentLoad, readingMode = 'dark', layout = 'single',
}, ref) => {
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const canvas2Ref = useRef<HTMLCanvasElement>(null);
  const docRef     = useRef<pdfjsLib.PDFDocumentProxy | null>(null);
  const loadingTaskRef = useRef<pdfjsLib.PDFDocumentLoadingTask | null>(null);
  const renderTaskRef  = useRef<pdfjsLib.RenderTask | null>(null);
  const [loading, setLoading]  = useState(true);
  const [error, setError]      = useState<string | null>(null);
  const [totalPages, setTotal] = useState(0);

  // ─── Expose handle ─────────────────────────────────────────
  useImperativeHandle(ref, () => ({
    search: async (query: string) => {
      if (!docRef.current || !query.trim()) return [];
      const results: number[] = [];
      for (let i = 1; i <= docRef.current.numPages; i++) {
        const page    = await docRef.current.getPage(i);
        const content = await page.getTextContent();
        const text    = content.items.map((it: any) => it.str ?? '').join(' ');
        if (text.toLowerCase().includes(query.toLowerCase())) results.push(i);
      }
      return results;
    },
    renderThumbnail: async (pageNum: number, canvas: HTMLCanvasElement) => {
      if (!docRef.current) return;
      const page     = await docRef.current.getPage(pageNum);
      const viewport = page.getViewport({ scale: 0.2 });
      canvas.width   = viewport.width;
      canvas.height  = viewport.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        await page.render({ canvas, canvasContext: ctx, viewport }).promise;
      }
    },
  }));

  // ─── Load PDF ──────────────────────────────────────────────
  useEffect(() => {
    setLoading(true);
    setError(null);
    docRef.current = null;

    const task = pdfjsLib.getDocument({ url: pdfUrl });
    loadingTaskRef.current = task;

    task.promise
      .then(async (doc) => {
        if (loadingTaskRef.current !== task) return; // stale
        docRef.current = doc;
        setTotal(doc.numPages);

        // Detect text layer
        let hasText = false;
        try {
          const p1 = await doc.getPage(1);
          const c  = await p1.getTextContent();
          hasText  = c.items.length > 0;
        } catch { /* ignore */ }

        onDocumentLoad?.(doc.numPages, hasText);
        setLoading(false);
      })
      .catch((err: any) => {
        if (err?.name === 'RenderingCancelledException') return;
        setError(err?.message ?? 'PDF жүктеу қатесі');
        setLoading(false);
      });

    return () => {
      loadingTaskRef.current = null;
      task.destroy().catch(() => {});
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfUrl]);

  // ─── Render page ───────────────────────────────────────────
  useEffect(() => {
    if (!docRef.current || loading || error) return;

    const renderPage = async (
      pageNum: number,
      canvasEl: HTMLCanvasElement | null,
    ) => {
      if (!canvasEl || !docRef.current) return;
      let page: pdfjsLib.PDFPageProxy;
      try { page = await docRef.current.getPage(pageNum); } catch { return; }

      const scale    = zoom * (window.devicePixelRatio || 1);
      const viewport = page.getViewport({ scale, rotation });

      canvasEl.width  = viewport.width;
      canvasEl.height = viewport.height;
      canvasEl.style.width  = `${viewport.width  / (window.devicePixelRatio || 1)}px`;
      canvasEl.style.height = `${viewport.height / (window.devicePixelRatio || 1)}px`;

      const ctx = canvasEl.getContext('2d');
      if (!ctx) return;

      renderTaskRef.current?.cancel?.();
      const task = page.render({ canvas: canvasEl, canvasContext: ctx, viewport });
      renderTaskRef.current = task;
      try { await task.promise; } catch { /* cancelled */ }
    };

    renderPage(currentPage, canvasRef.current);
    if (layout === 'double' && currentPage + 1 <= totalPages) {
      renderPage(currentPage + 1, canvas2Ref.current);
    }
  }, [currentPage, zoom, rotation, loading, error, layout, totalPages]);

  // ─── UI ────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-96 text-gray-400 gap-3">
        <Loader2 size={36} className="animate-spin text-violet-400" />
        <p className="text-sm">PDF жүктелуде...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-full min-h-96 text-center px-8 gap-4">
        <AlertCircle size={40} className="text-orange-400" />
        <div>
          <p className="text-white font-semibold mb-1">PDF ашылмады</p>
          <p className="text-gray-400 text-sm mb-3">{error}</p>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 text-left max-w-sm">
            <div className="flex items-start gap-2">
              <FileText size={16} className="text-blue-400 flex-shrink-0 mt-0.5" />
              <div>
                <p className="text-blue-300 text-xs font-medium mb-1">PDF файлды қосу үшін:</p>
                <p className="text-gray-400 text-xs font-mono">
                  public/pdf/<span className="text-blue-300">{pdfUrl.split('/').pop()}</span>
                </p>
                <p className="text-gray-500 text-xs mt-1">папкасына файлды көшіріңіз</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const filter = modeFilter[readingMode] ?? 'none';

  return (
    <div className="flex gap-4 items-start justify-center p-4 min-h-full">
      <div className="shadow-2xl rounded-lg overflow-hidden" style={{ filter }}>
        <canvas ref={canvasRef} className="block" />
      </div>
      {layout === 'double' && currentPage + 1 <= totalPages && (
        <div className="shadow-2xl rounded-lg overflow-hidden" style={{ filter }}>
          <canvas ref={canvas2Ref} className="block" />
        </div>
      )}
    </div>
  );
});

PdfCanvas.displayName = 'PdfCanvas';
export default PdfCanvas;
