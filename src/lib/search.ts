import Fuse from "fuse.js";
import type { IFuseOptions } from "fuse.js";
import type { Injection } from "./types";

function normalize(s: unknown) {
  return String(s ?? "")
    .normalize("NFKD")
    .replace(/\p{Diacritic}/gu, "")
    .toLowerCase();
}

const options: IFuseOptions<Injection> = {
  includeScore: true,
  threshold: 0.5,
  ignoreLocation: true,
  minMatchCharLength: 1,
  keys: [
    { name: "element", weight: 0.7 },
    { name: "action",  weight: 0.3 },
    { name: "css",     weight: 0.2 },
    { name: "tags",    weight: 0.2 },
  ],
};

export function search(data: Injection[], q?: string, template?: string) {
  let working = data;
  if (template) {
    const t = template.toLowerCase();
    working = working.filter(x => (x.template ?? "").toLowerCase() === t);
  }
  if (!q || !q.trim()) return working;

  const fuse = new Fuse(working, options);
  const result = fuse.search(q).map(r => r.item);
  if (result.length > 0) return result;

  const nq = normalize(q);
  return working.filter(x =>
    normalize(x.element).includes(nq) ||
    normalize(x.action).includes(nq) ||
    normalize(x.css).includes(nq)
  );
}

export function searchByElement(data: Injection[], q?: string, template?: string) {
  let working = data;
  if (template) {
    const t = template.toLowerCase();
    working = working.filter(x => (x.template ?? "").toLowerCase() === t);
  }
  if (!q || !q.trim()) return working;

  const nq = normalize(q);
  return working.filter(x => normalize(x.element).includes(nq));
}