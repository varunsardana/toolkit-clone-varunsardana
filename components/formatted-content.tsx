import { useState } from "react"
import { ChevronDown, ChevronUp, CheckCircle2, AlertCircle, Info, HelpCircle, BookOpen, FileText, List, MessageSquare } from "lucide-react"
import { cn } from "@/lib/utils"

interface FormattedContentProps {
  content: string
  className?: string
}

type ContentSection = {
  type: "header" | "text" | "list" | "question" | "answer" | "code" | "quote" | "note" | "warning" | "info"
  content: string
  level?: number
  items?: string[]
  isCorrect?: boolean
  headerForList?: string
}

function parseMarkdownInline(text: string) {
  // Bold
  let html = text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  // Italic
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  // Inline code
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>')
  return html
}

export function FormattedContent({ content, className }: FormattedContentProps) {
  const [expandedSections, setExpandedSections] = useState<Set<number>>(new Set())

  const toggleSection = (index: number) => {
    const newExpanded = new Set(expandedSections)
    if (newExpanded.has(index)) {
      newExpanded.delete(index)
    } else {
      newExpanded.add(index)
    }
    setExpandedSections(newExpanded)
  }

  // Enhanced parser
  const parseContent = (text: string): ContentSection[] => {
    const sections: ContentSection[] = []
    const lines = text.split("\n")
    let i = 0
    let lastHeader: ContentSection | null = null
    while (i < lines.length) {
      let line = lines[i].trim()
      if (!line) { i++; continue }

      // Header
      if (line.startsWith("#")) {
        const level = line.match(/^#+/)?.[0].length || 1
        const content = line.replace(/^#+\s*/, "")
        lastHeader = { type: "header", content, level }
        sections.push(lastHeader)
        i++
        continue
      }
      // Bold header
      if (line.startsWith("**") && line.endsWith("**")) {
        const content = line.replace(/\*\*/g, "")
        lastHeader = { type: "header", content, level: 2 }
        sections.push(lastHeader)
        i++
        continue
      }
      // Grouped list
      if (line.match(/^(-|\*)\s/)) {
        const items: string[] = []
        while (i < lines.length && lines[i].trim().match(/^(-|\*)\s/)) {
          items.push(lines[i].trim().replace(/^(-|\*)\s/, ""))
          i++
        }
        // Attach to last header if present and not already attached
        if (lastHeader && lastHeader.type === "header" && (!sections[sections.length-1] || sections[sections.length-1].type !== "list")) {
          sections.push({ type: "list", content: "List", items, headerForList: lastHeader.content })
        } else {
          sections.push({ type: "list", content: "List", items })
        }
        continue
      }
      // Question
      if (line.match(/^\d+\.\s/)) {
        const question = { type: "question", content: line.replace(/^\d+\.\s*/, "") } as ContentSection
        i++
        // Collect options
        const options: string[] = []
        while (i < lines.length && lines[i].trim().match(/^(-|\*)\s/)) {
          options.push(lines[i].trim().replace(/^(-|\*)\s/, ""))
          i++
        }
        if (options.length) question.items = options
        // Check for correct answer
        if (i < lines.length && lines[i].includes("**Correct Answer:")) {
          question.isCorrect = true
          question.content += `\n${lines[i].trim()}`
          i++
        }
        sections.push(question)
        continue
      }
      // Code block
      if (line.startsWith("```")) {
        let code = ""
        i++
        while (i < lines.length && !lines[i].startsWith("```")) {
          code += lines[i] + "\n"
          i++
        }
        i++ // skip closing ```
        sections.push({ type: "code", content: code.trim() })
        continue
      }
      // Quote
      if (line.startsWith(">")) {
        sections.push({ type: "quote", content: line.replace(/^>\s*/, "") })
        i++
        continue
      }
      // Notes, warnings, info
      if (line.startsWith("Note:") || line.startsWith("Warning:") || line.startsWith("Info:")) {
        const type = line.startsWith("Note:") ? "note" : line.startsWith("Warning:") ? "warning" : "info"
        sections.push({ type, content: line.split(":", 2)[1].trim() })
        i++
        continue
      }
      // Regular text (group consecutive lines)
      let textBlock = line
      let j = i + 1
      while (j < lines.length && lines[j].trim() && !lines[j].trim().match(/^(#|\*\*|\d+\.|-|\*|```|>|Note:|Warning:|Info:)/)) {
        textBlock += "\n" + lines[j].trim()
        j++
      }
      sections.push({ type: "text", content: textBlock })
      i = j
    }
    return sections
  }

  const getSectionIcon = (type: ContentSection["type"]) => {
    switch (type) {
      case "question":
        return <HelpCircle className="h-5 w-5 text-blue-500" />
      case "answer":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      case "note":
        return <FileText className="h-5 w-5 text-purple-500" />
      case "list":
        return <List className="h-5 w-5 text-gray-500" />
      case "quote":
        return <MessageSquare className="h-5 w-5 text-gray-500" />
      case "code":
        return <BookOpen className="h-5 w-5 text-gray-500" />
      default:
        return null
    }
  }

  const renderSection = (section: ContentSection, index: number) => {
    // Collapsing is disabled; all sections are always expanded

    const sectionContent = (
      <div
        className={cn(
          "p-4 rounded-lg border",
          {
            "bg-muted": !section.type.includes("header"),
            "bg-primary/5": section.type === "header",
            "border-blue-200": ["question", "info"].includes(section.type),
            "border-green-200": section.type === "answer",
            "border-yellow-200": section.type === "warning",
            "border-purple-200": section.type === "note",
            "border-gray-200": ["text", "list", "quote", "code"].includes(section.type),
          }
        )}
      >
        <div className="flex items-start gap-3">
          {getSectionIcon(section.type)}
          <div className="flex-1">
            {section.type === "header" ? (
              <h2 className={cn(
                "font-bold text-primary",
                {
                  "text-2xl": section.level === 1,
                  "text-xl": section.level === 2,
                  "text-lg": section.level === 3,
                }
              )}>
                {section.content}
              </h2>
            ) : section.type === "list" ? (
              <ul className="list-disc pl-5 space-y-1">
                {section.items?.map((item, i) => (
                  <li key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: parseMarkdownInline(item) }} />
                ))}
              </ul>
            ) : section.type === "question" ? (
              <div className="space-y-2">
                <div className="font-medium" dangerouslySetInnerHTML={{ __html: parseMarkdownInline(section.content.split("\n")[0]) }} />
                {section.items && (
                  <ul className="list-disc pl-5 space-y-1">
                    {section.items.map((item, i) => (
                      <li key={i} className="text-sm" dangerouslySetInnerHTML={{ __html: parseMarkdownInline(item) }} />
                    ))}
                  </ul>
                )}
                {section.isCorrect && (
                  <div className="text-green-700 font-semibold text-sm">
                    {section.content.split("\n").pop()}
                  </div>
                )}
              </div>
            ) : section.type === "code" ? (
              <pre className="bg-gray-100 p-3 rounded overflow-x-auto">
                <code className="text-sm">{section.content}</code>
              </pre>
            ) : section.type === "quote" ? (
              <blockquote className="border-l-4 border-gray-300 pl-4 italic">
                {section.content}
              </blockquote>
            ) : (
              <div className="prose prose-sm max-w-none whitespace-pre-wrap" dangerouslySetInnerHTML={{ __html: parseMarkdownInline(section.content) }} />
            )}
          </div>
        </div>
      </div>
    )

    return sectionContent
  }

  const sections = parseContent(content)

  return (
    <div className={cn("space-y-4", className)}>
      {sections.map((section, index) => (
        <div key={index}>
          {renderSection(section, index)}
        </div>
      ))}
    </div>
  )
} 