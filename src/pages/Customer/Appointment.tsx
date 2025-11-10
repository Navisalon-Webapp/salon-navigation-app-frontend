import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppointmentNotes from "../../components/AppointmentNotes";
import BeforeAfterImages from "../../components/BeforeAfterImages";
import ReviewForm from "../../components/ReviewForm";

const API = "http://localhost:5000";

interface AppointmentInfo {
  id: number;
  customer_id: number;
  employee_id: number;
  service_id: number;
  business_id: number;
  client: string;
  worker: string;
  service: string;
  price: number;
  duration: number;
  date: string;
  time: string;
  start_time: string;
  expected_end_time: string | null;
  end_time: string | null;
  status: string;
  notes: string | null;
  business_name: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zip_code: string;
  };
}

export default function AppointmentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (appointmentId) {
      fetchAppointment(appointmentId);
    }
  }, [appointmentId]);

  const fetchAppointment = async (aid: string) => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API}/api/clients/appointment/${aid}`, {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setAppointmentInfo(data);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to fetch appointment");
      }
    } catch (err) {
      console.error("Failed to fetch appointment:", err);
      setError("An error occurred while fetching appointment details");
    } finally {
      setLoading(false);
    }
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

          {loading && (
            <div style={{ color: "#FFFFFF", padding: "2rem" }}>
              Loading appointment details...
            </div>
          )}

          {error && (
            <div style={{ color: "#DE9E48", padding: "2rem", backgroundColor: "rgba(139, 69, 19, 0.3)", borderRadius: 8 }}>
              {error}
            </div>
          )}

          {!loading && !error && appointmentInfo && (
            <>
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



              <BeforeAfterImages appointmentId={appointmentInfo.id.toString()} />


              <AppointmentNotes appointmentId={appointmentInfo.id.toString()} />


              {appointmentInfo.status === "Completed" && (
                <div style={{ marginTop: 12 }}>

                  <ReviewForm eid={appointmentInfo.employee_id} />
                </div>
              )}
            </>
          )}

        </div>
      </div>
    </div>
  );
}
