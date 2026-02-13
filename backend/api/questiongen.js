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
    `Create a JSON object {"Q": "A"} containing 72 unique trivia items.
    The Split: The first 36 must be Easy/Medium difficulty; the final 36 must be Hard/Expert level.
    The Mix: Alternate between Sports, Science, History, Media, Pop Culture, Tech, and General Trivia. Ensure no category repeats in succession.
    The Tone: Use "The Weakest Link" style—brief, professional, and focusing on global records or scientific terms.`,
  
    `Generate 72 "The Weakest Link" style trivia questions.
    Format: Valid JSON {"Question": "Answer"}.
    Order: 1-36 are standard difficulty; 37-72 are high-difficulty/obscure facts.
    Diversity: Randomize categories (Science, History, Sports, Pop Culture, Media, Tech) so the same subject never appears twice in a row.`,
  
    `Provide 72 distinct trivia questions formatted as a single JSON map: {"Question": "Answer"}.
    Complexity: Deliver 36 moderate questions followed by 36 very challenging questions.
    Categories: Cycle through Science, History, Sports, Media, Tech, and Pop Culture without back-to-back duplicates.`
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