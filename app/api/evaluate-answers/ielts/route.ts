import { NextRequest, NextResponse } from "next/server";
import { PART2_CUE_LIST } from "@/data";

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

    // Check if question is Part 2
    const isPart2 = PART2_CUE_LIST.some(cue =>
      question.toLowerCase().includes(cue.toLowerCase())
    );

    // Prompt
    const prompt = isPart2
      ? `
You are an IELTS Speaking examiner.
Evaluate the user's Part 2 answer.
1️⃣ Give a band score (1-9) based on fluency, coherence, vocabulary & grammar.
2️⃣ Provide feedback in **1–2 lines**, highly relevant.
3️⃣ Then provide a **Band 9 model answer** using the **ARE** method.
4️⃣ Use this **Part 2 template** in the Band 9 answer:

Introduction:
‘Thank you for this interesting topic. I’d like to talk about ${question}, which is something I find quite [adjective]. It resonates with me because [personal connection]. Let me share my thoughts.’

Main Body (1-1.5 minutes):
1. Personal Connection:
‘To begin with, this topic reminds me of [experience]. For instance, [example]. This shaped my perspective because [reason].’
2. Broader Perspective:
‘Beyond my personal experience, I believe ${question} is significant because [relevance]. For example, [general example].’
3. Future Implications:
‘Looking ahead, I think ${question} will continue to evolve. I hope to see [wish]. Personally, I would like to [goal/action] because [reason].’

Conclusion:
‘To sum up, ${question} is something I deeply value because [reason]. It has taught me [lesson], and I believe it will remain relevant. Thank you for letting me share my thoughts.’

Return strictly as JSON:
{
  "band": <number>,
  "feedback": "<short feedback>",
  "band9_answer": "<model answer>"
}

User Answer: "${userAnswer}"
`
      : `
You are an IELTS Speaking examiner.
Evaluate the user's answer.
1️⃣ Give a band score (1-9) based on fluency, coherence, vocabulary & grammar.
2️⃣ Provide feedback in **1–2 lines**, highly relevant.
3️⃣ Provide a Band 9 model answer using the ARE method: Answer → Reason → Example.
Return strictly as JSON:
{
  "band": <number>,
  "feedback": "<short feedback>",
  "band9_answer": "<model answer>"
}
Question: "${question}"
UserAnswer: "${userAnswer}"
`;

    let retryCount = 0;
    const maxRetries = 2;
    let responseText: string | undefined;

    // -------- Retry Loop --------
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
            temperature: 0.4,
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
      } catch (err: unknown) {
        console.warn(`⚠️ Evaluation attempt ${retryCount} failed:`, err);

        const status = (err as unknown);
        if (retryCount > maxRetries || status === 429) {
          return NextResponse.json(
            { error: "Evaluation API limit reached. Please try again later." },
            { status: 503 }
          );
        }
        // Wait before retry
        await new Promise(res => setTimeout(res, 2000 * retryCount));
      }
    }

    if (!responseText) throw new Error("No valid response from GROQ.");

    // -------- Safe JSON parsing --------
    const match = responseText.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Response JSON extraction failed.");

    let parsed;
    try {
      const cleaned = match[0]
        .replace(/\n/g, " ")
        .replace(/\r/g, " ")
        .replace(/\\+/g, "")
        .replace(/(\r\n|\n|\r)/gm, " ");
      parsed = JSON.parse(cleaned);
    } catch (err) {
      console.log("❌ JSON parse failed after cleaning:", err);
      throw new Error("Failed to parse AI response JSON.");
    }

    const { band, feedback, band9_answer } = parsed;

    if (typeof band === "number" && typeof feedback === "string" && typeof band9_answer === "string") {
      return NextResponse.json({ band, feedback, band9_answer }, { status: 200 });
    } else {
      throw new Error("Parsed JSON missing required fields.");
    }
  } catch (err) {
    console.error("❌ Error in /api/evaluate-answers/ielts:", err);
    return NextResponse.json({ error: "Failed to evaluate answer." }, { status: 500 });
  }
}

// export async function POST(req: NextRequest) {
//   try {
//     const { question, userAnswer } = await req.json();

//     console.log("🎯 Question:", question);
//     console.log("🗣️ User Answer:", userAnswer);

//     if (!question || !userAnswer) {
//       return NextResponse.json(
//         { error: "Missing question or userAnswer in request body." },
//         { status: 400 }
//       );
//     }

//     const GROQ_API_KEY = process.env.GROQ_API_KEY;
//     if (!GROQ_API_KEY) {
//       return NextResponse.json(
//         { error: "GROQ API key not configured." },
//         { status: 500 }
//       );
//     }

//     const endpoint = "https://api.groq.com/openai/v1/chat/completions";
//     const model = "llama-3.1-8b-instant";

//     // Detect Part 2 Cue
//     const isPart2 = PART2_CUE_LIST.some(cue =>
//       question.toLowerCase().includes(cue.toLowerCase())
//     );

//     // Prompt for GROQ — Now includes detailed sub-scores
//     const prompt = isPart2
//       ? `
// You are an IELTS Speaking examiner.
// Evaluate the user's Part 2 answer.

// Return results as **structured JSON** ONLY.

// Provide:
// 1️⃣ Overall band score (1–9)
// 2️⃣ Subscores for:
//    - Fluency
//    - Pronunciation
//    - Grammar
//    - Vocabulary
// 3️⃣ 1–2 line feedback (specific, useful)
// 4️⃣ A Band 9 model answer using the ARE (Answer–Reason–Example) method.

// Band 9 answer must follow this **Part 2 Template**:

// Introduction:
// “Thank you for this interesting topic. I’d like to talk about ${question}, which is something I find quite [adjective]. It resonates with me because [personal connection]. Let me share my thoughts.”

// Main Body (1–1.5 minutes):
// 1. Personal Connection:
// “To begin with, this topic reminds me of [experience]. For instance, [example]. This shaped my perspective because [reason].”
// 2. Broader Perspective:
// “Beyond my personal experience, I believe ${question} is significant because [relevance]. For example, [general example].”
// 3. Future Implications:
// “Looking ahead, I think ${question} will continue to evolve. I hope to see [wish]. Personally, I would like to [goal/action] because [reason].”

// Conclusion:
// “To sum up, ${question} is something I deeply value because [reason]. It has taught me [lesson], and I believe it will remain relevant. Thank you for letting me share my thoughts.”

// Return **strictly** in JSON format:
// {
//   "band": <number>,
//   "fluency": <number>,
//   "pronunciation": <number>,
//   "grammar": <number>,
//   "vocabulary": <number>,
//   "feedback": "<short feedback>",
//   "band9_answer": "<Band 9 model answer>"
// }

// User Answer: "${userAnswer}"
// `
//       : `
// You are an IELTS Speaking examiner.
// Evaluate the user's answer.

// Return results as **strict JSON ONLY** with the following:
// {
//   "band": <number>,
//   "fluency": <number>,
//   "pronunciation": <number>,
//   "grammar": <number>,
//   "vocabulary": <number>,
//   "feedback": "<short feedback>",
//   "band9_answer": "<Band 9 model answer>"
// }

// Scoring Criteria:
// - Fluency & Coherence
// - Pronunciation
// - Grammar Range & Accuracy
// - Lexical Resource (Vocabulary)

// Band 9 answer should use ARE (Answer → Reason → Example) structure.

// Question: "${question}"
// User Answer: "${userAnswer}"
// `;

//     // Retry Logic
//     let retryCount = 0;
//     const maxRetries = 2;
//     let responseText: string | undefined;

//     while (retryCount <= maxRetries) {
//       try {
//         retryCount++;
//         console.log(`🔄 Attempt ${retryCount} to evaluate answer...`);

//         const response = await fetch(endpoint, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${GROQ_API_KEY}`,
//           },
//           body: JSON.stringify({
//             model,
//             messages: [{ role: "user", content: prompt }],
//             temperature: 0.4,
//             max_tokens: 700,
//           }),
//         });

//         if (!response.ok) {
//           const text = await response.text();
//           throw { status: response.status, message: text };
//         }

//         const json = await response.json();
//         responseText = json.choices?.[0]?.message?.content ?? json.text;

//         console.log("📝 Raw GROQ Response:", responseText);
//         break;
//       } catch (err) {
//         console.warn(`⚠️ Evaluation attempt ${retryCount} failed:`, err);
//         if (retryCount > maxRetries || err) {
//           console.log("📦 Using fallback: rate-limit or retries exceeded.");
//           return NextResponse.json(
//             { error: "Evaluation API limit reached. Please try again later." },
//             { status: 503 }
//           );
//         }
//         await new Promise(res => setTimeout(res, 2000 * retryCount));
//       }
//     }

//     if (!responseText) throw new Error("No valid response from GROQ.");

//     // Extract JSON safely
//     const match = responseText.match(/\{[\s\S]*\}/);
//     if (!match) throw new Error("Response JSON extraction failed.");

//     let parsed;
//     try {
//       const cleaned = match[0]
//         .replace(/\n/g, " ")
//         .replace(/\r/g, " ")
//         .replace(/\\+/g, "")
//         .replace(/(\r\n|\n|\r)/gm, " ");
//       parsed = JSON.parse(cleaned);
//     } catch (err) {
//       console.error("❌ JSON parse failed after cleaning:", err);
//       throw new Error("Failed to parse AI response JSON.");
//     }

//     const {
//       band,
//       feedback,
//       band9_answer,
//       fluency,
//       pronunciation,
//       grammar,
//       vocabulary,
//     } = parsed;

//     // Validation
//     if (
//       typeof band === "number" &&
//       typeof feedback === "string" &&
//       typeof band9_answer === "string" &&
//       typeof fluency === "number" &&
//       typeof pronunciation === "number" &&
//       typeof grammar === "number" &&
//       typeof vocabulary === "number"
//     ) {
//       return NextResponse.json(
//         { band, fluency, pronunciation, grammar, vocabulary, feedback, band9_answer },
//         { status: 200 }
//       );
//     } else {
//       throw new Error("Parsed JSON missing required fields.");
//     }
//   } catch (err) {
//     console.error("❌ Error in /api/evaluate-answers/ielts:", err);
//     return NextResponse.json({ error: "Failed to evaluate answer." }, { status: 500 });
//   }
// }
