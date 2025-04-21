// pages/api/aria.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  console.log("✅ ARIA API key loaded:", process.env.OPENAI_API_KEY ? "yes" : "no");

  if (req.method !== 'POST') {
    return res.status(405).end();
  }

  const { message } = req.body;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content:
            "You are ARIA, an emotionally intelligent AI guide who helps users grow in relationships and self-awareness. Speak with warmth, empathy, and deep clarity.",
        },
        {
          role: 'user',
          content: message,
        },
      ],
      temperature: 0.8,
    });

    const reply = response.choices?.[0]?.message?.content || '';
    res.status(200).json({ reply });
  } catch (error: any) {
    console.error('ARIA API Error:', error.message);
    res.status(500).json({ error: 'Something went wrong.' });
  }
}
