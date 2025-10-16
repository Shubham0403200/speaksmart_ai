// app/api/generate-questions/ielts/route.ts

import { NextResponse } from "next/server"

// === Part 2 Cue Card List ===
const PART2_CUE_LIST = [
  "Describe an interesting traditional story",
  "Describe a successful sportsperson you admire",
  "Describe a talk you gave to a group of people",
  "Describe a good habit your friend has, and you want to develop",
  "Describe a time you saw something interesting on social media",
  "Describe a time when you told your friend an important truth",
  "Describe the time when you first talked in a foreign language",
  "Describe a book you read that you found useful",
  "Describe a time when someone apologized to you",
  "Describe an occasion when you lost your way",
  "Describe a time when you saw something in the sky (e.g. flying kites, birds, sunset, etc.)",
  "Describe a place you went to and an outdoor activity you did there",
  "Describe someone else's room you enjoy spending time in",
  "Describe a singer whose music/songs you like",
  "Describe a piece of technology you own that you feel is difficult to use",
  "Describe a time when the electricity suddenly went off",
  "Describe an exciting activity you have tried for the first time",
  "Describe an important decision made with the help of other people",
  "Describe a great dinner you and your friends or family members enjoyed",
  "Describe a friend of yours who is good at music/singing"
]

// === Helper Functions ===
const pickCueCard = () =>
  PART2_CUE_LIST[Math.floor(Math.random() * PART2_CUE_LIST.length)]

const fallbackQuestions = (cue: string) => ({
  part1: [
    "What do you do for work or study?",
    "How do you usually spend your weekends?",
    "Do you prefer to travel alone or with others?",
    "What kind of food do you enjoy?",
    "Tell me about a hobby you have."
  ],
  part2: [cue],
  part3: [
    "How do people in your country typically plan holidays?",
    "What are the advantages and disadvantages of traveling alone?",
    "How has tourism changed in recent years?"
  ]
})

const GEMINI_PROMPT = `You are an expert IELTS speaking examiner. Produce a structured JSON object:
{
  "part1": [ /* 5 short conversational questions */ ],
  "part2": [ /* 1 cue card (provided by the server) */ ],
  "part3": [ /* 3 deeper follow-up discussion questions */ ]
}
Rules:
- Use exactly 5 concise Part 1 questions (6–14 words).
- Use the exact cue card from the server for part2.
- Create exactly 3 logical follow-up questions for part3.
Return only valid JSON — no explanations.`

// === MAIN HANDLER ===
export async function POST() {
  try {
    const chosenCue = pickCueCard()
    const GEMINI_API_URL = process.env.GEMINI_API_URL
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    // Fallback if environment not configured
    if (!GEMINI_API_URL || !GEMINI_API_KEY) {
      console.log("⚠️ GEMINI_API_URL or GEMINI_API_KEY missing — using fallback.")
      return NextResponse.json(fallbackQuestions(chosenCue), { status: 200 })
    }

    const prompt = `${GEMINI_PROMPT}\n\nServerProvidedCueCard: "${chosenCue}"\nInstructions: Use the provided cue card exactly as given.`

    const apiResp = await fetch(GEMINI_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${GEMINI_API_KEY}`
      },
      body: JSON.stringify({
        prompt,
        max_output_tokens: 400,
        temperature: 0.6,
        top_p: 0.95
      })
    })

    // if Gemini fails or returns empty body
    if (!apiResp.ok) {
      console.warn("Gemini API failed:", apiResp.statusText)
      return NextResponse.json(fallbackQuestions(chosenCue), { status: 200 })
    }

    const rawText = await apiResp.text()
    if (!rawText) {
      console.warn("Empty response from Gemini.")
      return NextResponse.json(fallbackQuestions(chosenCue), { status: 200 })
    }

    // Extract valid JSON substring
    const firstBrace = rawText.indexOf("{")
    const lastBrace = rawText.lastIndexOf("}")
    let parsed = null
    if (firstBrace !== -1 && lastBrace !== -1) {
      const jsonSubstring = rawText.slice(firstBrace, lastBrace + 1)
      try {
        parsed = JSON.parse(jsonSubstring)
      } catch {
        console.warn("❌ Failed to parse Gemini JSON.")
      }
    }

    // Validate shape
    if (
      parsed &&
      Array.isArray(parsed.part1) &&
      Array.isArray(parsed.part3) &&
      parsed.part1.length === 5
    ) {
      parsed.part2 = [chosenCue]
      parsed.part3 = parsed.part3.slice(0, 3)
      return NextResponse.json(parsed, { status: 200 })
    }

    // fallback otherwise
    return NextResponse.json(fallbackQuestions(chosenCue), { status: 200 })
  } catch (err) {
    console.error("❌ Error in /api/generate-questions:", err)
    const fallback = fallbackQuestions(pickCueCard())
    return NextResponse.json(fallback, { status: 200 })
  }
}
