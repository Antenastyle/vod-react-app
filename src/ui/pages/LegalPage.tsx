export function LegalPage() {
  return (
    <section className="fade-up py-6 sm:py-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Terms and notices
        </p>
        <h1 className="display-title mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
          Legal
        </h1>

        <div className="mt-6 space-y-4 text-sm leading-7 text-slate-700 sm:text-base">
          <article className="rounded-2xl bg-white/85 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Usage</h2>
            <p className="mt-2">
              The content presented in this application is for informational and
              demonstration purposes only.
            </p>
          </article>

          <article className="rounded-2xl bg-white/85 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Ownership</h2>
            <p className="mt-2">
              Movie posters, names, and related metadata may belong to their
              respective owners and are used here as reference data.
            </p>
          </article>

          <article className="rounded-2xl bg-white/85 p-4 shadow-sm">
            <h2 className="text-base font-semibold text-slate-900">Disclaimer</h2>
            <p className="mt-2">
              By using this application, you agree that availability and
              accuracy of data are provided without warranty.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
