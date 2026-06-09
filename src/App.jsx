import { useEffect, useState } from 'react'
import BusinessCard from './components/BusinessCard'
import BottomNav from './components/BottomNav'
import Header from './components/Header'
import { supabase } from './config/supabase'

/**
 * Componente raíz de la aplicación Zihua Descubre.
 *
 * Orquesta el layout principal de la pantalla de exploración y consume
 * los negocios reales desde la tabla `businesses` en Supabase.
 */
export default function App() {
  /**
   * Estado `businesses`: almacena los registros devueltos por Supabase.
   * Inicia vacío hasta que `fetchBusinesses` complete la primera carga.
   */
  const [businesses, setBusinesses] = useState([])

  /**
   * Estado `isLoading`: controla si la petición a Supabase está en curso.
   * En `true` se muestra el mensaje de carga en pantalla.
   */
  const [isLoading, setIsLoading] = useState(true)

  /**
   * Estado `error`: guarda el mensaje de error si la consulta falla.
   * Permite informar al usuario sin romper el resto del layout.
   */
  const [error, setError] = useState(null)

  /**
   * Ciclo de vida — montaje del componente:
   * Al renderizarse `App` por primera vez, se dispara `fetchBusinesses`
   * para poblar el listado con datos reales de la base de datos.
   */
  useEffect(() => {
    fetchBusinesses()
  }, [])

  /**
   * Petición a Supabase: obtiene todos los negocios de la tabla `businesses`.
   * Equivalente a `SELECT * FROM businesses`.
   * Actualiza los estados locales según el resultado (éxito o error).
   */
  async function fetchBusinesses() {
    try {
      setIsLoading(true)
      setError(null)

      const { data, error: supabaseError } = await supabase
        .from('businesses')
        .select('*')

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

  // Contenedor Principal: layout de pantalla completa con tema oscuro y padding inferior
  // para que el contenido no quede oculto detrás de la barra de navegación fija
  return (
    <div className="min-h-screen bg-[#0F172A] p-4 pb-20 text-white">
      {/* Encabezado: título, búsqueda y filtros de categoría */}
      <Header />

      {/* Lista de Tarjetas: datos provenientes de Supabase */}
      <main className="flex flex-col gap-4">
        {/* Estado de carga: visible mientras la petición a Supabase está activa */}
        {isLoading && (
          <p className="py-8 text-center text-gray-400">Cargando lugares...</p>
        )}

        {/* Estado de error: se muestra si la consulta falló */}
        {!isLoading && error && (
          <p className="py-8 text-center text-red-400">{error}</p>
        )}

        {/* Mapeo de datos: cada fila de `businesses` se adapta a las props de BusinessCard */}
        {!isLoading &&
          !error &&
          businesses.map((negocio) => (
            <BusinessCard
              key={negocio.id}
              title={negocio.name}
              location={negocio.address || negocio.location}
              tags={[negocio.category, negocio.food_type].filter(Boolean)}
              rating={4.5}
              imageUrl="https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=800&q=80"
            />
          ))}
      </main>

      {/* Navegación Inferior: barra fija con accesos a las secciones principales */}
      <BottomNav />
    </div>
  )
}
