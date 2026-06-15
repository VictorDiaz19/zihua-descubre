import { useState } from 'react'

/**
 * Página para que los dueños registren su local en Zihua Descubre.
 *
 * El formulario usa Tailwind CSS para un diseño oscuro y moderno. Los datos
 * se empaquetan en un objeto JSON listo para ser enviado a Supabase en el futuro.
 */
export default function BusinessRegistration() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [categories, setCategories] = useState('')
  const [phone, setPhone] = useState('')
  const [website, setWebsite] = useState('')
  const [description, setDescription] = useState('')
  const [allowFeedback, setAllowFeedback] = useState(true)
  const [submitted, setSubmitted] = useState(false)

  function handleSubmit(event) {
    event.preventDefault()

    const categoryArray = categories
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean)

    const businessPayload = {
      name: name.trim(),
      address: address.trim(),
      categories: categoryArray,
      phone: phone.trim() || null,
      website: website.trim() || null,
      description: description.trim() || null,
      allowFeedback,
    }

    console.log('Datos del negocio a enviar:', businessPayload)
    setSubmitted(true)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <section className="mx-auto max-w-4xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/90 p-8 shadow-2xl shadow-black/30">
          <div className="mb-8 space-y-3">
            <p className="text-sm uppercase tracking-[0.3em] text-orange-400">
              Registro de Local
            </p>
            <h1 className="text-3xl font-semibold text-white sm:text-4xl">
              Registra tu negocio en Zihua Descubre
            </h1>
            <p className="max-w-2xl text-slate-400">
              Completa el formulario para que tu local aparezca en nuestra plataforma.
              Los campos con * son obligatorios.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="business-name" className="text-sm font-medium text-slate-200">
                  Nombre del Negocio *
                </label>
                <input
                  id="business-name"
                  type="text"
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  required
                  placeholder="Ej. Mariscos El Tiburón"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="business-address" className="text-sm font-medium text-slate-200">
                  Dirección Exacta *
                </label>
                <input
                  id="business-address"
                  type="text"
                  value={address}
                  onChange={(event) => setAddress(event.target.value)}
                  required
                  placeholder="Calle Principal 123, Zihuatanejo"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="business-categories" className="text-sm font-medium text-slate-200">
                Categorías / Etiquetas
              </label>
              <input
                id="business-categories"
                type="text"
                value={categories}
                onChange={(event) => setCategories(event.target.value)}
                placeholder="restaurante, tacos, mariscos"
                className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
              <p className="text-sm text-slate-500">
                Escribe las categorías separadas por comas para guardarlas como un arreglo.
              </p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="business-phone" className="text-sm font-medium text-slate-200">
                  Teléfono
                </label>
                <input
                  id="business-phone"
                  type="tel"
                  value={phone}
                  onChange={(event) => setPhone(event.target.value)}
                  placeholder="+52 755 123 4567"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="business-website" className="text-sm font-medium text-slate-200">
                  Sitio Web
                </label>
                <input
                  id="business-website"
                  type="url"
                  value={website}
                  onChange={(event) => setWebsite(event.target.value)}
                  placeholder="https://www.mi-negocio.com"
                  className="w-full rounded-2xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="business-description" className="text-sm font-medium text-slate-200">
                Descripción del negocio
              </label>
              <textarea
                id="business-description"
                value={description}
                onChange={(event) => setDescription(event.target.value)}
                rows="5"
                placeholder="Describe tu local, especialidades y ambiente."
                className="w-full rounded-3xl border border-slate-700 bg-slate-950 px-4 py-3 text-white placeholder:text-slate-500 outline-none transition focus:border-orange-400 focus:ring-2 focus:ring-orange-400/20"
              />
            </div>

            <div className="flex items-center justify-between rounded-3xl border border-slate-700 bg-slate-950/80 p-4">
              <div>
                <p className="text-sm font-medium text-slate-200">
                  Permitir comentarios y calificaciones en mi perfil
                </p>
                <p className="text-sm text-slate-500">
                  Activa o desactiva la posibilidad de recibir reseñas.
                </p>
              </div>
              <button
                type="button"
                onClick={() => setAllowFeedback((current) => !current)}
                className={`relative inline-flex h-10 w-18 items-center rounded-full p-1 transition duration-200 ${
                  allowFeedback ? 'bg-orange-500/90' : 'bg-slate-700'
                }`}
              >
                <span
                  className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition ${
                    allowFeedback ? 'translate-x-8' : 'translate-x-0'
                  }`}
                />
              </button>
            </div>

            <div className="space-y-2">
              <button
                type="submit"
                className="w-full rounded-3xl bg-orange-500 px-6 py-3 text-base font-semibold text-slate-950 transition hover:bg-orange-400"
              >
                Enviar registro
              </button>
              {submitted && (
                <p className="text-center text-sm text-emerald-300">
                  Formulario preparado. Revisa la consola para ver el objeto JSON.
                </p>
              )}
            </div>
          </form>
        </div>
      </section>
    </main>
  )
}
