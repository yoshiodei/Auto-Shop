'use client'

import { useState, useEffect, useMemo }       from 'react'
// import { usePagination }     from '@/hooks/usePagination'
// import { PaginationBar }     from '@/components/analytics/PaginationBar'
import { useRouter }                          from 'next/navigation'
import {
  AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
  ResponsiveContainer, Legend
}                                             from 'recharts'
import { Users, Car, Bike, BadgeCheck,
  ArrowUpDown, Search, ExternalLink, 
  Eye}         from 'lucide-react'
import {
  fetchSummary, fetchChartData,
  fetchVehiclesForTable
}                                             from '@/utils/analytics/fetchAnalyticsData'
import { formatPrice }                        from '@/utils/formatPrice'
import type {
  AnalyticsSummary, ChartDataPoint, VehicleRow
}                                             from '@/utils/analytics/fetchAnalyticsData'
import { Header } from '@/components/header'
import { usePagination } from '@/hooks/use-pagination'
import { PaginationBar } from '@/components/analytics/pagination-bar'

// ── Types ─────────────────────────────────────────────────────
type Period      = 'day' | 'week' | 'month'
type SortOrder   = 'highest' | 'lowest'
type CategoryTab = 'all' | 'car' | 'bike'

// ── Summary card ──────────────────────────────────────────────
function SummaryCard({
  label, value, icon: Icon, color,
}: {
  label: string
  value: number
  icon:  React.ElementType
  color: string
}) {
  return (
    <div className={`bg-gradient-to-br border border-gray-500 bg-white rounded-lg p-6`}>
        <div className="flex items-center justify-between">
          <div>
          <p className="text-sm text-gray-600 mb-1">{label}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
        </div>
        {Icon && <Icon className={`w-10 h-10 text-gray-900 opacity-20`} />}
      </div>
    </div>
    // <div className="bg-white border border-gray-200 rounded-xl p-5 flex items-center gap-4">
    //   <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${color}`}>
    //     <Icon className="w-5 h-5 text-white" />
    //   </div>
    //   <div>
    //     <p className="text-sm text-gray-500">{label}</p>
    //     <p className="text-2xl font-semibold text-gray-900 mt-0.5">
    //       {value.toLocaleString()}
    //     </p>
    //   </div>
    // </div>
  )
}

// ── Status badge ──────────────────────────────────────────────
function StatusBadge({ status }: { status: string }) {
  const map: Record<string, string> = {
    available: 'bg-green-50 text-green-700 border-green-200',
    sold:      'bg-gray-100 text-gray-600 border-gray-200',
    pending:   'bg-yellow-50 text-yellow-700 border-yellow-200',
  }

  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
      map[status] ?? 'bg-gray-100 text-gray-600 border-gray-200'
    }`}>
      {status?.charAt(0)?.toUpperCase() + status?.slice(1)}
    </span>
  )
}

// ── Category badge ────────────────────────────────────────────
function CategoryBadge({ category }: { category: string }) {
  return (
    <span className={`px-2.5 py-1 text-xs font-medium rounded-full border ${
      category === 'car'
        ? 'bg-blue-50 text-blue-700 border-blue-200'
        : 'bg-purple-50 text-purple-700 border-purple-200'
    }`}>
      {category?.charAt(0)?.toUpperCase() + category?.slice(1)}
    </span>
  )
}

// ── Main page ─────────────────────────────────────────────────
export default function AnalyticsPage() {
  const router = useRouter()

  const [summary,    setSummary]    = useState<AnalyticsSummary | null>(null)
  const [chartData,  setChartData]  = useState<ChartDataPoint[]>([])
  const [vehicles,   setVehicles]   = useState<VehicleRow[]>([])
  const [period,     setPeriod]     = useState<Period>('week')
  const [sortOrder,  setSortOrder]  = useState<SortOrder>('highest')
  const [catTab,     setCatTab]     = useState<CategoryTab>('all')
  const [search,     setSearch]     = useState('')
  const [loadingSummary, setLoadingSummary] = useState(true)
  const [loadingChart,   setLoadingChart]   = useState(true)
  const [loadingTable,   setLoadingTable]   = useState(true)

    // Load summary
  useEffect(() => {
    fetchSummary()
      .then(setSummary)
      .finally(() => setLoadingSummary(false))
  }, [])

  // Reload chart when period changes
  useEffect(() => {
    setLoadingChart(true)
    fetchChartData(period)
      .then(setChartData)
      .finally(() => setLoadingChart(false))
  }, [period])

  // Load vehicles table once
  useEffect(() => {
    fetchVehiclesForTable()
      .then(setVehicles)
      .finally(() => setLoadingTable(false))
  }, [])

  // Filter + sort vehicles
  const filteredVehicles = useMemo(() => {
    return vehicles
      .filter((v) => {
        const matchesSearch = v.name.toLowerCase().includes(search.toLowerCase())
        const matchesCat    = catTab === 'all' || v.category === catTab
        return matchesSearch && matchesCat
      })
      .sort((a, b) =>
        sortOrder === 'highest' ? b.views - a.views : a.views - b.views
      )
  }, [vehicles, search, catTab, sortOrder])


  const {
  paginatedItems:  paginatedVehicles,
  currentPage,
  totalPages,
  pageNumbers,
  startIndex,
  endIndex,
  totalItems,
  isFirstPage,
  isLastPage,
  goToPage,
  goNext,
  goPrev,
  resetPage,
} = usePagination(filteredVehicles, 10)

useEffect(() => {
  resetPage()
}, [search, sortOrder, catTab])  


  const PERIOD_TABS: { label: string; value: Period }[] = [
    { label: 'Today',     value: 'day'   },
    { label: 'This week', value: 'week'  },
    { label: 'This month',value: 'month' },
  ]

  const CAT_TABS: { label: string; value: CategoryTab }[] = [
    { label: 'All',   value: 'all'  },
    { label: 'Cars',  value: 'car'  },
    { label: 'Bikes', value: 'bike' },
  ]
  
  return (
    <>
    <Header />
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto flex flex-col gap-8">

        {/* Page heading */}
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">
            Overview of your platform's performance
          </p>
        </div>

        {/* ── Summary cards ───────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {loadingSummary ? (
            Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="bg-white border border-gray-200 rounded-xl p-5 h-24 animate-pulse" />
            ))
          ) : (
            <>
              <SummaryCard label="Total users"     value={summary?.totalUsers  ?? 0} icon={Users}      color="blue"   />
              <SummaryCard label="Cars listed"     value={summary?.carsListed  ?? 0} icon={Car}        color="blue" />
              <SummaryCard label="Bikes listed"    value={summary?.bikesListed ?? 0} icon={Bike}       color="blue" />
              <SummaryCard label="Vehicles sold"   value={summary?.totalSold   ?? 0} icon={BadgeCheck}  color="blue"  />
            </>
          )}
        </div>

        {/* ── Chart ───────────────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Growth overview</h2>
              <p className="text-sm text-gray-500 mt-0.5">New users and site visits</p>
            </div>

            {/* Period tabs */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg self-start sm:self-auto">
              {PERIOD_TABS.map((tab) => (
                <button
                  key={tab.value}
                  onClick={() => setPeriod(tab.value)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                    period === tab.value
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          {loadingChart ? (
            <div className="h-64 bg-gray-50 rounded-lg animate-pulse" />
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <AreaChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#FF6B7A" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#FF6B7A" stopOpacity={0}    />
                  </linearGradient>
                  <linearGradient id="colorVisits" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0}    />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="label"
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  tickLine={false}
                  axisLine={false}
                  allowDecimals={false}
                />
                <Tooltip
                  contentStyle={{
                    background: '#fff',
                    border:     '1px solid #e5e7eb',
                    borderRadius: '8px',
                    fontSize:   '12px',
                  }}
                />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: '12px', paddingTop: '16px' }}
                />
                <Area
                  type="monotone"
                  dataKey="users"
                  name="New users"
                  stroke="#FF6B7A"
                  strokeWidth={2}
                  fill="url(#colorUsers)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
                <Area
                  type="monotone"
                  dataKey="visits"
                  name="Site visits"
                  stroke="#6366f1"
                  strokeWidth={2}
                  fill="url(#colorVisits)"
                  dot={false}
                  activeDot={{ r: 4 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* ── Vehicles table ───────────────────────────────── */}
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
          <div className="p-6 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-semibold text-gray-900">All vehicles</h2>
                <p className="text-sm text-gray-500 mt-0.5">
                  {paginatedVehicles.length} vehicle{paginatedVehicles.length !== 1 ? 's' : ''}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">

                {/* Search */}
                <div className="relative">
                  {/* <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" /> */}
                  <input
                    type="text"
                    placeholder="Search vehicles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="pl-9 pr-4 p-2 text-sm bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#FF6B7A] w-full sm:w-52"
                  />
                </div>

                {/* Sort by views */}
                <button
                  onClick={() => setSortOrder((s) => s === 'highest' ? 'lowest' : 'highest')}
                  className="flex items-center gap-2 px-3 py-2 text-sm bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors text-gray-700 whitespace-nowrap"
                >
                  <ArrowUpDown className="w-4 h-4" />
                  Views: {sortOrder === 'highest' ? 'Highest' : 'Lowest'}
                </button>

                {/* Category tabs */}
                <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
                  {CAT_TABS.map((tab) => (
                    <button
                      key={tab.value}
                      onClick={() => setCatTab(tab.value)}
                      className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                        catTab === tab.value
                          ? 'bg-white text-gray-900 shadow-sm'
                          : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      {tab.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Table */}
          {loadingTable ? (
            <div className="p-6 flex flex-col gap-3">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-12 bg-gray-100 rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center px-6">
              <Car className="w-10 h-10 text-gray-300 mb-3" />
              <p className="text-gray-900 font-medium">No vehicles found</p>
              <p className="text-gray-500 text-sm mt-1">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50">
                    {['Name', 'Price', 'Views', 'Category', 'Condition', 'Status', ''].map((h) => (
                      <th
                        key={h}
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wide"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginatedVehicles.map((vehicle) => (
                    <tr key={vehicle.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap">
                        {vehicle.name}
                      </td>
                      <td className="px-6 py-4 text-gray-700 whitespace-nowrap">
                        GH₵ {formatPrice(vehicle.price)}
                      </td>
                      <td className="px-6 py-4 text-gray-700">
                        {vehicle.views.toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <CategoryBadge category={vehicle.category} />
                      </td>
                      <td className="px-6 py-4 text-gray-700 capitalize">
                        {vehicle.condition}
                      </td>
                      <td className="px-6 py-4">
                        <StatusBadge status={vehicle.status} />
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => router.push(`/vehicles/${vehicle.id}`)}
                          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#FF6B7A] bg-[#FF6B7A]/10 hover:bg-[#FF6B7A]/20 rounded-lg transition-colors whitespace-nowrap"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <PaginationBar
                currentPage={currentPage}
                totalPages={totalPages}
                pageNumbers={pageNumbers}
                startIndex={startIndex}
                endIndex={endIndex}
                totalItems={totalItems}
                isFirstPage={isFirstPage}
                isLastPage={isLastPage}
                onGoToPage={goToPage}
                onNext={goNext}
                onPrev={goPrev}
              />
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  )
}