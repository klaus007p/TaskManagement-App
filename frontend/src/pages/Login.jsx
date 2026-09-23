import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { loginUser } from "../lib/api";
import AuthLayout from "./AuthLayout";

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [form, setForm] = useState({ email: "", password: "" });
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
    if (!form.email.trim()) nextErrors.email = "Email is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) nextErrors.email = "Enter a valid email address.";
    if (!form.password) nextErrors.password = "Password is required.";
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
      const result = await loginUser({ email: form.email, password: form.password });
      login({ token: result.token, user: result.user });
      navigate("/dashboard");
    } catch (error) {
      setApiError(error.message || "We couldn’t sign you in right now. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome back" subtitle="Sign in to continue managing your work with clarity.">
      <form onSubmit={submit} noValidate className="mt-8 space-y-5">
        {apiError && (
          <div className="rounded-xl border border-rose-200 bg-rose-50 px-3.5 py-3 text-sm text-rose-700">
            {apiError}
          </div>
        )}

        <div>
          <label htmlFor="email" className="mb-2 block text-sm font-medium text-stone-700">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            value={form.email}
            onChange={update}
            placeholder="you@example.com"
            className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 ${
              errors.email ? "border-rose-300" : "border-stone-200"
            }`}
          />
          {errors.email && <p className="mt-2 text-xs text-rose-500">{errors.email}</p>}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <label htmlFor="password" className="text-sm font-medium text-stone-700">
              Password
            </label>
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
            autoComplete="current-password"
            value={form.password}
            onChange={update}
            placeholder="••••••••"
            className={`w-full rounded-xl border bg-stone-50 px-3.5 py-2.5 text-sm text-stone-900 outline-none transition placeholder:text-stone-400 focus:border-stone-400 ${
              errors.password ? "border-rose-300" : "border-stone-200"
            }`}
          />
          {errors.password && <p className="mt-2 text-xs text-rose-500">{errors.password}</p>}
        </div>

        <div className="flex items-center justify-between text-sm">
          <label className="flex items-center gap-2 text-stone-600">
            <input type="checkbox" className="h-4 w-4 rounded border-stone-300 text-slate-900 focus:ring-slate-500" />
            Remember me
          </label>
          <button type="button" className="font-medium text-stone-600 transition hover:text-stone-900">
            Forgot password?
          </button>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center rounded-xl bg-slate-900 px-4 py-3 text-sm font-medium text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? (
            <span className="inline-flex items-center gap-2">
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Signing in…
            </span>
          ) : (
            "Sign in"
          )}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-stone-500">
        Need an account?{" "}
        <Link to="/register" className="font-medium text-stone-700 hover:text-stone-900">
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
}
