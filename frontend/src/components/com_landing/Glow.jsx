import React from "react";

export default function Glow({ className = "" }) {
  return (
    <div
      className={`pointer-events-none absolute blur-3xl opacity-50 ${className}`}
      style={{
        background:
          "radial-gradient(50% 50% at 50% 50%, rgba(34,197,94,0.35) 0%, rgba(34,197,94,0.1) 40%, transparent 70%)",
      }}
    />
  );
}
