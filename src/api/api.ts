export const API_URL = "http://localhost:5000";

export async function apiRequest(
  endpoint: string,
  method: string = "GET",
  body: any = null,
  token: string | null = null
) {
  const headers: any = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${API_URL}${endpoint}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : null,
  });

  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}
