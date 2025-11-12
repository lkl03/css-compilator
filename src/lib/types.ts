export type SourceRef = { type: string | null; url: string | null };

export type Injection = {
  id: string;
  element: string;
  template: "GLOBAL" | "Masterpiece" | "Producer" | string;
  selector?: string | null;
  css: string;
  action?: string | null;       // 👈 importante
  tags?: string[] | null;
  screenshot?: string | null;
  loomExplanation?: string | null;
  source?: SourceRef | null;
};
