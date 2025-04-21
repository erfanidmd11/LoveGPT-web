export interface LevelInfo {
  level: number;
  title: string;
}

export function getLevel(points: number): LevelInfo {
  if (points >= 200) return { level: 5, title: "Mentor Matchmaker" };
  if (points >= 150) return { level: 4, title: "Heart Aligned" };
  if (points >= 100) return { level: 3, title: "Growth Seeker" };
  if (points >= 50) return { level: 2, title: "Self-Aware" };
  return { level: 1, title: "Reflector" };
}
