import { motion } from 'framer-motion';
import { ArrowLeft, BookOpen, MessageSquare, Eye, Star, MapPin, Calendar } from 'lucide-react';
import type { UniversalAuthor } from '@/types/universal-author';
import { CATEGORY_COLORS, CATEGORY_ACCENT, CATEGORY_BADGE } from '@/hooks/useUniversalAuthor';

interface Props {
  author: UniversalAuthor;
}

export default function UniversalAuthorHero({ author }: Props) {
  const gradient = CATEGORY_COLORS[author.category];
  const accent = CATEGORY_ACCENT[author.category];
  const badge = CATEGORY_BADGE[author.category];

  const initials = author.fullName
    .split(' ')
    .map((w) => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="relative overflow-hidden">
      {/* Cover image / gradient backdrop */}
      <div className="relative h-72 md:h-96">
        {author.coverImage ? (
          <img
            src={author.coverImage}
            alt={author.fullName}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${gradient} opacity-20`} />
        )}
        {/* Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-gray-950 via-gray-950/70 to-transparent" />

        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => window.history.back()}
          className="absolute top-6 left-6 flex items-center gap-2 text-white/80 hover:text-white transition-colors bg-black/30 backdrop-blur-sm px-4 py-2 rounded-full border border-white/10"
        >
          <ArrowLeft size={16} />
          <span className="text-sm">Артқа</span>
        </motion.button>
      </div>

      {/* Content row */}
      <div className="relative -mt-32 md:-mt-44 px-4 sm:px-8 pb-0">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-6 md:gap-10 items-start">
          {/* Portrait */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
            className="flex-shrink-0"
          >
            <div className="w-36 h-44 md:w-44 md:h-56 rounded-2xl overflow-hidden shadow-2xl border-2 border-white/10 bg-gray-800">
              {author.photo ? (
                <img
                  src={author.photo}
                  alt={author.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div
                  className={`w-full h-full bg-gradient-to-br ${gradient} flex items-center justify-center`}
                >
                  <span className="text-5xl md:text-6xl font-bold text-white/90">
                    {initials}
                  </span>
                </div>
              )}
            </div>
          </motion.div>

          {/* Info */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="flex-1 pt-4 md:pt-8"
          >
            {/* Category + profession badges */}
            <div className="flex flex-wrap gap-2 mb-3">
              <span className={`text-xs font-medium px-3 py-1 rounded-full ${badge}`}>
                {author.categoryLabel}
              </span>
              {author.profession.map((p) => (
                <span
                  key={p}
                  className="text-xs font-medium px-3 py-1 rounded-full bg-white/5 text-white/60 border border-white/10"
                >
                  {p}
                </span>
              ))}
            </div>

            {/* Full name */}
            <h1 className="text-3xl md:text-5xl font-bold text-white mb-1">
              {author.fullName}
            </h1>

            {/* Literary movement */}
            {author.literaryMovement && (
              <p className={`text-sm font-medium ${accent} mb-4`}>
                {author.literaryMovement}
              </p>
            )}

            {/* Meta grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
              <MetaCard icon={<Calendar size={14} />} label="Өмір сүрген жылдары" value={`${author.birthDate} — ${author.deathDate}`} />
              <MetaCard icon={<MapPin size={14} />} label="Туған жері" value={author.birthPlace} />
              <MetaCard icon={<MapPin size={14} />} label="Қайтыс болған жері" value={author.deathPlace} />
              <MetaCard icon={<BookOpen size={14} />} label="Еңбектер" value={`${author.worksCount}+`} />
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-2xl">
              {author.description}
            </p>

            {/* Stats row */}
            <div className="flex flex-wrap gap-4 mt-4 text-sm text-gray-400">
              <span className="flex items-center gap-1">
                <Eye size={14} className="text-gray-500" />
                {author.viewCount.toLocaleString()} қаралым
              </span>
              <span className="flex items-center gap-1">
                <MessageSquare size={14} className="text-gray-500" />
                {author.quotesCount} дәйексөз
              </span>
              <span className="flex items-center gap-1">
                <BookOpen size={14} className="text-gray-500" />
                {author.worksCount} еңбек
              </span>
              {author.featured && (
                <span className="flex items-center gap-1 text-yellow-400">
                  <Star size={14} />
                  Танымал
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function MetaCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-3">
      <div className="flex items-center gap-1 text-gray-400 text-xs mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="text-white text-sm font-medium leading-tight">{value}</p>
    </div>
  );
}
