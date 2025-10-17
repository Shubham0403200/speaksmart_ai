import { NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

export async function POST(req: NextRequest) {
  try {
    const { question, userAnswer } = await req.json()

    console.log("🎯 Question:", question)
    console.log("🗣️ User Answer:", userAnswer)

    if (!question || !userAnswer) {
      return NextResponse.json(
        { error: "Missing question or userAnswer in request body." },
        { status: 400 }
      )
    }

    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    if (!GEMINI_API_KEY) {
      return NextResponse.json(
        { error: "Gemini API key not configured." },
        { status: 500 }
      )
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

    const prompt = `
You are an IELTS speaking examiner. Evaluate the given user answer for the provided IELTS speaking question.
Provide:
1️⃣ Band score (1-9) based on fluency, coherence, lexical resource, and grammatical range & accuracy.
2️⃣ Feedback explaining why the answer got this band and how to improve it.
3️⃣ A Band 9 model answer for this question.

Format your response strictly as JSON with this structure:
{
  "band": 8,
  "feedback": "Your feedback here...",
  "band9_answer": "Your Band 9 model answer here..."
}

Question: "${question}"
UserAnswer: "${userAnswer}"
`

    let response
    let retryCount = 0
    const maxRetries = 2

    // Retry logic for Gemini API overloads (503)
    while (retryCount <= maxRetries) {
      try {
        console.log(`🔄 Attempt ${retryCount + 1} to evaluate answer...`)
        response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            temperature: 0.4,
            maxOutputTokens: 400,
          },
        })
        console.log("✅ AI evaluation successful")
        break
      } catch (error) {
        retryCount++
        console.warn(`⚠️ Evaluation attempt ${retryCount} failed:`, error)

        if (retryCount <= maxRetries) {
          console.log("⏳ Retrying in 2 seconds...")
          await new Promise(resolve => setTimeout(resolve, 2000))
        } else {
          throw error
        }
      }
    }

    if (!response) {
      throw new Error("No response from Gemini after retries.")
    }

    const aiText = response.text
    console.log("📝 Raw AI Response:", aiText)

    if (!aiText) {
      throw new Error("Empty response from Gemini.")
    }

    // Extract JSON from Gemini’s output
    const jsonMatch = aiText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("AI response does not contain valid JSON.")
    }

    const parsed = JSON.parse(jsonMatch[0])

    if (
      typeof parsed.band === "number" &&
      parsed.feedback &&
      parsed.band9_answer
    ) {
      return NextResponse.json(parsed, { status: 200 })
    } else {
      throw new Error("AI JSON missing required fields.")
    }
  } catch (err) {
    console.log("❌ Error in /api/evaluate-answers/ielts:", err)
    return NextResponse.json({ error: "Failed to evaluate answer." }, { status: 500 })
  }
}
