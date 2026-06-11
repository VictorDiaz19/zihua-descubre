import { NavLink } from 'react-router-dom'

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
 * Cada ruta corresponde a una sección de la aplicación.
 */
const NAV_ITEMS = [
  { id: 'explorar', label: 'Explorar', path: '/', Icon: CompassIcon },
  { id: 'guardados', label: 'Guardados', path: '/guardados', Icon: BookmarkIcon },
  { id: 'mapa', label: 'Mapa', path: '/mapa', Icon: MapPinIcon },
  { id: 'perfil', label: 'Perfil', path: '/perfil', Icon: UserIcon },
]

/**
 * Barra de navegación inferior fija de la aplicación.
 *
 * Proporciona enlaces a las rutas principales de React Router. Usa `NavLink`
 * para saber cuál pestaña está activa y aplicar estilos condicionales.
 */
function BottomNav() {
  return (
    <nav
      aria-label="Navegación principal"
      className="fixed bottom-0 left-0 z-50 w-full border-t border-gray-800 bg-[#1E293B]"
    >
      {/* Contenedor de enlaces: distribución equitativa de las 4 pestañas */}
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {NAV_ITEMS.map(({ id, label, path, Icon }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition-colors ${
                isActive ? 'text-[#F97316]' : 'text-gray-400 hover:text-gray-300'
              }`
            }
          >
            <Icon className="h-6 w-6" />
            <span>{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default BottomNav
