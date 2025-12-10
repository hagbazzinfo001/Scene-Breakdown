import { generateText } from "ai"
import { type NextRequest, NextResponse } from "next/server"

const systemPrompt = `You are an expert screenwriter and film analyst. Analyze scenes and provide comprehensive breakdowns.
Respond with a JSON object containing:
{
  "characters": ["character1", "character2", ...],
  "locations": ["location1", "location2", ...],
  "themes": ["theme1", "theme2", ...],
  "tone": "description of the scene's tone",
  "structure": "description of the scene structure (setup, conflict, resolution)",
  "technicalNotes": "camera work, lighting, sound design notes",
  "visualElements": "description of key visual elements",
  "emotionalArc": "description of the emotional journey"
}`

export async function POST(request: NextRequest) {
  try {
    const { sceneText } = await request.json()

    if (!sceneText) {
      return NextResponse.json({ error: "Scene text is required" }, { status: 400 })
    }

    const { text } = await generateText({
      model: "openai/gpt-4o-mini",
      system: systemPrompt,
      prompt: `Analyze this scene:\n\n${sceneText}`,
    })

    // Parse the response
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Failed to parse AI response")
    }

    const breakdown = JSON.parse(jsonMatch[0])

    return NextResponse.json(breakdown)
  } catch (error) {
    console.error("Breakdown API error:", error)
    return NextResponse.json({ error: "Failed to analyze scene" }, { status: 500 })
  }
}
