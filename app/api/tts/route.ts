// app/api/tts/route.ts
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: Request) {
  try {
    const { text } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Missing text input." }, { status: 400 });
    }

    const apiKey = process.env.TTS_API_KEY;
    if (!apiKey) {
      console.error("Missing TTS_API_KEY environment variable");
      return NextResponse.json(
        { error: "TTS service not configured." },
        { status: 500 }
      );
    }

    console.log("🔊 TTS Request for:", text.slice(0, 50), "...");

    // Prepare request body as per TTSOpenAI spec
    const body = JSON.stringify({
      model: "tts-1",
      voice_id: "free_voice_1",
      speed: 1,
      input: text
    });

    const response = await fetch("https://api.ttsopenai.com/uapi/v1/text-to-speech", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey
      },
      body
    });

    if (!response.ok) {
      const errText = await response.text();
      console.error("❌ TTSOpenAI error:", response.status, errText);
      return NextResponse.json(
        { error: `TTSOpenAI failed: ${response.status} ${response.statusText}` },
        { status: response.status }
      );
    }

    const resultJson = await response.json();

    // The API returns a JSON with metadata, not the audio itself immediately
    // Usually TTSOpenAI provides a `uuid` or URL to fetch the audio
    // According to docs, result is in `result.uuid` etc. :contentReference[oaicite:3]{index=3}
    const { result } = resultJson;
    if (!result || !result.uuid) {
      console.error("❌ Missing result or uuid in TTSOpenAI response", resultJson);
      return NextResponse.json({ error: "TTSOpenAI response invalid." }, { status: 500 });
    }

    const uuid = result.uuid;
    // Build audio URL (docs mention you fetch via another endpoint or path)
    // Suppose audio URL is: https://api.ttsopenai.com/uapi/v1/text-to-speech/{uuid}
    const audioFetch = await fetch(`https://api.ttsopenai.com/uapi/v1/text-to-speech/${uuid}`, {
      headers: {
        "x-api-key": apiKey
      }
    });

    if (!audioFetch.ok) {
      const errText2 = await audioFetch.text();
      console.error("❌ Fetching TTS audio failed:", audioFetch.status, errText2);
      return NextResponse.json(
        { error: `Fetch audio failed: ${audioFetch.status}` },
        { status: audioFetch.status }
      );
    }

    const audioBuffer = await audioFetch.arrayBuffer();

    return new NextResponse(audioBuffer, {
      status: 200,
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": 'inline; filename="speech.mp3"',
        "Cache-Control": "no-cache"
      }
    });
  } catch (error) {
    console.error("TTSOpenAI API error:", error);
    return NextResponse.json(
      { error: "Text-to-speech generation failed." },
      { status: 500 }
    );
  }
}
