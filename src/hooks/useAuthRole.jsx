import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

/**
 * Hook personalizado para obtener el rol del usuario autenticado.
 *
 * Devuelve el `session` actual de Supabase y el `userRole` que viene desde
 * los metadatos del usuario. Si no hay sesión, el rol se asume como turista.
 */
export default function useAuthRole() {
  const [session, setSession] = useState(null)
  const [userRole, setUserRole] = useState('tourist')

  useEffect(() => {
    let mounted = true

    async function loadSession() {
      const {
        data: { session: currentSession },
      } = await supabase.auth.getSession()

      if (!mounted) return
      setSession(currentSession)
      setUserRole(currentSession?.user?.user_metadata?.role ?? 'tourist')
    }

    loadSession()

    const { data: authListener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      if (!mounted) return
      setSession(newSession || null)
      setUserRole(newSession?.user?.user_metadata?.role ?? 'tourist')
    })

    return () => {
      mounted = false
      authListener?.subscription?.unsubscribe()
    }
  }, [])

  return {
    session,
    userRole,
  }
}
