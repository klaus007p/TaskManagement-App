import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../lib/api";
import AuthLayout from "./AuthLayout";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(false);

  function update(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: "" }));
    setApiError("");
  }

  function validate() {
    const nextErrors = {};
    if (!form.name.trim()) nextErrors.name = "Name is required.";
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!form.password) nextErrors.password = "Password is required.";
    else if (form.password.length < 8) nextErrors.password = "Use at least 8 characters.";
    if (!form.confirmPassword) nextErrors.confirmPassword = "Confirm your password.";
    else if (form.confirmPassword !== form.password) nextErrors.confirmPassword = "Passwords do not match.";
    return nextErrors;
  }

  async function submit(event) {
    event.preventDefault();
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setLoading(true);
    setApiError("");

    try {
      await registerUser({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      navigate("/login");
    } catch (error) {
      setApiError(error.message || "We couldn’t create your account right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create account" subtitle="Set up your workspace and start organizing your priorities.">
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        {apiError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
            {apiError}
          </div>
        )}

        <div>
          <label htmlFor="name" className="mb-2 block text-sm font-medium text-stone-700">Name</label>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            value={form.name}
            onChange={update}
            className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 ${
              errors.name ? "border-rose-300" : "border-stone-200"
            }`}
            placeholder="Alicia Harper"
          />
          {errors.name && <p className="mt-2 text-xs text-rose-500">{errors.name}</p>}
        </div>

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update}
            className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 ${
              errors.email ? "border-rose-300" : "border-stone-200"
            }`}
            placeholder="you@example.com"
          />
          {errors.email && <p className="mt-2 text-xs text-rose-500">{errors.email}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-stone-700">Password</label>
            <button
              type="button"
              onClick={() => setShowPassword((current) => !current)}
              className="text-xs font-medium text-stone-500 transition hover:text-stone-700"
            >
              {showPassword ? "Hide" : "Show"}
            </button>
          </div>
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.password}
            onChange={update}
            className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 ${
              errors.password ? "border-rose-300" : "border-stone-200"
            }`}
            placeholder="Minimum 8 characters"
          />
          {errors.password && <p className="mt-2 text-xs text-rose-500">{errors.password}</p>}
          <ul className="mt-3 space-y-1.5 text-xs text-stone-500">
            <li>• At least 8 characters</li>
            <li>• Includes a number or symbol</li>
          </ul>
        </div>

        <div>
          <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-stone-700">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type={showPassword ? "text" : "password"}
            autoComplete="new-password"
            value={form.confirmPassword}
            onChange={update}
            className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 ${
              errors.confirmPassword ? "border-rose-300" : "border-stone-200"
            }`}
            placeholder="Re-enter your password"
          />
          {errors.confirmPassword && <p className="mt-2 text-xs text-rose-500">{errors.confirmPassword}</p>}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating account…
            </span>
          ) : (
            "Create account"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-stone-700 hover:text-stone-900">
          Sign in
        </Link>
      </p>
    </AuthLayout>
  );
}
