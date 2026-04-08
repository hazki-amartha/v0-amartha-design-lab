"use client"

import { useState, useMemo } from "react"
import { AppSidebar } from "@/components/app-sidebar"
import { SurveyForm } from "@/components/survey-form"
import { SurveyPreview } from "@/components/survey-preview"
import { generateSurveyHtml } from "@/lib/generate-html"
import { getDefaultConfig } from "@/lib/survey-types"
import type { SurveyConfig } from "@/lib/survey-types"

export default function SurveyPage() {
  const [config, setConfig] = useState<SurveyConfig>(getDefaultConfig)

  const html = useMemo(() => generateSurveyHtml(config), [config])

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col gap-3 p-3 pl-0 min-h-screen">
        {/* Content columns */}
        <div className="flex flex-1 gap-2">
          {/* Form column */}
          <div className="flex-1 overflow-y-auto max-h-screen pr-1" style={{ scrollbarWidth: "none" }}>
            <SurveyForm config={config} onChange={setConfig} surveyName={""} onNameChange={function (name: string): void {
              throw new Error("Function not implemented.")
            } } />
          </div>

          {/* Preview column */}
          <div className="w-[320px] shrink-0 overflow-y-auto max-h-screen" style={{ scrollbarWidth: "none" }}>
            <SurveyPreview html={html} />
          </div>
        </div>
      </main>
    </div>
  )
}

