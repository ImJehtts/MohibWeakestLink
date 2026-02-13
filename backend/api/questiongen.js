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
    `Generate 72 highly specific trivia questions. 
    Output: A single JSON object { "Question": "Answer" }.
    Categories: Try to focus on the categories Sports, History/Geography, Science, Media, Pop Culture, and Other (True Crime/Food/Tech).
    Difficulty: For each category, provide have half the questions easy/medium and the other half hard/very hard.
    Ordering: Mix easy and medium questions together for the first 36 questions. Mix hard and very hard for the remaining 48. Ensure categories are randomized so no two questions of the same category appear back-to-back.
    Style: "The Weakest Link" style—concise but challenging. Avoid common "top-tier" facts. Focus on international milestones, scientific nomenclature, and niche historical records to ensure variety if prompted repeatedly.`,
  
    `Generate 72 unique trivia questions for a high-stakes game.
    Output: Valid JSON object only. Format: {"Question": "Answer"}.
    Distribution: Try to focus on the categories Science, History/Geography, Sports, Pop Culture, Media, and Other (True Crime/Food/Tech/General). 
    Complexity Mix: Have half the questions easy/medium and the other half hard/very hard.
    Sequence: You MUST return all easy/medium questions first (shuffled), followed by all hard/very hard questions (shuffled). Do not group them by category.
    Use obscure facts that aren't typically found in standard trivia sets. The questions must be difficult enough for a money-prize competition.`,
  
    `Generate 72 random trivia questions for "The Weakest Link."
    Output: Valid JSON object only. Format: {"Question": "Answer"}.
    Categorization: Try to focus on the categories  Sports (obscure records), History/Geography (niche geopolitics), Science (Chemistry/Biology/Physics), Media (Classic Cinema/Indie Music), Pop Culture (Fashion/Trends), and Other (True Crime/Food/Tech/General).
    Hierarchy: Have half the questions easy/medium and the other half hard/very hard.
    Sorting: Shuffle the easy/medium questions together as the first half of the response. Shuffle hard/very hard together for the second half.
    Strict Instruction: Do not repeat common trivia tropes. If a question is commonly known, discard it and find a deeper fact. Ensure the phrasing is professional and the answers are 100% factually verifiable.`
  ];

  const randomPrompt = promptOptions[Math.floor(Math.random() * promptOptions.length)];
  const modelOptions = ["gpt-4o-mini", "gpt-5-nano"];
  const randomModel = modelOptions[Math.floor(Math.random() * modelOptions.length)];

  try {
    const completion = await openai.chat.completions.create({
      model: randomModel,
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