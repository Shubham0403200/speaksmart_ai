import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

// -----------------------------
// 🧠 Fallbacks for offline or missing API key
// -----------------------------
const SPEAKING_TOPIC_FALLBACKS: Record<string, string[]> = {
  travel: [
    "Do you like traveling? Why or why not?",
    "What is your favorite travel destination?",
    "Have you ever traveled alone?",
    "What are some advantages of traveling?",
    "How do you usually plan your trips?",
    "Do you prefer mountains or beaches? Why?",
    "What is the most memorable trip you’ve taken?",
    "How do you prepare before traveling to a new country?",
    "Do you enjoy trying new food while traveling?",
    "What place would you like to visit in the future?",
  ],
  technology: [
    "How has technology changed your daily life?",
    "Do you think people use mobile phones too much?",
    "What’s your favorite piece of technology?",
    "Do you think AI will replace human jobs?",
    "How has the internet changed education?",
    "What are the advantages and disadvantages of technology?",
    "Would you prefer reading a printed book or an e-book?",
    "How do you use technology in your studies or work?",
    "Do you think technology brings people closer or farther apart?",
    "How do you stay safe online?",
  ],
  environment: [
    "What are the main environmental problems today?",
    "Do you think individuals can help protect the environment?",
    "How do you personally reduce waste or pollution?",
    "What is your opinion on electric vehicles?",
    "Do you recycle? Why or why not?",
    "What can schools do to promote environmental awareness?",
    "Should governments ban plastic bags?",
    "How can we encourage people to use public transport?",
    "What environmental issues concern you most?",
    "How can future generations live more sustainably?",
  ],
  general: [
    "Can you describe your favorite hobby?",
    "What do you do in your free time?",
    "Do you prefer spending time alone or with friends?",
    "What kind of movies or music do you enjoy?",
    "Who is your role model and why?",
    "Do you enjoy reading books? Why or why not?",
    "How do you stay motivated every day?",
    "Do you prefer living in a city or countryside?",
    "How do you handle stress in your daily life?",
    "What’s a goal you want to achieve this year?",
  ],
};

function getFallbackQuestions(topic: string): string[] {
  const key = topic.toLowerCase().trim();
  return SPEAKING_TOPIC_FALLBACKS[key] || SPEAKING_TOPIC_FALLBACKS.general;
}

// -----------------------------
// 🔁 Simple cache for performance
// -----------------------------
const questionCache = new Map<string, string[]>();

// -----------------------------
// 🚀 POST handler
// -----------------------------
export async function POST(req: NextRequest) {
  try {
    const { topic } = await req.json();
    console.log("🗣️ User topic:", topic);

    if (!topic || topic.trim().length === 0) {
      return NextResponse.json(
        { error: "Topic is required before generating speaking questions." },
        { status: 400 }
      );
    }

    const topicKey = topic.toLowerCase().trim();

    // ✅ Use cache if available
    if (questionCache.has(topicKey)) {
      console.log("♻️ Using cached speaking questions for:", topicKey);
      return NextResponse.json({ questions: questionCache.get(topicKey) });
    }

    // ⚠️ Fallback if API key missing
    if (!GROQ_API_KEY) {
      console.log("⚠️ Missing GROQ_API_KEY — using fallback questions");
      const fallback = getFallbackQuestions(topicKey);
      questionCache.set(topicKey, fallback);
      return NextResponse.json({ questions: fallback });
    }

    const model = "llama-3.1-8b-instant";

    const prompt = `
You are an IELTS Speaking and Communication Coach.
Generate 10–15 realistic spoken English questions related to the topic "${topic}".
Each question should sound natural, conversational, and suitable for practicing fluency and communication.
Avoid numbering, extra comments, or formatting. 
Return ONLY this valid JSON:
{
  "questions": ["q1", "q2", "q3", ..., "q15"]
}
`;

    // Retry logic
    let retryCount = 0;
    const maxRetries = 3;
    const baseDelay = 1000;

    while (retryCount <= maxRetries) {
      try {
        console.log(`🔄 Generating speaking questions for "${topic}" (Attempt ${retryCount + 1})`);

        const completion = await groq.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
        });

        const text = completion.choices[0]?.message?.content;
        if (!text) throw new Error("Empty response from GROQ API");

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid JSON format from API");

        const data = JSON.parse(jsonMatch[0]);

        if (data?.questions?.length >= 10) {
          questionCache.set(topicKey, data.questions);
          console.log(`✅ Generated and cached ${data.questions.length} questions for "${topic}"`);
          return NextResponse.json(data);
        }

        throw new Error("Unexpected structure in API response");
      } catch (err) {
        retryCount++;
        console.log(`⚠️ Error attempt ${retryCount}/${maxRetries}: ${err}`);

        if (retryCount > maxRetries) {
          console.log("📦 Using fallback questions after retries");
          const fallback = getFallbackQuestions(topicKey);
          questionCache.set(topicKey, fallback);
          return NextResponse.json({ questions: fallback });
        }

        const delay = baseDelay * 2 ** (retryCount - 1);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    return NextResponse.json({ questions: getFallbackQuestions(topicKey) });
  } catch (error) {
    console.log("❌ Error in Speaking Questions API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
