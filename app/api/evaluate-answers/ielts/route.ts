import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { question, userAnswer } = await req.json();

    console.log("question: ", question); 
    console.log("asnwer: ", userAnswer); 

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: "Missing question or userAnswer in request body." },
        { status: 400 }
      );
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
    const GEMINI_API_URL = process.env.GEMINI_API_URL!;

    // if (!GEMINI_API_KEY || !GEMINI_API_URL) {
    //   return NextResponse.json(
    //     { error: "Gemini API key or URL not configured." },
    //     { status: 500 }
    //   );
    // }

    const prompt = `
You are an IELTS speaking examiner. Evaluate the given user answer for the provided IELTS speaking question.
Provide:
1. Band score (1-9) based on fluency, coherence, lexical resource, and grammatical range & accuracy.
2. Feedback explaining why the answer got this band and how to improve it.
3. A Band 9 model answer for this question.

Format your response as JSON only, no explanations, no extra text. Use this structure:

{
  "band": 8,
  "feedback": "The answer is fluent but lacks some advanced vocabulary. Use complex sentences for higher score...",
  "band9_answer": "Your model answer goes here, fluent and highly coherent with advanced vocabulary."
}

Question: "${question}"
UserAnswer: "${userAnswer}"
Respond strictly in JSON.
`;

    // Gemini / Grok REST API call
    const apiResp = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        max_output_tokens: 500,
        temperature: 0,
        top_p: 0.95
      })
    });

    if (!apiResp.ok) {
      console.error("Gemini API returned non-OK:", apiResp.status, apiResp.statusText);
      return NextResponse.json({ error: "Failed to evaluate answer." }, { status: 500 });
    }

    const aiJson = await apiResp.json();

    // Extract text from Gemini response
    let rawText = "";
    if (aiJson.outputText) rawText = aiJson.outputText;
    else if (aiJson.candidates && aiJson.candidates[0]?.content) rawText = aiJson.candidates[0].content;
    else rawText = JSON.stringify(aiJson); // fallback

    // Parse JSON safely
    let parsed = null;
    try {
      const firstBrace = rawText.indexOf("{");
      const lastBrace = rawText.lastIndexOf("}");
      if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
        const jsonSubstring = rawText.slice(firstBrace, lastBrace + 1);
        parsed = JSON.parse(jsonSubstring);
      }
    } catch (err) {
      console.log("Failed to parse JSON from Gemini:", err);
      return NextResponse.json({ error: "Failed to parse AI evaluation." }, { status: 500 });
    }

    return NextResponse.json(parsed, { status: 200 });
  } catch (err) {
    console.error("Error in /api/evaluate:", err);
    return NextResponse.json({ error: "Server error." }, { status: 500 });
  }
}
