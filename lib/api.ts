const BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

let tokenCache: { token: string; expires: number } | null = null;

export function clearToken() {
  tokenCache = null;
}

// The Next.js app signs a short-lived JWT for the logged-in user (/api/token).
// The Express server verifies it with the same secret.
async function getToken(force = false): Promise<string> {
  if (!force && tokenCache && tokenCache.expires > Date.now()) return tokenCache.token;
  const res = await fetch("/api/token", { cache: "no-store" });
  if (!res.ok) throw new ApiError("Please log in again", 401);
  const data = (await res.json()) as { token: string };
  tokenCache = { token: data.token, expires: Date.now() + 50 * 60 * 1000 };
  return data.token;
}

type Query = Record<string, string | number | boolean | undefined | null>;

interface Options {
  method?: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
  query?: Query;
}

function buildQuery(query?: Query) {
  if (!query) return "";
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(query)) {
    if (value === undefined || value === null || value === "") continue;
    params.set(key, String(value));
  }
  const qs = params.toString();
  return qs ? `?${qs}` : "";
}

export async function api<T>(path: string, opts: Options = {}): Promise<T> {
  const { method = "GET", body, auth = true, query } = opts;
  const url = `${BASE}${path}${buildQuery(query)}`;

  const run = async (forceToken: boolean) => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) headers.Authorization = `Bearer ${await getToken(forceToken)}`;
    return fetch(url, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    });
  };

  const unreachable = new ApiError(
    "Cannot reach the server. It may be waking up, please try again in a moment.",
    0
  );

  let res: Response;
  try {
    res = await run(false);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw unreachable;
  }

  if (res.status === 401 && auth) {
    clearToken();
    try {
      res = await run(true);
    } catch (err) {
      if (err instanceof ApiError) throw err;
      throw unreachable;
    }
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError((data && data.message) || "Something went wrong", res.status);
  }
  return data as T;
}

export function errorMessage(err: unknown): string {
  return err instanceof Error ? err.message : "Something went wrong";
}
