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
}
