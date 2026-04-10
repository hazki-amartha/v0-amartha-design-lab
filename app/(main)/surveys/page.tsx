"use client"

import { SurveyList } from "@/components/survey-list"

export default function SurveysPage() {
  return (
    <main className="flex-1 flex flex-col gap-3 p-3 pl-0 h-screen overflow-hidden">
      <SurveyList />
    </main>
  )
}
