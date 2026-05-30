import {
  collection, getCountFromServer,
  getDocs, query, where,
  orderBy, Timestamp
} from 'firebase/firestore'
import { db } from '@/lib/firebase'

export type AnalyticsSummary = {
  totalUsers:    number
  carsListed:    number
  bikesListed:   number
  totalSold:     number
}

export type ChartDataPoint = {
  label:   string
  users:   number
  visits:  number
}

export type VehicleRow = {
  id:        string
  name:      string
  price:     number
  views:     number
  category:  string
  condition: string
  status:    string
}

// Summary cards
export const fetchSummary = async (): Promise<AnalyticsSummary> => {
  const [users, cars, bikes, sold] = await Promise.all([
    getCountFromServer(collection(db, 'users')),
    getCountFromServer(query(collection(db, 'listings'), where('category', '==', 'car'))),
    getCountFromServer(query(collection(db, 'listings'), where('category', '==', 'bike'))),
    getCountFromServer(collection(db, 'soldVehicles')),
  ])

  return {
    totalUsers:  users.data().count,
    carsListed:  cars.data().count,
    bikesListed: bikes.data().count,
    totalSold:   sold.data().count,
  }
}

// Chart data
const getStartDate = (period: 'day' | 'week' | 'month'): Date => {
  const now = new Date()
  if (period === 'day')   now.setHours(0, 0, 0, 0)
  if (period === 'week')  now.setDate(now.getDate() - 6)
  if (period === 'month') now.setDate(now.getDate() - 29)
  return now
}

const formatLabel = (date: Date, period: 'day' | 'week' | 'month'): string => {
  if (period === 'day') return date.toLocaleTimeString('en-US', { hour: '2-digit', hour12: true })
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

export const fetchChartData = async (
  period: 'day' | 'week' | 'month'
): Promise<ChartDataPoint[]> => {
  const startDate = getStartDate(period)
  const startTs   = Timestamp.fromDate(startDate)

  const [usersSnap, visitsSnap] = await Promise.all([
    getDocs(query(
      collection(db, 'users'),
      where('createdAt', '>=', startTs),
      orderBy('createdAt', 'asc')
    )),
    getDocs(query(
      collection(db, 'siteVisits'),
      where('visitedAt', '>=', startTs),
      orderBy('visitedAt', 'asc')
    )),
  ])

  // Build a map of label → counts
  const dataMap = new Map<string, { users: number; visits: number }>()

  // Generate empty slots for the period
  const slots = period === 'day' ? 24 : period === 'week' ? 7 : 30
  for (let i = 0; i < slots; i++) {
    const d = new Date(startDate)
    if (period === 'day')         d.setHours(startDate.getHours() + i)
    else                          d.setDate(startDate.getDate() + i)
    const label = formatLabel(d, period)
    dataMap.set(label, { users: 0, visits: 0 })
  }

  usersSnap.docs.forEach((doc) => {
    const date  = (doc.data().createdAt as Timestamp).toDate()
    const label = formatLabel(date, period)
    if (dataMap.has(label)) dataMap.get(label)!.users += 1
  })

  visitsSnap.docs.forEach((doc) => {
    const date  = (doc.data().visitedAt as Timestamp).toDate()
    const label = formatLabel(date, period)
    if (dataMap.has(label)) dataMap.get(label)!.visits += 1
  })

  return Array.from(dataMap.entries()).map(([label, counts]) => ({
    label, ...counts,
  }))
}

// Vehicles table
export const fetchVehiclesForTable = async (): Promise<VehicleRow[]> => {
  const snap = await getDocs(collection(db, 'listings'))
  return snap.docs.map((doc) => {
    const d = doc.data()
    console.log("d is", d);
    
    return {
      id:        doc.id,
      name:      d.title ?? '',
      price:     d.price     ?? 0,
      views:     d.viewers?.length ?? d.viewCount ?? 0,
      category:  d.category  ?? '',
      condition: d.condition ?? '',
      status:    d.status    ?? 'available',
    }
  })
}