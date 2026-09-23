export default function StatCard({ label, value, hint, tone = "neutral" }) {
  const toneClasses = {
    neutral: "bg-stone-50 text-stone-900 dark:bg-stone-800 dark:text-stone-100",
    blue: "bg-sky-50 text-sky-900 dark:bg-sky-900/20 dark:text-sky-200",
    green: "bg-emerald-50 text-emerald-900 dark:bg-emerald-900/20 dark:text-emerald-200",
    red: "bg-rose-50 text-rose-900 dark:bg-rose-900/20 dark:text-rose-200",
  };

  return (
    <div className={`rounded-2xl border border-stone-200 p-4 shadow-[0_1px_2px_rgba(12,10,9,0.04)] dark:border-stone-800 ${toneClasses[tone]}`}>
      <p className="text-xs font-medium uppercase tracking-[0.12em] text-stone-500 dark:text-stone-400">
        {label}
      </p>
      <div className="mt-4 flex items-end justify-between gap-3">
        <p className="text-3xl font-semibold tracking-[-0.05em] text-current">{value}</p>
        {hint && <span className="text-xs text-current/80">{hint}</span>}
      </div>
    </div>
  );
}
