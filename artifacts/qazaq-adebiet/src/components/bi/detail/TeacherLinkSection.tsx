import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LinkIcon, Plus, Trash2, X, ExternalLink, GraduationCap,
  FileText, Headphones, Video, Play, Pause, ZoomIn, ZoomOut,
  Printer, Download, AlertCircle, ChevronDown, ChevronUp, Check,
} from 'lucide-react';
import type { LinkCategory, TeacherLink } from '@/hooks/useTeacherLinks';
import { useTeacherLinks, youtubeId, youtubeThumbnail } from '@/hooks/useTeacherLinks';

// ─── PDF viewer modal ─────────────────────────────────────────
function PdfModal({ link, onClose }: { link: TeacherLink; onClose: () => void }) {
  const [zoom, setZoom] = useState(100);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] bg-black/92 flex flex-col">
      <div className="flex items-center justify-between px-6 py-3 bg-[#0a0618]/95 border-b border-white/10 shrink-0">
        <p className="text-white text-sm font-medium truncate max-w-xs">{link.title}</p>
        <div className="flex items-center gap-2">
          <button onClick={() => setZoom(z => Math.max(50, z - 10))} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><ZoomOut className="w-4 h-4" /></button>
          <span className="text-white/50 text-sm w-12 text-center">{zoom}%</span>
          <button onClick={() => setZoom(z => Math.min(200, z + 10))} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><ZoomIn className="w-4 h-4" /></button>
          <button onClick={() => window.print()} className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><Printer className="w-4 h-4" /></button>
          <a href={link.url} download target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg hover:bg-white/10 text-white/60 hover:text-white transition-colors"><Download className="w-4 h-4" /></a>
          <button onClick={onClose} className="p-2 rounded-lg hover:bg-red-500/20 text-white/60 hover:text-red-400 transition-colors ml-2"><X className="w-4 h-4" /></button>
        </div>
      </div>
      <div className="flex-1 overflow-auto flex items-start justify-center p-6">
        <iframe src={link.url} title={link.title}
          style={{ width: `${zoom}%`, minWidth: 600, height: '90vh' }}
          className="rounded-xl border border-white/10 shadow-2xl bg-white" />
      </div>
    </motion.div>
  );
}

// ─── Inline audio player ──────────────────────────────────────
function AudioPlayer({ link }: { link: TeacherLink }) {
  const [playing, setPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [speed, setSpeed] = useState(1);
  const ref = useRef<HTMLAudioElement>(null);

  const toggle = () => {
    const a = ref.current; if (!a) return;
    playing ? a.pause() : a.play().catch(() => {});
    setPlaying(!playing);
  };
  const onTime = () => {
    const a = ref.current;
    if (a && a.duration) setProgress((a.currentTime / a.duration) * 100);
  };
  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const a = ref.current; if (!a || !a.duration) return;
    const v = +e.target.value;
    a.currentTime = (v / 100) * a.duration;
    setProgress(v);
  };
  const setSpd = (s: number) => { setSpeed(s); if (ref.current) ref.current.playbackRate = s; };

  return (
    <div className="glass-card p-5 rounded-xl space-y-3 border border-emerald-500/15">
      <audio ref={ref} src={link.url} onTimeUpdate={onTime} onEnded={() => { setPlaying(false); setProgress(0); }} />
      <div className="flex items-center gap-4">
        <button onClick={toggle}
          className="w-11 h-11 rounded-full bg-emerald-500/70 hover:bg-emerald-500 flex items-center justify-center text-white shadow-lg shrink-0 transition-colors">
          {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5 ml-0.5" />}
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-white font-medium text-sm truncate">{link.title}</p>
          {link.description && <p className="text-white/40 text-xs truncate">{link.description}</p>}
        </div>
        <a href={link.url} target="_blank" rel="noopener noreferrer"
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Сілтемені ашу">
          <ExternalLink className="w-4 h-4" />
        </a>
      </div>
      <input type="range" min={0} max={100} value={progress} onChange={onSeek}
        className="w-full accent-emerald-500 h-1.5 cursor-pointer rounded-full" />
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-white/35 text-xs">Жылдамдық:</span>
        {[0.5, 0.75, 1, 1.25, 1.5, 2].map(s => (
          <button key={s} onClick={() => setSpd(s)}
            className={`px-2 py-0.5 rounded text-xs border transition-colors ${
              speed === s ? 'bg-emerald-500 text-white border-emerald-500' : 'bg-white/5 text-white/50 border-white/10 hover:bg-white/10'
            }`}>
            {s}x
          </button>
        ))}
      </div>
    </div>
  );
}

// ─── Video card ───────────────────────────────────────────────
function VideoCard({ link, onDelete }: { link: TeacherLink; onDelete: () => void }) {
  const [expanded, setExpanded] = useState(false);
  const ytId = youtubeId(link.url);
  const embedUrl = ytId ? `https://www.youtube.com/embed/${ytId}?autoplay=0` : null;
  const thumb = ytId ? youtubeThumbnail(ytId) : null;
  const [confirmDel, setConfirmDel] = useState(false);

  const handleDel = () => {
    if (confirmDel) { onDelete(); } else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); }
  };

  return (
    <div className="glass-card rounded-xl overflow-hidden border border-white/8 hover:border-red-500/20 transition-colors">
      {/* Thumbnail / Embed */}
      {expanded && embedUrl ? (
        <div className="aspect-video w-full">
          <iframe src={embedUrl} title={link.title} allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen className="w-full h-full" />
        </div>
      ) : (
        <div
          className="relative aspect-video bg-gradient-to-br from-white/5 to-white/2 flex items-center justify-center cursor-pointer group"
          onClick={() => embedUrl ? setExpanded(true) : window.open(link.url, '_blank')}
        >
          {thumb && <img src={thumb} alt={link.title} className="absolute inset-0 w-full h-full object-cover opacity-70" />}
          <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
          <div className="relative w-14 h-14 rounded-full bg-red-600/85 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
            <Play className="w-6 h-6 text-white ml-0.5" />
          </div>
          {!ytId && (
            <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/50 text-white/60 text-xs">Сыртқы сілтеме</div>
          )}
        </div>
      )}

      {/* Info row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <div className="flex-1 min-w-0">
          <p className="text-white text-sm font-medium truncate">{link.title}</p>
          {link.description && <p className="text-white/40 text-xs truncate">{link.description}</p>}
        </div>
        <div className="flex items-center gap-1.5 shrink-0">
          {embedUrl && (
            <button onClick={() => setExpanded(e => !e)}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors"
              title={expanded ? 'Жию' : 'Ашу'}>
              {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
          )}
          <a href={link.url} target="_blank" rel="noopener noreferrer"
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-white/40 hover:text-white transition-colors" title="Жаңа қойындыда ашу">
            <ExternalLink className="w-4 h-4" />
          </a>
          <button onClick={handleDel}
            className={`p-1.5 rounded-lg transition-colors border ${
              confirmDel
                ? 'bg-red-500/20 text-red-400 border-red-500/30'
                : 'bg-white/5 hover:bg-red-500/10 text-white/30 hover:text-red-400 border-white/8 hover:border-red-500/20'
            }`} title={confirmDel ? 'Растау — тағы бір рет басыңыз' : 'Жою'}>
            {confirmDel ? <Check className="w-4 h-4" /> : <Trash2 className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PDF card ─────────────────────────────────────────────────
function PdfCard({ link, onOpen, onDelete }: { link: TeacherLink; onOpen: () => void; onDelete: () => void }) {
  const [confirmDel, setConfirmDel] = useState(false);
  const handleDel = () => {
    if (confirmDel) { onDelete(); } else { setConfirmDel(true); setTimeout(() => setConfirmDel(false), 3000); }
  };
  return (
    <div className="glass-card rounded-xl p-4 flex gap-4 border border-white/8 hover:border-amber-500/20 transition-colors">
      <div className="w-12 h-14 rounded-lg bg-gradient-to-b from-amber-600/30 to-amber-800/20 border border-amber-500/20 flex items-center justify-center shrink-0">
        <FileText className="w-5 h-5 text-amber-400" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white text-sm font-medium truncate">{link.title}</p>
        {link.description && <p className="text-white/40 text-xs truncate mt-0.5">{link.description}</p>}
        <div className="flex gap-2 mt-2">
          <button onClick={onOpen}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-teal-500/15 hover:bg-teal-500/25 text-teal-400 border border-teal-500/20 transition-colors">
            <ZoomIn className="w-3.5 h-3.5" /> Қарау
          </button>
          <a href={link.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs bg-amber-500/15 hover:bg-amber-500/25 text-amber-400 border border-amber-500/20 transition-colors">
            <ExternalLink className="w-3.5 h-3.5" /> Ашу
          </a>
          <button onClick={handleDel}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs border transition-colors ${
              confirmDel
                ? 'bg-red-500/15 text-red-400 border-red-500/25'
                : 'bg-white/5 text-white/30 border-white/8 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/20'
            }`}>
            {confirmDel ? <><Check className="w-3.5 h-3.5" /> Растау</> : <><Trash2 className="w-3.5 h-3.5" /> Жою</>}
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Add-link form ────────────────────────────────────────────
function AddLinkForm({
  category,
  onAdd,
  onCancel,
}: {
  category: LinkCategory;
  onAdd: (title: string, url: string, description?: string) => void;
  onCancel: () => void;
}) {
  const [title, setTitle] = useState('');
  const [url, setUrl] = useState('');
  const [desc, setDesc] = useState('');
  const [urlError, setUrlError] = useState('');

  const placeholders: Record<LinkCategory, { url: string; title: string }> = {
    pdf: { url: 'https://...pdf немесе Google Drive сілтемесі', title: 'Кітап атауы' },
    audio: { url: 'https://...mp3 немесе SoundCloud сілтемесі', title: 'Аудио атауы' },
    video: { url: 'https://youtube.com/watch?v=... немесе басқа сілтеме', title: 'Бейне атауы' },
  };
  const ph = placeholders[category];

  const validate = (v: string) => {
    try { new URL(v); setUrlError(''); return true; }
    catch { setUrlError('Жарамды сілтеме енгізіңіз (https://...)'); return false; }
  };

  const submit = () => {
    if (!title.trim()) return;
    if (!validate(url)) return;
    onAdd(title.trim(), url.trim(), desc.trim() || undefined);
  };

  return (
    <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
      className="rounded-xl border border-white/12 bg-white/[0.04] p-4 space-y-3">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <input value={title} onChange={e => setTitle(e.target.value)}
          placeholder={ph.title}
          className="px-3 py-2.5 rounded-lg bg-white/8 border border-white/12 text-white text-sm placeholder-white/30 focus:outline-none focus:border-teal-500/50 transition-colors" />
        <div>
          <input value={url} onChange={e => { setUrl(e.target.value); if (urlError) validate(e.target.value); }}
            placeholder={ph.url}
            className={`w-full px-3 py-2.5 rounded-lg bg-white/8 border text-white text-sm placeholder-white/30 focus:outline-none transition-colors ${
              urlError ? 'border-red-500/50 focus:border-red-500/70' : 'border-white/12 focus:border-teal-500/50'
            }`} />
          {urlError && <p className="text-red-400 text-xs mt-1">{urlError}</p>}
        </div>
      </div>
      <input value={desc} onChange={e => setDesc(e.target.value)}
        placeholder="Қысқаша сипаттама (міндетті емес)"
        className="w-full px-3 py-2.5 rounded-lg bg-white/8 border border-white/12 text-white text-sm placeholder-white/30 focus:outline-none focus:border-teal-500/50 transition-colors" />
      <div className="flex gap-2 justify-end">
        <button onClick={onCancel} className="px-4 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-white/50 text-sm transition-colors">Болдырмау</button>
        <button onClick={submit} disabled={!title.trim() || !url.trim()}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-teal-600 hover:bg-teal-500 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Қосу
        </button>
      </div>
    </motion.div>
  );
}

// ─── Category config ──────────────────────────────────────────
const CAT_CONFIG: Record<LinkCategory, {
  label: string; icon: React.ReactNode; accent: string; accentBg: string; accentBorder: string;
  hint: string;
}> = {
  pdf: {
    label: 'PDF кітаптар мен оқу құралдары',
    icon: <FileText className="w-4 h-4" />,
    accent: 'text-amber-400',
    accentBg: 'bg-amber-500/10 hover:bg-amber-500/20',
    accentBorder: 'border-amber-500/25',
    hint: 'Google Drive, Dropbox, тікелей PDF сілтемесін немесе кез-келген PDF URL-ді қосыңыз',
  },
  audio: {
    label: 'Аудио жазбалар',
    icon: <Headphones className="w-4 h-4" />,
    accent: 'text-emerald-400',
    accentBg: 'bg-emerald-500/10 hover:bg-emerald-500/20',
    accentBorder: 'border-emerald-500/25',
    hint: 'MP3, OGG сілтемесін немесе SoundCloud, Anchor.fm URL-ін қосыңыз',
  },
  video: {
    label: 'Бейнематериалдар',
    icon: <Video className="w-4 h-4" />,
    accent: 'text-red-400',
    accentBg: 'bg-red-500/10 hover:bg-red-500/20',
    accentBorder: 'border-red-500/25',
    hint: 'YouTube, Vimeo немесе кез-келген бейне сілтемесін қосыңыз — YouTube бейнелері тікелей ойнатылады',
  },
};

// ─── Main export ──────────────────────────────────────────────
interface Props {
  biSlug: string;
  category: LinkCategory;
}

export default function TeacherLinkSection({ biSlug, category }: Props) {
  const { links, addLink, removeLink } = useTeacherLinks(biSlug, category);
  const [showForm, setShowForm] = useState(false);
  const [openPdf, setOpenPdf] = useState<TeacherLink | null>(null);
  const cfg = CAT_CONFIG[category];

  const handleAdd = (title: string, url: string, description?: string) => {
    addLink(title, url, description);
    setShowForm(false);
  };

  return (
    <div className="mt-8 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <GraduationCap className={`w-4 h-4 ${cfg.accent}`} />
          <h3 className="text-white/80 text-sm font-semibold">Мұғалімнің сілтемелері — {cfg.label}</h3>
          <span className="text-white/25 text-xs">({links.length})</span>
        </div>
        <button
          onClick={() => setShowForm(s => !s)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium border ${cfg.accentBorder} ${cfg.accentBg} ${cfg.accent} transition-colors`}
        >
          <Plus className="w-3.5 h-3.5" />
          Сілтеме қосу
        </button>
      </div>

      {/* Hint */}
      {links.length === 0 && !showForm && (
        <div className={`flex items-start gap-2 px-4 py-3 rounded-xl border ${cfg.accentBorder} bg-white/[0.02] text-white/40 text-xs`}>
          <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-0.5" />
          {cfg.hint}
        </div>
      )}

      {/* Add form */}
      <AnimatePresence>
        {showForm && (
          <AddLinkForm category={category} onAdd={handleAdd} onCancel={() => setShowForm(false)} />
        )}
      </AnimatePresence>

      {/* Link list */}
      <AnimatePresence>
        {links.length > 0 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-3">
            {category === 'pdf' && links.map(link => (
              <PdfCard key={link.id} link={link} onOpen={() => setOpenPdf(link)} onDelete={() => removeLink(link.id)} />
            ))}
            {category === 'audio' && links.map(link => (
              <div key={link.id} className="relative group/audio">
                <AudioPlayer link={link} />
                <button
                  onClick={() => removeLink(link.id)}
                  className="absolute top-3 right-3 p-1.5 rounded-lg opacity-0 group-hover/audio:opacity-100 bg-white/5 hover:bg-red-500/15 text-white/30 hover:text-red-400 border border-white/8 hover:border-red-500/20 transition-all"
                  title="Жою"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {category === 'video' && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {links.map(link => (
                  <VideoCard key={link.id} link={link} onDelete={() => removeLink(link.id)} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* PDF viewer modal */}
      <AnimatePresence>
        {openPdf && <PdfModal link={openPdf} onClose={() => setOpenPdf(null)} />}
      </AnimatePresence>
    </div>
  );
}
