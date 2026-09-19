import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload,
  FileText,
  Trash2,
  ExternalLink,
  BookOpen,
  Plus,
  X,
  Check,
  AlertCircle,
  GraduationCap,
  Image as ImageIcon,
  Music,
  Video,
} from 'lucide-react';

import { supabase } from '@/lib/supabase';

interface Props {
  teacherName: string;
}

type MediaType = 'image' | 'audio' | 'video' | 'pdf';

interface MediaItem {
  id: number;
  author_slug: string;
  title: string;
  media_type: MediaType;
  file_url: string;
  file_path: string;
  created_at: string;
}

const GENRES = [
  'Поэзия',
  'Проза',
  'Драма',
  'Эпос',
  'Аңыз',
  'Мақал-мәтел',
  'Шешендік сөз',
  'Өзге',
];

const GRADES = [5, 6, 7, 8, 9, 10, 11];

const ACCEPTED_TYPES = {
  image: 'image/*',
  audio: 'audio/*',
  video: 'video/*',
  pdf: '.pdf,application/pdf',
};

const TYPE_LABELS = {
  image: 'Сурет',
  audio: 'Аудио',
  video: 'Видео',
  pdf: 'PDF',
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/ә/g, 'a')
    .replace(/ғ/g, 'g')
    .replace(/қ/g, 'q')
    .replace(/ң/g, 'n')
    .replace(/ө/g, 'o')
    .replace(/ұ/g, 'u')
    .replace(/ү/g, 'u')
    .replace(/і/g, 'i')
    .replace(/һ/g, 'h')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function getFileType(file: File): MediaType | null {
  if (file.type.startsWith('image/')) return 'image';
  if (file.type.startsWith('audio/')) return 'audio';
  if (file.type.startsWith('video/')) return 'video';
  if (file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')) {
    return 'pdf';
  }

  return null;
}

function formatSize(bytes: number) {
  if (bytes < 1024 * 1024) {
    return `${Math.round(bytes / 1024)} КБ`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('kk-KZ', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function getIcon(type: MediaType) {
  if (type === 'image') return ImageIcon;
  if (type === 'audio') return Music;
  if (type === 'video') return Video;
  return FileText;
}

function UploadModal({
  teacherName,
  onSaved,
  onClose,
}: {
  teacherName: string;
  onSaved: () => void;
  onClose: () => void;
}) {
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [gradeLevel, setGradeLevel] = useState(9);
  const [genre, setGenre] = useState('Поэзия');
  const [mediaType, setMediaType] = useState<MediaType>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const fileRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((selected: File) => {
    setError('');

    const detectedType = getFileType(selected);

    if (!detectedType) {
      setError('Тек PDF, сурет, аудио немесе видео файлдарын жүктеуге болады.');
      return;
    }

    // Exhibition-friendly limits
    const limits: Record<MediaType, number> = {
      image: 10 * 1024 * 1024,
      audio: 50 * 1024 * 1024,
      video: 50 * 1024 * 1024,
      pdf: 20 * 1024 * 1024,
    };

    if (selected.size > limits[detectedType]) {
      setError(
        `${TYPE_LABELS[detectedType]} файлы тым үлкен. Максимум: ${formatSize(limits[detectedType])}.`
      );
      return;
    }

    setFile(selected);
    setMediaType(detectedType);

    if (!title.trim()) {
      const cleanName = selected.name.replace(/\.[^/.]+$/, '');
      setTitle(cleanName);
    }
  }, [title]);

  const handleDrop = useCallback(
    (event: React.DragEvent) => {
      event.preventDefault();

      const droppedFile = event.dataTransfer.files?.[0];

      if (droppedFile) {
        handleFile(droppedFile);
      }
    },
    [handleFile]
  );

  const handleSave = async () => {
    if (!title.trim()) {
      setError('Шығарма атауын енгізіңіз.');
      return;
    }

    if (!author.trim()) {
      setError('Автор атын енгізіңіз.');
      return;
    }

    if (!file) {
      setError('Файл таңдаңыз.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setError('Алдымен Email және пароль арқылы жүйеге кіріңіз.');
        setLoading(false);
        return;
      }

      const authorSlug = slugify(author);

      const safeFileName = file.name
  .normalize('NFKD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-zA-Z0-9._-]/g, '-')
  .replace(/-+/g, '-')
  .replace(/^-|-$/g, '');

      const uniqueName = `${Date.now()}-${safeFileName}`;

      const filePath = `${authorSlug}/${mediaType}/${uniqueName}`;

      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.type,
        });

      if (uploadError) {
        console.error(uploadError);
        throw new Error(`Файлды сақтау қатесі: ${uploadError.message}`);
      }

      const {
        data: { publicUrl },
      } = supabase.storage
        .from('media')
        .getPublicUrl(filePath);

      const { error: databaseError } = await supabase
        .from('author_media')
        .insert({
          author_slug: authorSlug,
          title: title.trim(),
          media_type: mediaType,
          file_url: publicUrl,
          file_path: filePath,
        });

      if (databaseError) {
        // Database жазылмаса, Storage-та бос файл қалдырмаймыз
        await supabase.storage
          .from('media')
          .remove([filePath]);

        throw new Error(`Мәліметті сақтау қатесі: ${databaseError.message}`);
      }

      onSaved();
      onClose();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : 'Файлды сақтау кезінде белгісіз қате болды.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.93, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-gray-900 border border-white/12 rounded-3xl p-6 w-full max-w-lg shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-bold text-lg flex items-center gap-2">
            <Upload size={18} className="text-emerald-400" />
            Материал жүктеу
          </h2>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-500 hover:text-white hover:bg-white/8"
          >
            <X size={16} />
          </button>
        </div>

        {/* File type */}
        <div className="grid grid-cols-4 gap-2 mb-4">
          {(['image', 'audio', 'video', 'pdf'] as MediaType[]).map((type) => {
            const Icon = getIcon(type);

            return (
              <button
                key={type}
                type="button"
                onClick={() => {
                  setMediaType(type);
                  setFile(null);
                  setError('');
                }}
                className={`flex flex-col items-center gap-2 p-3 rounded-xl border transition-all ${
                  mediaType === type
                    ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300'
                    : 'bg-white/4 border-white/8 text-gray-500 hover:text-white'
                }`}
              >
                <Icon size={18} />
                <span className="text-[11px]">{TYPE_LABELS[type]}</span>
              </button>
            );
          })}
        </div>

        {/* Drop zone */}
        <div
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
          onClick={() => fileRef.current?.click()}
          className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer mb-4 transition-all ${
            file
              ? 'border-emerald-500/40 bg-emerald-500/5'
              : 'border-white/15 bg-white/3 hover:border-white/30 hover:bg-white/5'
          }`}
        >
          <input
            ref={fileRef}
            type="file"
            accept={ACCEPTED_TYPES[mediaType]}
            className="hidden"
            onChange={(e) => {
              const selected = e.target.files?.[0];

              if (selected) {
                handleFile(selected);
              }

              e.target.value = '';
            }}
          />

          {file ? (
            <div className="flex items-center justify-center gap-3">
              {(() => {
                const Icon = getIcon(mediaType);

                return <Icon size={28} className="text-emerald-400" />;
              })()}

              <div className="text-left">
                <div className="text-white text-sm font-medium break-all">
                  {file.name}
                </div>

                <div className="text-gray-500 text-xs mt-1">
                  {TYPE_LABELS[mediaType]} · {formatSize(file.size)}
                </div>
              </div>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setFile(null);
                }}
                className="p-1 rounded-lg text-gray-600 hover:text-red-400"
              >
                <X size={14} />
              </button>
            </div>
          ) : (
            <div>
              <Upload size={30} className="mx-auto mb-2 text-gray-600" />

              <p className="text-gray-400 text-sm font-medium">
                {TYPE_LABELS[mediaType]} файлын таңдаңыз
              </p>

              <p className="text-gray-600 text-xs mt-1">
                немесе осы жерге сүйреп әкеліңіз
              </p>
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 border border-red-500/20 mb-4">
            <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
            <p className="text-red-400 text-xs">{error}</p>
          </div>
        )}

        {/* Information */}
        <div className="space-y-3">
          <div>
            <label className="text-gray-500 text-xs block mb-1">
              Шығарма / материал атауы *
            </label>

            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Мысалы: Сегіз аяқ"
              className="input-field"
            />
          </div>

          <div>
            <label className="text-gray-500 text-xs block mb-1">
              Автор *
            </label>

            <input
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Мысалы: Абай Құнанбайұлы"
              className="input-field"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-gray-500 text-xs block mb-1">
                Сынып
              </label>

              <select
                value={gradeLevel}
                onChange={(e) => setGradeLevel(Number(e.target.value))}
                className="input-field"
              >
                {GRADES.map((grade) => (
                  <option key={grade} value={grade}>
                    {grade}-сынып
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-gray-500 text-xs block mb-1">
                Жанр
              </label>

              <select
                value={genre}
                onChange={(e) => setGenre(e.target.value)}
                className="input-field"
              >
                {GENRES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="text-gray-500 text-xs block mb-1">
              Қысқаша сипаттама
            </label>

            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Материал туралы қысқаша ақпарат…"
              rows={3}
              className="input-field resize-none"
            />
          </div>

          <div className="text-gray-600 text-[11px]">
            Жүктеуші: {teacherName}
          </div>
        </div>

        <div className="flex gap-2 mt-5">
          <button onClick={onClose} className="flex-1 btn-ghost">
            <X size={14} />
            Болдырмау
          </button>

          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 btn-primary"
          >
            {loading ? (
              <span className="flex items-center gap-2 justify-center">
                <motion.div
                  className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 0.8,
                    repeat: Infinity,
                    ease: 'linear',
                  }}
                />

                Сақталуда…
              </span>
            ) : (
              <>
                <Check size={14} />
                Сақтау
              </>
            )}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

function MediaCard({
  item,
  onDelete,
}: {
  item: MediaItem;
  onDelete: () => void;
}) {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const Icon = getIcon(item.media_type);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/4 border border-white/8 rounded-2xl p-4 hover:border-white/14 transition-all group"
    >
      <div className="flex gap-3">
        <div className="w-11 h-14 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center flex-shrink-0 shadow-lg">
          <Icon size={21} className="text-white/85" />
        </div>

        <div className="flex-1 min-w-0">
          <h3 className="text-white font-semibold text-sm leading-tight truncate">
            {item.title}
          </h3>

          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className="px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px]">
              {TYPE_LABELS[item.media_type]}
            </span>

            <span className="text-gray-700 text-[10px]">
              {formatDate(item.created_at)}
            </span>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-3">
        <a
          href={item.file_url}
          target="_blank"
          rel="noreferrer"
          className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg text-xs font-medium bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/25 transition-all"
        >
          <ExternalLink size={12} />
          Ашу
        </a>

        {confirmDelete ? (
          <div className="flex gap-1">
            <button
              onClick={onDelete}
              className="px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30 text-red-400 text-xs"
            >
              Иә
            </button>

            <button
              onClick={() => setConfirmDelete(false)}
              className="px-3 py-1.5 rounded-lg bg-white/6 border border-white/10 text-gray-500 text-xs"
            >
              Жоқ
            </button>
          </div>
        ) : (
          <button
            onClick={() => setConfirmDelete(true)}
            className="p-1.5 rounded-lg bg-white/4 border border-white/8 text-gray-600 hover:text-red-400 transition-all opacity-0 group-hover:opacity-100"
          >
            <Trash2 size={13} />
          </button>
        )}
      </div>
    </motion.div>
  );
}

export default function TchUploads({ teacherName }: Props) {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [search, setSearch] = useState('');

  const loadMedia = useCallback(async () => {
    setLoading(true);

    const { data, error } = await supabase
      .from('author_media')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Media load error:', error);
      setItems([]);
    } else {
      setItems((data ?? []) as MediaItem[]);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    loadMedia();
  }, [loadMedia]);

  const deleteMedia = async (item: MediaItem) => {
    const { error: storageError } = await supabase.storage
      .from('media')
      .remove([item.file_path]);

    if (storageError) {
      console.error(storageError);
    }

    const { error: databaseError } = await supabase
      .from('author_media')
      .delete()
      .eq('id', item.id);

    if (databaseError) {
      console.error(databaseError);
      return;
    }

    setItems((current) => current.filter((x) => x.id !== item.id));
  };

  const filtered = items.filter((item) =>
    !search ||
    item.title.toLowerCase().includes(search.toLowerCase()) ||
    item.author_slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex-1">
          <h2 className="text-white text-lg font-bold">
            Менің материалдарым
          </h2>

          <p className="text-gray-500 text-sm mt-1">
            Сурет, аудио, видео және PDF файлдарын Supabase-ке сақтаңыз.
          </p>
        </div>

        <button
          onClick={() => setShowModal(true)}
          className="btn-primary flex-shrink-0"
        >
          <Plus size={14} />
          Жүктеу
        </button>
      </div>

      {/* Search */}
      {items.length > 3 && (
        <div className="relative">
          <BookOpen
            size={13}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600"
          />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Материал немесе автор атауы…"
            className="input-field pl-8 py-2"
          />
        </div>
      )}

      {/* Stats */}
      {items.length > 0 && (
        <div className="flex items-center gap-4 p-3 bg-emerald-500/8 border border-emerald-500/15 rounded-2xl text-sm">
          <GraduationCap
            size={16}
            className="text-emerald-400 flex-shrink-0"
          />

          <span className="text-emerald-300 font-medium">
            {items.length} материал сақталған
          </span>

          <span className="text-gray-600 text-xs ml-auto">
            Supabase бұлтында
          </span>
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <div className="text-center py-20 text-gray-600">
          Материалдар жүктелуде…
        </div>
      ) : filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <AnimatePresence>
            {filtered.map((item) => (
              <MediaCard
                key={item.id}
                item={item}
                onDelete={() => deleteMedia(item)}
              />
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-20 text-gray-700">
          <Upload size={44} className="mx-auto mb-4 opacity-25" />

          <p className="font-medium text-gray-500 mb-1">
            Әзірге материал жоқ
          </p>

          <p className="text-sm mb-5">
            Сурет, аудио, видео немесе PDF жүктеп көріңіз.
          </p>

          <button
            onClick={() => setShowModal(true)}
            className="btn-primary mx-auto"
          >
            <Plus size={14} />
            Алғашқы материалды жүктеу
          </button>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <UploadModal
            teacherName={teacherName}
            onSaved={loadMedia}
            onClose={() => setShowModal(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}