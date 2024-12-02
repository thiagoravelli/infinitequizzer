// themeController.js

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function validateTheme(req, res) {
  const themeInput = req.body.theme;

  const prompt = `Analyze the following theme input and determine if it is suitable for generating quiz questions. The theme should be concise, not gibberish, nor nonsensical, nor offensive, nor inappropriate and you should have reasonable knowledge on the subject to generate interesting and good questions. Is the theme "${themeInput}" suitable? The answer should be one word and be either "Yes" or "No".`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
        { role: 'system', content: 'You are an expert quiz creator who generates engaging, precise multiple-choice questions in JSON format.' },
        { role: 'user', content: prompt },
        ],
      max_tokens: 5,
      temperature: 0.5,
    });

    const answer = response.choices[0].message.content.trim();
    const isValid = answer.toLowerCase().includes('yes');

    res.json({ isValid: isValid });
  } catch (error) {
    if (error.status) {
      console.error('Error response from OpenAI API:', error.statusText);
      res.status(500).json({ error: error.statusText });
    } else {
      console.error('Error during OpenAI API call:', error.message);
      res.status(500).json({ error: 'Error validating theme.' });
    }
  }
}