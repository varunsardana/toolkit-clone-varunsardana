"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Loader2, Download } from "lucide-react"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { gradeLevels, subjects, models, difficultyLevels } from "@/lib/constants"
import { GradeSelect } from "@/components/ui/GradeSelect"
import { SubjectSelect } from "@/components/ui/SubjectSelect"
import { DifficultySelect } from "@/components/ui/DifficultySelect"
import { ModelSelector } from "@/components/model-selector"
import { AIContentDisplay } from "@/components/ai-content-display"

const durations = [
  { value: "3-5", label: "3-5 minutes" },
  { value: "5-10", label: "5-10 minutes" },
  { value: "10-15", label: "10-15 minutes" },
  { value: "15-20", label: "15-20 minutes" },
]

export default function YouTubeGenerator() {
  const [topic, setTopic] = useState("")
  const [gradeLevel, setGradeLevel] = useState("")
  const [subject, setSubject] = useState("")
  const [difficulty, setDifficulty] = useState("intermediate")
  const [duration, setDuration] = useState("5-10")
  const [model, setModel] = useState("gpt-4o")
  const [result, setResult] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("script")

  const generateContent = async () => {
    if (!topic || !gradeLevel || !subject) return

    setIsLoading(true)
    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          prompt: `Create a ${duration} minute educational YouTube video ${
            activeTab === "script" ? "script" : activeTab === "ideas" ? "ideas" : "outline"
          } about: ${topic}. ${
            activeTab === "script"
              ? "Include an engaging introduction, clear explanations, and a conclusion."
              : activeTab === "ideas"
                ? "Provide 5 creative video ideas with titles and brief descriptions."
                : "Create a detailed outline with timestamps and key points."
          }`,
          type: "youtube",
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
    if (isFormValid) generateContent();
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">YouTube Content Generator</h1>
        <p className="text-muted-foreground mt-2">Create educational video scripts, ideas, and outlines</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Generate YouTube Content</CardTitle>
            <CardDescription>Enter your topic and preferences</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="topic">Topic</Label>
              <Textarea
                id="topic"
                placeholder="Enter the topic for your educational video..."
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
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
                <Label>Video Duration</Label>
                <Select value={duration} onValueChange={setDuration} disabled={isLoading}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {durations.map((dur) => (
                      <SelectItem key={dur.value} value={dur.value}>
                        {dur.label}
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

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-3 w-full">
                <TabsTrigger value="script">Full Script</TabsTrigger>
                <TabsTrigger value="ideas">Video Ideas</TabsTrigger>
                <TabsTrigger value="outline">Video Outline</TabsTrigger>
              </TabsList>
            </Tabs>

            <Button
              onClick={generateContent}
              disabled={!topic || !gradeLevel || !subject || isLoading}
              className="w-full"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                `Generate ${activeTab === "script" ? "Script" : activeTab === "ideas" ? "Ideas" : "Outline"}`
              )}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Generated Content</CardTitle>
            <CardDescription>
              Your {activeTab === "script" ? "script" : activeTab === "ideas" ? "video ideas" : "outline"} will appear here
            </CardDescription>
          </CardHeader>
          <CardContent>
            <AIContentDisplay
              result={result}
              isLoading={isLoading}
              title={activeTab === "script" ? "Script" : activeTab === "ideas" ? "Video Ideas" : "Outline"}
              description="Fill in the form and click 'Generate' to create your YouTube content"
              type="youtube"
              onRegenerate={regenerateContent}
              canRegenerate={isFormValid}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
