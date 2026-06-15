import { NavLink, Outlet } from 'react-router-dom'

/**
 * Layout exclusivo para usuarios con rol de negocio.
 *
 * Este layout contiene un contenedor principal similar al de la app general,
 * pero con una barra de navegación inferior especial para locales.
 */
export default function BusinessLayout() {
  return (
    <div className="min-h-screen bg-[#0F172A] text-white">
      <main className="px-4 pt-4 pb-28">
        <Outlet />
      </main>
      <BusinessBottomNav />
    </div>
  )
}

function StorefrontIcon({ className }) {
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
      <path d="M3 9l1-4h16l1 4" />
      <path d="M5 9v10h14V9" />
      <path d="M9 13h6" />
      <path d="M8 21h8" />
    </svg>
  )
}

function ReviewsIcon({ className }) {
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
      <path d="M21 10c0 6-9 12-9 12s-9-6-9-12a9 9 0 0 1 18 0z" />
      <path d="M12 6.5l1.5 3 3.5.5-2.5 2.4.6 3.6L12 14.5l-3.1 1.6.6-3.6L7 10l3.5-.5L12 6.5z" />
    </svg>
  )
}

function ChartIcon({ className }) {
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
      <path d="M3 3v18h18" />
      <path d="M18 17V9" />
      <path d="M13 17V5" />
      <path d="M8 17v-4" />
    </svg>
  )
}

function BusinessUserIcon({ className }) {
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

function BusinessBottomNav() {
  const NAV_ITEMS = [
    { id: 'web', label: 'Mi Web', path: '/negocio-admin/web', Icon: StorefrontIcon },
    { id: 'reviews', label: 'Comentarios', path: '/negocio-admin/reviews', Icon: ReviewsIcon },
    { id: 'analytics', label: 'Métricas', path: '/negocio-admin/analytics', Icon: ChartIcon },
    { id: 'perfil', label: 'Perfil', path: '/negocio-admin/perfil', Icon: BusinessUserIcon },
  ]

  return (
    <nav
      aria-label="Navegación del panel de negocio"
      className="fixed bottom-0 left-0 z-50 w-full border-t border-slate-800 bg-[#1E293B]"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2">
        {NAV_ITEMS.map(({ id, label, path, Icon }) => (
          <NavLink
            key={id}
            to={path}
            className={({ isActive }) =>
              `flex flex-1 flex-col items-center gap-1 py-3 text-xs font-medium transition ${
                isActive ? 'text-orange-400' : 'text-slate-400 hover:text-slate-200'
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
