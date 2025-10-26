import React, { useRef } from "react";

export default function RewardsPopup({ open, onClose, salons }) {
  const cardRef = useRef(null);

  if (!open) return null;

  const total = salons.reduce((acc, s) => acc + (s.points || 0), 0);

  const handleBackdropClick = (e) => {
    if (cardRef.current && !cardRef.current.contains(e.target)) onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Rewards from all salons"
      onMouseDown={handleBackdropClick}
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.45)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 2000,
        padding: 20,
      }}
    >
      <div
        ref={cardRef}
        style={{
          width: "min(700px, 100%)",
          background: "#FFFFFF",
          borderRadius: 12,
          border: "2px solid #DE9E48",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          color: "#372C2E",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "3px solid #DE9E48",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <h2 style={{ margin: 0 }}>All Salon Rewards</h2>
          <button
            onClick={onClose}
            aria-label="Close"
            style={{
              background: "transparent",
              border: "1px solid #DE9E48",
              color: "#372C2E",
              borderRadius: 8,
              padding: "6px 10px",
              cursor: "pointer",
              fontWeight: 600,
            }}
          >
            Close
          </button>
        </div>

        <div style={{ padding: 20 }}>
          {/* Totals */}
          <div
            style={{
              background: "#F9F5F1",
              border: "1px solid #DE9E48",
              borderRadius: 10,
              padding: 12,
              marginBottom: 16,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              fontWeight: 600,
            }}
          >
            <span>Total points across salons</span>
            <span>{total}</span>
          </div>

          {/* List */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr auto auto", gap: 12, alignItems: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Salon</div>
            <div style={{ fontSize: 12, opacity: 0.7, textAlign: "right" }}>Points</div>
            <div style={{ fontSize: 12, opacity: 0.7, textAlign: "right" }}>Goal</div>

            {salons.map((s) => (
              <React.Fragment key={s.id}>
                <div
                  style={{
                    background: "#FFFFFF",
                    border: "1px solid #E6E6E6",
                    borderRadius: 8,
                    padding: "10px 12px",
                    gridColumn: "1 / 2",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#372C2E" }}>{s.name}</div>
                  <div style={{ fontSize: 12, color: "#563727", opacity: 0.8 }}>{s.address ?? ""}</div>
                </div>
                <div style={{ textAlign: "right", fontWeight: 700 }}>{s.points}</div>
                <div style={{ textAlign: "right", opacity: 0.8 }}>{s.goal ?? "-"}</div>
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}