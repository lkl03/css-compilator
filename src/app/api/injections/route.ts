// app/api/injections/route.ts
export const runtime = 'nodejs';

import { NextResponse } from "next/server";
import { readAll, distinctTemplates } from "@/lib/db";
import { search, searchByElement } from "@/lib/search";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q           = searchParams.get("q") ?? undefined;
  const template    = searchParams.get("template") ?? "GLOBAL";
  const limitStr    = searchParams.get("limit");
  const limit       = limitStr ? Math.max(1, Math.min(200, Number(limitStr))) : 100;
  const distinct    = searchParams.get("distinct");
  const elementOnly = searchParams.get("elementOnly") === "1";

  if (distinct === "template") {
    const templates = await distinctTemplates();
    return NextResponse.json(templates);
  }

  const data = await readAll(template);
  const filtered = q
    ? (elementOnly ? searchByElement(data, q) : search(data, q))
    : data;

  const total = filtered.length;
  const items = filtered.slice(0, limit);

  return NextResponse.json({ items, total });
}
