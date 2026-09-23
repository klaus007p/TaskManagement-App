export default function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  icon = "✦",
}) {
  return (
    <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center shadow-[0_1px_2px_rgba(12,10,9,0.04)] dark:border-stone-800 dark:bg-stone-900/80 dark:text-stone-100">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl border border-stone-200 bg-stone-50 text-sm font-semibold text-stone-600 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-200">
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-[-0.02em] text-stone-900 dark:text-stone-100">
        {title}
      </h3>
      <p className="mt-2 text-sm leading-6 text-stone-600 dark:text-stone-400">
        {description}
      </p>
      {actionLabel && (
        <button
          type="button"
          onClick={onAction}
          className="mt-5 inline-flex items-center justify-center rounded-xl border border-stone-300 bg-white px-3.5 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-400 hover:bg-stone-50 dark:border-stone-700 dark:bg-stone-900 dark:text-stone-200 dark:hover:border-stone-600 dark:hover:bg-stone-800"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
}
