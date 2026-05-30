import { useState, useMemo } from 'react'

export const usePagination = <T>(items: T[], itemsPerPage: number = 10) => {
  const [currentPage, setCurrentPage] = useState(1)

  const totalPages = Math.max(1, Math.ceil(items.length / itemsPerPage))

  // Reset to page 1 whenever the items list changes
  const resetPage = () => setCurrentPage(1)

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end   = start + itemsPerPage
    return items.slice(start, end)
  }, [items, currentPage, itemsPerPage])

  const goToPage  = (page: number) => {
    if (page < 1 || page > totalPages) return
    setCurrentPage(page)
  }

  const goNext = () => goToPage(currentPage + 1)
  const goPrev = () => goToPage(currentPage - 1)

  // Generate page numbers with ellipsis e.g. [1, '...', 4, 5, 6, '...', 12]
  const pageNumbers = useMemo((): (number | '...')[] => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const pages: (number | '...')[] = [1]

    if (currentPage > 3) pages.push('...')

    const start = Math.max(2, currentPage - 1)
    const end   = Math.min(totalPages - 1, currentPage + 1)

    for (let i = start; i <= end; i++) pages.push(i)

    if (currentPage < totalPages - 2) pages.push('...')

    pages.push(totalPages)

    return pages
  }, [currentPage, totalPages])

  return {
    currentPage,
    totalPages,
    paginatedItems,
    pageNumbers,
    goToPage,
    goNext,
    goPrev,
    resetPage,
    isFirstPage: currentPage === 1,
    isLastPage:  currentPage === totalPages,
    startIndex:  (currentPage - 1) * itemsPerPage + 1,
    endIndex:    Math.min(currentPage * itemsPerPage, items.length),
    totalItems:  items.length,
  }
}