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
          content: "You are an emoji generator. Given a description, respond with only a single emoji that best matches the description. No other text or explanation."
        },
        {
          role: "user",
          content: description
        }
      ],
      max_tokens: 5,
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