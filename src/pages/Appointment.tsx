import { useEffect } from "react";

import BeforeAfterImages from "../components/BeforeAfterImages";

export default function AppointmentPage() {
  useEffect(() => {
    const docEl = document.documentElement;
    const prevHtmlBg = docEl.style.background;
    const prevHtmlColor = docEl.style.color;
    const prevBodyBg = document.body.style.background;
    const prevBodyColor = document.body.style.color;
    docEl.style.background = "#372C2E";
    docEl.style.color = "#FFFFFF";
    document.body.style.background = "#372C2E";
    document.body.style.color = "#FFFFFF";
    return () => {
      docEl.style.background = prevHtmlBg;
      docEl.style.color = prevHtmlColor;
      document.body.style.background = prevBodyBg;
      document.body.style.color = prevBodyColor;
    };
  }, []);

  return (
    <div style={{ minHeight: "100vh", padding: 40 }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>
        <div
          style={{
            backgroundColor: "transparent",
            borderRadius: 12,
            padding: 24,
          }}
        >
          <h1
            style={{
              color: "#FFFFFF",
              marginTop: 0,
              paddingBottom: 12,
              marginBottom: 16,
            }}
          >
            Appointments
          </h1>

          {/* Appointment notes component - functional (local state) */}

          {/* Before / After images (all roles can view) */}
          <BeforeAfterImages />

          {/* Placeholder for other appointment features */}
        </div>
      </div>
    </div>
  );
}
