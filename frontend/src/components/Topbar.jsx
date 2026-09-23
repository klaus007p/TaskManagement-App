import { useState } from "react";
import { Link } from "react-router-dom";

export default function Topbar({ title, user, onLogout }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const safeUser = user || { name: "User", email: "user@taskflow.app", avatar: "U" };

  return (
    <header className="sticky top-0 z-30 border-b border-stone-200 bg-white/90 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-stone-200 text-stone-600 lg:hidden"
            aria-label="Open navigation"
          >
            ☰
          </button>
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.18em] text-stone-500">Workspace</p>
            <h1 className="text-xl font-semibold tracking-[-0.04em] text-stone-900">{title}</h1>
          </div>
        </div>

        <div className="hidden items-center gap-3 md:flex md:flex-1 md:justify-end">
          <div className="relative w-full max-w-md">
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400">⌕</span>
            <input
              type="search"
              aria-label="Search tasks"
              placeholder="Search tasks, notes, projects…"
              className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-700 outline-none transition focus:border-stone-300"
            />
          </div>

          <div className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((current) => !current)}
              className="flex items-center gap-3 rounded-xl border border-stone-200 bg-white px-2 py-2 text-left transition hover:border-stone-300"
              aria-label="User menu"
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-800 text-xs font-semibold text-white">
                {safeUser.avatar || safeUser.name?.slice(0, 1).toUpperCase() || "U"}
              </div>
              <div className="hidden text-sm lg:block">
                <p className="font-medium text-stone-800">{safeUser.name}</p>
                <p className="text-xs text-stone-500">{safeUser.email}</p>
              </div>
            </button>

            {menuOpen && (
              <div className="absolute right-0 top-full mt-3 w-56 overflow-hidden rounded-2xl border border-stone-200 bg-white p-2 shadow-[0_18px_35px_rgba(12,10,9,0.10)]">
                <div className="px-3 py-2">
                  <p className="text-sm font-semibold text-stone-900">{safeUser.name}</p>
                  <p className="text-xs text-stone-500">{safeUser.email}</p>
                </div>
                <div className="mt-2 space-y-1">
                  <Link to="/dashboard" className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-100">Profile</Link>
                  <Link to="/settings" className="block rounded-xl px-3 py-2 text-sm text-stone-700 transition hover:bg-stone-100">Settings</Link>
                  <button type="button" onClick={onLogout} className="block w-full rounded-xl px-3 py-2 text-left text-sm text-stone-700 transition hover:bg-stone-100">Logout</button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
