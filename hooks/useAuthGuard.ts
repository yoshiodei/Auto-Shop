import { useEffect }          from 'react'
import { useRouter }          from 'next/navigation'
import { onAuthStateChanged } from 'firebase/auth'
import { auth }               from '@/lib/firebase'
import { useAppStore }        from '@/store/app-store'
import { signOut }            from '@/utils/auth/signOut/signOut'

export const useAuthGuard = () => {
  const router   = useRouter()
  const user     = useAppStore((state) => state.user)
  const clearUser = useAppStore((state) => state.clearUser)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        // User is authenticated in Firebase — do nothing
        return
      }

      // Firebase says user is not authenticated
      // but we still have them in Zustand — clear everything and redirect
      if (user) {
        await signOut()
        clearUser()
        router.replace('/main')
      }
    })

    return () => unsubscribe()
  }, [user])
}