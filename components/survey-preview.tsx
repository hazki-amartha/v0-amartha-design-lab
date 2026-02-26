"use client"

import { useState } from "react"
import { Copy, Download, Check, RotateCcw } from "lucide-react"

interface SurveyPreviewProps {
  html: string
}

export function SurveyPreview({ html }: SurveyPreviewProps) {
  const [copied, setCopied] = useState(false)
  const [iframeKey, setIframeKey] = useState(0)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(html)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // fallback
      const ta = document.createElement("textarea")
      ta.value = html
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const handleDownload = () => {
    const blob = new Blob([html], { type: "text/html" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "csat-survey.html"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleReload = () => {
    setIframeKey((k) => k + 1)
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Preview Card */}
      <div className="bg-card rounded-2xl shadow-[0_1px_3px_rgba(0,0,0,0.04)] flex flex-col overflow-hidden">
        <div className="flex items-center justify-between px-5 pt-5 pb-3">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground">
            Live Preview
          </span>
          <button
            onClick={handleReload}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-card-foreground hover:bg-secondary transition-colors"
            aria-label="Reload preview"
          >
            <RotateCcw className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Iframe rendered directly */}
        <div className="relative w-full bg-[#F3F6FD]" style={{ height: 640 }}>
          <iframe
            key={iframeKey}
            srcDoc={html}
            title="Survey Preview"
            className="absolute inset-0 w-full h-full border-0"
            sandbox="allow-scripts allow-same-origin"
          />
        </div>
      </div>

      {/* Actions card */}
      <div className="bg-card rounded-2xl p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <span className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground block mb-3">
          Export
        </span>
        <div className="flex flex-col gap-2.5">
          <button
            onClick={handleCopy}
            className="flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-full bg-primary text-primary-foreground text-[13px] font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4" />
                Copied
              </>
            ) : (
              <>
                <Copy className="h-4 w-4" />
                Copy HTML
              </>
            )}
          </button>
          <button
            onClick={handleDownload}
            className="flex items-center justify-center gap-2.5 w-full px-5 py-3 rounded-full border border-border bg-card text-card-foreground text-[13px] font-semibold transition-all hover:bg-secondary active:scale-[0.98]"
          >
            <Download className="h-4 w-4" />
            Download HTML
          </button>
        </div>
      </div>
    </div>
  )
}
