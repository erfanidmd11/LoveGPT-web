import { OpenAI } from 'openai';
import { UserResume } from '@/types/UserResume';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export async function generateUserReport(
  resume: UserResume
): Promise<{ summary: string; readinessScore: number }> {
  const traits = [
    `MBTI Type: ${resume.mbti || 'Unknown'}`,
    `DISC Dominant Trait: ${resume.disc?.dominant || 'Unknown'}`,
    `Big 5 Traits: ${resume.big5?.traits?.join(', ') || 'N/A'}`,
    `Enneagram: ${resume.enneagram?.answers?.slice(0, 3).join(', ') || 'N/A'}`,
    `Core Values: ${resume.coreValues?.selected?.join(', ') || 'N/A'}`,
    `Zodiac: ${resume.zodiac || 'Unknown'}`,
    `Relationship Readiness: ${resume.relationship?.answers?.length || 0}/10 answered`,
    `Parenthood Readiness: ${resume.parenthood?.answers?.length || 0}/10 answered`,
    `NLP Communication Style: ${resume.nlpStyle?.answers?.join(', ') || 'N/A'}`
  ];

  const prompt = `You are ARIA, a kind and emotionally intelligent AI therapist. Based on the following user traits, write a warm, empowering 3-paragraph summary that reflects the user's personality, readiness for relationships, and growth path. Keep it poetic, affirming, and insightful.\n\n${traits.join('\n')}`;

  const response = await openai.chat.completions.create({
    messages: [{ role: 'user', content: prompt }],
    model: 'gpt-4',
    temperature: 0.8,
    max_tokens: 600,
  });

  const readinessScore = [
    resume.mbti,
    resume.disc?.dominant,
    resume.big5?.traits?.length,
    resume.enneagram?.answers?.length,
    resume.coreValues?.selected?.length,
    resume.relationship?.answers?.length,
    resume.parenthood?.answers?.length,
  ].filter(Boolean).length * 14;

  return {
    summary: response.choices[0].message.content || '',
    readinessScore: Math.min(readinessScore, 100),
  };
}
