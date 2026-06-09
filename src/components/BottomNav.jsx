/**
 * Ícono SVG de brújula para la pestaña "Explorar".
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
 * Ícono SVG de marcador para la pestaña "Guardados".
 * @param {{ className?: string }} props - Clases de Tailwind aplicadas al SVG.
 */
function BookmarkIcon({ className }) {
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
      <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
    </svg>
  )
}

/**
 * Ícono SVG de pin de mapa para la pestaña "Mapa".
 * @param {{ className?: string }} props - Clases de Tailwind aplicadas al SVG.
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
 * Ícono SVG de usuario para la pestaña "Perfil".
 * @param {{ className?: string }} props - Clases de Tailwind aplicadas al SVG.
 */
function UserIcon({ className }) {
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
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}

/**
 * Configuración estática de los ítems de la barra de navegación.
 * `active` indica la pestaña visible actualmente (por ahora hardcodeada).
 */
const NAV_ITEMS = [
  { id: 'explorar', label: 'Explorar', Icon: CompassIcon, active: true },
  { id: 'guardados', label: 'Guardados', Icon: BookmarkIcon, active: false },
  { id: 'mapa', label: 'Mapa', Icon: MapPinIcon, active: false },
  { id: 'perfil', label: 'Perfil', Icon: UserIcon, active: false },
]

/**
 * Barra de navegación inferior fija de la aplicación.
 *
 * Proporciona acceso rápido a las cuatro secciones principales:
 * Explorar, Guardados, Mapa y Perfil. Se mantiene visible al hacer scroll
 * y resalta la pestaña activa con el color naranja de la marca (#F97316).
 */
function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-800 bg-[#1E293B]"
    >
      {/* Contenedor de Botones: distribución equitativa de las 4 pestañas */}
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {NAV_ITEMS.map(({ id, label, Icon, active }) => (
          <button
            key={id}
            type="button"
            aria-current={active ? 'page' : undefined}
            className={`flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
              active ? 'text-[#F97316]' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
