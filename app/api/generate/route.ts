import { OpenAI } from 'openai';
import { NextResponse } from 'next/server';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { description } = await req.json();

    if (!description?.trim()) {
      return NextResponse.json(
        { error: 'Description is required' },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are an emoji generator that creates expressive emoji responses. Given a description, respond with the most appropriate emoji or a small combination of emojis (maximum 3) that best capture the meaning, mood, and nuance of the description. Focus on being precise and evocative. No additional text or explanation."
        },
        {
          role: "user",
          content: description
        }
      ],
      max_tokens: 25,
      temperature: 0.7,
    });

    const emoji = completion.choices[0].message.content?.trim() || '❓';
    
    return NextResponse.json({ emoji });
  } catch (error) {
    console.error('Error:', error);
    return NextResponse.json(
      { error: 'Failed to generate emoji' },
      { status: 500 }
    );
  }
} 