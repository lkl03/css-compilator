// components/ResultCard.tsx
"use client";

import type { Injection } from "@/lib/types";
import { useEffect, useState } from "react";

export function ResultCard({ item }: { item: Injection }) {
  const [copied, setCopied] = useState(false);
  const [fullscreen, setFullscreen] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(item.css);
      setCopied(true);
      setTimeout(() => setCopied(false), 1200);
    } catch {}
  };

  const templateLabel = item.template === "GLOBAL" ? "Global CSS" : item.template;

  return (
    <>
      <article className="glass p-4 h-full min-h-60 flex flex-col min-w-0">
        <div className="flex flex-col items-center text-center gap-1 min-h-[104px]">
          <h3 className="font-semibold text-lg text-ink">
            {item.element}
            <span className="mx-1 text-ink-2">·</span>
            <span className="text-ink">{templateLabel}</span>
          </h3>

          <div className="mt-1 text-xs flex flex-wrap items-center justify-center gap-2">
            <span className="chip">{templateLabel}</span>

            {item.screenshot && (
              <a
                href={item.screenshot}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 text-ink-2 hover:text-ink"
                title="Screenshot"
              >
                Screenshot ↗
              </a>
            )}
            {item.loomExplanation && (
              <a
                href={item.loomExplanation}
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 text-ink-2 hover:text-ink"
                title="Loom"
              >
                View ↗
              </a>
            )}
            {item.source?.type && (
              <span className="text-ink-2">
                Source: <span className="text-ink">{item.source.type}</span>
                {item.source.url ? (
                  <>
                    {" "}|{" "}
                    <a
                      href={item.source.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline underline-offset-4 text-ink-2 hover:text-ink"
                    >
                      View ↗
                    </a>
                  </>
                ) : null}
              </span>
            )}
          </div>

          {item.action && (
            <p className="text-sm text-ink text-center">{item.action}</p>
          )}
        </div>

        <div className="relative mt-3 rounded-xl border border-white/10 bg-black/5 dark:bg-white/5">
          <pre
            className="codebox whitespace-pre-wrap p-3 overflow-auto text-[12px] leading-5
                       resize min-h-60 h-60 max-h-[70vh] min-w-40 max-w-full thin-scrollbar"
          >
{item.css}
          </pre>
        </div>

        {item.selector && (
          <p className="mt-2 text-xs text-ink-2 text-center">
            Selector: <code className="font-mono text-ink">{item.selector}</code>
          </p>
        )}

        <div className="mt-3 flex items-center justify-center gap-2">
          <button onClick={copy} className="btn px-2 py-1 text-xs cursor-pointer">
            {copied ? "Copied ✓" : "Copy CSS"}
          </button>
          <button
            onClick={() => setFullscreen(true)}
            className="btn px-2 py-1 text-xs cursor-pointer"
            title="Fullscreen"
          >
            Fullscreen
          </button>
        </div>
      </article>

      {fullscreen && (
        <FullscreenCode
          item={item}
          onClose={() => setFullscreen(false)}
          onCopy={copy}
          copied={copied}
        />
      )}
    </>
  );
}

function FullscreenCode({
  item, onClose, onCopy, copied,
}: {
  item: Injection; onClose: () => void; onCopy: () => void; copied: boolean;
}) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  const templateLabel = item.template === "GLOBAL" ? "Global CSS" : item.template;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm p-4 md:p-8"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
      role="dialog"
      aria-modal="true"
    >
      <div className="mx-auto h-full w-full max-w-6xl flex flex-col gap-3">
        <div className="flex items-center justify-between text-white">
          <h3 className="font-semibold text-lg">
            {item.element}
            <span className="mx-1 text-ink-2">·</span>
            <span className="text-white">{templateLabel}</span>
          </h3>
          <div className="flex items-center gap-2">
            <button onClick={onCopy} className="btn px-3 py-1.5 text-sm cursor-pointer">
              {copied ? "Copied ✓" : "Copy CSS"}
            </button>
            <button onClick={onClose} className="btn px-3 py-1.5 text-sm cursor-pointer">
              Close
            </button>
          </div>
        </div>

        {(item.action || item.source?.type) && (
          <div className="text-xs text-ink-2 flex flex-wrap items-center gap-3">
            {item.action && <span className="text-white">{item.action}</span>}
            {item.source?.type && (
              <span className="text-gray-400">
                Source: <span className="text-white">{item.source.type}</span>
                {item.source.url ? (
                  <>
                    {" "}|{" "}
                    <a
                      className="underline underline-offset-4 text-white"
                      href={item.source.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      View ↗
                    </a>
                  </>
                ) : null}
              </span>
            )}
          </div>
        )}

        <div className="flex-1 min-h-0 panel rounded-2xl">
          <pre className="codebox whitespace-pre-wrap p-4 h-full overflow-auto text-[13px] leading-6 thin-scrollbar">
{item.css}
          </pre>
        </div>
      </div>
    </div>
  );
}






