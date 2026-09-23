import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EmptyState from "../components/EmptyState";
import { getStoredUser, getTasks } from "../lib/api";

const formatDate = (value) => {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default function SearchPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = getStoredUser() || { name: "User", email: "user@taskflow.app", avatar: "U" };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const allTasks = await getTasks();
        setTasks(allTasks);
      } catch (err) {
        setError(err.message || "Unable to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const results = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return [];

    return tasks.filter(
      (task) =>
        (task.title || "").toLowerCase().includes(search) || (task.description || "").toLowerCase().includes(search)
    );
  }, [tasks, query]);

  return (
    <Layout title="Search" user={currentUser} onLogout={() => navigate("/login")}>
      <div className="mx-auto max-w-4xl space-y-5">
        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <label htmlFor="global-search" className="mb-2 block text-sm font-medium text-stone-700">Search tasks</label>
          <input
            id="global-search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search by title or description"
            className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-3 text-sm text-stone-900 outline-none focus:border-stone-400"
          />
        </div>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        {loading ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-6 text-sm text-stone-500">Loading tasks…</div>
        ) : query.trim() === "" ? (
          <EmptyState
            title="Search your tasks"
            description="Use keywords from the task title or description to find relevant work quickly."
            actionLabel="Browse tasks"
            onAction={() => navigate("/tasks")}
          />
        ) : results.length === 0 ? (
          <EmptyState
            title="No results found"
            description="Try a different keyword or check whether the task title contains the phrase you’re looking for."
            actionLabel="Clear search"
            onAction={() => setQuery("")}
          />
        ) : (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-stone-500">{results.length} result{results.length === 1 ? "" : "s"}</p>
            </div>

            {results.map((task) => (
              <Link
                key={task._id || task.id}
                to={`/tasks/${task._id || task.id}`}
                className="block rounded-2xl border border-stone-200 bg-white p-4 transition hover:border-stone-300"
              >
                <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                  <div className="min-w-0">
                    <p className="text-base font-semibold tracking-[-0.03em] text-stone-900">{task.title}</p>
                    <p className="mt-1 line-clamp-2 text-sm leading-6 text-stone-600">{task.description}</p>
                  </div>
                  <div className="text-xs text-stone-500">Due {formatDate(task.dueDate)}</div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
