/**
 * Thin wrapper tabs that re-use existing analysis section components.
 * Exported individually so AnalysisPage can import by name.
 */
import React from 'react';
import type { Analysis } from '@/types/analysis';
import CompositionSection   from '@/components/analysis/CompositionSection';
import PlotSection          from '@/components/analysis/PlotSection';
import CharactersSection    from '@/components/analysis/CharactersSection';
import CharacterMap         from '@/components/analysis/CharacterMap';
import LiteraryTheorySection from '@/components/analysis/LiteraryTheorySection';
import StylisticDevicesSection from '@/components/analysis/StylisticDevicesSection';
import LanguageFeaturesSection from '@/components/analysis/LanguageFeaturesSection';
import EmotionTimeline      from '@/components/analysis/EmotionTimeline';
import ChronologySection    from '@/components/analysis/ChronologySection';
import KazakhstanMap        from '@/components/analysis/KazakhstanMap';
import FactsSection         from '@/components/analysis/FactsSection';

export function TabComposition({ analysis }: { analysis: Analysis }) {
  return <CompositionSection composition={analysis.composition} />;
}

export function TabPlot({ analysis }: { analysis: Analysis }) {
  return <PlotSection plot={analysis.plot} />;
}

export function TabCharacters({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-8">
      <CharactersSection characters={analysis.characters} />
      <CharacterMap characters={analysis.characters} relations={analysis.characterRelations} />
    </div>
  );
}

export function TabLanguage({ analysis }: { analysis: Analysis }) {
  return <LanguageFeaturesSection features={analysis.languageFeatures} />;
}

export function TabDevices({ analysis }: { analysis: Analysis }) {
  return <StylisticDevicesSection devices={analysis.stylisticDevices} />;
}

export function TabTheory({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-8">
      <LiteraryTheorySection theory={analysis.literaryTheory} />
      <EmotionTimeline timeline={analysis.emotionTimeline} />
    </div>
  );
}

export function TabHistorical({ analysis }: { analysis: Analysis }) {
  return (
    <div className="space-y-8">
      <ChronologySection events={analysis.chronology} />
      {analysis.places.length > 0 && <KazakhstanMap places={analysis.places} />}
    </div>
  );
}

export function TabFacts({ analysis }: { analysis: Analysis }) {
  return <FactsSection facts={analysis.interestingFacts} />;
}
