import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../config/supabase'

/**
 * Página principal del panel "Mi Web" para dueños de negocio.
 *
 * Carga el negocio relacionado con el usuario autenticado y muestra dos
 * estados: cuando todavía no existe una mini-web y cuando ya hay datos.
 */
export default function BusinessWebAdmin() {
  const [businessData, setBusinessData] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const fetchMyBusiness = async () => {
      try {
        setLoading(true)

        // 1. Obtener usuario actual
        const {
          data: { user },
          error: userError,
        } = await supabase.auth.getUser()

        if (userError) {
          console.error('Error obteniendo el usuario actual:', userError)
          return
        }

        if (!user) {
          console.warn('No hay usuario autenticado para cargar el negocio.')
          return
        }

        // 2. Buscar SU negocio de forma segura
        const { data, error } = await supabase
          .from('businesses')
          .select('*')
          .eq('owner_id', user.id)
          .maybeSingle()

        if (error) throw error

        // 3. Guardar en el estado
        setBusinessData(data)
      } catch (error) {
        console.error('Error cargando el negocio:', error)
        setBusinessData(null)
      } finally {
        setLoading(false)
      }
    }

    fetchMyBusiness()
  }, [])

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-center text-white">
        <div>
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-lg font-medium">Cargando tu espacio de negocio...</p>
        </div>
      </div>
    )
  }

  if (!businessData) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center text-white">
        <div className="rounded-3xl bg-slate-900/90 p-10 shadow-2xl shadow-black/40">
          <div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full border border-orange-400 bg-slate-950 text-orange-400">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-12 w-12"
            >
              <path d="M3 9.5V19a1 1 0 0 0 1 1h16a1 1 0 0 0 1-1V9.5" />
              <path d="M3 9.5L12 4l9 5.5" />
              <path d="M8 14h3v5H8z" />
              <path d="M13 11h3v8h-3z" />
            </svg>
          </div>
          <h1 className="mt-6 text-3xl font-semibold text-white">Aún no tienes tu mini-web activa</h1>
          <p className="mt-3 max-w-xl text-slate-400">
            Crea tu perfil para que miles de turistas te descubran y vean tu negocio
            directamente desde Zihua Descubre.
          </p>
          <button
            type="button"
            onClick={() => navigate('/negocio-admin/web/editar')}
            className="mt-8 rounded-3xl bg-orange-500 px-6 py-3 text-sm font-semibold text-slate-950 transition hover:bg-orange-400"
          >
            Crea tu web
          </button>
        </div>
      </div>
    )
  }

  const coverImageUrl = 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'
  const categoryLabel = businessData.category || 'Restaurante'
  const websiteText = businessData.website || 'No disponible'
  const phoneText = businessData.phone || 'No disponible'

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="relative h-64 overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${coverImageUrl})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
      </section>

      <section className="relative px-4 pt-6 pb-32">
        <div className="mx-auto max-w-4xl">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-orange-500">{categoryLabel}</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">{businessData.name}</h1>
            <p className="mt-3 text-slate-400">{businessData.food_type || 'Negocio local'}</p>
          </div>

          <div className="mt-6 rounded-3xl bg-slate-900/90 p-6 shadow-2xl shadow-black/30">
            <p className="text-sm text-slate-400">Información de contacto</p>
            <div className="mt-5 space-y-4">
              <div className="flex items-start gap-4 rounded-3xl bg-slate-950/80 p-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-orange-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 11c1.38 0 2.5-1.12 2.5-2.5S13.38 6 12 6 9.5 7.12 9.5 8.5 10.62 11 12 11z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 21s8-4.5 8-10.5S15.52 0 12 0 4 6.5 4 10.5 12 21 12 21z" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-slate-400">Dirección</p>
                  <p className="mt-1 text-white">{businessData.address}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl bg-slate-950/80 p-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-orange-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5h2l.4 2M7 13h10l4-8H5.4" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 13l-1.5 7h13L17 13" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-slate-400">Teléfono</p>
                  <p className="mt-1 text-white">{phoneText}</p>
                </div>
              </div>

              <div className="flex items-start gap-4 rounded-3xl bg-slate-950/80 p-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-orange-400">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.5v6m0 0l2-2m-2 2l-2-2" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19.5 7.5l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
                <div>
                  <p className="text-sm text-slate-400">Sitio Web</p>
                  <p className="mt-1 text-white">{websiteText}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <button
        type="button"
        onClick={() => navigate('/negocio-admin/web/editar')}
        className="fixed bottom-24 left-4 right-4 rounded-3xl border border-orange-500 bg-slate-800 px-5 py-4 text-orange-500 shadow-2xl shadow-black/40 transition hover:bg-slate-700"
      >
        ✏️ Editar mi información
      </button>
    </main>
  )
}
