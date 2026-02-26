"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SurveyForm } from "@/components/survey-form"
import { SurveyPreview } from "@/components/survey-preview"
import { generateSurveyHtml } from "@/lib/generate-html"
import { getDefaultConfig } from "@/lib/survey-types"
import type { SurveyConfig } from "@/lib/survey-types"

export default function Page() {
  const [config, setConfig] = useState<SurveyConfig>(getDefaultConfig)

  const html = useMemo(() => generateSurveyHtml(config), [config])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <main className="flex-1 flex gap-5 p-5 pl-0 min-h-screen">
        {/* Form column */}
        <div className="flex-1 overflow-y-auto max-h-screen pr-1" style={{ scrollbarWidth: "none" }}>
          <SurveyForm config={config} onChange={setConfig} />
        </div>

        {/* Preview column */}
        <div className="w-[320px] shrink-0 overflow-y-auto max-h-screen" style={{ scrollbarWidth: "none" }}>
          <SurveyPreview html={html} />
        </div>
      </main>
    </div>
  )
}
