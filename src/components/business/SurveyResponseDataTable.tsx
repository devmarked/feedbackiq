"use client"

import * as React from "react"
import { SurveyQuestion, SurveyResponse } from "@/types"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

// Interface for metadata structure
interface ContactPreference {
  name: string
  email: string
  anonymous: boolean
}

interface ResponseMetadata {
  timestamp?: string
  user_agent?: string
  total_questions?: number
  contact_preference?: ContactPreference
  questions_answered?: number
}

interface Props {
  responses: SurveyResponse[]
  questions?: SurveyQuestion[]
}

export function SurveyResponseDataTable({ responses, questions = [] }: Props) {
  const [query, setQuery] = React.useState("")
  const [openId, setOpenId] = React.useState<string | null>(null)

  // Helper function to get respondent display info from metadata
  const getRespondentInfo = (response: SurveyResponse) => {
    const metadata = response.metadata as ResponseMetadata
    const contactPreference = metadata?.contact_preference
    
    if (contactPreference?.anonymous) {
      return { display: "Anonymous", name: "Anonymous", email: "" }
    }
    
    if (contactPreference?.name && contactPreference?.email) {
      return {
        display: contactPreference.name,
        name: contactPreference.name,
        email: contactPreference.email
      }
    }
    
    // Fallback to respondent_id or Anonymous
    return {
      display: response.respondent_id || "Anonymous",
      name: response.respondent_id || "Anonymous",
      email: ""
    }
  }

  const filtered = React.useMemo(() => {
    if (!query.trim()) return responses
    const q = query.toLowerCase()
    return responses.filter(r => {
      const respondentInfo = getRespondentInfo(r)
      return (
        r.id.toLowerCase().includes(q) ||
        (r.respondent_id || "").toLowerCase().includes(q) ||
        respondentInfo.name.toLowerCase().includes(q) ||
        respondentInfo.email.toLowerCase().includes(q)
      )
    })
  }, [responses, query])

  return (
    <div className="bg-white rounded-lg border shadow-sm p-6">
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder="Search responses..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="max-w-sm"
        />
        <Button variant="outline" size="sm" onClick={() => {
          const headers = [
            'Respondent',
            ...questions.map(q => q.title),
            'Submitted',
            'Status',
            'Completion Time (s)',
            'Response ID',
          ]

          const normalize = (value: any) => {
            if (value == null) return ''
            if (Array.isArray(value)) return value.join('; ')
            if (typeof value === 'object') return JSON.stringify(value)
            return String(value)
          }

          const rows = filtered.map(r => {
            const respondentInfo = getRespondentInfo(r)
            const respondent = respondentInfo.email ? `${respondentInfo.name} (${respondentInfo.email})` : respondentInfo.display
            const answerValues = questions.map(q => normalize((r.response_data as any)?.[q.id]))
            const submitted = new Date(r.submitted_at).toISOString()
            const status = r.is_complete ? 'Complete' : 'Partial'
            const completion = r.completion_time ?? ''
            const responseId = r.id
            return [respondent, ...answerValues, submitted, status, completion, responseId]
          })

          const escapeCsv = (v: any) => `"${String(v).replace(/"/g, '""')}"`
          const csv = [headers.join(','), ...rows.map(row => row.map(escapeCsv).join(','))].join('\n')
          const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
          const url = URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = 'responses.csv'
          a.click()
          URL.revokeObjectURL(url)
        }}>Export CSV</Button>
      </div>
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Respondent</TableHead>
              {questions.map(q => (
                <TableHead key={q.id} className="min-w-[220px]">{q.title}</TableHead>
              ))}
              <TableHead className="min-w-[120px]">Submitted</TableHead>
              <TableHead className="min-w-[100px]">Status</TableHead>
              <TableHead className="min-w-[140px]">Completion Time</TableHead>
              <TableHead className="min-w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length ? filtered.map((r) => {
              const respondentInfo = getRespondentInfo(r)
              return (
              <TableRow key={r.id}>
                <TableCell>
                  <div className="font-medium text-gray-900">{respondentInfo.name}</div>
                  {respondentInfo.email && (
                    <div className="text-sm text-gray-500">{respondentInfo.email}</div>
                  )}
                </TableCell>
                {questions.map(q => {
                  const answer = (r.response_data && (r.response_data as any)[q.id]) ?? null
                  let display: string = ''
                  if (answer == null) display = ''
                  else if (Array.isArray(answer)) display = answer.join(', ')
                  else if (typeof answer === 'object') display = JSON.stringify(answer)
                  else display = String(answer)
                  return (
                    <TableCell key={`${r.id}-${q.id}`}>{display}</TableCell>
                  )
                })}
                <TableCell>
                  <div className="text-sm font-medium text-gray-900">{new Date(r.submitted_at).toLocaleString()}</div>
                  <div className="text-xs text-gray-500">{r.id}</div>
                </TableCell>
                <TableCell>{r.is_complete ? 'Complete' : 'Partial'}</TableCell>
                <TableCell>{r.completion_time ? `${r.completion_time}s` : '-'}</TableCell>
              </TableRow>
              )
            }) : (
              <TableRow>
                <TableCell colSpan={4 + questions.length} className="text-center">No responses found.</TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}


