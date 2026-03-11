export function ContactPage() {
  return (
    <section className="fade-up py-6 sm:py-8">
      <div className="glass-card rounded-3xl p-6 sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-teal-700">
          Get in touch
        </p>
        <h1 className="display-title mt-2 text-4xl font-bold text-slate-900 sm:text-5xl">
          Contact
        </h1>

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <article className="rounded-2xl bg-white/85 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Email</h2>
            <p className="mt-2 text-sm text-slate-700">support@vodreactapp.com</p>
          </article>

          <article className="rounded-2xl bg-white/85 p-4 shadow-sm">
            <h2 className="text-sm font-semibold text-slate-900">Phone</h2>
            <p className="mt-2 text-sm text-slate-700">+1 (555) 123-4567</p>
          </article>

          <article className="rounded-2xl bg-white/85 p-4 shadow-sm sm:col-span-2">
            <h2 className="text-sm font-semibold text-slate-900">Address</h2>
            <p className="mt-2 text-sm text-slate-700">
              123 Streaming Avenue, Movie City, CA 90210
            </p>
            <p className="mt-2 text-sm text-slate-700">
              Business hours: Monday to Friday, 9:00 AM - 6:00 PM
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
