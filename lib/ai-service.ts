import { openai } from "@ai-sdk/openai"
import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"

export type AIProvider = "openai" | "groq"

export interface AIModel {
  id: string
  name: string
  provider: AIProvider
  description: string
  maxTokens: number
}

export const AI_MODELS: AIModel[] = [
  // OpenAI Models
  {
    id: "gpt-4o",
    name: "GPT-4o",
    provider: "openai",
    description: "Most capable OpenAI model, great for complex tasks",
    maxTokens: 4096,
  },
  {
    id: "gpt-4o-mini",
    name: "GPT-4o Mini",
    provider: "openai",
    description: "Faster and more cost-effective version of GPT-4o",
    maxTokens: 4096,
  },
  {
    id: "gpt-3.5-turbo",
    name: "GPT-3.5 Turbo",
    provider: "openai",
    description: "Fast and reliable for most educational tasks",
    maxTokens: 4096,
  },

  // Groq Models (Fast inference)
  {
    id: "llama-3.1-70b-versatile",
    name: "Llama 3.1 70B",
    provider: "groq",
    description: "Meta's powerful open-source model, excellent for education",
    maxTokens: 8192,
  },
  {
    id: "llama-3.1-8b-instant",
    name: "Llama 3.1 8B",
    provider: "groq",
    description: "Fast and efficient for quick content generation",
    maxTokens: 8192,
  },
  {
    id: "mixtral-8x7b-32768",
    name: "Mixtral 8x7B",
    provider: "groq",
    description: "Mistral's mixture of experts model, great for diverse tasks",
    maxTokens: 32768,
  },
  {
    id: "gemma2-9b-it",
    name: "Gemma 2 9B",
    provider: "groq",
    description: "Google's efficient open model, optimized for instruction following",
    maxTokens: 8192,
  },
]

function getModelProvider(modelId: string, provider: AIProvider) {
  switch (provider) {
    case "openai":
      return openai(modelId)
    case "groq":
      return groq(modelId)
    default:
      return groq("llama-3.1-70b-versatile") // fallback to Groq
  }
}

export interface GenerateOptions {
  prompt: string
  type: string
  gradeLevel: string
  subject: string
  difficulty?: string
  modelId?: string
  provider?: AIProvider
}

export async function generateContent(options: GenerateOptions): Promise<string> {
  const {
    prompt,
    type,
    gradeLevel,
    subject,
    difficulty = "intermediate",
    modelId = "llama-3.1-70b-versatile", // Default to Groq's Llama model
    provider = "groq",
  } = options

  try {
    const model = getModelProvider(modelId, provider)
    const difficultyContext = getDifficultyContext(difficulty)
    const systemPrompt = getSystemPrompt(type, gradeLevel, subject, difficultyContext)

    console.log(`Generating content with ${provider}:${modelId}`)

    const result = await generateText({
      model,
      system: systemPrompt,
      prompt: prompt,
      maxTokens: 2000,
      temperature: 0.7,
    })

    return result.text
  } catch (error) {
    console.error(`Error with ${provider}:${modelId}`, error)

    // Fallback to Groq Llama model if the selected model fails
    if (provider !== "groq" || modelId !== "llama-3.1-8b-instant") {
      console.log("Falling back to Groq Llama 3.1 8B")
      try {
        const fallbackModel = groq("llama-3.1-8b-instant")
        const systemPrompt = getSystemPrompt(type, gradeLevel, subject, getDifficultyContext(difficulty))

        const result = await generateText({
          model: fallbackModel,
          system: systemPrompt,
          prompt: prompt,
          maxTokens: 2000,
          temperature: 0.7,
        })

        return result.text
      } catch (fallbackError) {
        console.error("Fallback model also failed:", fallbackError)
        throw new Error("Content generation failed. Please try again.")
      }
    }

    throw new Error("Content generation failed. Please try again.")
  }
}

function getDifficultyContext(difficulty: string): string {
  switch (difficulty) {
    case "beginner":
      return "simple, foundational concepts with clear explanations"
    case "intermediate":
      return "moderately challenging content with balanced complexity"
    case "advanced":
      return "complex, thought-provoking material requiring critical thinking"
    case "expert":
      return "highly challenging content requiring deep analysis and advanced understanding"
    default:
      return "appropriately challenging content"
  }
}

function getSystemPrompt(type: string, gradeLevel: string, subject: string, difficultyContext: string): string {
  const baseContext = `You are an expert educator creating content for ${gradeLevel} students in ${subject}. Create ${difficultyContext} content that is age-appropriate, engaging, and educationally valuable.`

  switch (type) {
    case "mcq":
      return `${baseContext} Create multiple choice questions with 4 options (A, B, C, D) and clearly indicate the correct answer. Format each question clearly with proper numbering.`

    case "youtube":
      return `${baseContext} Create engaging YouTube video content including scripts, titles, and descriptions that are educational and entertaining for the target age group.`

    case "summarize":
      return `${baseContext} Create clear, concise summaries that capture the main ideas while being accessible to students at this level.`

    case "rewrite":
      return `${baseContext} Rewrite the content to be appropriate for the specified grade level while maintaining accuracy, engagement, and educational value.`

    case "lesson-plan":
      return `${baseContext} Create comprehensive lesson plans including learning objectives, materials needed, step-by-step activities, assessment methods, and time allocations.`

    case "ppt":
      return `${baseContext} Create presentation content with slide titles, bullet points, key concepts, and speaker notes that are visually organized and educationally effective.`

    case "essay-grade":
      return `${baseContext} Provide constructive feedback on student essays, including strengths, areas for improvement, specific suggestions, and an appropriate grade with justification.`

    case "worksheet":
      return `${baseContext} Create educational worksheets with varied question types, clear instructions, proper formatting, and appropriate difficulty progression.`

    default:
      return `${baseContext} Provide helpful, accurate, and engaging educational content.`
  }
}
