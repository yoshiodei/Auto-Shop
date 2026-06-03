'use client'

import { useAuthGuard }  from '@/hooks/useAuthGuard'
import LoadingScreen     from '@/components/loading-screen'
import { useAppStore }   from '@/store/app-store'

interface Props {
  children: React.ReactNode
}

export function AuthGuard({ children }: Props) {
  const user = useAppStore((state) => state.user)

  useAuthGuard()

  // Show loading screen while auth state is being determined
  if (!user) return <LoadingScreen />

  return <>{children}</>
}