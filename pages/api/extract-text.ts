import type { NextApiRequest, NextApiResponse } from "next"
import formidable from "formidable"
import fs from "fs"
import pdfParse from "pdf-parse"
import mammoth from "mammoth"
import Papa from "papaparse"

export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" })
    return
  }
  try {
    console.log("Incoming request headers:", req.headers)
    const form = formidable({ multiples: false })
    const data = await new Promise<{ fields: formidable.Fields; files: formidable.Files }>((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err)
        else resolve({ fields, files })
      })
    })
    console.log("Formidable fields:", data.fields)
    console.log("Formidable files:", data.files)
    let file = data.files.file as any
    if (Array.isArray(file)) {
      file = file[0]
    }
    if (!file) {
      console.error("No file uploaded. Formidable files:", data.files)
      res.status(400).json({ error: "No file uploaded." })
      return
    }
    const filePath = file.filepath || file.path
    const ext = file.originalFilename?.split(".").pop()?.toLowerCase()
    let text = ""
    if (ext === "pdf") {
      const buffer = fs.readFileSync(filePath)
      const pdfData = await pdfParse(buffer)
      text = pdfData.text
    } else if (ext === "docx") {
      const buffer = fs.readFileSync(filePath)
      const result = await mammoth.extractRawText({ buffer })
      text = result.value
    } else if (ext === "csv") {
      try {
        let csvContent = fs.readFileSync(filePath, "utf8")
        // Preprocess: replace \" with "" for standard CSV escaping
        csvContent = csvContent.replace(/\\"/g, '""')
        // Try parsing with headers first
        let parsed = Papa.parse(csvContent, { header: true, skipEmptyLines: true })
        let validRows = parsed.data as Record<string, string>[]
        if (parsed.errors.length) {
          console.warn("CSV parse errors (header mode), skipping bad lines:", parsed.errors)
          // Remove rows with errors by row index
          const errorRows = new Set(parsed.errors.map(e => e.row))
          validRows = validRows.filter((_, i) => !errorRows.has(i))
        }
        if (!validRows.length) {
          // Try parsing without headers
          parsed = Papa.parse(csvContent, { header: false, skipEmptyLines: true })
          let validRowsNoHeader = parsed.data as string[][]
          if (parsed.errors.length) {
            console.error("CSV parse error (no header mode):", parsed.errors)
            // Remove rows with errors by row index
            const errorRows = new Set(parsed.errors.map(e => e.row))
            validRowsNoHeader = validRowsNoHeader.filter((_, i) => !errorRows.has(i))
          }
          if (!validRowsNoHeader.length) {
            res.status(400).json({ error: "Failed to parse CSV file, even after skipping bad lines.", details: parsed.errors })
            return
          }
          // No headers, just rows
          let text = ""
          for (const row of validRowsNoHeader) {
            text += (row as string[]).join(" | ") + "\n"
          }
          res.status(200).json({ text })
          return
        }
        // With headers
        const headers = parsed.meta?.fields || Object.keys(validRows[0] || {})
        let text = headers.join(" | ") + "\n"
        text += "-".repeat(headers.join(" | ").length) + "\n"
        for (const row of validRows) {
          text += headers.map((h) => row[h] || "").join(" | ") + "\n"
        }
        if (!text.trim()) {
          res.status(400).json({ error: "CSV file is empty after parsing." })
          return
        }
        res.status(200).json({ text })
      } catch (err) {
        console.error("CSV extraction error:", err)
        res.status(500).json({ error: "Failed to extract text from CSV.", details: String(err) })
      }
      return
    } else {
      res.status(400).json({ error: "Unsupported file type." })
      return
    }
    res.status(200).json({ text })
  } catch (error) {
    res.status(500).json({ error: "Failed to extract text." })
  }
} 