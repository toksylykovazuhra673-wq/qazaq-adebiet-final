import { useParams } from 'wouter';
import { motion } from 'framer-motion';
import { AlertCircle } from 'lucide-react';
import type { AuthorCategory } from '@/types/universal-author';
import { useUniversalAuthorBySlug } from '@/hooks/useUniversalAuthor';
import UniversalAuthorHero from '@/components/universal/UniversalAuthorHero';
import UniversalAuthorTabs from '@/components/universal/UniversalAuthorTabs';

export default function UniversalAuthorPage() {
  const params = useParams<{ category: string; slug: string }>();
  const category = params.category as AuthorCategory;
  const slug = params.slug ?? '';

  const author = useUniversalAuthorBySlug(category, slug);

  if (!author) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-[60vh] flex flex-col items-center justify-center text-center px-4"
      >
        <AlertCircle size={48} className="text-gray-600 mb-4" />
        <h1 className="text-2xl font-bold text-white mb-2">Автор табылмады</h1>
        <p className="text-gray-400">
          «{slug}» авторы «{category}» санатында жоқ.
        </p>
        <p className="text-gray-500 text-sm mt-2">
          Маршрут: /authors/{category}/{slug}
        </p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gray-950 text-white"
    >
      <UniversalAuthorHero author={author} />
      <UniversalAuthorTabs author={author} />
    </motion.div>
  );
}
