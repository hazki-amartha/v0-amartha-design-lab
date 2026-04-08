"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SurveyForm } from "@/components/survey-form"
import { SurveyPreview } from "@/components/survey-preview"
import { generateSurveyHtml } from "@/lib/generate-html"
import { getDefaultConfig } from "@/lib/survey-types"
import type { SurveyConfig } from "@/lib/survey-types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useMemo } from "react"

interface EditorPageProps {
  searchParams: Promise<{ id?: string }>
}

export default function EditorPage({ searchParams }: EditorPageProps) {
  const router = useRouter()
  const [surveyId, setSurveyId] = useState<string | null>(null)
  const [paramsLoaded, setParamsLoaded] = useState(false)

  const [config, setConfig] = useState<SurveyConfig>(getDefaultConfig())
  const [surveyName, setSurveyName] = useState("")
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)

  const html = useMemo(() => generateSurveyHtml(config), [config])

  useEffect(() => {
    // Load search params in client-side effect
    const loadParams = async () => {
      const params = await searchParams
      console.log("[v0] Loaded search params:", params)
      if (params.id) {
        console.log("[v0] Setting survey ID:", params.id)
        setSurveyId(params.id)
        setLoading(true)
      } else {
        console.log("[v0] No survey ID in params, creating new survey")
        setParamsLoaded(true)
      }
    }
    loadParams()
  }, [searchParams])

  useEffect(() => {
    console.log("[v0] Effect triggered - surveyId:", surveyId, "loading:", loading)
    if (surveyId && loading) {
      fetchSurvey(surveyId)
    }
  }, [surveyId, loading])

  const fetchSurvey = async (id: string) => {
    try {
      console.log("[v0] Fetching survey:", id)
      const response = await fetch(`/api/surveys/${id}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const survey = await response.json()
      console.log("[v0] Fetched survey data:", survey)
      setConfig(survey.config)
      setSurveyName(survey.name)
      setParamsLoaded(true)
    } catch (error) {
      console.error("[v0] Error fetching survey:", error)
      alert("Failed to load survey")
      setParamsLoaded(true)
    } finally {
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

      const payload = {
        name: surveyName,
        config,
        html_output: html,
      }

      let response

      if (surveyId) {
        // Update existing survey
        response = await fetch(`/api/surveys/${surveyId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      } else {
        // Create new survey
        response = await fetch("/api/surveys", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
      }

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || `HTTP ${response.status}`)
      }

      const savedSurvey = await response.json()
      console.log("[v0] Saved survey response:", savedSurvey)
      alert(`Survey saved successfully!`)
      router.push(`/surveys/editor?id=${savedSurvey.id}`)
    } catch (error) {
      console.error("[v0] Error saving survey:", error)
      alert(`Failed to save survey: ${error instanceof Error ? error.message : "Unknown error"}`)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!surveyId) return

    if (!confirm("Are you sure you want to delete this survey?")) return

    try {
      const response = await fetch(`/api/surveys/${surveyId}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      alert("Survey deleted successfully")
      router.push("/surveys")
    } catch (error) {
      console.error("Error deleting survey:", error)
      alert("Failed to delete survey")
    }
  }

  if (!paramsLoaded) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div>Loading...</div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content area */}
      <main className="flex-1 flex flex-col gap-2 p-3 pl-0 min-h-screen">
        {/* Top bar with survey name and actions */}
        <div className="bg-card rounded-lg shadow-sm p-4 flex items-end gap-3">
          <div className="flex-1">
            <label className="text-xs font-semibold uppercase text-muted-foreground">
              Survey Name
            </label>
            <Input
              value={surveyName}
              onChange={(e) => setSurveyName(e.target.value)}
              placeholder="Enter survey name"
              className="mt-2"
            />
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => router.push("/surveys")}
              variant="outline"
            >
              Back
            </Button>
            {surveyId && (
              <Button onClick={handleDelete} variant="destructive">
                Delete
              </Button>
            )}
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>

        {/* Form and preview */}
        <div className="flex gap-2 flex-1 overflow-hidden">
          {/* Form column */}
          <div
            className="flex-1 overflow-y-auto pr-1"
            style={{ scrollbarWidth: "none" }}
          >
            <SurveyForm config={config} onChange={setConfig} />
          </div>

          {/* Preview column */}
          <div
            className="w-[320px] shrink-0 overflow-y-auto"
            style={{ scrollbarWidth: "none" }}
          >
            <SurveyPreview html={html} />
          </div>
        </div>
      </main>
    </div>
  )
}
