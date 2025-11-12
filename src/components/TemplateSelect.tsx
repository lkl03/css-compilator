// components/TemplateSelect.tsx
"use client";

import { useEffect, useState } from "react";
import { useTemplates } from "@/lib/useTemplates";

type Props = {
  value?: string;
  onChange?: (val: string) => void;
};

export default function TemplateSelect({ value, onChange }: Props) {
  const { templates, loading } = useTemplates();
  const [val, setVal] = useState(value ?? "GLOBAL");

  // Si el padre cambia value, sincronizamos
  useEffect(() => {
    if (value && value !== val) setVal(value);
  }, [value]);

  // Si no hay valor y ya cargó, fijar default "GLOBAL" si existe
  useEffect(() => {
    if (!value && !loading && templates.length > 0) {
      const preferred = templates.includes("GLOBAL") ? "GLOBAL" : templates[0];
      if (val !== preferred) {
        setVal(preferred);
        onChange?.(preferred);
      }
    }
  }, [loading, templates]);

  const disabled = loading || templates.length === 0;

  return (
    <select
      className="input"
      disabled={disabled}
      value={val}
      onChange={(e) => {
        const v = e.target.value;
        setVal(v);
        onChange?.(v);
      }}
      title={disabled ? "Cargando templates..." : "Seleccionar template"}
    >
      {loading && <option>Cargando...</option>}
      {!loading && templates.map(t => (
        <option key={t} value={t}>
          {t === "GLOBAL" ? "Global CSS" : t}
        </option>
      ))}
    </select>
  );
}
