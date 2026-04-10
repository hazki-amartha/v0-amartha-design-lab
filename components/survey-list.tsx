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
import { Trash2, Edit2, Plus, Loader2 } from "lucide-react"
import { PageHeader } from "@/components/page-header"

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

  return (
    <>
      <PageHeader
        title="CSAT Surveys"
        actions={
          <Button onClick={handleCreateNew} className="gap-2" variant="default">
            <Plus className="w-4 h-4" />
            Create New Survey
          </Button>
        }
      />

      <div className="flex-1 overflow-y-auto min-h-0">
      <div className="bg-card rounded-lg shadow-[0_1px_3px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            <p className="text-sm text-muted-foreground">Loading surveys...</p>
          </div>
        ) : surveys.length === 0 ? (
          <div className="p-6 text-center py-12">
            <p className="text-muted-foreground mb-4">No surveys yet</p>
            <Button onClick={handleCreateNew} className="gap-2" variant="outline">
              <Plus className="w-4 h-4" />
              Create New Survey
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="px-6 py-4">Survey Name</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Modified</TableHead>
                <TableHead className="px-6 w-24 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {surveys.map((survey) => (
                <TableRow key={survey.id}>
                  <TableCell className="font-medium text-accent px-6 py-4">
                    <button
                      onClick={() => handleEdit(survey.id)}
                      className="hover:text-accent hover:underline transition-colors text-left font-semibold"
                    >
                      {survey.name}
                    </button>
                  </TableCell>
                  <TableCell>{formatDate(survey.created_at)}</TableCell>
                  <TableCell>{formatDate(survey.updated_at)}</TableCell>
                  <TableCell className="px-6 text-right">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleEdit(survey.id)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit2 className="w-4 h-4" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => handleDelete(survey.id)}
                        className="h-8 w-8 p-0 hover:text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
      </div>
    </>
  )
}