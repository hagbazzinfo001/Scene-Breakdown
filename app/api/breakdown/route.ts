


import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

// Initialize Groq Client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY!,
});

// System instructions
const systemPrompt = `
You are an expert screenwriter and film analyst. Analyze scenes and provide comprehensive breakdowns.
Respond STRICTLY with a JSON object in this format:

{
  "characters": ["character1", "character2"],
  "locations": ["location1", "location2"],
  "themes": ["theme1", "theme2"],
  "tone": "description",
  "structure": "setup, conflict, resolution",
  "technicalNotes": "camera, lighting, sound",
  "visualElements": "key visual elements",
  "emotionalArc": "emotional journey"
}
`;

export async function POST(request: NextRequest) {
  try {
    const { sceneText } = await request.json();

    if (!sceneText) {
      return NextResponse.json(
        { error: "Scene text is required" },
        { status: 400 }
      );
    }

    if (!process.env.GROQ_API_KEY) {
      console.error("GROQ_API_KEY is missing");
      return NextResponse.json(
        {
          error: "Groq API key not set. Add GROQ_API_KEY to your .env.local",
        },
        { status: 503 }
      );
    }

    console.log("[SceneBreak] Starting scene analysis with Groq…");

    // Call Groq Llama model
    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
      messages: [
        { role: "system", content: systemPrompt },
        {
          role: "user",
          content: `Analyze this scene and return ONLY JSON:\n\n${sceneText}`,
        },
      ],
      temperature: 0.2,
      max_tokens: 2000,
    });

    const result = completion.choices[0].message?.content || "";
    console.log("[SceneBreak] Raw Groq output:", result.substring(0, 200));

    // Extract JSON object from text
    const jsonMatch = result.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[SceneBreak] Failed to parse JSON");
      throw new Error("AI did not return valid JSON:\n" + result);
    }

    const breakdown = JSON.parse(jsonMatch[0]);
    console.log("[SceneBreak] Successfully parsed breakdown");

    return NextResponse.json(breakdown, { status: 200 });
  } catch (error: any) {
    console.error("[SceneBreak] Breakdown API error:", error);

    return NextResponse.json(
      {
        error: error?.message || "Failed to analyze scene",
        debug: error?.toString(),
      },
      { status: 500 }
    );
  }
}
