import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { useParams } from 'wouter';
import { AlertCircle, Sparkles } from 'lucide-react';

import { useAnalysis } from '@/hooks/useAnalysis';
import AnalysisHeader    from '@/components/analysis/AnalysisHeader';
import CompositionSection from '@/components/analysis/CompositionSection';
import PlotSection        from '@/components/analysis/PlotSection';
import CharactersSection  from '@/components/analysis/CharactersSection';
import CharacterMap       from '@/components/analysis/CharacterMap';
import LiteraryTheorySection   from '@/components/analysis/LiteraryTheorySection';
import StylisticDevicesSection from '@/components/analysis/StylisticDevicesSection';
import LanguageFeaturesSection from '@/components/analysis/LanguageFeaturesSection';
import EmotionTimeline    from '@/components/analysis/EmotionTimeline';
import ChronologySection  from '@/components/analysis/ChronologySection';
import KazakhstanMap      from '@/components/analysis/KazakhstanMap';
import FactsSection       from '@/components/analysis/FactsSection';
import AnalysisLoadingSkeleton from '@/components/analysis/LoadingSkeleton';

export default function AnalysisPage() {
  const params = useParams<{ workSlug: string }>();
  const workSlug = params.workSlug ?? '';
  const { analysis, loading } = useAnalysis(workSlug);

  // set page title
  useEffect(() => {
    if (analysis) {
      document.title = `Талдау: ${analysis.title}`;
    }
    return () => { document.title = 'QazaqAdebiet'; };
  }, [analysis]);

  if (loading) return <AnalysisLoadingSkeleton />;

  if (!analysis) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-md">
          <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mx-auto mb-4">
            <AlertCircle size={28} className="text-white/30" />
          </div>
          <h2 className="text-white text-xl font-semibold mb-2">Талдау табылмады</h2>
          <p className="text-white/50 text-sm leading-relaxed mb-4">
            «{workSlug}» шығармасының талдауы әлі дайын емес. Жаңа талдау қосу үшін{' '}
            <code className="text-violet-400 bg-violet-400/10 px-1 rounded">
              src/data/analysis.json
            </code>{' '}
            файлына жаңа объект енгізіңіз.
          </p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-white text-sm transition-colors"
          >
            Артқа оралу
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-[#0d0d1a] to-slate-950 print:bg-white">
      {/* print header (only visible when printing) */}
      <div className="hidden print:block p-8 border-b mb-6">
        <h1 className="text-2xl font-bold">{analysis.title} — Әдеби талдау</h1>
        <p className="text-gray-500 mt-1">{analysis.author} · {analysis.period}</p>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 md:px-6">

        {/* ── HEADER ── */}
        <AnalysisHeader analysis={analysis} />

        {/* ── AI badge strip ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="flex items-center gap-3 mb-6 print:hidden"
        >
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-500/15 border border-violet-500/25">
            <Sparkles size={12} className="text-violet-400" />
            <span className="text-violet-300 text-xs font-medium">Автоматты талдау жүйесі</span>
          </div>
          <div className="flex-1 h-px bg-white/5" />
          <span className="text-white/25 text-xs">{analysis.workSlug}</span>
        </motion.div>

        {/* ── SECTIONS ── */}
        <div className="space-y-4">
          <CompositionSection composition={analysis.composition} />
          <PlotSection plot={analysis.plot} />
          <CharactersSection characters={analysis.characters} />
          <CharacterMap
            characters={analysis.characters}
            relations={analysis.characterRelations}
          />
          <LiteraryTheorySection theory={analysis.literaryTheory} />
          <StylisticDevicesSection devices={analysis.stylisticDevices} />
          <LanguageFeaturesSection features={analysis.languageFeatures} />
          <EmotionTimeline timeline={analysis.emotionTimeline} />
          <ChronologySection events={analysis.chronology} />
          {analysis.places.length > 0 && <KazakhstanMap places={analysis.places} />}
          {analysis.interestingFacts.length > 0 && (
            <FactsSection facts={analysis.interestingFacts} />
          )}
        </div>

        {/* bottom padding */}
        <div className="h-16" />
      </div>
    </div>
  );
}
