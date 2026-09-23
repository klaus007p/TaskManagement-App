export default function AuthLayout({ children, title, subtitle }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-stone-100 px-4 py-12">
      <div className="w-full max-w-md">
        <div className="mb-8 flex items-center justify-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-sm font-semibold text-white">
            TF
          </div>
          <div>
            <p className="text-lg font-semibold tracking-[-0.04em] text-stone-900">TaskFlow</p>
          </div>
        </div>

        <div className="rounded-3xl border border-stone-200 bg-white p-6 shadow-[0_12px_30px_rgba(12,10,9,0.06)] sm:p-8">
          <h1 className="text-3xl font-semibold tracking-[-0.05em] text-stone-900">{title}</h1>
          <p className="mt-2 text-sm leading-6 text-stone-600">{subtitle}</p>
          {children}
        </div>
      </div>
    </div>
  );
}
