"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Download, GraduationCap } from "lucide-react"
import { gradeLevels, subjects, models, difficultyLevels } from "@/lib/constants"
import { GradeSelect } from "@/components/ui/GradeSelect"
import { SubjectSelect } from "@/components/ui/SubjectSelect"
import { DifficultySelect } from "@/components/ui/DifficultySelect"
import { ModelSelector } from "@/components/model-selector"
import { AIContentDisplay } from "@/components/ai-content-display"

const essayTypes = [
  { value: "argumentative", label: "Argumentative Essay" },
  { value: "narrative", label: "Narrative Essay" },
  { value: "descriptive", label: "Descriptive Essay" },
  { value: "expository", label: "Expository Essay" },
  { value: "creative", label: "Creative Writing" },
]

export default function EssayGrader() {
  const [essay, setEssay] = useState("")
  const [prompt, setPrompt] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [essayType, setEssayType] = useState("argumentative")
  const [model, setModel] = useState("gpt-4o")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const gradeEssay = async () => {
    if (!essay || !gradeLevel || !subject) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Grade this ${essayType} essay for a ${gradeLevel} student. ${prompt ? `Essay prompt: ${prompt}` : ""} Essay: ${essay}`,
          type: "essay-grade",
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

  const isFormValid = !!essay && !!gradeLevel && !!subject;
  const regenerateContent = () => {
    if (isFormValid) gradeEssay();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Essay Grader</h1>
        <p className="text-muted-foreground mt-2">Provide feedback and grades on student essays</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <GraduationCap className="h-5 w-5" />
              Grade Essay
            </CardTitle>
            <CardDescription>Enter the essay and assignment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="prompt">Essay Prompt (Optional)</Label>
              <Input
                id="prompt"
                placeholder="What was the assignment or question?"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="essay">Student Essay</Label>
              <Textarea
                id="essay"
                placeholder="Paste the student's essay here..."
                value={essay}
                onChange={(e) => setEssay(e.target.value)}
                rows={10}
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
                <Label>Essay Type</Label>
                <Select value={essayType} onValueChange={setEssayType} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {essayTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <ModelSelector
                value={model}
                onValueChange={setModel}
                description="Choose the AI model for content generation"
              />
            </div>

            <Button onClick={gradeEssay} disabled={!essay || !gradeLevel || !subject || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Grading...
                </>
              ) : (
                "Grade Essay"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Grading Results</CardTitle>
            <CardDescription>Feedback and grade will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <AIContentDisplay
              result={result}
              isLoading={isLoading}
              title="Feedback"
              description="Enter an essay and click 'Grade Essay' to get feedback and a grade"
              type="essay-grade"
              onRegenerate={regenerateContent}
              canRegenerate={isFormValid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
