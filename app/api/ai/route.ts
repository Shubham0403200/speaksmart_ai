import { NextResponse } from "next/server";
import axios from "axios";

export async function POST(req: Request) {
  try {
    // Parse the incoming request body
    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { success: false, error: "Invalid request: 'messages' must be an array." },
        { status: 400 }
      );
    }

    // Send request to Groq API
    const response = await axios.post(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        model: "llama-3.1-70b-versatile",
        messages,
        temperature: 0.7,
        max_tokens: 1000,
      },
      {
        headers: {
          "Authorization": `Bearer ${process.env.GROQ_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    // Return successful response
    return NextResponse.json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.log("Error from Groq API:", error);

    return NextResponse.json(
      {
        success: false,
        error:
          "Something went wrong while processing your request.",
      },
      { status: 500 }
    );
  }
}
