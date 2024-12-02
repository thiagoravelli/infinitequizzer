// questionController.js

import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateQuestion(req, res) {
  const theme = req.body.theme;
  const difficulty = req.body.difficulty;

  const prompt = ` Generate a multiple-choice question based on the theme "${theme}" at a "${difficulty}" difficulty level.
**Difficulty Levels Explained:**
- **Easy**: Questions cover basic concepts or well-known facts within the theme. They should be straightforward and commonly known.
- **Medium**: Questions require a moderate understanding of the theme. They may involve less obvious facts or concepts that are not general knowledge.
- **Hard**: Questions are challenging and require in-depth knowledge. They may cover complex ideas or obscure facts within the theme.
- **Impossible**: Questions are extremely challenging, likely only answerable by experts or enthusiasts deeply familiar with the theme.

**Requirements:**
- Provide the **question text**.
- Provide **four answer options** labeled A, B, C, D.
- **Indicate which option is correct**.
- Provide a brief **explanation for the correct answer**.
- Ensure the question **matches the specified difficulty level**.
- **Avoid repetition** and ensure the question is unique.

**Format your response as JSON:**
{
    "question": "Question text",
    "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
    },
    "correctOption": "A",
    "explanation": "Explanation text"
}
`;

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: 'You are an expert quiz creator who generates engaging, precise multiple-choice questions in JSON format. The difficulty of the question should be based on the following parameters: Easy is a simple question. Medium is a complex question. Hard is a simple question on a more obscure subject of the theme. Impossible is a complex question on a more obscure subject of the theme' },
        { role: 'user', content: prompt },
        ],
      max_tokens: 500,
      temperature: 0.7,
    });

    const jsonResponse = response.choices[0].message.content.trim();

    // Extract JSON from the response
    const jsonStartIndex = jsonResponse.indexOf('{');
    const jsonEndIndex = jsonResponse.lastIndexOf('}') + 1;
    const jsonString = jsonResponse.substring(jsonStartIndex, jsonEndIndex);

    let questionData;
    try {
      questionData = JSON.parse(jsonString);
    } catch (parseError) {
      console.error('Failed to parse JSON:', parseError);
      res.status(500).json({ error: 'Error parsing the assistant\'s response.' });
      return;
    }

    res.json({ questionData: questionData });
  } catch (error) {
    if (error.status) {
      console.error('Error response from OpenAI API:', error.statusText);
      res.status(500).json({ error: error.statusText });
    } else {
      console.error('Error during OpenAI API call:', error.message);
      res.status(500).json({ error: 'Error generating question.' });
    }
  }
}
