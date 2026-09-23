import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import { getStoredUser } from "../lib/api";

export default function SettingsPage() {
  const navigate = useNavigate();
  const currentUser = getStoredUser() || { name: "User", email: "user@taskflow.app", avatar: "U" };

  return (
    <Layout title="Settings" user={currentUser} onLogout={() => navigate("/login")}>
      <div className="mx-auto max-w-4xl space-y-6">
        <div>
          <p className="text-sm text-stone-500">Account</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Profile settings</h2>
        </div>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.04em] text-stone-900">Profile</h3>
          <div className="mt-5 flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-800 text-lg font-semibold text-white">
              {currentUser.avatar || currentUser.name?.slice(0, 1).toUpperCase() || "U"}
            </div>
            <div>
              <p className="text-lg font-medium text-stone-900">{currentUser.name}</p>
              <p className="text-sm text-stone-500">{currentUser.email}</p>
            </div>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Name</label>
              <input readOnly value={currentUser.name || ""} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none" />
            </div>
            <div>
              <label className="mb-2 block text-sm font-medium text-stone-700">Email</label>
              <input readOnly value={currentUser.email || ""} className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none" />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-stone-200 bg-white p-5">
          <h3 className="text-xl font-semibold tracking-[-0.04em] text-stone-900">Account</h3>
          <div className="mt-5 space-y-3">
            <div className="flex items-center justify-between rounded-xl border border-stone-200 bg-stone-50 px-4 py-3">
              <span className="text-sm text-stone-700">Account status</span>
              <span className="text-xs text-stone-500">Verified</span>
            </div>
            <button
              type="button"
              onClick={() => navigate("/login")}
              className="w-full rounded-xl border border-stone-200 bg-white px-4 py-3 text-left text-sm font-medium text-stone-700 transition hover:border-stone-300"
            >
              Logout
            </button>
          </div>
        </section>
      </div>
    </Layout>
  );
}
