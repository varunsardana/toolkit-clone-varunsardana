import { Loader2, Download, Copy } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { FormattedContent } from "@/components/formatted-content"

interface AIContentDisplayProps {
  result: string
  isLoading: boolean
  title: string
  description: string
  usedModel?: string
  onRegenerate?: () => void
  canRegenerate?: boolean
  type?: "mcq" | "worksheet" | "ppt" | "lesson-plan" | "youtube" | "summarize" | "essay-grade" | "rewrite"
}

export function AIContentDisplay({
  result,
  isLoading,
  title,
  description,
  usedModel,
  onRegenerate,
  canRegenerate = false,
  type = "mcq",
}: AIContentDisplayProps) {
  const [copySuccess, setCopySuccess] = useState(false)
  const [exportSuccess, setExportSuccess] = useState(false)

  const handleCopy = () => {
    if (result) {
      navigator.clipboard.writeText(result)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 1500)
    }
  }

  const handleExport = () => {
    if (!result) return;
    // Use the title as the filename, fallback to 'export.txt'
    const safeTitle = title ? title.replace(/[^a-z0-9]/gi, '_').toLowerCase() : 'export';
    const blob = new Blob([result], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${safeTitle}.txt`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => {
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      setExportSuccess(true);
      setTimeout(() => setExportSuccess(false), 1500);
    }, 0);
  }

  const parseMCQs = (text: string) => {
    const questionBlocks = text.split(/\n(?=\d+\.\s)/g).filter(Boolean)
    return questionBlocks.map((block) => {
      const questionMatch = block.match(/^\d+\.\s*(.*?)(?:\n|$)/)
      const question = questionMatch ? questionMatch[1].trim() : ""

      const options = []
      const optionRegex = /-\s([A-D])\)\s(.*)/g
      let optionMatch
      while ((optionMatch = optionRegex.exec(block)) !== null) {
        options.push({ label: optionMatch[1], text: optionMatch[2] })
      }

      const correctMatch = block.match(/\*\*Correct Answer:\s*([A-D])\)\s(.*?)\*\*/)
      const correct = correctMatch
        ? { label: correctMatch[1], text: correctMatch[2] }
        : null

      return { question, options, correct }
    })
  }

  const parseWorksheet = (text: string) => {
    const sections = text.split(/\n(?=\*\*[^*]+\*\*)/g)
    return sections.map((section) => {
      const headerMatch = section.match(/\*\*([^*]+)\*\*/)
      const header = headerMatch ? headerMatch[1] : ""
      const content = section.replace(/\*\*[^*]+\*\*/, "").trim()
      return { header, content }
    })
  }

  const parsePPT = (text: string) => {
    const slides = text.split(/\n(?=Slide \d+:)/g)
    return slides.map((slide) => {
      const titleMatch = slide.match(/Slide \d+:\s*(.*?)(?:\n|$)/)
      const title = titleMatch ? titleMatch[1] : ""
      const content = slide.replace(/Slide \d+:\s*.*?\n/, "").trim()
      return { title, content }
    })
  }

  const parseLessonPlan = (text: string) => {
    const sections = text.split(/\n(?=\*\*[^*]+\*\*)/g)
    return sections.map((section) => {
      const headerMatch = section.match(/\*\*([^*]+)\*\*/)
      const header = headerMatch ? headerMatch[1] : ""
      const content = section.replace(/\*\*[^*]+\*\*/, "").trim()
      return { header, content }
    })
  }

  const parseEssayGrade = (text: string) => {
    const sections = text.split(/\n(?=\*\*[^*]+\*\*)/g)
    return sections.map((section) => {
      const headerMatch = section.match(/\*\*([^*]+)\*\*/)
      const header = headerMatch ? headerMatch[1] : ""
      const content = section.replace(/\*\*[^*]+\*\*/, "").trim()
      return { header, content }
    })
  }

  const renderContent = () => {
    switch (type) {
      case "mcq":
        const questions = parseMCQs(result)
        return (
          <div className="space-y-6">
            {questions.map((q, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-lg border">
                <div className="font-medium mb-2">{idx + 1}. {q.question}</div>
                <ul className="mb-2 space-y-1">
                  {q.options.map((opt) => (
                    <li key={opt.label}>
                      <span className="font-semibold">{opt.label})</span> {opt.text}
                    </li>
                  ))}
                </ul>
                {q.correct && (
                  <div className="text-green-700 font-semibold">
                    Correct Answer: {q.correct.label}) {q.correct.text}
                  </div>
                )}
              </div>
            ))}
          </div>
        )

      case "worksheet":
        const worksheetSections = parseWorksheet(result)
        return (
          <div className="space-y-6">
            {worksheetSections.map((section, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-lg border">
                {section.header && (
                  <div className="font-bold text-lg mb-3 text-primary">{section.header}</div>
                )}
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{section.content}</div>
              </div>
            ))}
          </div>
        )

      case "ppt":
        const slides = parsePPT(result)
        return (
          <div className="space-y-6">
            {slides.map((slide, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-lg border">
                <div className="font-bold text-lg mb-3 text-primary">Slide {idx + 1}: {slide.title}</div>
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{slide.content}</div>
              </div>
            ))}
          </div>
        )

      case "lesson-plan":
        const lessonSections = parseLessonPlan(result)
        return (
          <div className="space-y-6">
            {lessonSections.map((section, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-lg border">
                {section.header && (
                  <div className="font-bold text-lg mb-3 text-primary">{section.header}</div>
                )}
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{section.content}</div>
              </div>
            ))}
          </div>
        )

      case "youtube":
        const sections = result.split(/\n(?=\*\*[^*]+\*\*)/g)
        return (
          <div className="space-y-6">
            {sections.map((section, idx) => {
              const headerMatch = section.match(/\*\*([^*]+)\*\*/)
              const header = headerMatch ? headerMatch[1] : ""
              const content = section.replace(/\*\*[^*]+\*\*/, "").trim()
              const formattedContent = content.replace(
                /\((\d+:\d+)\s*-\s*(\d+:\d+)\)/g,
                '<span class="text-blue-600 font-medium">($1 - $2)</span>'
              )

              return (
                <div key={idx} className="p-4 bg-muted rounded-lg border">
                  {header && (
                    <div className="font-bold text-lg mb-3 text-primary">{header}</div>
                  )}
                  <div 
                    className="prose prose-sm max-w-none"
                    dangerouslySetInnerHTML={{ __html: formattedContent }}
                  />
                </div>
              )
            })}
          </div>
        )

      case "essay-grade":
        const gradeSections = parseEssayGrade(result)
        return (
          <div className="space-y-6">
            {gradeSections.map((section, idx) => (
              <div key={idx} className="p-4 bg-muted rounded-lg border">
                {section.header && (
                  <div className="font-bold text-lg mb-3 text-primary">{section.header}</div>
                )}
                <div className="prose prose-sm max-w-none whitespace-pre-wrap">{section.content}</div>
              </div>
            ))}
          </div>
        )

      case "summarize":
        const summarySections = result.split(/\n(?=\*\*[^*]+\*\*)/g)
        return (
          <div className="space-y-6">
            {summarySections.map((section, idx) => {
              const headerMatch = section.match(/\*\*([^*]+)\*\*/)
              const header = headerMatch ? headerMatch[1] : ""
              const content = section.replace(/\*\*[^*]+\*\*/, "").trim()
              
              return (
                <div key={idx} className="p-4 bg-muted rounded-lg border">
                  {header && (
                    <div className="font-bold text-lg mb-3 text-primary">{header}</div>
                  )}
                  <div className="prose prose-sm max-w-none whitespace-pre-wrap">{content}</div>
                </div>
              )
            })}
          </div>
        )

      case "rewrite":
        if (result.match(/^\d+\.\s.*\n\s*-\s*[A-D]\)/)) {
          const questions = parseMCQs(result)
          return (
            <div className="space-y-6">
              {questions.map((q, idx) => (
                <div key={idx} className="p-4 bg-muted rounded-lg border">
                  <div className="font-medium mb-2">{idx + 1}. {q.question}</div>
                  <ul className="mb-2 space-y-1">
                    {q.options.map((opt) => (
                      <li key={opt.label}>
                        <span className="font-semibold">{opt.label})</span> {opt.text}
                      </li>
                    ))}
                  </ul>
                  {q.correct && (
                    <div className="text-green-700 font-semibold">
                      Correct Answer: {q.correct.label}) {q.correct.text}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }
        
        if (result.includes("**")) {
          const sections = result.split(/\n(?=\*\*[^*]+\*\*)/g)
          return (
            <div className="space-y-6">
              {sections.map((section, idx) => {
                const headerMatch = section.match(/\*\*([^*]+)\*\*/)
                const header = headerMatch ? headerMatch[1] : ""
                const content = section.replace(/\*\*[^*]+\*\*/, "").trim()
                
                return (
                  <div key={idx} className="p-4 bg-muted rounded-lg border">
                    {header && (
                      <div className="font-bold text-lg mb-3 text-primary">{header}</div>
                    )}
                    <div className="prose prose-sm max-w-none whitespace-pre-wrap">{content}</div>
                  </div>
                )
              })}
            </div>
          )
        }

        return (
          <div className="p-4 bg-muted rounded-lg border">
            <div className="prose prose-sm max-w-none whitespace-pre-wrap">{result}</div>
          </div>
        )

      default:
        return (
          <div className="bg-muted p-4 rounded-lg max-h-[500px] overflow-y-auto">
            <pre className="whitespace-pre-wrap text-sm">{result}</pre>
          </div>
        )
    }
  }

  return (
    <div className="space-y-4">
      {isLoading ? (
        <div className="flex items-center justify-center h-40">
          <Loader2 className="animate-spin mr-2" />
          <span>Generating content...</span>
        </div>
      ) : result ? (
        <>
          <FormattedContent content={result} />
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={handleCopy}>
              <Copy className="mr-2 h-4 w-4" />
              {copySuccess ? "Copied!" : "Copy"}
            </Button>
            <Button variant="outline" className="flex-1" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              {exportSuccess ? "Exported!" : `Export ${title}`}
            </Button>
            {canRegenerate && onRegenerate && (
              <Button
                variant="outline"
                onClick={onRegenerate}
                className="sm:w-auto"
              >
                Regenerate
              </Button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center text-muted-foreground py-8">
          {description}
        </div>
      )}
      {usedModel && (
        <div className="text-xs text-green-600 dark:text-green-400">
          ✓ Generated using: {usedModel}
        </div>
      )}
    </div>
  )
} 