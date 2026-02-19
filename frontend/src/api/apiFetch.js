const API_URL = "http://127.0.0.1:8000/api";

export async function apiFetch(endpoint, options = {}) {
  const token = localStorage.getItem("token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  if (!response.ok) {
    let errorMessage = "API Error";

    try {
      const errorData = await response.json();
      errorMessage = errorData.message || errorMessage;
    } catch {}

    throw new Error(errorMessage);
  }

  return response.json();
}
