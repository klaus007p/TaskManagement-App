import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import TaskModal from "../components/TaskModal";
import { deleteTask as removeTaskApi, getStoredUser, getTaskById, updateTask as patchTask } from "../lib/api";

const statusStyles = {
  Todo: "bg-stone-100 text-stone-700",
  "In-Progress": "bg-sky-100 text-sky-700",
  Completed: "bg-emerald-100 text-emerald-700",
};

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

export default function TaskDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const currentUser = getStoredUser() || { name: "User", email: "user@taskflow.app", avatar: "U" };

  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const result = await getTaskById(id);
        setTask(result);
      } catch (err) {
        setError(err.message || "Task not found.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchTask();
  }, [id]);

  const handleSave = async (payload) => {
    try {
      const result = await patchTask(id, {
        title: payload.title,
        description: payload.description,
        status: normalizeStatus(payload.status),
        dueDate: payload.dueDate,
      });
      setTask(result.task);
      setModalOpen(false);
    } catch (err) {
      setError(err.message || "Unable to update task.");
    }
  };

  const toggleComplete = async () => {
    if (!task) return;
    try {
      const nextStatus = normalizeStatus(task.status) === "Completed" ? "Todo" : "Completed";
      const result = await patchTask(id, { status: nextStatus });
      setTask(result.task);
    } catch (err) {
      setError(err.message || "Unable to update task status.");
    }
  };

  const handleDelete = async () => {
    try {
      await removeTaskApi(id);
      navigate("/tasks");
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    }
  };

  if (loading) {
    return (
      <Layout title="Task Details" user={currentUser} onLogout={() => navigate("/login")}>
        <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-8 text-center text-stone-500">
          Loading task…
        </div>
      </Layout>
    );
  }

  if (!task || error) {
    return (
      <Layout title="Task not found" user={currentUser} onLogout={() => navigate("/login")}>
        <div className="rounded-2xl border border-stone-200 bg-white p-8 text-center">
          <p className="text-lg font-semibold text-stone-900">Task not found</p>
          <Link to="/tasks" className="mt-4 inline-flex items-center rounded-xl bg-slate-900 px-4 py-2 text-sm font-medium text-white">
            Back to tasks
          </Link>
        </div>
      </Layout>
    );
  }

  const statusValue = normalizeStatus(task.status);

  return (
    <Layout title="Task Details" user={currentUser} onLogout={() => navigate("/login")}>
      <div className="mx-auto max-w-4xl space-y-5">
        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div className="flex flex-col gap-4 rounded-2xl border border-stone-200 bg-white p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/tasks" className="text-sm text-stone-500 transition hover:text-stone-700">← Back to tasks</Link>
            <h2 className="mt-3 text-3xl font-semibold tracking-[-0.05em] text-stone-900">{task.title}</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={() => setModalOpen(true)} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-300">Edit</button>
            <button type="button" onClick={toggleComplete} className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-300">
              {statusValue === "Completed" ? "Reopen" : "Complete"}
            </button>
            <button type="button" onClick={handleDelete} className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100">Delete</button>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.5fr_0.9fr]">
          <section className="rounded-2xl border border-stone-200 bg-white p-5">
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">Description</p>
            <p className="mt-3 text-sm leading-7 text-stone-600">{task.description || "No description provided."}</p>
          </section>

          <aside className="space-y-4 rounded-2xl border border-stone-200 bg-white p-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">Status</p>
              <div className="mt-2">
                <span className={`rounded-full px-2 py-1 text-xs font-semibold ${statusStyles[statusValue]}`}>{statusValue}</span>
              </div>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">Due date</p>
              <p className="mt-2 text-sm font-medium text-stone-700">{formatDate(task.dueDate)}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">Created</p>
              <p className="mt-2 text-sm text-stone-600">{formatDate(task.createdAt)}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">Updated</p>
              <p className="mt-2 text-sm text-stone-600">{formatDate(task.updatedAt)}</p>
            </div>
          </aside>
        </div>
      </div>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialData={task} onSubmit={handleSave} />
    </Layout>
  );
}
