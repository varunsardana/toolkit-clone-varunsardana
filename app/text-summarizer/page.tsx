"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Download, FileText } from "lucide-react"
import { gradeLevels, subjects, models, difficultyLevels } from "@/lib/constants"
import { GradeSelect } from "@/components/ui/GradeSelect"
import { SubjectSelect } from "@/components/ui/SubjectSelect"
import { DifficultySelect } from "@/components/ui/DifficultySelect"
import { ModelSelector } from "@/components/model-selector"
import { AIContentDisplay } from "@/components/ai-content-display"

const summaryLengths = [
  { value: "short", label: "Short (2-3 sentences)" },
  { value: "medium", label: "Medium (1 paragraph)" },
  { value: "long", label: "Long (2-3 paragraphs)" },
]

export default function TextSummarizer() {
  const [text, setText] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [model, setModel] = useState("gpt-4o")
  const [summaryLength, setSummaryLength] = useState("medium")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const summarizeText = async () => {
    if (!text || !gradeLevel || !subject) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Summarize the following text in a ${summaryLength} format: ${text}`,
          type: "summarize",
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

  const isFormValid = !!text && !!gradeLevel && !!subject;
  const regenerateContent = () => {
    if (isFormValid) summarizeText();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Text Summarizer</h1>
        <p className="text-muted-foreground mt-2">Summarize long texts for easier comprehension</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Summarize Text
            </CardTitle>
            <CardDescription>Enter the text you want to summarize</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="text">Text to Summarize</Label>
              <Textarea
                id="text"
                placeholder="Paste the text you want to summarize here..."
                value={text}
                onChange={(e) => setText(e.target.value)}
                rows={8}
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
                <Label>Summary Length</Label>
                <Select value={summaryLength} onValueChange={setSummaryLength} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {summaryLengths.map((length) => (
                      <SelectItem key={length.value} value={length.value}>
                        {length.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label>AI Model</Label>
              <ModelSelector
                value={model}
                onValueChange={setModel}
                description="Choose the AI model for content generation"
              />
            </div>

            <Button onClick={summarizeText} disabled={!text || !gradeLevel || !subject || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Summarizing...
                </>
              ) : (
                "Summarize Text"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>Your summarized text will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <AIContentDisplay
              result={result}
              isLoading={isLoading}
              title="Summary"
              description="Enter text and click 'Summarize Text' to generate a summary"
              type="summarize"
              onRegenerate={regenerateContent}
              canRegenerate={isFormValid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
