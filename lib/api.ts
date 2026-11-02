/**
 * All API calls go to the same-origin "/backend" path, which next.config.ts forwards to the Express API.
 * Being same-origin means the browser sends the HttpOnly `ss_token` JWT cookie automatically,
 * and client code never touches the token.
 */
const BASE = "/backend";

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
  }
}

/** Removes the JWT cookie (logout, or before another account signs in). */
export async function clearTokenCache() {
  await fetch("/api/session-token", { method: "DELETE" }).catch(() => undefined);
}

let refreshing: Promise<boolean> | null = null;

/** Asks the Next server to mint a fresh JWT cookie from the current BetterAuth session. */
function refreshTokenCookie(): Promise<boolean> {
  // Share one refresh between requests that fail at the same moment.
  refreshing ??= fetch("/api/session-token", { method: "POST", cache: "no-store" })
    .then((r) => r.ok)
    .catch(() => false)
    .finally(() => {
      refreshing = null;
    });
  return refreshing;
}

interface Options {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  body?: unknown;
  /** Marks calls to protected routes: on 401 we refresh the cookie once and retry. */
  auth?: boolean;
}

export async function api<T>(path: string, { method = "GET", body, auth = false }: Options = {}): Promise<T> {
  const send = () =>
    fetch(`${BASE}${path.replace(/^\/api/, "")}`, {
      method,
      headers: body !== undefined ? { "Content-Type": "application/json" } : undefined,
      body: body !== undefined ? JSON.stringify(body) : undefined,
      credentials: "same-origin",
      cache: "no-store",
    });

  let res: Response;
  try {
    res = await send();
    if (auth && res.status === 401) {
      // No cookie yet, or it expired: mint a new one from the session and try again.
      if (!(await refreshTokenCookie())) throw new ApiError(401, "Please log in to continue.");
      res = await send();
    }
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
