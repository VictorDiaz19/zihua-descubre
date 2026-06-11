import { useEffect, useState } from 'react'
import BusinessCard from '../components/BusinessCard'
import Header from '../components/Header'
import { supabase } from '../config/supabase'

/**
 * Página principal de la aplicación.
 *
 * Aquí se carga la lista de negocios desde Supabase y se renderiza el
 * listado de tarjetas `BusinessCard`. Esta pantalla incluye el encabezado
 * de exploración con búsqueda, filtros y avatar.
 */
export default function Home() {
  const [businesses, setBusinesses] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchBusinesses()
  }, [])

  /**
   * Petición a Supabase para obtener los negocios y sus imágenes.
   * Se realiza al montar el componente `Home`.
   */
  async function fetchBusinesses() {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('businesses')
        .select('*, business_media(url)')

      if (supabaseError) {
        throw supabaseError
      }

      setBusinesses(data ?? [])
    } catch (err) {
      setError(err.message ?? 'No se pudieron cargar los negocios.')
      setBusinesses([])
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="flex flex-col gap-4">
      <Header />

      {isLoading && (
        <p className="py-8 text-center text-gray-400">Cargando lugares...</p>
      )}

      {!isLoading && error && (
        <p className="py-8 text-center text-red-400">{error}</p>
      )}

      {!isLoading && !error &&
        businesses.map((negocio) => (
          <BusinessCard
            key={negocio.id}
            businessId={negocio.id}
            title={negocio.name}
            location={negocio.address || negocio.location}
            tags={[negocio.category, negocio.food_type].filter(Boolean)}
            rating={4.5}
            imageUrl={
              negocio.business_media?.[0]?.url ||
              'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80'
            }
          />
        ))}
    </main>
  )
}
