declare module '@/data/zodiacData.json' {
  export interface ZodiacProfile {
    element: string;
    maleTraits: string[];
    femaleTraits: string[];
    best_matches: string[];
    caution_matches: string[];
    growth_areas: string[];
    ai_tips: string[];
  }

  const value: Record<string, ZodiacProfile>;
  export default value;
}
