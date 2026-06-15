import 'leaflet/dist/leaflet.css';

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { supabase } from '../config/supabase';

/**
 * Página de mapa de la aplicación Zihua Descubre.
 *
 * Este componente renderiza un mapa oscurecido centrado en Zihuatanejo,
 * obteniendo los negocios directamente desde Supabase y mostrando sus
 * marcadores en el mapa.
 */
export default function Map() {
  const navigate = useNavigate();
  const [locations, setLocations] = useState([]);

  useEffect(() => {
    async function fetchLocations() {
      try {
        const { data, error } = await supabase
          .from('businesses')
          .select('id, name, lat, lng');

        if (error) {
          throw error;
        }

        setLocations(data || []);
      } catch (err) {
        console.error('Error cargando ubicaciones:', err.message || err);
        setLocations([]);
      }
    }

    fetchLocations();
  }, []);

  // Icono personalizado para Leaflet con Tailwind CSS.
  // Evita el bug de rutas de imágenes predeterminadas cuando se usa Vite.
  const orangeIcon = L.divIcon({
    className: 'bg-transparent',
    html: `
      <span class="block h-4 w-4 rounded-full bg-orange-500 border-2 border-white shadow-lg"></span>
    `,
    iconSize: [16, 16],
    iconAnchor: [8, 8],
    popupAnchor: [0, -10],
  });

  return (
    <main className="h-[calc(100vh-4rem)] w-full relative z-0 bg-slate-950 text-white">
      {/*
        Contenedor principal del mapa.
        Se ajusta para dejar espacio a la barra de navegación inferior.
      */}
      <MapContainer
        center={[17.644, -101.551]}
        zoom={14}
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        {/*
          Capa base oscura de CartoDB para un estilo premium y moderno.
        */}
        <TileLayer
          attribution="&copy; <a href='https://carto.com/attributions'>CARTO</a> &copy; <a href='https://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />

        {/* Marcadores cargados desde Supabase que tienen coordenadas válidas. */}
        {locations
          .filter((loc) => loc.lat != null && loc.lng != null)
          .map((loc) => (
            <Marker
              key={loc.id}
              position={[loc.lat, loc.lng]}
              icon={orangeIcon}
            >
              <Popup>
                <div className="space-y-2 text-sm text-slate-950">
                  <p className="font-semibold">{loc.name}</p>
                  <p
                    className="cursor-pointer text-orange-500 underline"
                    onClick={() => navigate('/negocio/' + loc.id)}
                  >
                    Ver negocio
                  </p>
                </div>
              </Popup>
            </Marker>
          ))}
      </MapContainer>
    </main>
  );
}
