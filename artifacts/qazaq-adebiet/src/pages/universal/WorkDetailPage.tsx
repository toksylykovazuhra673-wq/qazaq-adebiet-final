import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { useLocation } from 'wouter';
import {
  ArrowLeft, BookOpen, Download, Headphones, ExternalLink,
  Calendar, User, Tag, FileText, Lock, AlertCircle,
} from 'lucide-react';
import { useAllUniversalAuthors } from '@/hooks/useUniversalAuthor';
import type { UniversalAuthor } from '@/types/universal-author';

// Resolve a work by its slug across all authors and all work types
interface ResolvedWork {
  title: string;
  year?: string;
  genre?: string;
  description?: string;
  content?: string;         // full text / excerpt
  bibliography?: string;
  isPublicDomain?: boolean;
  hasPdf?: boolean;
  pdfUrl?: string;
  hasAudio?: boolean;
  audioUrl?: string;
  author: UniversalAuthor;
  workType: string;
}

function resolveWork(slug: string, authors: UniversalAuthor[]): ResolvedWork | null {
  for (const author of authors) {
    // novels have their own slugs
    for (const novel of author.novels ?? []) {
      if (novel.slug === slug) {
        return {
          title: novel.title, year: novel.year, genre: novel.genre,
          description: novel.description, isPublicDomain: novel.isPublicDomain,
          hasPdf: novel.hasPdf, pdfUrl: novel.pdfUrl,
          hasAudio: novel.hasAudio, audioUrl: novel.audioUrl,
          author, workType: 'Роман',
        };
      }
    }
    // poems: slug = poem-{id}
    if (slug.startsWith('poem-')) {
      const id = Number(slug.replace('poem-', ''));
      const poem = (author.poems ?? []).find(p => p.id === id);
      if (poem) {
        return {
          title: poem.title, year: poem.year, genre: 'Өлең',
          description: poem.description, content: poem.fullText,
          isPublicDomain: poem.isPublicDomain, author, workType: 'Өлең',
        };
      }
    }
    // longpoems: slug = longpoem-{id}
    if (slug.startsWith('longpoem-')) {
      const id = Number(slug.replace('longpoem-', ''));
      const lp = (author.longPoems ?? []).find(p => p.id === id);
      if (lp) {
        return {
          title: lp.title, year: lp.year, genre: 'Поэма',
          description: lp.description, content: lp.excerpt,
          isPublicDomain: lp.isPublicDomain, author, workType: 'Поэма',
        };
      }
    }
    // stories: slug = story-{id}
    if (slug.startsWith('story-')) {
      const id = Number(slug.replace('story-', ''));
      const story = (author.stories ?? []).find(s => s.id === id);
      if (story) {
        return {
          title: story.title, year: story.year, genre: story.genre,
          description: story.description, content: story.fullText ?? story.excerpt,
          isPublicDomain: story.isPublicDomain, author, workType: 'Әңгіме',
        };
      }
    }
    // science: slug = science-{id}
    if (slug.startsWith('science-')) {
      const id = Number(slug.replace('science-', ''));
      const w = (author.scientificWorks ?? []).find(s => s.id === id);
      if (w) {
        return {
          title: w.title, year: w.year, genre: w.field,
          description: w.description, bibliography: w.bibliography,
          hasPdf: w.hasPdf, pdfUrl: w.pdfUrl, author, workType: 'Ғылыми еңбек',
        };
      }
    }
  }
  return null;
}

export default function WorkDetailPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug ?? '';
  const [, navigate] = useLocation();
  const authors = useAllUniversalAuthors();
  const work = resolveWork(slug, authors);

  if (!work) {
    return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <AlertCircle size={48} className="text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Шығарма табылмады</h1>
        <p className="text-gray-400">«{slug}» шығармасы жоқ.</p>
      </motion.div>
    );
  }

  const initials = work.author.fullName.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase();

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="min-h-screen bg-gray-950">
      {/* Hero */}
      <div className="bg-gradient-to-b from-gray-900 to-gray-950 border-b border-white/5">
        <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10">
          <button onClick={() => navigate(-1 as any)}
            className="flex items-center gap-2 text-gray-400 hover:text-white mb-8 transition-colors text-sm">
            <ArrowLeft size={16} />Артқа
          </button>

          <div className="flex flex-col md:flex-row gap-8">
            {/* Cover placeholder */}
            <div className="flex-shrink-0 w-32 h-44 md:w-44 md:h-60 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 border border-white/10 flex items-center justify-center shadow-xl">
              <BookOpen size={40} className="text-gray-500" />
            </div>

            {/* Info */}
            <div className="flex-1">
              {/* Type badge */}
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-white/10 text-gray-300 border border-white/15">
                {work.workType}
              </span>

              <h1 className="text-3xl md:text-4xl font-bold text-white mt-3 mb-2">{work.title}</h1>

              {/* Author */}
              <button
                onClick={() => navigate(`/authors/${work.author.category}/${work.author.slug}`)}
                className="flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-4"
              >
                <div className="w-7 h-7 rounded-full bg-gray-700 flex items-center justify-center text-xs font-bold">
                  {initials}
                </div>
                <span className="text-sm font-medium">{work.author.fullName}</span>
              </button>

              {/* Meta */}
              <div className="flex flex-wrap gap-4 text-sm text-gray-400 mb-4">
                {work.year && (
                  <span className="flex items-center gap-1.5">
                    <Calendar size={14} />Жазылған жылы: <strong className="text-gray-200">{work.year}</strong>
                  </span>
                )}
                {work.genre && (
                  <span className="flex items-center gap-1.5">
                    <Tag size={14} />Жанры: <strong className="text-gray-200">{work.genre}</strong>
                  </span>
                )}
              </div>

              {work.isPublicDomain !== undefined && (
                <div className="flex items-center gap-2 mb-4">
                  {work.isPublicDomain ? (
                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-green-500/10 text-green-400 border border-green-500/20">
                      <FileText size={12} />Ашық қолжетімді (Public Domain)
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full bg-orange-500/10 text-orange-400 border border-orange-500/20">
                      <Lock size={12} />Авторлық құқықпен қорғалған
                    </span>
                  )}
                </div>
              )}

              {/* Description */}
              {work.description && (
                <p className="text-gray-300 text-sm leading-relaxed mb-5">{work.description}</p>
              )}

              {/* Actions */}
              <div className="flex flex-wrap gap-3">
                {work.hasPdf && work.pdfUrl && (
                  <a href={work.pdfUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-red-500/15 hover:bg-red-500/25 text-red-300 border border-red-500/20 text-sm transition-colors">
                    <Download size={14} />PDF жүктеу
                  </a>
                )}
                {work.hasAudio && work.audioUrl && (
                  <a href={work.audioUrl} target="_blank" rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-500/15 hover:bg-violet-500/25 text-violet-300 border border-violet-500/20 text-sm transition-colors">
                    <Headphones size={14} />Аудиокітап
                  </a>
                )}
                <button
                  onClick={() => navigate(`/authors/${work.author.category}/${work.author.slug}`)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 text-gray-300 text-sm transition-colors">
                  <User size={14} />Автор беті
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-8 py-10 space-y-8">
        {/* Full text (public domain) */}
        {work.isPublicDomain && work.content && (
          <section className="bg-white/3 border border-white/8 rounded-2xl p-6 md:p-8">
            <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
              <FileText size={18} className="text-gray-400" />
              {work.workType === 'Өлең' ? 'Толық мәтін' : 'Үзінді'}
            </h2>
            <pre className="text-gray-200 text-sm md:text-base leading-relaxed whitespace-pre-wrap font-serif">
              {work.content}
            </pre>
          </section>
        )}

        {/* Copyright notice */}
        {work.isPublicDomain === false && (
          <section className="bg-orange-500/5 border border-orange-500/20 rounded-2xl p-6">
            <div className="flex items-start gap-3">
              <Lock size={20} className="text-orange-400 flex-shrink-0 mt-0.5" />
              <div>
                <h3 className="text-orange-300 font-semibold text-sm mb-2">Авторлық құқықпен қорғалған</h3>
                <p className="text-orange-200/70 text-sm leading-relaxed">
                  Бұл шығарма авторлық құқықпен қорғалған. Толық мәтінді заңды жолмен қол жеткізуге болады:
                  кітапханалар, ресми баспа сайттары немесе авторлық агенттіктер арқылы.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Content (excerpt) for non-public-domain */}
        {!work.isPublicDomain && work.content && (
          <section className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Үзінді</h2>
            <blockquote className="border-l-2 border-gray-600 pl-4 text-gray-300 text-sm leading-relaxed italic">
              {work.content}
            </blockquote>
          </section>
        )}

        {/* Bibliography */}
        {work.bibliography && (
          <section className="bg-white/3 border border-white/8 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <BookOpen size={18} className="text-gray-400" />
              Библиография
            </h2>
            <p className="text-gray-300 text-sm font-mono">{work.bibliography}</p>
          </section>
        )}

        {/* Literary analysis link */}
        <section className="bg-white/3 border border-white/8 rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">Әдеби талдау</h2>
          <p className="text-gray-400 text-sm mb-4">
            Бұл шығарманың тереңдетілген әдеби талдауын «Талдау» бөлімінен таба аласыз.
          </p>
          <button
            onClick={() => navigate('/taldau')}
            className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/8 hover:bg-white/15 text-gray-300 text-sm transition-colors">
            <ExternalLink size={14} />Талдау бөліміне өту
          </button>
        </section>
      </div>
    </motion.div>
  );
}
