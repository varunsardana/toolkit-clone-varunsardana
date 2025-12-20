"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Download, PresentationIcon as PresentationChart } from "lucide-react"
import { gradeLevels, subjects, models, difficultyLevels } from "@/lib/constants"
import { GradeSelect } from "@/components/ui/GradeSelect"
import { SubjectSelect } from "@/components/ui/SubjectSelect"
import { DifficultySelect } from "@/components/ui/DifficultySelect"
import { ModelSelector } from "@/components/model-selector"
import { AIContentDisplay } from "@/components/ai-content-display"

const slideNumbers = [
  { value: "5", label: "5 slides" },
  { value: "10", label: "10 slides" },
  { value: "15", label: "15 slides" },
  { value: "20", label: "20 slides" },
]

export default function PPTGenerator() {
  const [topic, setTopic] = useState("")
  const [keyPoints, setKeyPoints] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [numSlides, setNumSlides] = useState("10")
  const [model, setModel] = useState("gpt-4o")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const generatePPT = async () => {
    if (!topic || !gradeLevel || !subject) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a ${numSlides}-slide presentation outline for ${gradeLevel} students on: ${topic}. ${keyPoints ? `Key points to cover: ${keyPoints}` : ""} Include slide titles, bullet points, and speaker notes.`,
          type: "ppt",
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
    if (isFormValid) generatePPT();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">PPT Generator</h1>
        <p className="text-muted-foreground mt-2">Generate presentation outlines and content</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PresentationChart className="h-5 w-5" />
              Create Presentation
            </CardTitle>
            <CardDescription>Enter your presentation details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Presentation Topic</Label>
              <Input
                id="topic"
                placeholder="e.g., The Solar System"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="keyPoints">Key Points to Cover (Optional)</Label>
              <Textarea
                id="keyPoints"
                placeholder="List the main points you want to include in your presentation..."
                value={keyPoints}
                onChange={(e) => setKeyPoints(e.target.value)}
                rows={4}
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
                <Label>Number of Slides</Label>
                <Select value={numSlides} onValueChange={setNumSlides} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {slideNumbers.map((slide) => (
                      <SelectItem key={slide.value} value={slide.value}>
                        {slide.label}
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

            <Button onClick={generatePPT} disabled={!topic || !gradeLevel || !subject || isLoading} className="w-full">
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                "Generate Presentation"
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Presentation</CardTitle>
            <CardDescription>Your presentation outline will appear here</CardDescription>
          </CardHeader>
          <CardContent>
            <AIContentDisplay
              result={result}
              isLoading={isLoading}
              title="Presentation"
              description="Fill in the details and click 'Generate Presentation' to create your slides"
              type="ppt"
              onRegenerate={regenerateContent}
              canRegenerate={isFormValid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
