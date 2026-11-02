"use client";

import { useCallback, useEffect, useState } from "react";
import { api } from "@/lib/api";

/** Loads `path` from the API and re-runs whenever it changes. Pass null to skip. */
export function useFetch<T>(path: string | null, options: { auth?: boolean } = {}) {
  const { auth = false } = options;
  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(path !== null);
  const [version, setVersion] = useState(0);

  useEffect(() => {
    if (path === null) return;
    let active = true;
    setLoading(true);
    setError(null);
    api<T>(path, { auth })
      .then((d) => active && setData(d))
      .catch((e: Error) => active && setError(e.message))
      .finally(() => active && setLoading(false));
    return () => {
      active = false;
    };
  }, [path, auth, version]);

  const reload = useCallback(() => setVersion((v) => v + 1), []);

  return { data, setData, error, loading, reload };
}
