import React, { useState } from "react";
import RewardRing from "../../components/Rewards/RewardRing";
import RewardsPopup from "../../components/Rewards/RewardsPopup";

export default function Home() {
  const [open, setOpen] = useState(false);

  const currentPoints = 80;
  const goalPoints = 100;
  const salons = [
    { id: "s1", name: "Downtown Cuts", points: 80, goal: 100, address: "123 Market St" },
    { id: "s2", name: "Nail Oasis", points: 45, goal: 80, address: "22 Pine Ave" },
    { id: "s3", name: "Glow Spa", points: 120, goal: 150, address: "9 River Rd" },
  ];

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 40,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "2px solid #DE9E48",
      }}
    >
      <h1
        style={{
          color: "#372C2E",
          marginTop: 0,
          borderBottom: "3px solid #DE9E48",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        Home
      </h1>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: 20,
          alignItems: "start",
        }}
      >
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={open}
          style={{ all: "unset", cursor: "pointer", borderRadius: 12 }}
        >
          <RewardRing current={currentPoints} goal={goalPoints} />
        </button>
      </div>

      <RewardsPopup
        open={open}
        onClose={() => setOpen(false)}
        salons={salons}
      />
    </div>
  );
}
