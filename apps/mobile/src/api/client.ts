import AsyncStorage from "@react-native-async-storage/async-storage";

// Point this at your deployed API. For local dev with Expo Go on a physical
// device, replace localhost with your machine's LAN IP.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? "http://localhost:4000";

const TOKEN_KEY = "nexserv.token";

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY);
}

export async function setToken(token: string | null): Promise<void> {
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
  }
}

export async function apiRequest<T>(path: string, options: { method?: string; body?: unknown } = {}): Promise<T> {
  const token = await getToken();
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  if (!res.ok) {
    const payload = await res.json().catch(() => ({ error: res.statusText }));
    throw new ApiError(res.status, payload.error ?? "Request failed");
  }
  if (res.status === 204) return undefined as T;
  return res.json();
}
