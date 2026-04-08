"use client"

import { AppSidebar } from "@/components/app-sidebar"
import { SurveyList } from "@/components/survey-list"

export default function SurveysPage() {
  return (
    <div className="flex min-h-screen bg-background">
      {/* Sidebar */}
      <AppSidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col gap-3 p-3 pl-0 min-h-screen">
        <SurveyList />
      </main>
    </div>
  )
}
