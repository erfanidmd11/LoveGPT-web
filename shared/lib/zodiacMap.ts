// shared/lovegpt-shared/lib/zodiacMap.ts

import { ZodiacNarrative } from './types';

// Use dynamic imports or a central registry
import { Aquarius_Dog_male, Aquarius_Dog_female } from './zodiac/Aquarius/Dog';
// Repeat or generate these for each valid zodiac combo

const narrativeMap: Record<string, ZodiacNarrative> = {
  'Aquarius_Dog_male': Aquarius_Dog_male,
  'Aquarius_Dog_female': Aquarius_Dog_female,
  // Add more entries here for other combinations...
};

export function getZodiacNarrative(
  western: string,
  chinese: string,
  gender: 'male' | 'female'
): ZodiacNarrative | undefined {
  const key = `${western}_${chinese}_${gender}`;
  return narrativeMap[key];
}

export function getZodiacKeyList(): string[] {
  return Object.keys(narrativeMap);
}
