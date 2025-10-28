import { useEffect } from "react";
import AppointmentNotes from "../components/AppointmentNotes";
import BeforeAfterImages from "../components/BeforeAfterImages";
import AppointmentPlaceholders from "../components/appointment_modal";

export default function AppointmentPage() {
  const demoAppointmentId = "demo-appointment-1";
  const appointmentInfo = {
    id: demoAppointmentId,
    client: "Jack Johnson",
    worker: "Alex Smith",
    service: "Haircut",
    date: "Oct 15, 2025",
    time: "2:00 PM",
    status: "Completed",
  };
  useEffect(() => {
    const prevBg = document.body.style.background;
    const prevColor = document.body.style.color;
    const prevOverflowX = document.body.style.overflowX;
    document.body.style.background = "#372C2E";
    document.body.style.color = "#FFFFFF";
    document.body.style.overflowX = "hidden";
    return () => {
      document.body.style.background = prevBg;
      document.body.style.color = prevColor;
      document.body.style.overflowX = prevOverflowX;
    };
  }, []);

  return (
    <div
      style={{
        minHeight: "100vh",
        padding: 40,
        backgroundColor: "#372C2E",
        overflowX: "hidden",
        position: "relative",
      }}
    >

      <div
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          backgroundColor: "#372C2E",
          zIndex: -1,
        }}
      />
      <div style={{ maxWidth: 900, margin: "0 auto", backgroundColor: "#372C2E" }}>
        <div
          style={{
            backgroundColor: "#372C2E",
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
            Appointment
          </h1>

          <div
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.08)",
              borderRadius: 8,
              padding: 16,
              marginBottom: 16,
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 12,
              }}
            >
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                  Appointment ID
                </div>
                <div style={{ color: "#FFFFFF", fontWeight: 600 }}>
                  {appointmentInfo.id}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                  Status
                </div>
                <div style={{ color: "#DE9E48", fontWeight: 600 }}>
                  {appointmentInfo.status}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                  Client
                </div>
                <div style={{ color: "#FFFFFF" }}>{appointmentInfo.client}</div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                  Worker
                </div>
                <div style={{ color: "#FFFFFF" }}>{appointmentInfo.worker}</div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                  Service
                </div>
                <div style={{ color: "#FFFFFF" }}>{appointmentInfo.service}</div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12 }}>
                  When
                </div>
                <div style={{ color: "#FFFFFF" }}>
                  {appointmentInfo.date} • {appointmentInfo.time}
                </div>
              </div>
            </div>
          </div>



          <BeforeAfterImages appointmentId={demoAppointmentId} />


          <AppointmentNotes appointmentId={demoAppointmentId} />

        </div>
      </div>
    </div>
  );
}
