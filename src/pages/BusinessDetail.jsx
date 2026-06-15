import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { supabase } from '../config/supabase'

/**
 * Página de detalle de un negocio para Zihua Descubre.
 *
 * Muestra información detallada del negocio seleccionado, incluyendo
 * portada, datos de contacto, galería de menú/fotos y un CTA de check-in.
 */
export default function BusinessDetail() {
  const { id } = useParams()
  const navigate = useNavigate()

  const [business, setBusiness] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLocating, setIsLocating] = useState(false)
  const [hasCheckedIn, setHasCheckedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    async function fetchBusiness() {
      try {
        setIsLoading(true)
        setError(null)

        const { data, error: supabaseError } = await supabase
          .from('businesses')
          .select('*, business_media(url)')
          .eq('id', id)
          .maybeSingle()

        if (supabaseError) {
          throw supabaseError
        }

        if (!data) {
          setError('Negocio no encontrado.')
          setBusiness(null)
        } else {
          setBusiness(data)
        }
      } catch (err) {
        setError(err.message || 'Error al cargar los datos del negocio.')
        setBusiness(null)
      } finally {
        setIsLoading(false)
      }
    }

    if (id) {
      fetchBusiness()
    }
  }, [id])

  useEffect(() => {
    async function loadCurrentUser() {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        setCurrentUser(user)
      } catch (err) {
        console.error('Error cargando usuario:', err)
      }
    }

    loadCurrentUser()

    const { data: authListener } = supabase.auth.onAuthStateChange((_, session) => {
      setCurrentUser(session?.user ?? null)
    })

    return () => {
      authListener.subscription.unsubscribe()
    }
  }, [])

  useEffect(() => {
    async function checkPreviousVisit() {
      try {
        if (!currentUser) {
          return
        }

        const { data } = await supabase
          .from('checkins')
          .select('id')
          .eq('business_id', id)
          .eq('user_id', currentUser.id)
          .limit(1)

        if (data && data.length > 0) {
          setHasCheckedIn(true)
        }
      } catch (err) {
        console.error('Error al comprobar visitas anteriores:', err)
      }
    }

    if (id) {
      checkPreviousVisit()
    }
  }, [id, currentUser])

  async function handleCheckIn() {
    if (isLocating || hasCheckedIn) {
      return
    }

    setIsLocating(true)

    try {
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser()

      if (authError) {
        throw authError
      }

      if (!user) {
        setIsLocating(false)
        alert('Necesitas iniciar sesión para registrar tu visita.')
        navigate('/perfil')
        return
      }

      await new Promise((resolve, reject) => {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            resolve(position)
          },
          (geoError) => {
            reject(geoError)
          },
          { enableHighAccuracy: true, timeout: 15000 }
        )
      }).then(async (position) => {
        const latitude = position.coords.latitude
        const longitude = position.coords.longitude

        const { error: insertError } = await supabase.from('checkins').insert([
          {
            business_id: id,
            user_id: user.id,
            lat: latitude,
            lng: longitude,
          },
        ])

        if (insertError) {
          throw insertError
        }

        setHasCheckedIn(true)
        alert('Check-in registrado con éxito. ¡Gracias por visitar este lugar!')
      })
    } catch (err) {
      console.error('Error en check-in:', err.message || err)
      if (err.code === 1) {
        alert('Permiso de ubicación denegado. Activa la geolocalización para usar esta función.')
      } else if (err.code === 2) {
        alert('No se pudo obtener tu ubicación. Intenta nuevamente.')
      } else if (err.code === 3) {
        alert('La solicitud de ubicación tardó demasiado. Intenta nuevamente.')
      } else {
        alert('No fue posible registrar el check-in. Intenta más tarde.')
      }
    } finally {
      setIsLocating(false)
    }
  }

  const coverImage =
    business?.business_media?.[0]?.url ||
    'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80'

  const businessName = business?.name || 'Negocio no disponible'
  const categoryLabel = business?.category || 'Categoria'
  const addressText = business?.address || 'Dirección no disponible'
  const phoneText = business?.phone || 'Teléfono no disponible'
  const websiteText = business?.website || 'Sitio web no disponible'

  return (
    <main className="min-h-screen bg-slate-950 pb-24 relative text-white">
      {/* Botón flotante para regresar a la pantalla anterior */}
      <button
        type="button"
        onClick={() => navigate(-1)}
        className="absolute top-4 left-4 z-10 rounded-full bg-black/50 p-2 text-white backdrop-blur-sm shadow-lg transition hover:bg-black/70"
      >
        Volver
      </button>

      {/* Hero de portada del negocio */}
      <section className="relative h-72 overflow-hidden">
        <img
          src={coverImage}
          alt={`Portada de ${businessName}`}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
      </section>

      <section className="relative px-4 pt-6">
        <div className="space-y-3">
          <div className="max-w-2xl">
            <p className="text-sm uppercase tracking-[0.28em] text-orange-500">{categoryLabel}</p>
            <h1 className="mt-2 text-3xl font-bold text-white sm:text-4xl">
              {businessName}
            </h1>
          </div>

          <div className="space-y-3 rounded-3xl bg-slate-900/80 p-4 shadow-xl shadow-black/20">
            <p className="text-sm text-slate-400">Información de contacto</p>
            <div className="space-y-3">
              <div className="flex items-start gap-3 rounded-3xl bg-slate-950/90 p-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-orange-500">
                  📍
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Dirección</p>
                  <p className="mt-1 text-sm text-slate-200">{addressText}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-3xl bg-slate-950/90 p-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-orange-500">
                  📞
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Teléfono</p>
                  <p className="mt-1 text-sm text-slate-200">{phoneText}</p>
                </div>
              </div>

              <div className="flex items-start gap-3 rounded-3xl bg-slate-950/90 p-4">
                <span className="mt-1 inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-slate-800 text-orange-500">
                  🌐
                </span>
                <div>
                  <p className="text-sm uppercase tracking-[0.24em] text-slate-500">Sitio web</p>
                  <p className="mt-1 text-sm text-slate-200 break-all">{websiteText}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm uppercase tracking-[0.28em] text-slate-500">Menú y Fotos</p>
                <h2 className="mt-2 text-2xl font-bold text-white">Explora los platos del lugar</h2>
              </div>
            </div>

            <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4">
              <div className="snap-start shrink-0 rounded-3xl bg-slate-800 p-4 shadow-lg shadow-black/20">
                <div className="h-64 w-48 rounded-3xl bg-slate-800" />
              </div>
              <div className="snap-start shrink-0 rounded-3xl bg-slate-800 p-4 shadow-lg shadow-black/20">
                <div className="h-64 w-48 rounded-3xl bg-slate-800" />
              </div>
              <div className="snap-start shrink-0 rounded-3xl bg-slate-800 p-4 shadow-lg shadow-black/20">
                <div className="h-64 w-48 rounded-3xl bg-slate-800" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mensajes de estado de carga o error */}
      {isLoading && (
        <div className="absolute inset-x-0 top-72 flex justify-center pt-8">
          <div className="rounded-3xl bg-slate-900/90 px-6 py-4 text-slate-200 shadow-xl shadow-black/20">
            Cargando detalles del negocio...
          </div>
        </div>
      )}

      {error && (
        <div className="absolute inset-x-0 top-72 flex justify-center pt-8">
          <div className="rounded-3xl bg-rose-500/15 border border-rose-500/30 px-6 py-4 text-rose-200 shadow-xl shadow-black/20">
            {error}
          </div>
        </div>
      )}

      {/* Botón fijo para check-in */}
      <div className="fixed bottom-20 left-4 right-4 z-20">
        <button
          type="button"
          onClick={handleCheckIn}
          disabled={isLocating || hasCheckedIn}
          className={`w-full rounded-3xl px-5 py-4 text-lg font-semibold text-white shadow-[0_18px_40px_-18px_rgba(248,113,30,0.9)] transition ${
            hasCheckedIn
              ? 'bg-emerald-500 hover:bg-emerald-400'
              : 'bg-orange-500 hover:bg-orange-400'
          } ${isLocating ? 'cursor-not-allowed opacity-80' : ''}`}
        >
          {isLocating
            ? 'Obteniendo ubicación...'
            : hasCheckedIn
            ? '¡Visita registrada!'
            : 'Hacer Check-in aquí'}
        </button>
      </div>
    </main>
  )
}
