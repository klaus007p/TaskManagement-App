import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EmptyState from "../components/EmptyState";
import { getStoredUser, getTasks, updateTask as patchTask } from "../lib/api";

const normalizeStatus = (status) => {
  if (status === "In-Progress" || status === "in_progress") return "In-Progress";
  if (status === "Completed" || status === "done") return "Completed";
  return "Todo";
};

const formatDate = (value) => {
  if (!value) return "No due date";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
};

export default function CompletedPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const currentUser = getStoredUser() || { name: "User", email: "user@taskflow.app", avatar: "U" };

  useEffect(() => {
    const loadTasks = async () => {
      try {
        setLoading(true);
        const allTasks = await getTasks();
        setTasks(allTasks.filter((task) => normalizeStatus(task.status) === "Completed"));
      } catch (err) {
        setError(err.message || "Unable to load completed tasks.");
      } finally {
        setLoading(false);
      }
    };

    loadTasks();
  }, []);

  const restoreTask = async (taskId) => {
    try {
      const result = await patchTask(taskId, { status: "Todo" });
      setTasks((current) => current.filter((task) => (task._id || task.id) !== taskId));
      if (result.task) {
        navigate("/tasks");
      }
    } catch (err) {
      setError(err.message || "Unable to restore task.");
    }
  };

  return (
    <Layout title="Completed" user={currentUser} onLogout={() => navigate("/login")}>
      <div className="space-y-5">
        <div>
          <p className="text-sm text-stone-500">Completed work</p>
          <h2 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Finished tasks</h2>
        </div>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        {loading ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-6 text-sm text-stone-500">Loading completed tasks…</div>
        ) : tasks.length === 0 ? (
          <EmptyState
            title="No completed tasks yet"
            description="When you finish a task, it will appear here so you can review it later."
            actionLabel="View tasks"
            onAction={() => navigate("/tasks")}
          />
        ) : (
          <div className="space-y-3">
            {tasks.map((task) => (
              <div key={task._id || task.id} className="rounded-2xl border border-stone-200 bg-white p-4">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-lg font-semibold tracking-[-0.03em] text-stone-900">{task.title}</p>
                    <div className="mt-2 flex flex-wrap gap-3 text-xs text-stone-500">
                      <span>Completed {formatDate(task.completedAt || task.updatedAt)}</span>
                      <span>Due {formatDate(task.dueDate)}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button type="button" onClick={() => restoreTask(task._id || task.id)} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700">Restore</button>
                    <button type="button" onClick={() => navigate(`/tasks/${task._id || task.id}`)} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700">Open</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
