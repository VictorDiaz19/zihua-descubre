/**
 * Ícono SVG de lupa utilizado en la barra superior y en el campo de búsqueda.
 * @param {{ className?: string }} props - Clases de Tailwind aplicadas al SVG.
 */
function SearchIcon({ className }) {
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
      <circle cx="11" cy="11" r="8" />
      <path d="m21 21-4.35-4.35" />
    </svg>
  )
}

/**
 * Ícono SVG de brújula para la categoría activa "Explore".
 * @param {{ className?: string }} props - Clases de Tailwind aplicadas al SVG.
 */
function CompassIcon({ className }) {
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
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}

/**
 * URL de imagen de perfil genérica (placeholder de Unsplash).
 * Se reemplazará por la foto real del usuario autenticado.
 */
const PROFILE_IMAGE =
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face'

/**
 * Listado de categorías del filtro horizontal.
 * Solo "Explore" inicia en estado activo; el resto son chips inactivos.
 */
const CATEGORIES = [
  { id: 'explore', label: 'Explore', Icon: CompassIcon, active: true },
  { id: 'tacos', label: 'Tacos', active: false },
  { id: 'seafood', label: 'Seafood', active: false },
  { id: 'drinks', label: 'Drinks', active: false },
]

/**
 * Encabezado principal de la pantalla de exploración.
 *
 * Agrupa la barra superior (marca + avatar), el campo de búsqueda
 * y los filtros de categoría con desplazamiento horizontal.
 * La fila superior usa Flexbox: marca a la izquierda, perfil a la derecha.
 * Replica el diseño mobile de Zihua Descubre en modo oscuro.
 */
function Header() {
  return (
    <header className="mb-6 flex flex-col gap-4 pt-4">
      {/* Barra Superior: marca alineada a la izquierda y avatar a la derecha */}
      <div className="flex items-center justify-between gap-3">
        {/* Grupo Izquierdo: lupa y título juntos, sin salto de línea */}
        <div className="flex min-w-0 items-center gap-2">
          <button
            type="button"
            aria-label="Abrir búsqueda"
            className="flex shrink-0 items-center justify-center text-[#E8CDBF] transition-colors hover:text-white"
          >
            <SearchIcon className="h-5 w-5" />
          </button>

          <h1 className="whitespace-nowrap text-lg font-bold tracking-tight text-[#E8CDBF]">
            Zihua Descubre
          </h1>
        </div>

        {/* Avatar del usuario: anclado al extremo derecho de la fila */}
        <img
          src={PROFILE_IMAGE}
          alt="Foto de perfil del usuario"
          className="h-9 w-9 shrink-0 rounded-full object-cover ring-2 ring-[#1E293B]"
        />
      </div>

      {/* Barra de Búsqueda: campo tipo pill con placeholder descriptivo */}
      <div className="flex items-center gap-3 rounded-full bg-[#1E293B] px-4 py-3">
        <SearchIcon className="h-5 w-5 shrink-0 text-gray-500" />
        <input
          type="search"
          placeholder="Find tacos, beaches, drinks..."
          aria-label="Buscar tacos, playas, bebidas y más"
          className="w-full bg-transparent text-sm text-white placeholder:text-gray-500 focus:outline-none"
        />
      </div>

      {/* Filtros de Categoría: fila deslizable horizontalmente sin barra visible */}
      <div className="no-scrollbar flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map(({ id, label, Icon, active }) => (
          <button
            key={id}
            type="button"
            aria-current={active ? 'true' : undefined}
            className={`flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              active
                ? 'border border-[#F97316] text-[#F97316]'
                : 'bg-[#1E293B] text-[#E2E8F0] hover:bg-[#253044]'
            }`}
          >
            {/* Solo la categoría activa muestra ícono de brújula */}
            {Icon && <Icon className="h-4 w-4" />}
            <span>{label}</span>
          </button>
        ))}
      </div>
    </header>
  )
}

export default Header
