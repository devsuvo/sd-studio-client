export const API_URL = (process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:5000").replace(/\/+$/, "");

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

// BetterAuth JWTs live 15 minutes; reuse one for 10 so we don't fetch a token per request.
let cachedToken: { value: string; expires: number } | null = null;

export function clearTokenCache() {
  cachedToken = null;
}

async function getToken(force: boolean): Promise<string> {
  if (!force && cachedToken && cachedToken.expires > Date.now()) return cachedToken.value;
  const res = await fetch("/api/auth/token", { credentials: "include", cache: "no-store" });
  if (!res.ok) {
    cachedToken = null;
    throw new ApiError(401, "Please log in to continue.");
  }
  const { token } = (await res.json()) as { token: string };
  cachedToken = { value: token, expires: Date.now() + 10 * 60 * 1000 };
  return token;
}

interface Options {
  method?: "GET" | "POST" | "PATCH" | "DELETE";
  body?: unknown;
  auth?: boolean;
}

export async function api<T>(path: string, { method = "GET", body, auth = false }: Options = {}): Promise<T> {
  const send = async (forceToken: boolean) => {
    const headers: Record<string, string> = {};
    if (body !== undefined) headers["Content-Type"] = "application/json";
    if (auth) headers.Authorization = `Bearer ${await getToken(forceToken)}`;
    return fetch(`${API_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      cache: "no-store",
    });
  };

  let res: Response;
  try {
    res = await send(false);
    // A cached token may have been revoked; retry once with a fresh one.
    if (auth && res.status === 401) res = await send(true);
  } catch (err) {
    if (err instanceof ApiError) throw err;
    throw new ApiError(0, "Can't reach the server right now. Check your connection and try again.");
  }

  const data = await res.json().catch(() => null);
  if (!res.ok) {
    throw new ApiError(res.status, (data as { message?: string } | null)?.message ?? "Something went wrong.");
  }
  return data as T;
}
