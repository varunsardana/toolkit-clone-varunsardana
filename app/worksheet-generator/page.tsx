"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Download, FileCheck } from "lucide-react"
import { gradeLevels, subjects, models, difficultyLevels } from "@/lib/constants"
import { GradeSelect } from "@/components/ui/GradeSelect"
import { SubjectSelect } from "@/components/ui/SubjectSelect"
import { DifficultySelect } from "@/components/ui/DifficultySelect"
import { QuestionCountSelect } from "@/components/ui/QuestionCountSelect"
import { ModelSelector } from "@/components/model-selector"
import { AIContentDisplay } from "@/components/ai-content-display"

const worksheetTypes = [
  { value: "practice", label: "Practice Problems" },
  { value: "review", label: "Review Worksheet" },
  { value: "assessment", label: "Assessment" },
  { value: "homework", label: "Homework Assignment" },
  { value: "activity", label: "Activity Worksheet" },
]

const questionCounts = [
  { value: "10", label: "10 questions" },
  { value: "15", label: "15 questions" },
  { value: "20", label: "20 questions" },
  { value: "25", label: "25 questions" },
]

export default function WorksheetGenerator() {
  const [topic, setTopic] = useState("")
  const [instructions, setInstructions] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [worksheetType, setWorksheetType] = useState("practice")
  const [questionCount, setQuestionCount] = useState("15")
  const [model, setModel] = useState("gpt-4o")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generateWorksheet = async () => {
    if (!topic || !gradeLevel || !subject) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a ${worksheetType} worksheet with ${questionCount} questions for ${gradeLevel} students on: ${topic}. ${instructions ? `Special instructions: ${instructions}` : ""} Include varied question types and clear instructions.`,
          type: "worksheet",
          gradeLevel,
          subject,
          difficulty,
          model,
        }),
      })

      const data = await response.json()
      setResult(data.result)
    } catch (error) {
      console.error("Error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isFormValid = !!topic && !!gradeLevel && !!subject;
  const regenerateContent = () => {
    if (isFormValid) generateWorksheet();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Worksheet Generator</h1>
        <p className="text-muted-foreground mt-2">Create educational worksheets for any topic</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileCheck className="h-5 w-5" />
              Create Worksheet
            </CardTitle>
            <CardDescription>Enter your worksheet details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Worksheet Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., Multiplication Tables, Grammar Rules"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="instructions">Special Instructions (Optional)</Label>
              <Textarea
                id="instructions"
                placeholder="Any specific requirements or focus areas for the worksheet..."
                value={instructions}
                onChange={(e) => setInstructions(e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <GradeSelect
                value={gradeLevel}
                onChange={setGradeLevel}
                disabled={isLoading}
              />
              <SubjectSelect
                value={subject}
                onChange={setSubject}
                disabled={isLoading}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <DifficultySelect
                value={difficulty}
                onChange={setDifficulty}
                disabled={isLoading}
              />
              <div className="space-y-2">
                <Label>Worksheet Type</Label>
                <Select value={worksheetType} onValueChange={setWorksheetType} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {worksheetTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <QuestionCountSelect
                value={questionCount}
                onChange={setQuestionCount}
                disabled={isLoading}
              />
              <div className="space-y-2">
                <Label>AI Model</Label>
                <ModelSelector
                  value={model}
                  onValueChange={setModel}
                  description="Choose the AI model for content generation"
                />
              </div>
            </div>

            <Button
              onClick={generateWorksheet}
              disabled={!topic || !gradeLevel || !subject || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Worksheet"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Worksheet</CardTitle>
            <CardDescription>Your worksheet will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <AIContentDisplay
              result={result}
              isLoading={isLoading}
              title="Worksheet"
              description="Fill in the details and click 'Generate Worksheet' to create your worksheet"
              type="worksheet"
              onRegenerate={regenerateContent}
              canRegenerate={isFormValid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
