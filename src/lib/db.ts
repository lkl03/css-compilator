import path from "node:path";
import { promises as fs } from "node:fs";
import type { Injection } from "./types";

const DATA_DIR = path.join(process.cwd(), "data");

async function readIfExists(relPaths: string[]): Promise<Injection[]> {
  for (const rel of relPaths) {
    try {
      const p = path.join(DATA_DIR, rel);
      const raw = await fs.readFile(p, "utf8");
      const json = JSON.parse(raw);
      if (Array.isArray(json)) return json as Injection[];
    } catch {
      // try next candidate
    }
  }
  return [];
}

export async function readAll(template?: string): Promise<Injection[]> {
  // 👇 importante: contemplar ambos nombres
  const globalDB     = await readIfExists(["global.json", "globals.json"]);
  const masterDB     = await readIfExists(["masterpiece.json"]);
  const producerDB   = await readIfExists(["producer.json"]);
  const influencerDB = await readIfExists(["influencer.json"]);
  const visionaryDB  = await readIfExists(["visionary.json"]);

  let all = [...globalDB, ...masterDB, ...producerDB, ...influencerDB, ...visionaryDB];

  if (template) {
    const t = template.trim().toLowerCase();
    all = all.filter(x => (x.template ?? "").toLowerCase() === t);
  }
  return all;
}

export async function distinctTemplates(): Promise<string[]> {
  const order = ["GLOBAL", "Masterpiece", "Producer", "Influencer", "Visionary"];
  const seen = new Set<string>();
  (await readAll()).forEach(x => seen.add((x.template ?? "").trim()));
  return order.filter(t => seen.has(t));
}
