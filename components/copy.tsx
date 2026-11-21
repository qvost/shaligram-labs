"use client";

import { useEffect, useRef, useState } from "react";

export function Copy({ value }: { value: string }) {
  const [status, setStatus] = useState("Copy");
  const reset = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (reset.current) clearTimeout(reset.current);
    },
    [],
  );

  async function copy() {
    if (reset.current) clearTimeout(reset.current);
    try {
      await navigator.clipboard.writeText(value);
      setStatus("Copied");
    } catch {
      setStatus("Copy unavailable");
    }
    reset.current = setTimeout(() => setStatus("Copy"), 2000);
  }

  return (
    <button className="copy" onClick={copy} aria-live="polite">
      {status}
    </button>
  );
}
