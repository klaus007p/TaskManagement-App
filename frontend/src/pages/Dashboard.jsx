import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import StatCard from "../components/StatCard";
import TaskModal from "../components/TaskModal";
import { clearAuthSession, getStoredUser, getTasks, createTask as saveTask } from "../lib/api";

const formatDate = (value) =>
  new Intl.DateTimeFormat("en", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(value));

const normalizeStatus = (status) => {
  if (status === "In-Progress" || status === "in_progress") return "In-Progress";
  if (status === "Completed" || status === "done") return "Completed";
  return "Todo";
};

const statusStyles = {
  Todo: "bg-stone-100 text-stone-700",
  "In-Progress": "bg-sky-100 text-sky-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

export default function DashboardPage() {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = getStoredUser() || { name: "User", email: "user@taskflow.app", avatar: "U" };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch {
        setError("Could not load tasks right now.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const stats = useMemo(() => {
    const total = tasks.length;
    const completed = tasks.filter((task) => normalizeStatus(task.status) === "Completed").length;
    const pending = total - completed;
    const overdue = tasks.filter(
      (task) => normalizeStatus(task.status) !== "Completed" && task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString())
    ).length;

    return { total, completed, pending, overdue };
  }, [tasks]);

  const todaysTasks = tasks.filter((task) => {
    const dueDate = task.dueDate ? new Date(task.dueDate).toISOString().slice(0, 10) : null;
    return dueDate === new Date().toISOString().slice(0, 10);
  });

  const recentTasks = [...tasks]
    .sort((a, b) => new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt))
    .slice(0, 4);

  const handleCreateTask = async (payload) => {
    try {
      const response = await saveTask({
        title: payload.title,
        description: payload.description,
        status: normalizeStatus(payload.status),
        dueDate: payload.dueDate,
      });

      setTasks((current) => [response.task, ...current]);
      setIsModalOpen(false);
      navigate("/tasks");
    } catch (err) {
      setError(err.message || "Unable to create task.");
    }
  };

  const handleLogout = () => {
    clearAuthSession();
    navigate("/login");
  };

  return (
    <Layout title="Dashboard" user={currentUser} onLogout={handleLogout}>
      <div className="space-y-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm text-stone-500">Good morning</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-stone-900">
              {currentUser.name.split(" ")[0]}, here is your day.
            </h2>
          </div>
          <div className="inline-flex items-center rounded-full border border-stone-200 bg-white px-3 py-2 text-sm text-stone-600">
            {formatDate(new Date())}
          </div>
        </div>

        {error && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
            {error}
          </div>
        )}

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Total tasks" value={loading ? "..." : stats.total} hint="All" tone="neutral" />
          <StatCard label="Completed" value={loading ? "..." : stats.completed} hint="Done" tone="green" />
          <StatCard label="Pending" value={loading ? "..." : stats.pending} hint="Open" tone="blue" />
          <StatCard label="Overdue" value={loading ? "..." : stats.overdue} hint="Action" tone="red" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(12,10,9,0.03)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">Today</p>
                <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-stone-900">Today&apos;s tasks</h3>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(true)}
                className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-3.5 py-2 text-sm font-medium text-white transition hover:bg-slate-800"
              >
                Quick add
              </button>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-5 text-sm text-stone-500">
                  Loading tasks…
                </div>
              ) : todaysTasks.length === 0 ? (
                <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-5 text-sm text-stone-500">
                  Nothing scheduled today. Add a task to keep momentum going.
                </div>
              ) : (
                todaysTasks.map((task) => (
                  <button
                    key={task._id || task.id}
                    type="button"
                    onClick={() => navigate(`/tasks/${task._id || task.id}`)}
                    className="flex w-full items-center justify-between gap-4 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-left transition hover:border-stone-300 hover:bg-white"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-stone-900">{task.title}</p>
                      <p className="mt-1 text-xs text-stone-500">{task.description}</p>
                    </div>
                    <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[normalizeStatus(task.status)]}`}>
                      {normalizeStatus(task.status)}
                    </span>
                  </button>
                ))
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_1px_2px_rgba(12,10,9,0.03)]">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">Overview</p>
              <h3 className="mt-2 text-xl font-semibold tracking-[-0.04em] text-stone-900">Recent tasks</h3>
            </div>

            <div className="mt-5 space-y-3">
              {loading ? (
                <div className="rounded-xl border border-dashed border-stone-200 bg-stone-50 p-5 text-sm text-stone-500">
                  Loading recent activity…
                </div>
              ) : recentTasks.map((task) => (
                <button
                  key={task._id || task.id}
                  type="button"
                  onClick={() => navigate(`/tasks/${task._id || task.id}`)}
                  className="flex w-full items-center justify-between gap-3 rounded-2xl border border-stone-200 bg-stone-50 p-3 text-left transition hover:border-stone-300 hover:bg-white"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-medium text-stone-900">{task.title}</p>
                    <p className="mt-1 text-xs text-stone-500">Updated {formatDate(task.updatedAt || task.createdAt)}</p>
                  </div>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${statusStyles[normalizeStatus(task.status)]}`}>
                    {normalizeStatus(task.status)}
                  </span>
                </button>
              ))}
            </div>
          </section>
        </div>
      </div>

      <TaskModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSubmit={handleCreateTask} />
    </Layout>
  );
}
