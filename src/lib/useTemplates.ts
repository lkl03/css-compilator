"use client";

import { useEffect, useState } from "react";

const ORDER = ["GLOBAL", "Masterpiece", "Producer"];

export function useTemplates() {
  const [templates, setTemplates] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    let cancelled = false;

    async function run() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch("/api/injections?distinct=template", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = (await res.json()) as string[];

        const sorted = ORDER.filter(t => data.includes(t));
        if (!cancelled) setTemplates(sorted);
      } catch (e) {
        if (!cancelled) {
          setError(e);
          setTemplates(ORDER);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    run();
    return () => { cancelled = true; };
  }, []);

  return { templates, loading, error };
}
