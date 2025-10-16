import { NextResponse } from "next/server"
import axios from "axios"

export const runtime = "edge" // optional, for faster streaming response

export async function POST(req: Request) {
  try {
    const { text } = await req.json()

    if (!text) {
      return NextResponse.json({ error: "Missing text input." }, { status: 400 })
    }

    const apiKey = process.env.TTS_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing TTSOPENAI_API_KEY in environment." },
        { status: 500 }
      )
    }

    // prepare multipart form data
    const formData = new FormData()
    formData.append("model", "tts-1")
    formData.append("voice_id", "OA001") // change to OA002, OA003, etc. if you want different voice
    formData.append("speed", "1")
    formData.append("text", text) // we are sending plain text here

    const response = await axios.post(
      "https://api.ttsopenai.com/uapi/v1/text-to-speech",
      formData,
      {
        headers: {
          "x-api-key": apiKey,
          "Content-Type": "multipart/form-data"
        },
        responseType: "arraybuffer" // to receive audio binary
      }
    )

    // Create and return the audio file as a response
    return new NextResponse(response.data, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"'
      }
    })
  } catch (error) {
    console.log("TTS API error:", error); 
    return NextResponse.json(
      { error: "Text-to-speech generation failed." },
      { status: 500 }
    )
  }
}
