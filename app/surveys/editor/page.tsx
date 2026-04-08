"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import { AppSidebar } from "@/components/app-sidebar"
import { SurveyForm } from "@/components/survey-form"
import { SurveyPreview } from "@/components/survey-preview"
import { generateSurveyHtml } from "@/lib/generate-html"
import { getDefaultConfig } from "@/lib/survey-types"
import type { SurveyConfig } from "@/lib/survey-types"
import { Button } from "@/components/ui/button"

// FORCE DYNAMIC: This is critical for production builds to read URL params correctly
export const dynamic = "force-dynamic"

interface EditorPageProps {
  searchParams: Promise<{ id?: string }>
}

export default function EditorPage({ searchParams }: EditorPageProps) {
  const router = useRouter()
  
  // State management
  const [surveyId, setSurveyId] = useState<string | null>(null)
  const [paramsLoaded, setParamsLoaded] = useState(false)
  const [config, setConfig] = useState<SurveyConfig>(getDefaultConfig())
  const [surveyName, setSurveyName] = useState("")
  const [loading, setLoading] = useState(true) // Start as true
  const [saving, setSaving] = useState(false)

  const html = useMemo(() => generateSurveyHtml(config), [config])

  // 1. Resolve searchParams Promise
  useEffect(() => {
    const loadParams = async () => {
      try {
        const params = await searchParams
        if (params.id) {
          setSurveyId(params.id)
          // Don't set paramsLoaded yet; fetchSurvey will do it
        } else {
          setParamsLoaded(true)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error loading params:", error)
        setParamsLoaded(true)
        setLoading(false)
      }
    }
    loadParams()
  }, [searchParams])

  // 2. Fetch data if ID exists
  useEffect(() => {
    if (surveyId) {
      fetchSurvey(surveyId)
    }
  }, [surveyId])

  const fetchSurvey = async (id: string) => {
    try {
      const response = await fetch(`/api/surveys/${id}`)
      if (!response.ok) throw new Error("Failed to fetch")
      const survey = await response.json()
      
      setConfig(survey.config)
      setSurveyName(survey.name)
    } catch (error) {
      console.error("Error fetching survey:", error)
      alert("Failed to load survey. It may have been deleted.")
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
      
      // If it was a new survey, redirect to the edit URL
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

  // Loading Screen
  if (!paramsLoaded || loading) {
    return (
      <div className="flex min-h-screen bg-background">
        <AppSidebar />
        <main className="flex-1 flex items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-accent border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading survey data...</p>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />

      <main className="flex-1 flex flex-col gap-3 p-3 pl-0 min-h-screen">
        {/* Top Bar */}
        <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex items-center justify-between">
          <h1 className="text-[22px] font-semibold tracking-tight text-card-foreground">
            {surveyId ? "Edit Survey" : "New Survey"}
          </h1>
          
          <div className="flex gap-2">
            <Button onClick={() => router.push("/surveys")} variant="outline">
              Cancel
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
    </div>
  )
}