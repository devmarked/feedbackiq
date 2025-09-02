"use client"

import { Card } from "@/components/ui/card"

interface Props {
  totalResponses: number
  completedResponses: number
  completionRatePercent: number
  averageCompletionSeconds: number
}

export function SurveyAnalytics({ totalResponses, completedResponses, completionRatePercent, averageCompletionSeconds }: Props) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="text-sm text-gray-500">Total responses</div>
        <div className="text-2xl font-semibold">{totalResponses}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-gray-500">Completed</div>
        <div className="text-2xl font-semibold">{completedResponses}</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-gray-500">Completion rate</div>
        <div className="text-2xl font-semibold">{completionRatePercent}%</div>
      </Card>
      <Card className="p-4">
        <div className="text-sm text-gray-500">Avg. completion time</div>
        <div className="text-2xl font-semibold">{averageCompletionSeconds}s</div>
      </Card>
    </div>
  )
}


