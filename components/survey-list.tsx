"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2, Edit2, Plus } from "lucide-react"

interface Survey {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export function SurveyList() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    fetchSurveys()
  }, [])

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/surveys")
      const data = await response.json()
      setSurveys(data || [])
    } catch (error) {
      console.error("Error fetching surveys:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this survey?")) return

    try {
      const response = await fetch(`/api/surveys/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete")

      setSurveys(surveys.filter((s) => s.id !== id))
    } catch (error) {
      console.error("Error deleting survey:", error)
    }
  }

  const handleEdit = (id: string) => {
    router.push(`/surveys/editor?id=${id}`)
  }

  const handleCreateNew = () => {
    router.push("/surveys/editor")
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("id-ID", {
      year: "numeric",
      month: "short",
      day: "numeric",
    })
  }

  if (loading) {
    return <div className="text-center py-8">Loading surveys...</div>
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 flex items-center justify-between">
        <h1 className="text-2xl font-bold">CSAT Surveys</h1>
        <Button onClick={handleCreateNew} className="gap-2">
          <Plus className="w-4 h-4" />
          Create New Survey
        </Button>
      </div>

      {surveys.length === 0 ? (
        <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] p-6 text-center py-12">
          <p className="text-muted-foreground mb-4">No surveys yet</p>
          <Button onClick={handleCreateNew} className="gap-2" variant="outline">
            <Plus className="w-4 h-4" />
            Create New Survey
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Survey Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="w-24">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell className="font-medium">{survey.name}</TableCell>
                  <TableCell>{formatDate(survey.created_at)}</TableCell>
                  <TableCell>{formatDate(survey.updated_at)}</TableCell>
                  <TableCell className="flex gap-2">
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleEdit(survey.id)}
                    >
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => handleDelete(survey.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
