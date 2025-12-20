"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface FormDiagnosticsProps {
  topic: string
  gradeLevel: string
  subject: string
  difficulty: string
  numQuestions: string
  modelId: string
}

export function FormDiagnostics({
  topic,
  gradeLevel,
  subject,
  difficulty,
  numQuestions,
  modelId,
}: FormDiagnosticsProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [eventLog, setEventLog] = useState<string[]>([])

  useEffect(() => {
    const log = `Topic changed: "${topic}" (${topic.length} chars)`
    setEventLog((prev) => [...prev.slice(-4), log])
  }, [topic])

  useEffect(() => {
    const log = `Grade Level changed: "${gradeLevel}"`
    setEventLog((prev) => [...prev.slice(-4), log])
  }, [gradeLevel])

  useEffect(() => {
    const log = `Subject changed: "${subject}"`
    setEventLog((prev) => [...prev.slice(-4), log])
  }, [subject])

  if (!isVisible) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsVisible(true)} className="fixed bottom-4 right-4 z-50">
        Debug Form
      </Button>
    )
  }

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 max-h-96 overflow-y-auto">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm">Form Diagnostics</CardTitle>
          <Button variant="ghost" size="sm" onClick={() => setIsVisible(false)}>
            ×
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3 text-xs">
        <div>
          <strong>Current Values:</strong>
          <div className="space-y-1 mt-1">
            <div>
              Topic: <Badge variant="outline">{topic || "empty"}</Badge>
            </div>
            <div>
              Grade: <Badge variant="outline">{gradeLevel || "none"}</Badge>
            </div>
            <div>
              Subject: <Badge variant="outline">{subject || "none"}</Badge>
            </div>
            <div>
              Difficulty: <Badge variant="outline">{difficulty}</Badge>
            </div>
            <div>
              Questions: <Badge variant="outline">{numQuestions}</Badge>
            </div>
            <div>
              Model: <Badge variant="outline">{modelId}</Badge>
            </div>
          </div>
        </div>

        <div>
          <strong>Validation:</strong>
          <div className="space-y-1 mt-1">
            <div>
              Topic valid: <Badge variant={topic.trim() ? "default" : "destructive"}>{topic.trim() ? "✓" : "✗"}</Badge>
            </div>
            <div>
              Grade valid: <Badge variant={gradeLevel ? "default" : "destructive"}>{gradeLevel ? "✓" : "✗"}</Badge>
            </div>
            <div>
              Subject valid: <Badge variant={subject ? "default" : "destructive"}>{subject ? "✓" : "✗"}</Badge>
            </div>
          </div>
        </div>

        <div>
          <strong>Recent Events:</strong>
          <div className="space-y-1 mt-1 max-h-20 overflow-y-auto">
            {eventLog.map((log, index) => (
              <div key={index} className="text-xs text-muted-foreground">
                {log}
              </div>
            ))}
          </div>
        </div>

        <div>
          <strong>Browser Info:</strong>
          <div className="space-y-1 mt-1">
            <div>User Agent: {navigator.userAgent.slice(0, 30)}...</div>
            <div>Touch Support: {"ontouchstart" in window ? "Yes" : "No"}</div>
            <div>
              Screen: {window.screen.width}x{window.screen.height}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
