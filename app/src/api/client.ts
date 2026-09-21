// Expo inlines any EXPO_PUBLIC_* variable at build time (see app/.env.example).
// Defaults to localhost, which only works for the web target or a simulator
// on the same machine as the backend — a physical phone in Expo Go needs
// the dev machine's LAN IP here instead.
export const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly cause?: unknown,
    // The HTTP status, when there was a response at all — absent when the
    // request never reached the server. Lets a caller tell "you typed the
    // wrong thing" apart from "the backend is down".
    public readonly status?: number,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

async function readErrorMessage(response: Response): Promise<string | null> {
  try {
    const body = (await response.clone().json()) as { message?: string | string[] };
    if (Array.isArray(body.message)) return body.message[0] ?? null;
    return body.message ?? null;
  } catch {
    return null;
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
      throw new ApiError("We couldn't find that.", undefined, 404);
    }
    const serverMessage = await readErrorMessage(response);
    throw new ApiError(
      serverMessage ?? 'Something went wrong. Please try again.',
      undefined,
      response.status,
    );
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

// No Content-Type header here — fetch sets the multipart boundary itself
// when the body is a FormData instance.
export function apiPostForm<T>(path: string, formData: FormData): Promise<T> {
  return request<T>(path, { method: 'POST', body: formData });
}
