export type CharacterType = 'main' | 'secondary' | 'episodic';
export type RelationType = 'positive' | 'negative' | 'neutral' | 'complex';
export type DeviceGroup = 'azharlau' | 'qubyltu' | 'ayshyqtau';

export interface AnalysisCharacter {
  id: string;
  name: string;
  type: CharacterType;
  description: string;
  role: string;
  traits: string[];
  relations: Array<{ characterId: string; label: string }>;
}

export interface CharacterRelation {
  from: string;
  to: string;
  label: string;
  type: RelationType;
}

export interface CompositionPart {
  key: string;
  nameKaz: string;
  description: string;
  excerpt: string;
}

export interface PlotStage {
  stage: string;
  stageKaz: string;
  description: string;
  events: string[];
}

export interface StylisticExample {
  text: string;
  explanation: string;
}

export interface StylisticDevice {
  name: string;
  nameKaz: string;
  group: DeviceGroup;
  examples: StylisticExample[];
}

export interface LanguageFeatureItem {
  text: string;
  explanation?: string;
}

export interface LanguageFeature {
  type: string;
  typeKaz: string;
  items: LanguageFeatureItem[];
}

export interface LiteraryTheory {
  theme: string;
  idea: string;
  image: string;
  portrait: string;
  landscape: string;
  dialogue: string;
  monologue: string;
  psychology: string;
  narration: string;
}

export interface EmotionPoint {
  label: string;
  emotion: string;
  intensity: number;
  color: string;
  description: string;
}

export interface ChronologyEvent {
  year: string;
  event: string;
  description?: string;
  category: 'biography' | 'literary' | 'historical';
}

export interface Place {
  name: string;
  description: string;
  lat: number;
  lon: number;
}

// ── New interfaces ─────────────────────────────────────────
export interface WordCloudItem { word: string; count: number; }

export interface TestQuestion {
  q: string;
  options: string[];
  answer: number;
}

export interface OlympiadQuestion {
  q: string;
  answer?: string;
  grade: string;
  hint?: string;
}

export interface OlympiadSection {
  easy: OlympiadQuestion[];
  medium: OlympiadQuestion[];
  hard: OlympiadQuestion[];
  republican?: OlympiadQuestion[];
}

export interface LessonPlanActivity { step: number; name: string; description: string; }

export interface RubricCriterion {
  criterion: string;
  '4': string; '3': string; '2': string; '1': string;
}

export interface LessonPlan {
  subject: string;
  grade: string;
  duration: string;
  topic: string;
  objectives: string[];
  activities: LessonPlanActivity[];
  assessment: string;
  descriptors: string[];
  rubric: RubricCriterion[];
}

export interface Flashcard { front: string; back: string; }

export interface StudentMaterials {
  summary: string;
  keywords: string[];
  flashcards: Flashcard[];
  keyThoughts: string[];
}

export interface InteractiveExercises {
  matching: { left: string; right: string }[];
  compositionOrdering: { order: number; key: string; name: string }[];
  characterMatching: { character: string; role: string }[];
  fillInBlanks: { text: string; answer: string }[];
}

// ── Main Analysis interface (extended) ──────────────────────
export interface Analysis {
  workSlug: string;
  author: string;
  title: string;
  genre: string;
  direction: string;
  type: string;
  theme: string;
  idea: string;
  mainThought: string;
  period: string;
  literaryMovement: string;
  composition: CompositionPart[];
  plot: PlotStage[];
  characters: AnalysisCharacter[];
  characterRelations: CharacterRelation[];
  literaryTheory: LiteraryTheory;
  stylisticDevices: StylisticDevice[];
  languageFeatures: LanguageFeature[];
  emotionTimeline: EmotionPoint[];
  chronology: ChronologyEvent[];
  places: Place[];
  interestingFacts: string[];
  // ── Optional extended fields ────────────────────────────
  coverGradient?: string[];
  pageCount?: number;
  readingTime?: string;
  readingLevel?: string;
  language?: string;
  rating?: number;
  viewCount?: number;
  downloadCount?: number;
  summary?: string;
  authorPortrait?: string;
  historicalContext?: string;
  philosophicalMeaning?: string;
  educationalValue?: string;
  modernRelevance?: string;
  nationalValue?: string;
  globalValue?: string;
  poemStructure?: null | Record<string, unknown>;
  synopsis?: string;
  keyWords?: WordCloudItem[];
  deviceStatistics?: Record<string, number>;
  test?: TestQuestion[];
  olympiad?: OlympiadSection;
  lessonPlan?: LessonPlan;
  studentMaterials?: StudentMaterials;
  interactiveExercises?: InteractiveExercises;
}
