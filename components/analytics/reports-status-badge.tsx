'use client'

type Props = { status: string }

export function ReportStatusBadge({ status }: Props) {
  const map: Record<string, string> = {
    pending:  'bg-yellow-50 text-yellow-700 border-yellow-200',
    reviewed: 'bg-blue-50 text-blue-700 border-blue-200',
    resolved: 'bg-green-50 text-green-700 border-green-200',
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
      map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
    }`}>
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  )
}