// frontend/src/services/apiService.js

export async function fetchJobs() {
  const res = await fetch(`${import.meta.env.VITE_API_URL}/jobs`);
  if (!res.ok) throw new Error("Failed to fetch jobs");
  return await res.json();
}
