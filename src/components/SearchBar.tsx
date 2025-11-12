// components/SearchBar.tsx
'use client'
import React from 'react'

export function SearchBar({
  placeholder,
  value,
  onChange,
}: {
  placeholder?: string
  value: string
  onChange: (v: string) => void
}) {
  return (
    <input
      className="w-full glass px-4 py-3 outline-none placeholder:text-slate-500"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  )
}

