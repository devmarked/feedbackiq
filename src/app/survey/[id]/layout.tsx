import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Survey Response',
  description: 'Complete this survey',
}

export default function SurveyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {children}
    </div>
  )
}
