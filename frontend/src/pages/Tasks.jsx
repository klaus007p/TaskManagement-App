import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import EmptyState from "../components/EmptyState";
import TaskModal from "../components/TaskModal";
import { createTask as saveTask, deleteTask as removeTaskApi, getStoredUser, getTasks, updateTask as patchTask } from "../lib/api";

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

export default function TasksPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filters, setFilters] = useState({
    search: "",
    status: "all",
    dueDate: "all",
    sort: "newest",
  });
  const [selectedTask, setSelectedTask] = useState(null);
  const currentUser = getStoredUser() || { name: "User", email: "user@taskflow.app", avatar: "U" };

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const data = await getTasks();
        setTasks(data);
      } catch (err) {
        setError(err.message || "Unable to load tasks.");
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, []);

  const filteredTasks = useMemo(() => {
    const query = filters.search.trim().toLowerCase();

    return [...tasks]
      .filter((task) => {
        const normalizedStatus = normalizeStatus(task.status);
        const title = (task.title || "").toLowerCase();
        const description = (task.description || "").toLowerCase();
        const matchesSearch = !query || title.includes(query) || description.includes(query);
        const matchesStatus = filters.status === "all" || normalizedStatus === filters.status;
        const matchesDueDate =
          filters.dueDate === "all" ||
          (filters.dueDate === "today" && task.dueDate && new Date(task.dueDate).toDateString() === new Date().toDateString()) ||
          (filters.dueDate === "overdue" && normalizedStatus !== "Completed" && task.dueDate && new Date(task.dueDate) < new Date(new Date().toDateString()));

        return matchesSearch && matchesStatus && matchesDueDate;
      })
      .sort((a, b) => {
        if (filters.sort === "due_soon") {
          return new Date(a.dueDate || Date.now()) - new Date(b.dueDate || Date.now());
        }
        return new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt);
      });
  }, [tasks, filters]);

  const openCreateModal = () => {
    setSelectedTask(null);
    setModalOpen(true);
  };

  const openEditModal = (task) => {
    setSelectedTask(task);
    setModalOpen(true);
  };

  const handleSubmit = async (payload) => {
    try {
      if (selectedTask) {
        const result = await patchTask(selectedTask._id || selectedTask.id, {
          title: payload.title,
          description: payload.description,
          status: normalizeStatus(payload.status),
          dueDate: payload.dueDate,
        });

        setTasks((current) =>
          current.map((task) => ((task._id || task.id) === (result.task._id || result.task.id) ? result.task : task))
        );
      } else {
        const result = await saveTask({
          title: payload.title,
          description: payload.description,
          status: normalizeStatus(payload.status),
          dueDate: payload.dueDate,
        });
        setTasks((current) => [result.task, ...current]);
      }

      setModalOpen(false);
      setSelectedTask(null);
      setError("");
    } catch (err) {
      setError(err.message || "Unable to save task.");
    }
  };

  const toggleComplete = async (taskId) => {
    try {
      const task = tasks.find((item) => (item._id || item.id) === taskId);
      if (!task) return;

      const nextStatus = normalizeStatus(task.status) === "Completed" ? "Todo" : "Completed";
      const result = await patchTask(taskId, { status: nextStatus });
      setTasks((current) =>
        current.map((item) => ((item._id || item.id) === taskId ? result.task : item))
      );
    } catch (err) {
      setError(err.message || "Unable to update task status.");
    }
  };

  const removeTask = async (taskId) => {
    try {
      await removeTaskApi(taskId);
      setTasks((current) => current.filter((task) => (task._id || task.id) !== taskId));
    } catch (err) {
      setError(err.message || "Unable to delete task.");
    }
  };

  return (
    <Layout title="My Tasks" user={currentUser} onLogout={() => navigate("/login")}>
      <div className="space-y-5">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm text-stone-500">Task list</p>
            <h2 className="mt-1 text-3xl font-semibold tracking-[-0.05em] text-stone-900">Everything in one place</h2>
          </div>
          <button
            type="button"
            onClick={openCreateModal}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800"
          >
            + Create task
          </button>
        </div>

        {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

        <div className="rounded-2xl border border-stone-200 bg-white p-4">
          <div className="grid gap-3 md:grid-cols-[1.3fr_repeat(2,minmax(0,1fr))]">
            <div className="relative">
              <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-stone-400">⌕</span>
              <input
                type="search"
                value={filters.search}
                onChange={(event) => setFilters((current) => ({ ...current, search: event.target.value }))}
                placeholder="Search tasks"
                className="w-full rounded-xl border border-stone-200 bg-stone-50 py-2.5 pl-9 pr-3 text-sm text-stone-700 outline-none transition focus:border-stone-300"
              />
            </div>

            <select
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-300"
            >
              <option value="all">All statuses</option>
              <option value="Todo">To do</option>
              <option value="In-Progress">In progress</option>
              <option value="Completed">Completed</option>
            </select>

            <select
              value={filters.sort}
              onChange={(event) => setFilters((current) => ({ ...current, sort: event.target.value }))}
              className="rounded-xl border border-stone-200 bg-stone-50 px-3 py-2.5 text-sm text-stone-700 outline-none focus:border-stone-300"
            >
              <option value="newest">Newest</option>
              <option value="due_soon">Due soon</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="rounded-2xl border border-dashed border-stone-200 bg-stone-50 p-6 text-sm text-stone-500">Loading tasks…</div>
        ) : filteredTasks.length === 0 ? (
          <EmptyState
            title="No tasks match your search"
            description="Try a different keyword or reset the filters to see more work items."
            actionLabel="Clear filters"
            onAction={() => setFilters({ search: "", status: "all", dueDate: "all", sort: "newest" })}
          />
        ) : (
          <div className="space-y-3">
            {filteredTasks.map((task) => {
              const statusValue = normalizeStatus(task.status);
              const taskId = task._id || task.id;

              return (
                <div key={taskId} className="rounded-2xl border border-stone-200 bg-white p-4 shadow-[0_1px_2px_rgba(12,10,9,0.03)] transition hover:border-stone-300">
                  <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <Link to={`/tasks/${taskId}`} className="text-lg font-semibold tracking-[-0.03em] text-stone-900 transition hover:text-stone-700">
                          {task.title}
                        </Link>
                        <span className={`rounded-full px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.08em] ${statusStyles[statusValue]}`}>
                          {statusValue}
                        </span>
                      </div>

                      <p className="mt-2 line-clamp-2 text-sm leading-6 text-stone-600">{task.description}</p>

                      <div className="mt-3 flex flex-wrap gap-3 text-xs text-stone-500">
                        <span>Due {formatDate(task.dueDate)}</span>
                        <span>{task.project || "General"}</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleComplete(taskId)}
                        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                      >
                        {statusValue === "Completed" ? "Reopen" : "Complete"}
                      </button>
                      <button
                        type="button"
                        onClick={() => openEditModal(task)}
                        className="rounded-xl border border-stone-200 bg-white px-3 py-2 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        onClick={() => removeTask(taskId)}
                        className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-medium text-rose-700 transition hover:bg-rose-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <TaskModal isOpen={modalOpen} onClose={() => setModalOpen(false)} initialData={selectedTask} onSubmit={handleSubmit} />
    </Layout>
  );
}
