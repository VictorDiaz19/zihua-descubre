import { BrowserRouter, Routes, Route } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import Home from './pages/Home'
import Map from './pages/Map'
import Rewards from './pages/Rewards'
import Profile from './pages/Profile'
import Saved from './pages/Saved'

/**
 * Componente raíz de la aplicación Zihua Descubre.
 *
 * Actúa como el enrutador central, renderizando las páginas según la URL y
 * manteniendo la barra inferior fija en todas las vistas.
 */
export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0F172A] text-white">
        {/* Rutas principales de la aplicación */}
        <div className="px-4 pt-4 pb-20">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mapa" element={<Map />} />
            <Route path="/recompensas" element={<Rewards />} />
            <Route path="/perfil" element={<Profile />} />
            <Route path="/guardados" element={<Saved />} />
          </Routes>
        </div>

        {/* Navegación inferior fija en todas las rutas */}
        <BottomNav />
      </div>
    </BrowserRouter>
  )
}
