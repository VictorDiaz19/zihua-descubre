/**
 * Página de administración de la web del negocio.
 *
 * Esta página se muestra dentro del layout exclusivo para locales.
 */
export default function BusinessAdminWeb() {
  return (
    <section className="rounded-3xl border border-slate-700 bg-slate-900/90 p-8 shadow-2xl shadow-black/20">
      <h1 className="text-3xl font-semibold text-white">Mi Web</h1>
      <p className="mt-3 text-slate-400">
        Aquí el dueño puede administrar el contenido y la presencia de su negocio.
      </p>
    </section>
  )
}
