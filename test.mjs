import { OpenAI } from 'openai';
import * as dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function testOpenAI() {
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an emoji generator. Respond with a single emoji only.' },
        { role: 'user', content: 'a happy cat' }
      ],
    });
    console.log('Success! Emoji:', completion.choices[0].message.content);
  } catch (error) {
    console.error('Error:', error.message);
  }
}

testOpenAI();