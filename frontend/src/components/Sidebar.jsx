import { NavLink } from "react-router-dom";

const menuItems = [
  { label: "Dashboard", path: "/dashboard" },
  { label: "My Tasks", path: "/tasks" },
  { label: "Completed", path: "/completed" },
  { label: "In Progress", path: "/important" },
];

const secondaryItems = [
  { label: "Settings", path: "/settings" },
];

function SidebarItem({ label, path, active, onClick }) {
  return (
    <NavLink
      to={path}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition ${
          isActive || active
            ? "bg-stone-900 text-white"
            : "text-stone-600 hover:bg-stone-100 hover:text-stone-900"
        }`
      }
    >
      <span>{label}</span>
    </NavLink>
  );
}

export default function Sidebar({ user, onLogout }) {
  const safeUser = user || { name: "User", email: "user@taskflow.app", avatar: "U" };

  return (
    <aside className="hidden w-72 shrink-0 border-r border-stone-200 bg-stone-50/80 p-4 lg:flex lg:flex-col">
      <div className="flex items-center gap-3 px-2 py-3">
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-900 text-sm font-semibold text-white">
          TF
        </div>
        <div>
          <p className="text-base font-semibold tracking-[-0.03em] text-stone-900">TaskFlow</p>
        </div>
      </div>

      <nav className="mt-8 space-y-1">
        {menuItems.map((item) => (
          <SidebarItem key={item.path} {...item} />
        ))}
      </nav>

      <div className="mt-auto space-y-1 border-t border-stone-200 pt-4">
        {secondaryItems.map((item) => (
          <SidebarItem key={item.path} {...item} />
        ))}

        <button
          type="button"
          onClick={onLogout}
          className="flex w-full items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium text-stone-600 transition hover:bg-stone-100 hover:text-stone-900"
        >
          <span>Logout</span>
        </button>
      </div>

      <div className="mt-4 flex items-center gap-3 rounded-2xl border border-stone-200 bg-white p-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-slate-800 text-xs font-semibold text-white">
          {safeUser.avatar || safeUser.name?.slice(0, 1).toUpperCase() || "U"}
        </div>
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-stone-900">{safeUser.name}</p>
          <p className="truncate text-xs text-stone-500">{safeUser.email}</p>
        </div>
      </div>
    </aside>
  );
}
