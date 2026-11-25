"use client";

import { useId, useState } from "react";

export function InfoTip({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  const id = useId();
  const [open, setOpen] = useState(false);

  return (
    <span style={{ position: "relative", display: "inline-flex", alignItems: "center" }}>
      <button
        type="button"
        aria-label={label}
        aria-describedby={open ? id : undefined}
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        onClick={() => setOpen((v) => !v)}
        style={{
          width: 16,
          height: 16,
          borderRadius: "50%",
          border: "1px solid currentColor",
          background: "transparent",
          color: "inherit",
          fontSize: 10,
          lineHeight: 1,
          cursor: "help",
          padding: 0,
          display: "inline-flex",
          alignItems: "center",
          justifyContent: "center",
          opacity: 0.7,
        }}
      >
        ?
      </button>
      {open && (
        <span
          role="tooltip"
          id={id}
          style={{
            position: "absolute",
            bottom: "calc(100% + 8px)",
            left: "50%",
            transform: "translateX(-50%)",
            background: "Canvas",
            color: "CanvasText",
            border: "1px solid currentColor",
            borderRadius: 6,
            padding: "8px 10px",
            fontSize: 13,
            lineHeight: 1.4,
            width: 240,
            zIndex: 50,
            boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          }}
        >
          {children}
        </span>
      )}
    </span>
  );
}
