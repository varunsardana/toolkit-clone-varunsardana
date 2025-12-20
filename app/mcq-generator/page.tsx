"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Download, RefreshCw, AlertCircle, FileText, Copy } from "lucide-react"
import { gradeLevels, subjects, difficultyLevels, models } from "@/lib/constants"
import { ModelSelector } from "@/components/model-selector"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { FormDiagnostics } from "@/components/form-diagnostics"
import { GradeSelect } from "@/components/ui/GradeSelect"
import { SubjectSelect } from "@/components/ui/SubjectSelect"
import { DifficultySelect } from "@/components/ui/DifficultySelect"
import { QuestionCountSelect } from "@/components/ui/QuestionCountSelect"
import Papa from "papaparse"
import { AIContentDisplay } from "@/components/ai-content-display"

export default function MCQGenerator() {
  // State management with proper initialization
  const [topic, setTopic] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [numQuestions, setNumQuestions] = useState("5")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [modelId, setModelId] = useState("llama-3.1-70b-versatile")
  const [error, setError] = useState("")
  const [usedModel, setUsedModel] = useState("")
  const [files, setFiles] = useState<File[]>([])
  const [fileTexts, setFileTexts] = useState<string[]>([])
  const [fileErrors, setFileErrors] = useState<string[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Memoized event handlers to prevent unnecessary re-renders
  const handleTopicChange = useCallback(
    (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value
      console.log("Topic change event:", value) // Debug log
      setTopic(value)
      // Clear any previous errors when user starts typing
      if (error) setError("")
    },
    [error],
  )

  const handleGradeLevelChange = useCallback(
    (value: string) => {
      console.log("Grade level change:", value) // Debug log
      setGradeLevel(value)
      if (error) setError("")
    },
    [error],
  )

  const handleSubjectChange = useCallback(
    (value: string) => {
      console.log("Subject change:", value) // Debug log
      setSubject(value)
      if (error) setError("")
    },
    [error],
  )

  const handleDifficultyChange = useCallback((value: string) => {
    console.log("Difficulty change:", value) // Debug log
    setDifficulty(value)
  }, [])

  const handleNumQuestionsChange = useCallback((value: string) => {
    console.log("Number of questions change:", value) // Debug log
    setNumQuestions(value)
  }, [])

  const handleModelChange = useCallback((value: string) => {
    console.log("Model change:", value) // Debug log
    setModelId(value)
  }, [])

  // File upload handler (multiple files)
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(e.target.files || [])
    setFiles(uploadedFiles)
    setFileErrors([])
    setFileTexts([])
    if (!uploadedFiles.length) return
    const texts: string[] = []
    const errors: string[] = []
    for (const file of uploadedFiles) {
      const ext = file.name.split(".").pop()?.toLowerCase()
      if (ext === "txt") {
        // Read text file on client
        const text = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = (ev) => resolve(ev.target?.result as string)
          reader.onerror = () => reject("Failed to read file.")
          reader.readAsText(file)
        }).catch((err) => {
          errors.push(err)
          return ""
        })
        texts.push(text)
      } else if (["csv", "pdf", "docx"].includes(ext || "")) {
        // Server-side extraction, one request per file
        const formData = new FormData()
        formData.append("file", file)
        try {
          const extractRes = await fetch("/api/extract-text", { method: "POST", body: formData })
          if (!extractRes.ok) {
            errors.push(`Failed to extract text from ${file.name}`)
            texts.push("")
            continue
          }
          const extractData = await extractRes.json()
          texts.push(extractData.text || "")
        } catch {
          errors.push(`Failed to extract text from ${file.name}`)
          texts.push("")
        }
      } else {
        errors.push(`Unsupported file type: ${file.name}`)
        texts.push("")
      }
    }
    setFileTexts(texts)
    setFileErrors(errors)
  }

  // Form validation - fix the validation logic
  const isFormValid = topic.trim().length > 0 && gradeLevel.length > 0 && subject.length > 0

  const generateMCQ = async () => {
    console.log("Generate MCQ called with:", { topic, gradeLevel, subject, difficulty, numQuestions, modelId })

    // Validate form before submission
    if (!topic.trim()) {
      setError("Please enter a topic or content for the MCQ questions.")
      return
    }
    if (!gradeLevel) {
      setError("Please select a grade level.")
      return
    }
    if (!subject) {
      setError("Please select a subject.")
      return
    }

    setIsLoading(true)
    setError("")
    setResult("")
    try {
      const knowledgeText = fileTexts.filter(Boolean).join("\n\n")

      const requestBody = {
        prompt: `Create ${numQuestions} multiple choice questions about: ${topic.trim()}${knowledgeText ? `\n\nUse the following knowledge base:\n${knowledgeText}` : ""}. Each time this prompt is run, generate a new, unique set of questions that do not repeat previous questions. Vary the question style, order, and focus. Each question should have 4 options (A, B, C, D) with clear, distinct choices. Indicate the correct answer for each question. Make sure questions test understanding, not just memorization. Format the output as follows:\n\n1. Question text?\n   - A) Option A\n   - B) Option B\n   - C) Option C\n   - D) Option D\n\n   **Correct Answer: X) Option X**\n\n2. Next question...`,
        type: "mcq",
        gradeLevel,
        subject,
        difficulty,
        modelId,
      }

      console.log("Sending request:", JSON.stringify(requestBody))

      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      })

      console.log("Response status:", response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error("API Error:", errorData)
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log("Response data:", data)

      if (!data.result) {
        throw new Error("No content was generated. Please try again.")
      }

      setResult(data.result)
      setUsedModel(data.model || modelId)
    } catch (error) {
      console.error("Error generating MCQ:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(`Failed to generate MCQs: ${errorMessage}`)
    } finally {
      setIsLoading(false)
    }
  }

  const regenerateContent = useCallback(() => {
    if (result && isFormValid) {
      generateMCQ()
    }
  }, [result, isFormValid])

  const clearForm = useCallback(() => {
    setTopic("")
    setGradeLevel("")
    setSubject("")
    setDifficulty("intermediate")
    setNumQuestions("5")
    setResult("")
    setError("")
    setUsedModel("")
    setFiles([])
    setFileTexts([])
    setFileErrors([])
  }, [])

  // Test function to verify input functionality
  const testInputs = useCallback(() => {
    console.log("Testing inputs...")
    setTopic("Test topic for debugging")
    setGradeLevel("Grade 5")
    setSubject("Mathematics")
    console.log("Test values set")
  }, [])

  const handleExport = useCallback(() => {
    if (!result) return;
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'mcqs.txt';
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }, 0);
  }, [result]);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-2xl lg:text-3xl font-bold text-foreground">MCQ Generator</h1>
        <p className="text-sm lg:text-base text-muted-foreground">
          Create multiple choice questions from any topic for your students
        </p>
      </div>

      {/* File Upload */}
      <div className="mb-2">
        <label className="block text-sm font-medium mb-1">Knowledge Files (PDF, DOCX, TXT, CSV, optional, multiple allowed)</label>
        <input
          type="file"
          accept=".pdf,.docx,.txt,.csv"
          ref={fileInputRef}
          onChange={handleFileChange}
          multiple
          className="block w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-accent file:text-accent-foreground hover:file:bg-accent/80"
        />
        {files.length > 0 && (
          <div className="mt-1 text-xs text-muted-foreground">
            <span className="font-medium">Selected:</span> {files.map((f) => f.name).join(", ")}
          </div>
        )}
        {fileErrors.length > 0 && fileErrors.map((err, i) => (
          <div key={i} className="text-xs text-red-500 mt-1">{err}</div>
        ))}
        {/* {fileTexts.map((text, i) => text && (
          <div key={i} className="mt-2 p-2 bg-muted rounded text-xs max-h-32 overflow-y-auto border">
            <strong>Preview ({files[i]?.name}):</strong>
            <div className="whitespace-pre-wrap">{text.slice(0, 1000)}{text.length > 1000 ? "..." : ""}</div>
          </div>
        ))} */}
      </div>

      {/* Main Content - Responsive Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Generate MCQs
            </CardTitle>
            <CardDescription>Enter your topic and preferences to create questions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic-input" className="text-sm font-medium">
                Topic/Content <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="topic-input"
                name="topic"
                placeholder="Enter the topic or paste content you want to create questions from..."
                value={topic}
                onChange={handleTopicChange}
                onFocus={() => {
                  console.log("Textarea focused")
                  if (error && !topic.trim()) setError("")
                }}
                onBlur={() => console.log("Textarea blurred, current value:", topic)}
                rows={4}
                className={`resize-none transition-colors ${
                  error && !topic.trim() ? "border-red-500 focus:border-red-500" : ""
                }`}
                disabled={isLoading}
                autoComplete="off"
                spellCheck="true"
                data-testid="topic-input"
              />
              <p className="text-xs text-muted-foreground">
                Characters: {topic.length} | Minimum: 10 characters recommended
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <GradeSelect
                value={gradeLevel}
                onChange={handleGradeLevelChange}
                disabled={isLoading}
                error={!!(error && !gradeLevel)}
              />
              <SubjectSelect
                value={subject}
                onChange={handleSubjectChange}
                disabled={isLoading}
                error={!!(error && !subject)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DifficultySelect
                value={difficulty}
                onChange={handleDifficultyChange}
                disabled={isLoading}
              />
              <QuestionCountSelect
                value={numQuestions}
                onChange={handleNumQuestionsChange}
                disabled={isLoading}
              />
            </div>

            <div className="space-y-2">
              <Label>AI Model</Label>
              <ModelSelector
                value={modelId}
                onValueChange={handleModelChange}
                description="Choose the AI model for content generation"
              />
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <div className="flex flex-col sm:flex-row gap-3">
              <Button
                onClick={generateMCQ}
                disabled={!isFormValid || isLoading}
                className="flex-1"
                size="lg"
                data-testid="generate-button"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Generating MCQs...
                  </>
                ) : (
                  "Generate MCQs"
                )}
              </Button>

              <Button
                onClick={clearForm}
                variant="outline"
                disabled={isLoading}
                className="sm:w-auto"
                data-testid="clear-button"
              >
                Clear Form
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated MCQs</CardTitle>
            <CardDescription>
              Your multiple choice questions will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIContentDisplay
              result={result}
              isLoading={isLoading}
              title="MCQs"
              description="Fill in the topic, select grade level and subject, then click 'Generate MCQs' to create your questions"
              usedModel={usedModel}
              onRegenerate={regenerateContent}
              canRegenerate={isFormValid}
              type="mcq"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
