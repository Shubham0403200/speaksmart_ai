import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, userAnswer } = await req.json();

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: "Missing question or userAnswer in request body." },
        { status: 400 }
      );
    }

    const GROQ_API_KEY = process.env.GROQ_API_KEY;
    if (!GROQ_API_KEY) {
      return NextResponse.json(
        { error: "GROQ API key not configured." },
        { status: 500 }
      );
    }

    const endpoint = "https://api.groq.com/openai/v1/chat/completions";
    const model = "llama-3.1-8b-instant";

    const prompt = `
You are an IELTS Speaking Examiner and Communication Skills Coach.

Evaluate the user's spoken answer based on:
- Fluency and coherence
- Pronunciation clarity
- Grammar and vocabulary range
- Relevance and natural tone
- Ability to express ideas clearly

Now do three things:
1️⃣ Give a **score from 1–10** (1 = very poor, 10 = excellent fluency and clarity)
2️⃣ Provide a **short 1–2 line feedback** suggesting improvement.
3️⃣ Write a **Good Response** — a natural, fluent, band 9-level answer for the same question.

Return ONLY valid JSON in this format:
{
  "score": <number>,
  "feedback": "<short feedback>",
  "good_response": "<model fluent speaking answer>"
}

Question: "${question}"
User Answer: "${userAnswer}"
`;

    // ------------------------------------
    // 🔁 Retry mechanism
    // ------------------------------------
    let retryCount = 0;
    const maxRetries = 2;
    let responseText: string | undefined;

    while (retryCount <= maxRetries) {
      try {
        retryCount++;
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model,
            messages: [{ role: "user", content: prompt }],
            temperature: 0.6,
            max_tokens: 600,
          }),
        });

        if (!response.ok) {
          const text = await response.text();
          throw { status: response.status, message: text };
        }

        const json = await response.json();
        responseText = json.choices?.[0]?.message?.content ?? json.text;

        break;
      } catch (err) {
        console.log(`⚠️ Attempt ${retryCount} failed:`, err);
        if (retryCount > maxRetries) {
          return NextResponse.json(
            { error: "Evaluation temporarily unavailable. Please try again later." },
            { status: 503 }
          );
        }
        await new Promise((res) => setTimeout(res, 2000 * retryCount));
      }
    }

    if (!responseText) throw new Error("No valid response from GROQ API");

    // ------------------------------------
    // 🧩 Extract and clean JSON
    // ------------------------------------
    const match = responseText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Failed to extract JSON from AI response.");

    let parsed;
    try {
      const cleaned = match[0]
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/\\+/g, "")
        .replace(/(\r\n|\n|\r)/gm, " ");
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.error("❌ JSON parse failed after cleaning:", err);
      throw new Error("Failed to parse AI response JSON.");
    }

    const { score, feedback, good_response } = parsed;

    if (
      typeof score === "number" &&
      typeof feedback === "string" &&
      typeof good_response === "string"
    ) {
      return NextResponse.json({ score, feedback, good_response }, { status: 200 });
    } else {
      throw new Error("Parsed JSON missing required fields.");
    }
  } catch (err) {
    console.error("❌ Error in /api/evaluate-answers/speaking:", err);
    return NextResponse.json(
      { error: "Failed to evaluate speaking answer." },
      { status: 500 }
    );
  }
}
