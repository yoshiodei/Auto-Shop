'use client'

import { useState }      from 'react'
import { Trash2, Loader2 } from 'lucide-react'
import { timeAgo }       from '@/utils/timeAgo'
import { formatPrice }   from '@/utils/formatPrice'
import { deleteAdminRecord } from '@/utils/analytics/deleteAdminRecord'
import { showToast }     from '@/context/ShowToast'
import { ShowReportModal } from '../modals/show-report'
import { useRouter } from 'next/navigation'

export type Column<T> = {
  label:  string
  render: (row: T) => React.ReactNode
}

interface ReportType {
    id: string;
    vehicleId: string;
    reportType: string;
    description: string;
    reportedBy: string;
    status: 'pending' | 'resolved';
    createdAt?: any;
}

interface Props<T extends { id: string }> {
  rows:             T[]
  columns:          Column<T>[]
  collectionName:   'soldVehicles' | 'deletedVehicles' | 'reports'
  onDelete:         (id: string) => void
  onResolved:       (id: string) => void
  emptyMessage:     string
}

export function AdminTable<T extends { id: string }>({
  rows,
  columns,
  collectionName,
  onDelete,
  onResolved,
  emptyMessage,
}: Props<T>) {
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [reportModalOpen, setReportModalOpen] = useState(false)
  const [selectedReport, setSelectedReport] = useState<T | null>(null)

  const router = useRouter();

  const handleDelete = async (id: string) => {
    setDeletingId(id)
    const result = await deleteAdminRecord(collectionName, id)
    setDeletingId(null)

    if (!result.success) {
      showToast('Failed to delete record', 'error')
      return
    }

    onDelete(id)
    showToast('Record deleted successfully', 'success')
  }
  

  if (rows.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-center px-6">
        <p className="text-sm text-gray-400">{emptyMessage}</p>
      </div>
    )
  }

  const handleOpenReport = (report: T) => {
    console.log("Selected Report:", report);
    
    setSelectedReport(report)
    setReportModalOpen(true)
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-gray-100 bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.label}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
              >
                {col.label}
              </th>
            ))}
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide">
              Action
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-50">
          {rows.map((row) => (
            <tr key={row.id} className="hover:bg-gray-50 transition-colors">
              {columns.map((col) => (
                <td key={col.label} className="px-6 py-4 text-gray-700">
                  {col.render(row)}
                </td>
              ))}
              <td className="px-6 py-4">
                {(collectionName === 'reports') ? (
                <>    
                  <button
                    onClick={() => handleOpenReport(row)}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white-500 bg-green-300 hover:bg-green-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    View Report
                  </button>
                  <ShowReportModal isModalOpen={reportModalOpen} onModalClose={() => setReportModalOpen(false)} selectedReport={selectedReport} router={router} onDelete={onDelete} onResolved={onResolved} />
                </>
                ) :
                (<button
                  onClick={() => handleDelete(row.id)}
                  disabled={deletingId === row.id}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-red-500 bg-red-50 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  {deletingId === row.id
                    ? <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    : <Trash2 className="w-3.5 h-3.5" />
                  }
                  Delete
                </button>)
                }
              </td>
            </tr>
          ))}
        </tbody>
      </table>  
    </div>
  )
}