// ============================================================================
// IMPORTACIONES: React y cliente Supabase
// ============================================================================
import { useState } from 'react'
import { supabase } from '../config/supabase'

/**
 * Ícono SVG de corazón para la acción de guardar en favoritos.
 * @param {{ className?: string }} props - Clases de Tailwind aplicadas al SVG.
 */
function HeartIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
    </svg>
  )
}

/**
 * Ícono SVG de estrella para mostrar la calificación del negocio.
 * @param {{ className?: string }} props - Clases de Tailwind aplicadas al SVG.
 */
function StarIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  )
}

/**
 * Ícono SVG de pin de ubicación para la dirección y el botón de check-in.
 * @param {Object} props - Propiedades del ícono.
 * @param {string} [props.className] - Clases de Tailwind aplicadas al SVG.
 */
function MapPinIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
      <circle cx="12" cy="10" r="3" />
    </svg>
  )
}

/**
 * Tarjeta dinámica de un negocio local (restaurante, bar, etc.).
 *
 * Componente presentacional que recibe todos sus datos vía props y los
 * distribuye en tres bloques visuales:
 * 1. Imagen destacada con acción de favorito.
 * 2. Encabezado informativo (título, calificación y ubicación).
 * 3. Pie de tarjeta (etiquetas y botón de check-in).
 *
 * @param {Object} props - Propiedades del componente.
 * @param {string} props.title - Nombre comercial del establecimiento mostrado como encabezado.
 * @param {number} props.rating - Calificación promedio del negocio (ej. 4.8).
 * @param {string} props.location - Zona o colonia donde se ubica el negocio.
 * @param {string[]} props.tags - Arreglo de etiquetas de categoría y precio (ej. ['Dining', '$$']).
 * @param {string} props.imageUrl - URL de la imagen principal que se renderiza en la parte superior.
 * @param {string} props.businessId - ID único del negocio en Supabase para registrar el check-in.
 * @param {() => void} [props.onCheckIn] - Callback opcional al pulsar el botón "Check-in".
 * @param {() => void} [props.onFavorite] - Callback opcional al pulsar el ícono de favorito.
 * @param {boolean} [props.isFavorite=false] - Indica si el negocio ya está guardado en favoritos.
 */
function BusinessCard({
  title,
  rating,
  location,
  tags,
  imageUrl,
  businessId,
  onCheckIn,
  onFavorite,
  isFavorite = false,
}) {
  // ============================================================================
  // ESTADOS LOCALES DEL COMPONENTE
  // ============================================================================
  
  /**
   * isCheckingIn: controla si la solicitud de check-in está en curso.
   * Se utiliza para deshabilitar el botón y mostrar el estado "Guardando...".
   * Tipo: boolean | Valor inicial: false
   */
  const [isCheckingIn, setIsCheckingIn] = useState(false)
  
  /**
   * hasCheckedIn: indica si el usuario ya ha realizado un check-in en este negocio.
   * Una vez true, el botón cambia de color y texto.
   * Tipo: boolean | Valor inicial: false
   */
  const [hasCheckedIn, setHasCheckedIn] = useState(false)

  // ============================================================================
  // FUNCIÓN: handleCheckIn - Realiza el check-in en Supabase
  // ============================================================================
  /**
   * Función asíncrona que maneja el proceso de check-in del usuario.
   * Evita ejecución múltiple si ya está cargando o si ya se visitó el negocio.
   * Registra el check-in en la tabla 'checkins' de Supabase.
   */
  const handleCheckIn = async () => {
    // Validación: evita ejecutar si ya está cargando o si ya se ha visitado
    if (isCheckingIn || hasCheckedIn) {
      return
    }

    try {
      // Cambia el estado a "cargando" para desactivar el botón
      setIsCheckingIn(true)

      // Inserta un registro en la tabla 'checkins' de Supabase con el ID del negocio
      const { error } = await supabase
        .from('checkins')
        .insert([{ business_id: businessId }])

      // Si hay un error en la inserción, lanza una excepción
      if (error) {
        throw error
      }

      // Si la inserción fue exitosa, marca el check-in como completado
      setHasCheckedIn(true)
    } catch (err) {
      // En caso de error, registra en consola y permite reintentar
      console.error('Error al realizar check-in:', err.message)
      // Nota: setHasCheckedIn NO se ejecuta, permitiendo reintentos
    } finally {
      // En todos los casos, regresa el estado de carga a false
      setIsCheckingIn(false)
    }
  }
  return (
    <article className="w-full max-w-sm overflow-hidden rounded-3xl bg-[#1a2232] shadow-[0_8px_32px_rgba(0,0,0,0.35)]">
      {/* Bloque 1 — Imagen: usa `imageUrl` como fuente y `title` como texto alternativo */}
      <div className="relative p-3 pb-0">
        <img
          src={imageUrl}
          alt={title}
          className="h-44 w-full rounded-2xl object-cover"
        />
        <button
          type="button"
          onClick={onFavorite}
          aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
          className="absolute right-6 top-6 flex h-9 w-9 items-center justify-center rounded-full bg-[#0a0f18]/55 text-[#fdf2f0] backdrop-blur-sm transition-colors hover:bg-[#0a0f18]/75"
        >
          <HeartIcon
            className={`h-4 w-4 ${isFavorite ? 'fill-[#F97316] stroke-[#F97316]' : ''}`}
          />
        </button>
      </div>

      {/* Bloque 2 y 3 — Información y acciones del negocio */}
      <div className="p-4 pt-3">
        {/* Fila de título (`title`) y calificación (`rating`) */}
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-lg font-bold leading-tight tracking-tight text-white">
            {title}
          </h3>
          <div className="flex shrink-0 items-center gap-1">
            <StarIcon className="h-4 w-4 text-[#F97316]" />
            <span className="text-sm font-semibold text-white">{rating}</span>
          </div>
        </div>

        {/* Fila de ubicación (`location`) */}
        <div className="mt-1.5 flex items-center gap-1.5">
          <MapPinIcon className="h-3.5 w-3.5 shrink-0 text-[#F97316]" />
          <span className="text-sm text-white/80">{location}</span>
        </div>

        {/* Fila inferior: etiquetas (`tags`) y acción de check-in */}
        <div className="mt-3.5 flex items-center justify-between gap-3">
          {/* Iteración sobre el arreglo `tags` para renderizar cada etiqueta */}
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full bg-[#252d3d] px-3 py-1 text-xs font-medium text-white"
              >
                {tag}
              </span>
            ))}
          </div>

          {/* Botón de Check-in: acción principal de la tarjeta */}
          {/* Cambia de color y texto según el estado de carga y si ya se visitó */}
          <button
            type="button"
            onClick={handleCheckIn}
            disabled={isCheckingIn || hasCheckedIn}
            className={`flex shrink-0 items-center gap-1.5 rounded-full px-4 py-2 text-sm font-bold text-white transition-colors ${
              hasCheckedIn
                ? 'bg-emerald-500 cursor-default hover:bg-emerald-500'  // Verde si ya visitado
                : 'bg-[#F97316] hover:bg-orange-400 active:bg-orange-600 disabled:opacity-60'  // Naranja por defecto
            }`}
          >
            <MapPinIcon className="h-4 w-4" />
            {/* Muestra diferente texto según el estado del check-in */}
            {hasCheckedIn ? '¡Visitado!' : isCheckingIn ? 'Guardando...' : 'Check-in'}
          </button>
        </div>
      </div>
    </article>
  )
}

export default BusinessCard
