export default function RewardRing({ current, goal, salonName = "Salon" }: { current: number; goal: number; salonName?: string }) {
  const clamped = Math.max(0, Math.min(current, goal));
  const pct = goal ? clamped / goal : 0;
  const radius = 40;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;

  const remaining = Math.max(0, goal - clamped);

  return (
    <div
      style={{
        backgroundColor: "#DE9E48",
        borderRadius: 12,
        padding: 20,
        width: 300,
        minHeight: 340,
        color: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
      }}
      aria-label={`Rewards progress: ${Math.round(pct * 100)} percent`}
    >
      <div style={{ fontWeight: 700, marginBottom: 12, fontSize: 18 }}>
        Rewards at {salonName}
      </div>

      <svg width="150" height="150" viewBox="0 0 110 110">
        {/* Track */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="#BFBFBF"
          strokeWidth={stroke}
          strokeLinecap="round"
        />
        {/* Progress */}
        <circle
          cx="55"
          cy="55"
          r={radius}
          fill="none"
          stroke="#372C2E"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circumference - dash}`}
          transform="rotate(-90 55 55)"
        />
        {/* Center text */}
        <text
          x="55"
          y="50"
          textAnchor="middle"
          dominantBaseline="middle"
          fontSize="12"
          fill="#FFFFFF"
          style={{ fontWeight: 600 }}
        >
          {remaining > 0 ? `${remaining} more` : "Goal met!"}
          <tspan x="55" dy="1.2em">
            {remaining > 0 ? "points" : ""}
          </tspan>
        </text>
      </svg>
      <div style={{ marginTop: 12, fontSize: 16, fontWeight: 600 }}>
        {current} / {goal} points
      </div>
    </div>
  );
}