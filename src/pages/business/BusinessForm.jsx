import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../../config/supabase'

/**
 * Formulario de creación y edición del negocio para el panel de administración.
 *
 * Este componente captura coordenadas GPS reales y guarda los datos en el
 * esquema exacto de la tabla `businesses` de Supabase.
 */
export default function BusinessForm() {
  const [businessData, setBusinessData] = useState(null)
  const [businessId, setBusinessId] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [foodType, setFoodType] = useState('')
  const [phone, setPhone] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState('restaurant')
  const [lat, setLat] = useState(null)
  const [lng, setLng] = useState(null)
  const [coverFile, setCoverFile] = useState(null)
  const [galleryFiles, setGalleryFiles] = useState([])
  const [isLocating, setIsLocating] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    async function loadBusiness() {
      setLoading(true)
      setError('')

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError) {
        setError('No se pudo verificar el usuario autenticado.')
        setLoading(false)
        return
      }

      if (!user) {
        setError('Usuario no autenticado. Inicia sesión para continuar.')
        setLoading(false)
        return
      }

      const { data, error: fetchError } = await supabase
        .from('businesses')
        .select('*')
        .eq('owner_id', user.id)
        .single()

      if (fetchError && fetchError.code !== 'PGRST116') {
        setError('Error cargando los datos del negocio. Revisa la consola.')
        console.error('Error cargando BusinessForm:', fetchError)
      }

      if (data) {
        setBusinessData(data)
        setBusinessId(data.id)
        setName(data.name || '')
        setAddress(data.address || '')
        setFoodType(data.food_type || '')
        setCategory(data.category || 'restaurant')
        setPhone(data.phone || '')
        setDescription(data.description || '')
        setLat(data.lat ?? null)
        setLng(data.lng ?? null)
      }

      setLoading(false)
    }

    loadBusiness()
  }, [])

  async function handleGeolocation() {
    if (!navigator.geolocation) {
      setError('Tu navegador no soporta geolocalización.')
      return
    }

    setIsLocating(true)
    setError('')

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude)
        setLng(position.coords.longitude)
        setIsLocating(false)
      },
      (geoError) => {
        setError('No se pudo obtener la ubicación. Asegúrate de permitir el acceso al GPS.')
        console.error('Error al obtener geolocalización:', geoError)
        setIsLocating(false)
      },
      { enableHighAccuracy: true, timeout: 15000 }
    )
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setSaving(true)
    setError('')

    // Volver a leer el usuario actual para evitar desajustes de sesión
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (!user || !user.id) {
      alert('Error: No se encontró una sesión activa. Por favor, inicia sesión de nuevo.')
      setSaving(false)
      return
    }

    if (userError) {
      setError('No se pudo obtener el usuario autenticado para guardar el negocio.')
      setSaving(false)
      return
    }

    const businessDataToSave = {
      owner_id: user.id,
      name: name.trim(),
      address: address.trim(),
      category: category,
      food_type: foodType.trim(),
      phone: phone.trim() || null,
      description: description.trim() || null,
      lat,
      lng,
    }

    // Guardado inteligente: Si owner_id ya existe, actualiza; si no, inserta.
    const { data: savedBusiness, error: saveError } = await supabase
      .from('businesses')
      .upsert(businessDataToSave, { onConflict: 'owner_id' })
      .select()
      .single()

    if (saveError) {
      setError('No se pudo guardar la información. Revisa la consola.')
      console.error('Error guardando BusinessForm:', saveError)
      setSaving(false)
      return
    }

    const savedBusinessId = savedBusiness?.id

    if (coverFile && savedBusinessId) {
      try {
        const fileExt = coverFile.name.split('.').pop()
        const fileName = `${savedBusinessId}-cover-${Date.now()}.${fileExt}`
        const filePath = `${user.id}/${fileName}`

        const { error: uploadError } = await supabase.storage
          .from('business_media_bucket')
          .upload(filePath, coverFile)

        if (uploadError) throw uploadError

        const {
          data: { publicUrl },
        } = supabase.storage.from('business_media_bucket').getPublicUrl(filePath)

        const { error: mediaError } = await supabase.from('business_media').insert([
          {
            business_id: savedBusinessId,
            url: publicUrl,
            caption: 'Foto de portada',
            // media_type: 'image', // Ajusta según el ENUM exacto en la base de datos
          },
        ])

        if (mediaError) throw mediaError
      } catch (mediaSaveError) {
        setError('No se pudo guardar la foto de portada. Revisa la consola.')
        console.error('Error guardando business_media:', mediaSaveError)
        setSaving(false)
        return
      }
    }

    if (galleryFiles && galleryFiles.length > 0 && savedBusinessId) {
      try {
        for (let i = 0; i < galleryFiles.length; i++) {
          const file = galleryFiles[i]
          const fileExt = file.name.split('.').pop()
          const fileName = `${savedBusinessId}-gallery-${i}-${Date.now()}.${fileExt}`
          const filePath = `${user.id}/${fileName}`

          const { error: uploadErr } = await supabase.storage
            .from('business_media_bucket')
            .upload(filePath, file)

          if (uploadErr) throw uploadErr

          const {
            data: { publicUrl },
          } = supabase.storage.from('business_media_bucket').getPublicUrl(filePath)

          const { error: mediaErr } = await supabase.from('business_media').insert([
            {
              business_id: savedBusinessId,
              url: publicUrl,
              caption: 'Galería',
              sort_order: i,
            },
          ])

          if (mediaErr) throw mediaErr
        }
      } catch (gallerySaveError) {
        setError('No se pudo guardar las fotos de la galería. Revisa la consola.')
        console.error('Error guardando business_media gallery:', gallerySaveError)
        setSaving(false)
        return
      }
    }

    navigate('/negocio-admin/web')
  }

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4 text-white">
        <div>
          <div className="mb-4 inline-flex h-12 w-12 animate-spin items-center justify-center rounded-full border-4 border-orange-500 border-t-transparent" />
          <p className="text-lg font-medium">Cargando datos del negocio...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6">
      <div className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl shadow-black/30">
        <div className="mb-8">
          <p className="text-sm uppercase tracking-[0.3em] text-orange-400">Mi Web</p>
          <h1 className="mt-3 text-3xl font-semibold text-white">
            {businessData ? 'Editar tu mini-web' : 'Crea tu mini-web'}
          </h1>
          <p className="mt-2 text-slate-400">
            Completa los datos de tu negocio y captura sus coordenadas GPS exactas.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
              {error}
            </div>
          )}

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="name" className="text-sm font-medium text-slate-200">
                Nombre del Negocio *
              </label>
              <input
                id="name"
                type="text"
                value={name}
                onChange={(event) => setName(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium text-slate-200">
                Dirección *
              </label>
              <input
                id="address"
                type="text"
                value={address}
                onChange={(event) => setAddress(event.target.value)}
                required
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
              <button
                type="button"
                onClick={handleGeolocation}
                className="mt-2 w-full rounded-2xl bg-slate-800 px-4 py-3 text-sm font-semibold text-orange-500 transition hover:bg-slate-700"
              >
                {isLocating ? 'Buscando ubicación...' : lat && lng ? '✅ Ubicación guardada' : '📍 Obtener coordenadas exactas del local'}
              </button>
              <p className="text-sm text-slate-500">
                La ubicación se utiliza para mostrar tu negocio en el mapa con precisión.
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="foodType" className="text-sm font-medium text-slate-200">
              Especialidades / Palabras Clave (Opcional)
            </label>
            <input
              id="foodType"
              type="text"
              value={foodType}
              onChange={(event) => setFoodType(event.target.value)}
              placeholder="Tacos, Al pastor, Pet-friendly, Terraza"
              className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
            />
            <p className="text-sm text-slate-500">
              Palabras clave para que los turistas te encuentren en el buscador (Ej. Tacos, Al pastor, Pet-friendly, Terraza, Música en vivo). Sepáralas con comas.
            </p>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-slate-300 mb-1">Categoría del Negocio *</label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-3 text-white focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none"
            >
              <option value="restaurant">Restaurante</option>
              <option value="hotel">Hotel / Hospedaje</option>
              <option value="bar">Bar / Vida Nocturna</option>
              <option value="cafe">Cafetería</option>
              <option value="store">Tienda Local</option>
              <option value="tour">Experiencia / Tour</option>
            </select>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-5">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-orange-400">Imágenes del Negocio</p>
            <div className="mt-4 space-y-4">
              <label className="block rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-5 text-center text-slate-300 transition hover:border-orange-400 hover:bg-slate-800">
                <span className="mb-2 inline-block text-lg">Foto de Portada</span>
                <p className="mb-4 text-sm text-slate-500">Sube una imagen principal para tu perfil.</p>
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => setCoverFile(event.target.files?.[0] ?? null)}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-300">
                  {coverFile ? coverFile.name : 'Seleccionar archivo'}
                </span>
              </label>

              <label className="block rounded-3xl border border-dashed border-slate-700 bg-slate-900/80 p-5 text-center text-slate-300 transition hover:border-orange-400 hover:bg-slate-800">
                <span className="mb-2 inline-block text-lg">Fotos Secundarias</span>
                <p className="mb-4 text-sm text-slate-500">Sube hasta 5 fotos de tu menú o local (Plan Gratuito).</p>
                <input
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={(event) => {
                    const files = Array.from(event.target.files || [])
                    if (files.length > 5) {
                      alert('Solo puedes subir hasta 5 fotos en la galería.')
                      setGalleryFiles(files.slice(0, 5))
                      return
                    }
                    setGalleryFiles(files)
                  }}
                  className="hidden"
                />
                <span className="inline-flex items-center justify-center rounded-full bg-slate-800 px-3 py-2 text-sm text-slate-300">
                  {galleryFiles.length > 0
                    ? `${galleryFiles.length} foto(s) seleccionada(s)`
                    : 'Seleccionar archivos'}
                </span>
              </label>

              {galleryFiles.length > 0 && (
                <div className="space-y-2 rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300">
                  <p className="font-medium text-white">Vista previa de galería:</p>
                  <ul className="list-disc space-y-1 pl-5">
                    {galleryFiles.map((file, index) => (
                      <li key={index}>{file.name}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>

          <div className="grid gap-6 sm:grid-cols-2">
            <div className="space-y-2">
              <label htmlFor="phone" className="text-sm font-medium text-slate-200">
                Teléfono
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(event) => setPhone(event.target.value)}
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium text-slate-200">
                Descripción
              </label>
              <textarea
                id="description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows="5"
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-700 bg-slate-950/80 p-4 text-sm text-slate-300">
            <p>
              Coordenadas guardadas:{' '}
              {lat && lng ? (
                <span className="text-green-300">{lat.toFixed(5)}, {lng.toFixed(5)}</span>
              ) : (
                <span className="text-slate-400">Aún no se han capturado</span>
              )}
            </p>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              disabled={!lat || !lng || loading || saving}
              className="w-full rounded-3xl bg-orange-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-orange-400 disabled:opacity-60"
            >
              {saving ? 'Guardando...' : 'Guardar mi web'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
