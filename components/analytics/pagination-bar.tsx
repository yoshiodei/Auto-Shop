'use client'

import { ChevronLeft, ChevronRight } from 'lucide-react'

interface Props {
  currentPage:  number
  totalPages:   number
  pageNumbers:  (number | '...')[]
  startIndex:   number
  endIndex:     number
  totalItems:   number
  isFirstPage:  boolean
  isLastPage:   boolean
  onGoToPage:   (page: number) => void
  onNext:       () => void
  onPrev:       () => void
}

export function PaginationBar({
  currentPage,
  totalPages,
  pageNumbers,
  startIndex,
  endIndex,
  totalItems,
  isFirstPage,
  isLastPage,
  onGoToPage,
  onNext,
  onPrev,
}: Props) {
  if (totalPages <= 1) return null

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-6 py-4 border-t border-gray-100">

      {/* Results info */}
      <p className="text-sm text-gray-500 shrink-0">
        Showing <span className="font-medium text-gray-900">{startIndex}</span>
        {' '}–{' '}
        <span className="font-medium text-gray-900">{endIndex}</span>
        {' '}of{' '}
        <span className="font-medium text-gray-900">{totalItems}</span> vehicles
      </p>

      {/* Page controls */}
      <div className="flex items-center gap-1">

        {/* Prev */}
        <button
          onClick={onPrev}
          disabled={isFirstPage}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Previous page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page numbers */}
        {pageNumbers.map((page, i) =>
          page === '...' ? (
            <span
              key={`ellipsis-${i}`}
              className="flex items-center justify-center w-8 h-8 text-sm text-gray-400"
            >
              ···
            </span>
          ) : (
            <button
              key={page}
              onClick={() => onGoToPage(page)}
              className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                currentPage === page
                  ? 'bg-[#FF6B7A] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {page}
            </button>
          )
        )}

        {/* Next */}
        <button
          onClick={onNext}
          disabled={isLastPage}
          className="flex items-center justify-center w-8 h-8 rounded-lg text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Next page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}