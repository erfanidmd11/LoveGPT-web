import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import OpenAI from 'openai';

admin.initializeApp();
const db = admin.firestore();

// ✅ Initialize OpenAI with the latest SDK
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const generateResumeSummary = functions.firestore
  .document('userResumes/{userId}')
  .onWrite(async (change, context) => {
    const after = change.after.data();
    const userId = context.params.userId;

    if (!after) return;

    const { mbti, disc, big5, enneagram, coreValues } = after;

    const hasEnough =
      mbti &&
      disc?.dominant &&
      big5?.scores &&
      enneagram?.answers?.length &&
      coreValues?.selected?.length;

    if (!hasEnough) return;

    const prompt = `
You are ARIA, an emotionally intelligent AI assistant.
Please write a 4-6 sentence summary of this user based on their personality traits:

MBTI: ${mbti}
DISC: ${disc.dominant}
Big 5 Traits: ${Object.entries(big5.scores).map(([k, v]) => `${k}: ${v}`).join(', ')}
Core Values: ${coreValues.selected.join(', ')}
Enneagram Summary: ${enneagram.answers.slice(0, 3).join('; ')}

The summary should be gentle, insightful, supportive, and unique to them.
`;

    try {
      const res = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      });

      const summary = res.choices[0].message?.content || '';

      await db.doc(`userResumes/${userId}`).update({
        aiInsights: summary,
        aiGeneratedAt: admin.firestore.Timestamp.now(),
      });

      console.log(`✅ AI summary saved for ${userId}`);
    } catch (err) {
      console.error('❌ Error generating AI resume summary:', err);
    }
  });
