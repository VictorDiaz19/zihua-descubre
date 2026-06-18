import { supabase } from '../config/supabase'

/**
 * Página de perfil del negocio dentro del panel administrativo.
 *
 * Incluye la acción de cerrar sesión para que el usuario salga de la cuenta.
 */
export default function BusinessAdminProfile() {
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
          onClick={handleSignOut}
          className="w-full rounded-3xl bg-red-500 px-5 py-3 text-white transition hover:bg-red-400"
        >
          Cerrar sesión
        </button>
      </div>
    </section>
  )
}
