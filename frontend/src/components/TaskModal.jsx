import { useEffect, useState } from "react";

const emptyForm = {
  title: "",
  description: "",
  status: "Todo",
  dueDate: "",
};

const normalizeStatus = (value) => {
  if (!value) return "Todo";
  if (value === "todo") return "Todo";
  if (value === "in_progress" || value === "In-Progress") return "In-Progress";
  if (value === "done" || value === "Completed") return "Completed";
  return value;
};

export default function TaskModal({ isOpen, onClose, onSubmit, initialData = null }) {
  const [form, setForm] = useState(emptyForm);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    if (initialData) {
      setForm({
        title: initialData.title || "",
        description: initialData.description || "",
        status: normalizeStatus(initialData.status),
        dueDate: initialData.dueDate ? new Date(initialData.dueDate).toISOString().slice(0, 10) : "",
      });
    } else {
      setForm(emptyForm);
    }

    setErrors({});
    setLoading(false);
  }, [isOpen, initialData]);

  if (!isOpen) return null;

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!form.title.trim()) nextErrors.title = "Task title is required.";
    if (!form.description.trim()) nextErrors.description = "Provide a short description.";
    if (!form.dueDate) nextErrors.dueDate = "Choose a due date.";

    return nextErrors;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const nextErrors = validate();

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    await onSubmit({
      ...form,
      status: normalizeStatus(form.status),
    });
    setLoading(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/40 px-4 backdrop-blur-[2px]">
      <div className="w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-5 shadow-[0_20px_45px_rgba(12,10,9,0.12)]">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.14em] text-stone-500">
              {initialData ? "Edit task" : "New task"}
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-[-0.04em] text-stone-900">
              {initialData ? "Update task details" : "Create a new task"}
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-stone-200 text-stone-500 transition hover:border-stone-300 hover:text-stone-700"
            aria-label="Close task form"
          >
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label htmlFor="task-title" className="mb-2 block text-sm font-medium text-stone-700">
              Title
            </label>
            <input
              id="task-title"
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Finish client presentation"
              className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 ${
                errors.title ? "border-rose-300" : "border-stone-200"
              }`}
            />
            {errors.title && <p className="mt-2 text-xs text-rose-500">{errors.title}</p>}
          </div>

          <div>
            <label htmlFor="task-description" className="mb-2 block text-sm font-medium text-stone-700">
              Description
            </label>
            <textarea
              id="task-description"
              name="description"
              value={form.description}
              onChange={handleChange}
              rows={4}
              placeholder="Add context, next steps, and any dependencies."
              className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 ${
                errors.description ? "border-rose-300" : "border-stone-200"
              }`}
            />
            {errors.description && <p className="mt-2 text-xs text-rose-500">{errors.description}</p>}
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="task-status" className="mb-2 block text-sm font-medium text-stone-700">
                Status
              </label>
              <select
                id="task-status"
                name="status"
                value={form.status}
                onChange={handleChange}
                className="w-full rounded-xl border border-stone-200 bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition focus:border-stone-400"
              >
                <option value="Todo">Todo</option>
                <option value="In-Progress">In Progress</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div>
              <label htmlFor="task-due-date" className="mb-2 block text-sm font-medium text-stone-700">
                Due date
              </label>
              <input
                id="task-due-date"
                name="dueDate"
                type="date"
                value={form.dueDate}
                onChange={handleChange}
                className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition ${
                  errors.dueDate ? "border-rose-300" : "border-stone-200"
                }`}
              />
              {errors.dueDate && <p className="mt-2 text-xs text-rose-500">{errors.dueDate}</p>}
            </div>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-stone-200 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-stone-200 bg-white px-4 py-2.5 text-sm font-medium text-stone-700 transition hover:border-stone-300 hover:bg-stone-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (initialData ? "Saving…" : "Creating…") : initialData ? "Save changes" : "Create task"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
