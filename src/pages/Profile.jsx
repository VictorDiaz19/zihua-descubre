import { useEffect, useState } from 'react'
import { supabase } from '../config/supabase'

/**
 * Página de perfil de usuario con autenticación mediante Supabase.
 *
 * Esta versión muestra dos vistas condicionadas por el estado de sesión:
 * - Si NO hay sesión: muestra un formulario de autenticación (login / sign up).
 * - Si HAY sesión: muestra la interfaz premium del perfil con estadísticas y
 *   la opción de cerrar sesión.
 *
 * Todos los comentarios explican en español la lógica de estado y autenticación.
 */
export default function Profile() {
  // Estados de sesión y formulario
  const [session, setSession] = useState(null)
  const [loading, setLoading] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  // `confirmPassword`: utilizado únicamente durante el registro para validar
  // que el usuario haya introducido la misma contraseña dos veces.
  const [confirmPassword, setConfirmPassword] = useState('')
  const [isLogin, setIsLogin] = useState(true)

  // Revisa la sesión inicial y suscribe a cambios de auth
  useEffect(() => {
    let mounted = true

    async function checkSession() {
      try {
        setLoading(true)
        const {
          data: { session: currentSession },
        } = await supabase.auth.getSession()
        if (mounted) setSession(currentSession ?? null)
      } catch (err) {
        console.error('Error verificando sesión:', err)
      } finally {
        setLoading(false)
      }
    }

    checkSession()

    const { data: listener } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession ?? null)
    })

    return () => {
      mounted = false
      listener?.subscription?.unsubscribe?.()
    }
  }, [])

  // Maneja login o registro según `isLogin`
  async function handleAuth(e) {
    if (e?.preventDefault) e.preventDefault()

    // Validación temprana: si el usuario está en modo registro, verifica
    // que `password` y `confirmPassword` coincidan antes de llamar a Supabase.
    if (!isLogin && password !== confirmPassword) {
      alert('Las contraseñas no coinciden')
      return
    }

    try {
      setLoading(true)
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password })
        if (error) {
          alert(error.message)
          console.error('Error en signIn:', error)
          return
        }
        setSession(data?.session ?? null)
      } else {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) {
          alert(error.message)
          console.error('Error en signUp:', error)
          return
        }
        setSession(data?.session ?? null)
      }
    } catch (err) {
      console.error('Error en handleAuth:', err)
      alert('Ocurrió un error al autenticar. Revisa la consola.')
    } finally {
      setLoading(false)
    }
  }

  // Cierra sesión
  async function handleLogout() {
    try {
      setLoading(true)
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Error al cerrar sesión:', error)
        alert('No se pudo cerrar sesión. Revisa la consola.')
        return
      }
      setSession(null)
    } catch (err) {
      console.error('Error en handleLogout:', err)
      alert('Ocurrió un error al cerrar sesión.')
    } finally {
      setLoading(false)
    }
  }

  // Si no hay sesión: mostrar formulario de auth
  if (!session) {
    return (
      <main className="min-h-[calc(100vh-13rem)] bg-[#0F172A] px-4 pb-8 text-white">
        <section className="mx-auto flex max-w-md flex-col gap-6 pt-12">
          <div className="rounded-3xl bg-[#11203b] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
            <h1 className="text-xl font-bold">{isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}</h1>
            <p className="mt-2 text-sm text-slate-400">Accede para guardar check-ins y puntos.</p>

            <form onSubmit={handleAuth} className="mt-6 flex flex-col gap-4">
              <input
                type="email"
                placeholder="Correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none"
                required
              />


              <input
                type="password"
                placeholder="Contraseña"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none"
                required
              />

              {/* Input adicional para confirmar contraseña: solo visible al registrarse */}
              {!isLogin && (
                <input
                  type="password"
                  placeholder="Confirmar Contraseña"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full rounded-xl bg-slate-800 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none"
                  required
                />
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full rounded-2xl bg-gradient-to-r from-orange-500 via-orange-400 to-yellow-400 px-4 py-3 font-semibold text-slate-950 shadow-md disabled:opacity-60"
              >
                {loading ? 'Procesando...' : isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
              </button>
            </form>

            <p className="mt-4 text-center text-sm text-slate-400">
              {isLogin ? (
                <>
                  ¿No tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      // Al cambiar a modo registro, limpiamos el campo de confirmación
                      setIsLogin(false)
                      setConfirmPassword('')
                    }}
                    className="underline text-orange-400"
                  >
                    Regístrate
                  </button>
                </>
              ) : (
                <>
                  ¿Ya tienes cuenta?{' '}
                  <button
                    type="button"
                    onClick={() => {
                      // Al volver a modo login, limpiamos confirmPassword por seguridad
                      setIsLogin(true)
                      setConfirmPassword('')
                    }}
                    className="underline text-orange-400"
                  >
                    Inicia Sesión
                  </button>
                </>
              )}
            </p>
          </div>
        </section>
      </main>
    )
  }

  // Si hay sesión: mostrar perfil premium
  return (
    <main className="min-h-[calc(100vh-13rem)] bg-[#0F172A] px-4 pb-8 text-white">
      <section className="mx-auto flex max-w-3xl flex-col gap-6 pt-6">
        <div className="rounded-3xl bg-[#11203b] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="flex flex-col items-center gap-4 text-center md:flex-row md:items-center md:text-left">
            <img
              src={session?.user?.user_metadata?.avatar || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=200&q=80'}
              alt="Avatar de perfil"
              className="h-28 w-28 rounded-full border-4 border-orange-500 object-cover shadow-lg"
            />
            <div>
              <h1 className="text-2xl font-bold text-white">{session.user.email}</h1>
              <p className="mt-2 text-sm text-slate-300">Nivel 3: Conocedor local</p>
            </div>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-3xl bg-slate-800/50 px-5 py-6 shadow-[0_12px_30px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Check-ins</p>
            <p className="mt-3 text-3xl font-semibold text-white">12</p>
            <p className="mt-1 text-sm text-orange-500">Explorando la ciudad</p>
          </div>
          <div className="rounded-3xl bg-slate-800/50 px-5 py-6 shadow-[0_12px_30px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Puntos</p>
            <p className="mt-3 text-3xl font-semibold text-white">450</p>
            <p className="mt-1 text-sm text-orange-500">Recompensas cercanas</p>
          </div>
          <div className="rounded-3xl bg-slate-800/50 px-5 py-6 shadow-[0_12px_30px_rgba(15,23,42,0.45)] backdrop-blur-sm">
            <p className="text-sm uppercase tracking-[0.2em] text-slate-400">Reseñas</p>
            <p className="mt-3 text-3xl font-semibold text-white">5</p>
            <p className="mt-1 text-sm text-orange-500">Opiniones publicadas</p>
          </div>
        </div>

        <section className="rounded-3xl bg-[#11203b] p-6 shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <div className="mb-4 flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Actividad reciente</h2>
              <p className="mt-1 text-sm text-slate-400">Últimos lugares visitados en tu aventura.</p>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4 shadow-inner">
            <p className="font-semibold text-white">Visitó La Sirena Gorda</p>
            <p className="mt-2 text-sm text-slate-300">Hace 2 días</p>
          </div>
        </section>

        <div className="flex justify-center">
          <button
            onClick={handleLogout}
            disabled={loading}
            className="inline-flex w-full max-w-md items-center justify-center rounded-3xl bg-red-500/10 px-6 py-4 text-base font-semibold text-red-500 shadow-sm transition disabled:opacity-60 sm:px-8"
          >
            {loading ? 'Cerrando sesión...' : 'Cerrar Sesión'}
          </button>
        </div>
      </section>
    </main>
  )
}
