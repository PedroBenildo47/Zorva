export const API_URL = process.env.EXPO_PUBLIC_API_URL as string;
export async function api(path: string, init?: RequestInit) {
  const res = await fetch(API_URL + path, { headers: { "Content-Type": "application/json", ...(init?.headers||{}) }, ...init });
  const json = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(json?.error || `Request failed: ${res.status}`);
  return json;
}