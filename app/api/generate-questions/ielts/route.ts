// app/api/generate-questions/ielts/route.ts
import { NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai"

// === Enhanced Part 2 Cue Card List ===
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
const pickCueCard = () => PART2_CUE_LIST[Math.floor(Math.random() * PART2_CUE_LIST.length)]

// Enhanced fallback questions that are more relevant to the cue card
const getEnhancedFallbackQuestions = (cue: string) => {
  // Extract topic from cue card to make part3 questions more relevant
  const topic = cue.toLowerCase();
  
  let relevantPart3Questions = [
    "How do people in your country typically approach this?",
    "What are the advantages and disadvantages of this?",
    "How has this changed in recent years?"
  ];

  // Add more context-specific part3 questions based on cue card topic
  if (topic.includes("social media")) {
    relevantPart3Questions = [
      "How has social media changed the way people share information?",
      "What are the positive and negative effects of social media on society?",
      "Do you think social media will continue to be important in the future?"
    ];
  } else if (topic.includes("technology") || topic.includes("difficult")) {
    relevantPart3Questions = [
      "Why do you think some people find technology difficult to use?",
      "How can companies make technology more user-friendly?",
      "What skills are important for using modern technology effectively?"
    ];
  } else if (topic.includes("friend") || topic.includes("family")) {
    relevantPart3Questions = [
      "How important are friendships in people's lives?",
      "What qualities make a good friend?",
      "How have relationships between friends changed over time?"
    ];
  } else if (topic.includes("travel") || topic.includes("place")) {
    relevantPart3Questions = [
      "Why do you think people enjoy traveling to new places?",
      "How has tourism affected different countries?",
      "What are the benefits of experiencing different cultures?"
    ];
  }

  return {
    part1: [
      "What do you do for work or study?",
      "How do you usually spend your weekends?",
      "Do you prefer to travel alone or with others?",
      "What kind of food do you enjoy?",
      "Tell me about a hobby you have."
    ],
    part2: [cue],
    part3: relevantPart3Questions
  };
}

// AI-generated questions cache to avoid API calls when possible
const aiGeneratedQuestionsCache = new Map();

export async function POST() {
  try {
    const chosenCue = pickCueCard()
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY

    console.log("🎯 Selected cue card:", chosenCue)

    // Check cache first
    if (aiGeneratedQuestionsCache.has(chosenCue)) {
      console.log("♻️ Using cached questions for:", chosenCue)
      return NextResponse.json(aiGeneratedQuestionsCache.get(chosenCue))
    }

    // If no API key, return enhanced fallback immediately
    if (!GEMINI_API_KEY) {
      console.log("⚠️ No API key - using enhanced fallback")
      const fallback = getEnhancedFallbackQuestions(chosenCue)
      return NextResponse.json(fallback)
    }

    const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY })

    const prompt = `As an IELTS examiner, create exactly:
- 5 short Part 1 questions (6-14 words each)
- Use this exact Part 2 cue: "${chosenCue}"
- 3 relevant Part 3 follow-up questions

Return ONLY this JSON format:
{
  "part1": ["q1", "q2", "q3", "q4", "q5"],
  "part2": ["${chosenCue}"],
  "part3": ["q1", "q2", "q3"]
}`

    let response;
    let retryCount = 0;
    const maxRetries = 2;

    // Retry logic for 503 errors
    while (retryCount <= maxRetries) {
      try {
        console.log(`🔄 Attempt ${retryCount + 1} to generate questions...`)
        
        response = await ai.models.generateContent({
          model: "gemini-2.0-flash",
          contents: prompt,
          config: {
            temperature: 0.7,
            maxOutputTokens: 500,
          }
        })

        console.log("✅ AI questions generated successfully")
        break; // Success, exit retry loop

      } catch (error) {
        retryCount++;
        
        if (error && retryCount <= maxRetries) {
          console.log(`⏳ API overloaded, retrying in 2 seconds... (${retryCount}/${maxRetries})`)
          await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2 seconds
          continue; // Retry
        } else {
          throw error; // Re-throw other errors or if max retries exceeded
        }
      }
    }

    if (!response) {
      throw new Error("Failed to get response after retries")
    }

    const generatedText = response.text
    console.log("📝 AI Response:", generatedText)

    if (!generatedText) {
      throw new Error("Empty response from AI")
    }

    // Extract and parse JSON
    const jsonMatch = generatedText.match(/\{[\s\S]*\}/)
    if (jsonMatch) {
      try {
        const questions = JSON.parse(jsonMatch[0])
        
        // Validate structure
        if (questions.part1 && 
            Array.isArray(questions.part1) && 
            questions.part1.length === 5 &&
            questions.part3 && 
            Array.isArray(questions.part3) && 
            questions.part3.length === 3) {
          
          questions.part2 = [chosenCue] // Ensure correct part2
          
          // Cache the successful result
          aiGeneratedQuestionsCache.set(chosenCue, questions)
          console.log("💾 Cached AI-generated questions for:", chosenCue)
          
          console.log("🎯 Final AI-generated questions:", questions)
          return NextResponse.json(questions)
        }
      } catch (parseError) {
        console.warn("❌ JSON parse error:", parseError)
      }
    }

    // If we get here, AI generation failed
    throw new Error("AI response format invalid")

  } catch (err) {
    console.error("❌ AI question generation failed:", err)
    
    const chosenCue = pickCueCard()
    const fallback = getEnhancedFallbackQuestions(chosenCue)
    
    console.log("📦 Using enhanced fallback questions:", fallback)
    return NextResponse.json(fallback)
  }
}