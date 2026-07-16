import { useMemo } from 'react';
import type { Analysis } from '@/types/analysis';
import analysisData from '@/data/analysis.json';

const allAnalyses: Analysis[] = analysisData as Analysis[];

export function useAnalysis(workSlug: string) {
  const analysis = useMemo(
    () => allAnalyses.find((a) => a.workSlug === workSlug) ?? null,
    [workSlug]
  );
  return { analysis, loading: false };
}

export function useAllAnalyses() {
  return allAnalyses;
}
