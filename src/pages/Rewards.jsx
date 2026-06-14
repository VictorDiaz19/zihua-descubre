import { useState } from 'react'

/**
 * Página de Recompensas: Interfaz premium para canjear puntos por beneficios.
 *
 * Componente que muestra:
 * 1. Estado de gamificación del usuario (nivel, puntos, barra de progreso)
 * 2. Lista de recompensas disponibles para canjear
 * 3. Botones de canjeo con validación de puntos disponibles
 *
 * Todos los comentarios explican en español la lógica de estado y diseño.
 */
export default function Rewards() {
  // ============================================================================
  // ESTADOS LOCALES
  // ============================================================================

  /**
   * userPoints: Puntos actuales del usuario (simulado para mockup).
   * En producción, este valor vendría de Supabase basado en la sesión del usuario.
   * Tipo: number | Valor inicial: 450
   */
  const [userPoints, setUserPoints] = useState(450)

  /**
   * userLevel: Nivel actual del usuario en el sistema de gamificación (ej. 2).
   * Tipo: number | Valor inicial: 2
   */
  const [userLevel] = useState(2)

  return (
    <main className="min-h-screen bg-slate-950 px-4 py-8 text-white pb-24">
      {/* ================================================================
          HEADER: Título principal con gradiente
      ================================================================ */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-400 to-amber-500 bg-clip-text text-transparent">
          Tus Recompensas
        </h1>
        <p className="mt-2 text-slate-400">Canjea tus puntos por beneficios exclusivos en Zihuatanejo.</p>
      </div>

      {/* ================================================================
          TARJETA DE ESTADO (Gamificación)
      ================================================================ */}
      <div className="mb-8 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-lg">
        {/* Nivel Actual */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-sm text-slate-400 uppercase tracking-wide">Nivel Actual</p>
            <h2 className="text-2xl font-bold text-white">Nivel {userLevel}: Explorador</h2>
          </div>
          {/* Icono de nivel (emoji o SVG) */}
          <div className="text-5xl">🎖️</div>
        </div>

        {/* Puntos Actuales */}
        <div className="mb-6 flex items-center gap-2">
          <span className="text-3xl font-bold text-orange-400">{userPoints}</span>
          <span className="text-slate-400">Puntos Disponibles</span>
          <span className="text-lg">⭐</span>
        </div>

        {/* Barra de Progreso Visual */}
        <div className="mb-2">
          <p className="text-xs text-slate-400 mb-2">Progreso al siguiente nivel</p>
          {/* Contenedor de la barra: fondo oscuro */}
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            {/* Barra interna: ancho dinámico (60% para este mockup) */}
            <div
              className="h-full bg-gradient-to-r from-orange-500 to-amber-400 rounded-full transition-all duration-500"
              style={{ width: '60%' }}
            />
          </div>
        </div>
        <p className="text-right text-xs text-slate-400">1500 / 2500 puntos</p>
      </div>

      {/* ================================================================
          ESTADO: Próximamente (Coming Soon)
      ================================================================ */}
      {/* Contenedor de estado vacío estilizado. Informamos al usuario que */}
      {/* las recompensas están en desarrollo y que pronto habrá alianzas. */}
      <div className="mt-6 border-2 border-dashed border-slate-700 rounded-2xl p-8 text-center bg-slate-900/50">
        {/* Icono grande y amigable en color gris sutil o naranja transparente */}
        <div className="text-6xl mb-4 text-orange-500/50">🎁</div>

        {/* Título principal del estado */}
        <h3 className="text-lg font-bold text-white mb-2">Nuevas recompensas en camino</h3>

        {/* Texto descriptivo con información sobre las alianzas */}
        <p className="text-sm text-slate-400">
          Estamos haciendo alianzas con los mejores restaurantes y negocios locales de Zihuatanejo 
          para traerte beneficios exclusivos. ¡Sigue explorando y acumulando puntos para estar listo!
        </p>
      </div>
    </main>
  )
}
