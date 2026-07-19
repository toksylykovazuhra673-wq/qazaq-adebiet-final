import { useMemo } from 'react';
import type { Analysis } from '@/types/analysis';
import workAnalysesData from '@/data/workAnalyses.json';

const allAnalyses: Analysis[] = workAnalysesData as unknown as Analysis[];

export function useAnalysis(workSlug: string) {
  const analysis = useMemo(
    () => allAnalyses.find((a) => a.workSlug === workSlug) ?? null,
    [workSlug],
  );
  return { analysis, loading: false };
}

export function useAllAnalyses() {
  return allAnalyses;
}
