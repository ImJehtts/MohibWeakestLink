import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");


  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are a trivia generator. Output valid JSON only."
        },
        {
          role: "user",
          content: `Generate 84 random trivia questions. 
          Return a single JSON object where the keys are the questions and the values are the answers.
          The questions should be difficult and cover a wide range of topics as this is for a game called "The Weakest Link" with money prizes.
          Example format: {"When did WW2 End?": "1945", "who invented the telephone": "Alexander Graham Bell"}`
        }
      ],
      response_format: { type: "json_object" }, 
    });

    const content = completion.choices[0].message.content;
    const triviaData = JSON.parse(content);

    res.status(200).json(triviaData);

  } catch (error) {
    console.error('Error generating trivia:', error);
    res.status(500).json({ error: 'Failed to generate trivia questions' });
  }
}