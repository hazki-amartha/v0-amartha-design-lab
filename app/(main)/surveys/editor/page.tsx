"use client"

import { useState, useEffect, useMemo, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { SurveyForm } from "@/components/survey-form"
import { SurveyPreview } from "@/components/survey-preview"
import { generateSurveyHtml } from "@/lib/generate-html"
import { getDefaultConfig } from "@/lib/survey-types"
import type { SurveyConfig } from "@/lib/survey-types"
import { Button } from "@/components/ui/button"
import { PageHeader } from "@/components/page-header"

// Force dynamic ensures the server doesn't cache a blank version of the page
export const dynamic = "force-dynamic"

function EditorContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const idFromUrl = searchParams.get("id")

  const [surveyId, setSurveyId] = useState<string | null>(null)
  const [paramsLoaded, setParamsLoaded] = useState(false)
  const [config, setConfig] = useState<SurveyConfig>(getDefaultConfig())
  const [surveyName, setSurveyName] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const html = useMemo(() => generateSurveyHtml(config), [config])

  useEffect(() => {
    if (idFromUrl) {
      setSurveyId(idFromUrl)
      fetchSurvey(idFromUrl)
    } else {
      setLoading(false)
      setParamsLoaded(true)
    }
  }, [idFromUrl])

  const fetchSurvey = async (id: string) => {
    try {
      const response = await fetch(`/api/surveys/${id}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const survey = await response.json()
      setConfig(survey.config)
      setSurveyName(survey.name)
    } catch (error) {
      console.error("Error fetching survey:", error)
      router.push("/surveys")
    } finally {
      setParamsLoaded(true)
      setLoading(false)
    }
  }

  const handleSave = async () => {
    if (!surveyName.trim()) {
      alert("Please enter a survey name")
      return
    }

    try {
      setSaving(true)
      const payload = { name: surveyName, config, html_output: html }
      const method = surveyId ? "PUT" : "POST"
      const url = surveyId ? `/api/surveys/${surveyId}` : "/api/surveys"

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const savedSurvey = await response.json()
      alert(`Survey saved successfully!`)

      if (!surveyId) {
        router.push(`/surveys/editor?id=${savedSurvey.id}`)
      }
    } catch (error) {
      console.error("Error saving survey:", error)
      alert(`Failed to save: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!surveyId || !confirm("Are you sure you want to delete this survey?")) return

    try {
      const response = await fetch(`/api/surveys/${surveyId}`, { method: "DELETE" })
      if (!response.ok) throw new Error("Failed to delete")
      alert("Survey deleted successfully")
      router.push("/surveys")
    } catch (error) {
      console.error("Error deleting survey:", error)
      alert("Failed to delete survey")
    }
  }

  if (!paramsLoaded || loading) {
    return (
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <div className="flex flex-col items-center gap-2">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
          <p className="text-sm text-muted-foreground">Loading survey editor...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="flex flex-1 flex-col p-3 gap-3 pl-0 h-screen overflow-hidden">
      <PageHeader
        title={surveyId ? "Edit Survey" : "New Survey"}
        onBack={() => router.push("/surveys")}
        actions={
          <>
            {surveyId && (
              <Button onClick={handleDelete} variant="destructive">
                Delete
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving} variant="default" className="px-8">
              {saving ? "Saving..." : "Save"}
            </Button>
          </>
        }
      />

      {/* Scrollable content area */}
      <div className="flex gap-2 flex-1 overflow-hidden">
        <div className="flex-1 overflow-y-auto pr-1" style={{ scrollbarWidth: "none" }}>
          <SurveyForm
            config={config}
            onChange={setConfig}
            surveyName={surveyName}
            onNameChange={setSurveyName}
          />
        </div>
        <div className="w-[320px] shrink-0 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
          <SurveyPreview html={html} />
        </div>
      </div>
    </main>
  )
}

export default function EditorPage() {
  return (
    <Suspense fallback={
      <main className="flex-1 flex items-center justify-center min-h-screen">
        <p className="text-muted-foreground animate-pulse">Initializing...</p>
      </main>
    }>
      <EditorContent />
    </Suspense>
  )
}
