export const gradeLevels = [
  "Kindergarten",
  "Grade 1",
  "Grade 2",
  "Grade 3",
  "Grade 4",
  "Grade 5",
  "Grade 6",
  "Grade 7",
  "Grade 8",
  "Grade 9",
  "Grade 10",
  "Grade 11",
  "Grade 12",
]

export const subjects = [
  "Mathematics",
  "Science",
  "English",
  "History",
  "Geography",
  "Art",
  "Music",
  "Physical Education",
  "Computer Science",
  "Foreign Languages",
  "Social Studies",
  "Other",
]

export const difficultyLevels = [
  { value: "beginner", label: "Beginner", description: "Basic concepts and simple problems" },
  { value: "intermediate", label: "Intermediate", description: "Moderate complexity with some challenge" },
  { value: "advanced", label: "Advanced", description: "Complex problems requiring critical thinking" },
  { value: "expert", label: "Expert", description: "Highly challenging content for gifted students" },
]

// Legacy models export for backward compatibility
export const models = [
  { value: "gpt-4o", label: "GPT-4o", free: false },
  { value: "gpt-4o-mini", label: "GPT-4o Mini", free: false },
  { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo", free: false },
  { value: "llama-3.1-70b-versatile", label: "Llama 3.1 70B (Groq)", free: true },
  { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Groq)", free: true },
  { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B (Groq)", free: true },
  { value: "gemma2-9b-it", label: "Gemma 2 9B (Groq)", free: true },
  { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet", free: false },
  { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku", free: false },
  { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", free: false },
  { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", free: false },
]

// Model categories for better organization
export const modelCategories = [
  {
    name: "Recommended",
    description: "Best models for educational content",
    models: [
      { value: "llama-3.1-70b-versatile", label: "Llama 3.1 70B (Groq)", provider: "groq", badge: "Fast" },
      { value: "gpt-4o", label: "GPT-4o (OpenAI)", provider: "openai", badge: "Premium" },
      { value: "claude-3-5-sonnet-20241022", label: "Claude 3.5 Sonnet", provider: "anthropic", badge: "Smart" },
    ],
  },
  {
    name: "Fast & Efficient",
    description: "Quick generation for rapid prototyping",
    models: [
      { value: "llama-3.1-8b-instant", label: "Llama 3.1 8B (Groq)", provider: "groq", badge: "Instant" },
      { value: "gemma2-9b-it", label: "Gemma 2 9B (Groq)", provider: "groq", badge: "Fast" },
      { value: "gpt-4o-mini", label: "GPT-4o Mini (OpenAI)", provider: "openai", badge: "Efficient" },
      { value: "gemini-1.5-flash", label: "Gemini 1.5 Flash", provider: "google", badge: "Quick" },
    ],
  },
  {
    name: "Advanced",
    description: "Most capable models for complex tasks",
    models: [
      { value: "mixtral-8x7b-32768", label: "Mixtral 8x7B (Groq)", provider: "groq", badge: "Large Context" },
      { value: "gemini-1.5-pro", label: "Gemini 1.5 Pro", provider: "google", badge: "Pro" },
      { value: "claude-3-haiku-20240307", label: "Claude 3 Haiku", provider: "anthropic", badge: "Balanced" },
      { value: "gpt-3.5-turbo", label: "GPT-3.5 Turbo (OpenAI)", provider: "openai", badge: "Reliable" },
    ],
  },
]

// Flatten all models for easy access
export const allModels = modelCategories.flatMap((category) => category.models)
