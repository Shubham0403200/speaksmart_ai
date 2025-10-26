import { NextResponse } from "next/server";
import Groq from "groq-sdk";
import { PART2_CUE_LIST } from "@/data";
import { IELTSQuestions as GeneratedQuestions } from "@/components/interface"

const pickCueCard = () => PART2_CUE_LIST[Math.floor(Math.random() * PART2_CUE_LIST.length)];

const getEnhancedFallbackQuestions = (cue: string): GeneratedQuestions => {
  const topic = cue.toLowerCase();

  let relevantPart3Questions = [
    "How do people in your country typically approach this?",
    "What are the advantages and disadvantages of this?",
    "How has this changed in recent years?",
  ];

  if (topic.includes("technology") || topic.includes("difficult")) {
    relevantPart3Questions = [
      "Why do some people find technology difficult to use?",
      "How can companies make technology more user-friendly?",
      "What skills are important for using modern technology effectively?",
    ];
  } else if (topic.includes("friend") || topic.includes("family")) {
    relevantPart3Questions = [
      "How important are friendships in people's lives?",
      "What qualities make a good friend?",
      "How have relationships between friends changed over time?",
    ];
  } else if (topic.includes("travel") || topic.includes("place")) {
    relevantPart3Questions = [
      "Why do people enjoy traveling to new places?",
      "How has tourism affected different countries?",
      "What are the benefits of experiencing different cultures?",
    ];
  }

  return {
    part1: [
      "What do you do for work or study?",
      "How do you usually spend your weekends?",
      "Do you prefer to travel alone or with others?",
      "What kind of food do you enjoy?",
      "Tell me about a hobby you have.",
    ],
    part2: [cue],
    part3: relevantPart3Questions,
  };
};

const aiGeneratedQuestionsCache = new Map<string, GeneratedQuestions>();

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

export async function POST() {
  const cue = pickCueCard();

  // Return cached questions immediately if available
  if (aiGeneratedQuestionsCache.has(cue)) {
    console.log("♻️ Using cached questions for:", cue);
    return NextResponse.json(aiGeneratedQuestionsCache.get(cue));
  }

  if (!GROQ_API_KEY) {
    console.log("⚠️ No GROQ API key - using fallback");
    return NextResponse.json(getEnhancedFallbackQuestions(cue));
  }

  const model = "llama-3.1-8b-instant";

  const prompt = `
As an IELTS examiner, create exactly:
- 5 short Part 1 questions (6–14 words each)
- Use this exact Part 2 cue: "${cue}"
- 3 relevant Part 3 follow-up questions

Return ONLY this JSON format:
{
  "part1": ["q1", "q2", "q3", "q4", "q5"],
  "part2": ["${cue}"],
  "part3": ["q1", "q2", "q3"]
}
`;

  let retryCount = 0;
  const maxRetries = 3;
  const baseDelay = 1000;

  while (retryCount <= maxRetries) {
    try {
      console.log(`🔄 Attempt ${retryCount + 1} to generate questions...`);

      const completion = await groq.chat.completions.create({
        model,
        messages: [{ role: "user", content: prompt }],
      });

      const text = completion.choices[0]?.message.content;
      if (!text) throw new Error("Empty response from GROQ API");

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) throw new Error("Invalid JSON format from API");

      const data: GeneratedQuestions = JSON.parse(jsonMatch[0]);

      if (data?.part1?.length === 5 && data?.part3?.length === 3) {
        aiGeneratedQuestionsCache.set(cue, data);
        console.log("✅ Successfully generated and cached questions");
        return NextResponse.json(data);
      }

      throw new Error("Unexpected structure in API response");
    } catch (err: unknown) {
      retryCount++;

      let errorMessage = "Unknown error";
      let errorStatus: number | undefined;

      if (err instanceof Error) {
        errorMessage = err.message;
      } else if (typeof err === "object" && err !== null) {
        const e = err as { message?: string; status?: number };
        if (e.message) errorMessage = e.message;
        if (e.status) errorStatus = e.status;
      }

      console.log(`⏳ Retry ${retryCount}/${maxRetries} — ${errorMessage}`);

      if (retryCount > maxRetries || errorStatus === 429) {
        console.log("📦 Using fallback questions after retries or rate-limit");
        return NextResponse.json(getEnhancedFallbackQuestions(cue));
      }

      const delay = baseDelay * 2 ** (retryCount - 1);
      await new Promise((res) => setTimeout(res, delay));
    }
  }

  return NextResponse.json(getEnhancedFallbackQuestions(cue));
}
