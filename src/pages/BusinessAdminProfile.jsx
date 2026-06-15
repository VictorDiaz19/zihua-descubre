import { supabase } from '../config/supabase'

/**
 * Página de perfil del negocio dentro del panel administrativo.
 *
 * Incluye la acción de cambiar al modo turista y cerrar sesión para que el
 * enrutador lea los metadatos actualizados y redirija a la experiencia de
 * explorador.
 */
export default function BusinessAdminProfile() {
  async function switchToTouristMode() {
    try {
      await supabase.auth.updateUser({
        data: {
          role: 'tourist',
        },
      })
      window.location.href = '/'
    } catch (error) {
      console.error('Error cambiando al modo turista:', error)
      alert('No se pudo cambiar el modo. Intenta de nuevo.')
    }
  }

  async function handleSignOut() {
    try {
      await supabase.auth.signOut()
      window.location.href = '/'
    } catch (error) {
      console.error('Error cerrando sesión:', error)
      alert('No se pudo cerrar sesión. Intenta de nuevo.')
    }
  }

  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
      <h1 className="text-3xl font-semibold text-white">Perfil</h1>
      <p className="mt-3 text-slate-400">
        Gestión de datos del negocio, horarios y contacto para el dueño.
      </p>

      <div className="mt-8 space-y-4">
        <button
          type="button"
          onClick={switchToTouristMode}
          className="flex w-full items-center justify-center gap-2 rounded-3xl bg-slate-800 px-5 py-3 text-white transition hover:bg-slate-700"
        >
          <span className="text-lg">🧭</span>
          <span>Cambiar a modo Explorador</span>
        </button>

        <button
          type="button"
          onClick={handleSignOut}
          className="w-full rounded-3xl bg-red-500 px-5 py-3 text-white transition hover:bg-red-400"
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  )
}
