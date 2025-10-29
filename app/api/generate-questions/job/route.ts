import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const GROQ_API_KEY = process.env.GROQ_API_KEY;
const groq = new Groq({ apiKey: GROQ_API_KEY });

// -----------------------------
// 🎯 Fallback questions per field
// -----------------------------
const FIELD_SPECIFIC_FALLBACKS: Record<string, string[]> = {
  general: [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why do you want to work here?",
    "Describe a challenge you faced and how you handled it.",
    "How do you handle stress or pressure?",
    "What motivates you in your career?",
    "Where do you see yourself in five years?",
    "How do you prioritize your work?",
    "Describe a time you worked in a team.",
    "Why should we hire you?",
  ],
  engineering: [
    "Can you explain a technical project you worked on?",
    "What tools or technologies are you most comfortable with?",
    "How do you approach solving complex problems?",
    "Describe a time you faced an engineering challenge and overcame it.",
    "How do you ensure quality and safety in your projects?",
    "What new technology excites you in your field?",
    "How do you handle project deadlines under pressure?",
    "Explain a design improvement you made recently.",
    "How do you collaborate with non-technical teams?",
    "What’s the most innovative project you’ve contributed to?",
  ],
  marketing: [
    "What’s your process for planning a marketing campaign?",
    "How do you measure campaign success?",
    "Describe a campaign that didn’t go as planned and what you learned.",
    "How do you handle negative feedback from clients?",
    "What marketing tools or platforms do you use?",
    "How has social media changed marketing strategies?",
    "Tell me about a time you worked under a tight deadline.",
    "How do you stay updated on market trends?",
    "What’s your favorite ad campaign and why?",
    "What’s the biggest challenge in reaching Gen Z consumers?",
  ],
  teaching: [
    "What inspired you to become a teacher?",
    "How do you handle disruptive students?",
    "Describe your teaching style.",
    "How do you make your lessons engaging?",
    "Tell me about a memorable student you’ve taught.",
    "What role does technology play in your classroom?",
    "How do you manage classroom diversity?",
    "How do you assess student learning effectively?",
    "What are your biggest challenges as a teacher?",
    "How do you handle feedback from parents?",
  ],
};

function getFallbackQuestions(field: string): string[] {
  const key = field.toLowerCase().trim();
  return FIELD_SPECIFIC_FALLBACKS[key] || FIELD_SPECIFIC_FALLBACKS.general;
}

// -----------------------------
// 🔁 Cache for performance
// -----------------------------
const questionCache = new Map<string, string[]>();

// -----------------------------
// 🚀 POST handler
// -----------------------------
export async function POST(req: NextRequest) {
  try {
    const { userField } = await req.json();

    if (!userField || userField.trim().length === 0) {
      return NextResponse.json(
        { error: "User field is required before generating interview questions." },
        { status: 400 }
      );
    }

    const fieldKey = userField.toLowerCase().trim();

    // ✅ Return cached questions if available
    if (questionCache.has(fieldKey)) {
      return NextResponse.json({ questions: questionCache.get(fieldKey) });
    }

    // ⚠️ No API key fallback
    if (!GROQ_API_KEY) {
      const fallback = getFallbackQuestions(fieldKey);
      questionCache.set(fieldKey, fallback);
      return NextResponse.json({ questions: fallback });
    }

    const model = "llama-3.1-8b-instant";

    const prompt = `
You are an HR interviewer for a ${userField} position.
Generate exactly 10 realistic job interview questions in the ${userField} field.
Each question should be between 8–18 words long and natural for a spoken interview.

Return ONLY this valid JSON:
{
  "questions": ["q1", "q2", "q3", ..., "q10"]
}
`;

    // Retry mechanism
    let retryCount = 0;
    const maxRetries = 3;
    const baseDelay = 1000;

    while (retryCount <= maxRetries) {
      try {
        const completion = await groq.chat.completions.create({
          model,
          messages: [{ role: "user", content: prompt }],
        });

        const text = completion.choices[0]?.message?.content;
        if (!text) throw new Error("Empty response from GROQ API");

        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (!jsonMatch) throw new Error("Invalid JSON format from API");

        const data = JSON.parse(jsonMatch[0]);

        if (data?.questions?.length === 10) {
          questionCache.set(fieldKey, data.questions);
          return NextResponse.json(data);
        }

        throw new Error("Unexpected structure in API response");
      } catch (err) {
        retryCount++;
        console.log(`⚠️ Error attempt ${retryCount}/${maxRetries}: ${err}`);

        if (retryCount > maxRetries || err) {
          const fallback = getFallbackQuestions(fieldKey);
          questionCache.set(fieldKey, fallback);
          return NextResponse.json({ questions: fallback });
        }

        const delay = baseDelay * 2 ** (retryCount - 1);
        await new Promise((res) => setTimeout(res, delay));
      }
    }

    return NextResponse.json({ questions: getFallbackQuestions(fieldKey) });
  } catch (error) {
    console.log("❌ Error in Job Interview Questions API:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
