// Expo inlines any EXPO_PUBLIC_* variable at build time (see app/.env.example).
// Defaults to localhost, which only works for the web target or a simulator
// on the same machine as the backend — a physical phone in Expo Go needs
// the dev machine's LAN IP here instead.
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  let response: Response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, init);
  } catch (error) {
    throw new ApiError("Couldn't reach the server. Check your connection.", error);
  }

  if (!response.ok) {
    if (response.status === 404) {
      throw new ApiError("We couldn't find that.");
    }
    throw new ApiError('Something went wrong. Please try again.');
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string): Promise<T> {
  return request<T>(path);
}

export function apiPost<T>(path: string, body?: unknown): Promise<T> {
  return request<T>(path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
  });
}
