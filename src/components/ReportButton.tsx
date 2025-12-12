import React, { useRef, useState, useEffect } from "react";
import ReportModal from "./ReportModal";

export interface ReportItem {
  id: string;
  label: string;
  ref: React.RefObject<HTMLDivElement | null>;
}

const ReportButton: React.FC<{ items: ReportItem[] }> = ({ items }) => {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const onDocClick = (e: MouseEvent) => {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <div ref={wrapperRef} style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        style={{
          padding: "0.5rem 1rem",
          borderRadius: 8,
          border: "none",
          background: "#DE9E48",
          color: "#372C2E",
          fontWeight: 600,
          cursor: "pointer",
        }}
      >
        Generate Report
      </button>

      {open && (
        <ReportModal
          items={items}
          onClose={() => setOpen(false)}
        />
      )}
    </div>
  );
};

export default ReportButton;
