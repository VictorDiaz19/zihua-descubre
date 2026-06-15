import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import BottomNav from './components/BottomNav'
import BusinessLayout from './components/BusinessLayout'
import Home from './pages/Home'
import Map from './pages/Map'
import Rewards from './pages/Rewards'
import Profile from './pages/Profile'
import Saved from './pages/Saved'
import BusinessDetail from './pages/BusinessDetail'
import BusinessWebAdmin from './pages/business/BusinessWebAdmin'
import BusinessForm from './pages/business/BusinessForm'
import BusinessAdminReviews from './pages/BusinessAdminReviews'
import BusinessAdminAnalytics from './pages/BusinessAdminAnalytics'
import BusinessAdminProfile from './pages/BusinessAdminProfile'
import useAuthRole from './hooks/useAuthRole'

/**
 * Componente raíz de la aplicación Zihua Descubre.
 *
 * Administra el enrutamiento general, separando la experiencia de usuarios
 * turistas y locales según el rol almacenado en los metadatos de Supabase.
 */
export default function App() {
  const { userRole } = useAuthRole()

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-[#0F172A] text-white">
        <div className="px-4 pt-4 pb-20">
          <Routes>
            {userRole === 'business' ? (
              <>
                {/* Rutas exclusivas para dueños de negocio */}
                <Route path="/negocio-admin" element={<BusinessLayout />}>
                  <Route index element={<Navigate to="/negocio-admin/web" replace />} />
                  <Route path="web" element={<BusinessWebAdmin />} />
                  <Route path="web/editar" element={<BusinessForm />} />
                  <Route path="reviews" element={<BusinessAdminReviews />} />
                  <Route path="analytics" element={<BusinessAdminAnalytics />} />
                  <Route path="perfil" element={<BusinessAdminProfile />} />
                </Route>
                <Route path="*" element={<Navigate to="/negocio-admin" replace />} />
              </>
            ) : (
              <>
                {/* Rutas para turistas o usuarios sin sesión */}
                <Route path="/" element={<Home />} />
                <Route path="/mapa" element={<Map />} />
                <Route path="/recompensas" element={<Rewards />} />
                <Route path="/perfil" element={<Profile />} />
                <Route path="/guardados" element={<Saved />} />
                <Route path="/negocio/:id" element={<BusinessDetail />} />
                <Route path="*" element={<Navigate to="/" replace />} />
              </>
            )}
          </Routes>
        </div>

        {userRole !== 'business' && <BottomNav />}
      </div>
    </BrowserRouter>
  )
}
