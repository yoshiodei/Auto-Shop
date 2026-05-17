import React from 'react'

export default function DayDivider({ label }: { label: string }) {
  return (
     <div className="flex items-center gap-3 my-4">
       <div className="flex-1 h-px bg-gray-200" />
       <span className="text-xs text-gray-400 font-medium px-2">{label}</span>
       <div className="flex-1 h-px bg-gray-200" />
     </div>
  )
}