import React, { useState } from "react";
import CreatePromotion from "./CreatePromotion";
import CreateLoyalty from "./CreateLoyalty";

const tabContainer: React.CSSProperties = {
  display: "flex",
  gap: "0.5rem",
  marginBottom: "1rem",
};

const tabButton = (active: boolean): React.CSSProperties => ({
  padding: "0.5rem 0.75rem",
  borderRadius: 8,
  border: "none",
  cursor: "pointer",
  background: active ? "#DE9E48" : "transparent",
  color: active ? "#372C2E" : "#FFFFFF",
  fontWeight: 600,
});

const Marketing: React.FC = () => {
  const [tab, setTab] = useState<"promotions" | "loyalty">("promotions");

  return (
    <div style={{ position: "relative" }}>
      <div aria-hidden style={{ position: "fixed", inset: 0, background: "#372C2E", zIndex: -1 }} />

      <h1 style={{ color: "#FFFFFF", fontSize: "1.75rem", fontWeight: 600, marginBottom: "1rem" }}>
        Promotions & Loyalty
      </h1>

      <div style={tabContainer}>
        <button onClick={() => setTab("promotions")} style={tabButton(tab === "promotions")}>Promotions</button>
        <button onClick={() => setTab("loyalty")} style={tabButton(tab === "loyalty")}>Loyalty Programs</button>
      </div>

      <div>
        {tab === "promotions" ? (
          <CreatePromotion />
        ) : (
          <CreateLoyalty />
        )}
      </div>
    </div>
  );
};

export default Marketing;
