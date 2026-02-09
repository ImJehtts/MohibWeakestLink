import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", process.env.FRONTEND_URL);
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
          Make 12 questions for each category : Sports, History Geography, Science (chemistry, biology, etc), Media (movies, music, shows), Pop Culture, Other (true crime, food, technology, etc)
          2 easy, 4 medium, 3 hard, 3 very hard
          Come up with very random questions that are not commonly or could not come up again if prompted twice. 
          Mix up the easy and medium questions together and then mix the hard and very hard questions together so that they are not in order of difficulty.
          Mix the questions up so that they are not in order of category however easy and medium are returned first and hard and very hard and returned after.
          Example format: {"When did WW2 End?": "1945", "Who invented the telephone": "Alexander Graham Bell"}`
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