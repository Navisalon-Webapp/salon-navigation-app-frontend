export default function WorkerDashboard() {
  return (
    <div
      style={{
        backgroundColor: "#2A1F1D",
        position: "fixed",
        top: 64,
        left: 0,
        right: 0,
        bottom: 0,
        overflow: "auto",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          backgroundColor: "#372C2E",
          borderRadius: 12,
          padding: 40,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          border: "2px solid #DE9E48",
          maxWidth: 1200,
          margin: "0 auto",
        }}
      >
        <h1
          style={{
            color: "#FFFFFF",
            marginTop: 0,
            borderBottom: "3px solid #DE9E48",
            paddingBottom: 16,
            marginBottom: 24,
          }}
        >
          Worker Dashboard
        </h1>
      </div>
    </div>
  );
}
