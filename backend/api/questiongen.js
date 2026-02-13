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

  const promptOptions = [
    `Generate 16 unique trivia questions
    Output: Valid JSON object only. Format: {"Question": "Answer"}.
    Example format: {"When did WW2 End?": "1945", "Who invented the telephone": "Alexander Graham Bell"}
    Categories: Randomly pull from Sports, Science, History, Media, Pop Culture, and Tech.
    Difficulty: Completely randomize the difficulty for each question (Medium, Hard, or Very Hard).
    Style: "The Weakest Link" style—concise, professional, and factually dense. No back-to-back duplicate categories.`,
  
    `Provide 16 trivia questions in a valid JSON object
    Output: Valid JSON object only. Format: {"Question": "Answer"}.
    Example format: {"When did WW2 End?": "1945", "Who invented the telephone": "Alexander Graham Bell"}
    Mix: Randomly distribute categories (Science, History, Sports, Media, Tech, Pop Culture) and difficulties (ranging from Medium to Very Hard).
    Rule: Avoid common "trivia tropes. Ensure no two questions of the same category are consecutive.`,
  
    `Create 15 diverse trivia questions as a JSON object
    Output: Valid JSON object only. Format: {"Question": "Answer"}.
    Example format: {"When did WW2 End?": "1945", "Who invented the telephone": "Alexander Graham Bell"}
    Instructions: Shuffle categories (Sports, Science, History, Media, Pop Culture, Tech) and difficulties (Medium through Very Hard) randomly.
    Content: Keep phrasing brief and challenging.`
  ];

  const randomPrompt = promptOptions[Math.floor(Math.random() * promptOptions.length)];

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
          content: randomPrompt
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