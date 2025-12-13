type ProgramDescriptor = {
  plural: string;
  singular: string;
};

const PROGRAM_UNITS: Record<string, ProgramDescriptor> = {
  appts_thresh: { plural: "appointments", singular: "appointment" },
  pdct_thresh: { plural: "products", singular: "product" },
  points_thresh: { plural: "points", singular: "point" },
  price_thresh: { plural: "dollars", singular: "dollar" },
};

const getProgramUnits = (programType?: string | null): ProgramDescriptor => {
  if (!programType) {
    return PROGRAM_UNITS.points_thresh;
  }
  return PROGRAM_UNITS[programType] ?? PROGRAM_UNITS.points_thresh;
};

const formatValue = (value?: number | null): string => {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0";
  }
  return Number.isInteger(value) ? String(value) : value.toFixed(2);
};

const formatWithUnits = (value: number | null | undefined, descriptor: ProgramDescriptor): string => {
  const safeValue = value ?? 0;
  const formatted = formatValue(safeValue);
  const word = safeValue === 1 ? descriptor.singular : descriptor.plural;
  return `${formatted} ${word}`;
};

export default function RewardRing({
  current,
  goal,
  salonName = "Salon",
  programType,
  pointsBalance,
}: {
  current: number;
  goal: number;
  salonName?: string;
  programType?: string | null;
  pointsBalance?: number;
}) {
  const clamped = Math.max(0, Math.min(current, goal));
  const pct = goal ? clamped / goal : 0;
  const radius = 40;
  const stroke = 10;
  const circumference = 2 * Math.PI * radius;
  const dash = circumference * pct;

  const remaining = Math.max(0, goal - clamped);
  const descriptor = getProgramUnits(programType);
  const progressLabel = `${formatValue(current)} / ${formatValue(goal)} ${descriptor.plural}`;
  const remainingLabel = remaining > 0 ? `${formatWithUnits(remaining, descriptor)} remaining` : "Reward ready!";
  const remainingWord = remaining === 1 ? descriptor.singular : descriptor.plural;
  const remainingValue = formatValue(remaining);
  const normalizedBalance = typeof pointsBalance === "number" && Number.isFinite(pointsBalance)
    ? Math.max(pointsBalance, 0)
    : null;

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
          {remaining > 0 ? `${remainingValue} more` : "Goal met!"}
          <tspan x="55" dy="1.2em">
            {remaining > 0 ? remainingWord : ""}
          </tspan>
        </text>
      </svg>
      <div style={{ marginTop: 12, fontSize: 16, fontWeight: 600 }}>
        {progressLabel}
      </div>
      <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>{remainingLabel}</div>
      {normalizedBalance !== null && (
        <div style={{ fontSize: 12, opacity: 0.85, marginTop: 4 }}>
          Available points: {formatValue(normalizedBalance)}
        </div>
      )}
    </div>
  );
}