"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SurveyList } from "@/components/survey-list"

export default function SurveysPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto p-8">
        <SurveyList />
      </main>
    </div>
  )
}
