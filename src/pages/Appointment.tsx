import { useEffect } from "react";
import AppointmentNotes from "../components/AppointmentNotes";
import AppointmentPlaceholders from "../components/appointment_modal";

export default function AppointmentPage() {
  useEffect(() => {
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    document.body.style.background = "#372C2E";
    document.body.style.color = "#FFFFFF";
    return () => {
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
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

          <p
            style={{
              color: "#FFFFFF",
              opacity: 0.9,
              fontSize: 16,
              lineHeight: 1.6,
            }}
          >
            Below is a small demo UI for appointment notes. This is local-only
            and intended to show the frontend behavior.
          </p>

          {/* Appointment notes component - functional (local state) */}
          <AppointmentNotes appointmentId="demo-appointment-1" />

          {/* Placeholder for other appointment features */}
          <AppointmentPlaceholders />
        </div>
      </div>
    </div>
  );
}
