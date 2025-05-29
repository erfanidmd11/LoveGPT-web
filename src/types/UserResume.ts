export interface UserResume {
  name: string;
  score: number;
  mbti?: string;
  disc?: {
    dominant?: string;
  };
  big5?: {
    traits?: string[];
  };
  enneagram?: {
    answers?: string[];
  };
  coreValues?: {
    selected?: string[];
  };
  relationship?: {
    answers?: string[];
  };
  parenthood?: {
    answers?: string[];
  };
  nlpStyle?: {
    answers?: string[];
  };
  zodiac?: string;
}
