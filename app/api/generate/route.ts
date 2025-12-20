import { generateContent } from "@/lib/ai-service"
import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "../auth/[...nextauth]/route"
import { allModels } from "@/lib/constants"

export const maxDuration = 60 // Increase timeout for complex generations

export async function POST(req: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions)
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const {
      prompt,
      type,
      gradeLevel,
      subject,
      difficulty = "intermediate",
      modelId = "llama-3.1-70b-versatile", // Default to Groq Llama
    } = body

    // Validate required fields
    if (!prompt || !type || !gradeLevel || !subject) {
      return NextResponse.json({ error: "Missing required fields: prompt, type, gradeLevel, subject" }, { status: 400 })
    }

    // Find the model and provider
    const selectedModel = allModels.find((m) => m.value === modelId)
    const provider = selectedModel?.provider || "groq"

    console.log(`Generating ${type} content for ${gradeLevel} ${subject} using ${provider}:${modelId}`)

    // Generate content using the new AI service
    const result = await generateContent({
      prompt,
      type,
      gradeLevel,
      subject,
      difficulty,
      modelId,
      provider: provider as any,
    })

    return NextResponse.json({
      result,
      model: selectedModel?.label || modelId,
      provider,
    })
  } catch (error) {
    console.error("Error generating content:", error)

    // Return a more helpful error message
    const errorMessage = error instanceof Error ? error.message : "Failed to generate content"

    return NextResponse.json(
      {
        error: errorMessage,
        details: "Please try again with a different model or check your internet connection.",
      },
      { status: 500 },
    )
  }
}
