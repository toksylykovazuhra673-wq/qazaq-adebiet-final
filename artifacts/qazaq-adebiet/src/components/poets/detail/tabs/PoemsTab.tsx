import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronUp, Pencil, Check, X, Sparkles } from 'lucide-react';
import { useLocation } from 'wouter';
import type { Poet, PoetPoem } from '@/types/poet';
import ItemPdfButton from '@/components/shared/ItemPdfButton';

// ─── Edit Modal ───────────────────────────────────────────────
function EditPoemModal({
  poem,
  onSave,
  onClose,
}: {
  poem: PoetPoem;
  onSave: (updated: PoetPoem) => void;
  onClose: () => void;
}) {
  const [title, setTitle]     = useState(poem.title);
  const [year, setYear]       = useState(poem.year);
  const [content, setContent] = useState(poem.content);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        onClick={e => e.stopPropagation()}
        className="w-full max-w-2xl bg-[#0d0a1f] border border-white/15 rounded-2xl p-6 shadow-2xl flex flex-col gap-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-white font-bold text-lg flex items-center gap-2">
            <Pencil size={16} className="text-violet-400" /> Өлеңді өңдеу
          </h3>
          <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/10 text-white/50 hover:text-white transition-colors">
            <X size={16} />
          </button>
        </div>

        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Атауы</label>
          <input
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
          />
        </div>

        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Жылы</label>
          <input
            value={year}
            onChange={e => setYear(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:outline-none focus:border-violet-500/50 transition-colors"
            placeholder="1890"
          />
        </div>

        <div>
          <label className="text-white/50 text-xs uppercase tracking-wider mb-1.5 block">Мәтіні</label>
          <textarea
            value={content}
            onChange={e => setContent(e.target.value)}
            rows={12}
            className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm font-mono leading-loose focus:outline-none focus:border-violet-500/50 transition-colors resize-none"
          />
        </div>

        <div className="flex gap-3 pt-1">
          <button
            onClick={() => onSave({ ...poem, title: title.trim() || poem.title, year: year.trim() || poem.year, content: content.trim() || poem.content })}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-violet-500 hover:bg-violet-400 text-white font-medium text-sm transition-colors"
          >
            <Check size={15} /> Сақтау
          </button>
          <button
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-white/8 hover:bg-white/12 text-white/70 font-medium text-sm transition-colors border border-white/10"
          >
            <X size={15} /> Бас тарту
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Poem Card ────────────────────────────────────────────────
function PoemCard({
  poem,
  poetSlug,
  onEdit,
  onAnalyze,
}: {
  poem: PoetPoem;
  poetSlug: string;
  onEdit: (p: PoetPoem) => void;
  onAnalyze: (p: PoetPoem) => void;
}) {
  const [expanded, setExpanded] = useState(false);

  const lines = poem.content.split('\n');
  const previewLines = lines.slice(0, 4);
  const hasMore = lines.length > 4;

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 flex flex-col transition-all">
      {/* Header */}
      <div className="flex justify-between items-start mb-6 gap-3">
        <h4 className="text-2xl font-serif text-white flex-1">{poem.title}</h4>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-accent font-medium bg-accent/10 px-3 py-1 rounded-full text-sm">
            {poem.year}
          </span>
          <button
            onClick={() => onAnalyze(poem)}
            title="Талдау"
            className="p-2 rounded-xl bg-violet-500/15 hover:bg-violet-500/30 text-violet-300 border border-violet-500/20 transition-colors"
          >
            <Sparkles size={14} />
          </button>
          <button
            onClick={() => onEdit(poem)}
            title="Өңдеу"
            className="p-2 rounded-xl bg-white/8 hover:bg-white/15 text-white/60 hover:text-white border border-white/10 transition-colors"
          >
            <Pencil size={14} />
          </button>
          {/* PDF icon-variant next to existing controls */}
          <ItemPdfButton
            ownerSlug={poetSlug}
            itemId={`poem-${poem.id}`}
            itemTitle={poem.title}
            variant="icon"
          />
        </div>
      </div>

      {/* Poem text */}
      <div className="font-mono text-[0.95rem] leading-loose text-white/80 whitespace-pre-wrap flex-1 bg-black/20 p-5 rounded-xl border border-white/5">
        <AnimatePresence initial={false}>
          {expanded ? (
            <motion.div key="full" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} transition={{ duration: 0.3 }}>
              {poem.content}
            </motion.div>
          ) : (
            <motion.div key="preview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {previewLines.join('\n')}
              {hasMore && <span className="text-white/40 block mt-2">...</span>}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {hasMore && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="mt-6 flex items-center justify-center gap-2 w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white/70 hover:text-white transition-colors text-sm font-medium"
        >
          {expanded ? <>Жасыру <ChevronUp className="w-4 h-4" /></> : <>Толығырақ оқу <ChevronDown className="w-4 h-4" /></>}
        </button>
      )}
    </div>
  );
}

// ─── Main Tab ─────────────────────────────────────────────────
export default function PoemsTab({ poet }: { poet: Poet }) {
  const [, navigate] = useLocation();
  const [poems, setPoems] = useState<PoetPoem[]>(poet.poems ?? []);
  const [editing, setEditing] = useState<PoetPoem | null>(null);

  const handleSave = (updated: PoetPoem) => {
    setPoems(prev => prev.map(p => p.id === updated.id ? updated : p));
    setEditing(null);
  };

  const handleAnalyze = (poem: PoetPoem) => {
    navigate(`/taldau?text=${encodeURIComponent(poem.content)}`);
  };

  if (poems.length === 0) {
    return (
      <div className="glass-panel rounded-2xl p-10 text-center">
        <p className="text-white/60 text-lg">Өлеңдер тізімі әзірге бос.</p>
      </div>
    );
  }

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {poems.map((poem) => (
          <PoemCard
            key={poem.id}
            poem={poem}
            poetSlug={poet.slug}
            onEdit={setEditing}
            onAnalyze={handleAnalyze}
          />
        ))}
      </div>

      <AnimatePresence>
        {editing && (
          <EditPoemModal
            poem={editing}
            onSave={handleSave}
            onClose={() => setEditing(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
}
