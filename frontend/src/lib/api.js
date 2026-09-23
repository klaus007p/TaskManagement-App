const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:3000/api").replace(/\/$/, "");

export const getToken = () => localStorage.getItem("taskflow_token");

export const setAuthSession = ({ token, user }) => {
  if (token) {
    localStorage.setItem("taskflow_token", token);
  }
  if (user) {
    localStorage.setItem("taskflow_user", JSON.stringify(user));
  }
};

export const clearAuthSession = () => {
  localStorage.removeItem("taskflow_token");
  localStorage.removeItem("taskflow_user");
};

export const getStoredUser = () => {
  const raw = localStorage.getItem("taskflow_user");
  if (!raw) return null;

  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const apiRequest = async (endpoint, options = {}) => {
  const token = getToken();

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let payload = null;

  if (text) {
    try {
      payload = JSON.parse(text);
    } catch {
      payload = { message: text };
    }
  }

  if (!response.ok) {
    throw new Error(payload?.message || payload?.error || "Request failed");
  }

  return payload;
};

export const loginUser = async ({ email, password }) =>
  apiRequest("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

export const registerUser = async ({ name, email, password }) => {
  const safeUserName = `${(name || email).toLowerCase().replace(/\s+/g, "").replace(/[^a-z0-9]/g, "") || "user"}`;

  return apiRequest("/auth/register", {
    method: "POST",
    body: JSON.stringify({
      name,
      email,
      userName: safeUserName,
      password,
    }),
  });
};

export const getMe = async () => apiRequest("/auth/me");

export const getTasks = async () => {
  const result = await apiRequest("/tasks");
  return result.tasks || [];
};

export const createTask = async (payload) => apiRequest("/tasks", {
  method: "POST",
  body: JSON.stringify(payload),
});

export const updateTask = async (id, payload) => apiRequest(`/tasks/${id}`, {
  method: "PATCH",
  body: JSON.stringify(payload),
});

export const deleteTask = async (id) => apiRequest(`/tasks/${id}`, {
  method: "DELETE",
});

export const getTaskById = async (id) => {
  const result = await apiRequest(`/tasks/${id}`);
  return result.task;
};
