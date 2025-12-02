import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import AppointmentNotes from "../../components/AppointmentNotes";
import BeforeAfterImages from "../../components/BeforeAfterImages";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export default function WorkerAppointmentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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
    if (appointmentId) {
      fetchAppointment(appointmentId);
    }
  }, [appointmentId]);

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
          Appointment Details
        </h1>

      {loading && (
        <div style={{ color: "#FFFFFF", padding: "2rem" }}>
          Loading appointment details...
        </div>
      )}

      {error && (
        <div style={{ 
          color: "#FFFFFF", 
          padding: "1rem", 
          backgroundColor: "#D62828", 
          borderRadius: 8,
          border: "2px solid #8B0000",
          marginBottom: 16
        }}>
          {error}
        </div>
      )}

      {!loading && !error && appointmentInfo && (
        <>
          <div
            style={{
              background: "#563727",
              border: "2px solid #7A431D",
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
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>
                  Appointment ID
                </div>
                <div style={{ color: "#FFFFFF", fontWeight: 600 }}>
                  {appointmentInfo.id}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>
                  Status
                </div>
                <div style={{ color: "#DE9E48", fontWeight: 600 }}>
                  {appointmentInfo.status}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>
                  Client
                </div>
                <div style={{ color: "#FFFFFF" }}>{appointmentInfo.client}</div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>
                  Worker
                </div>
                <div style={{ color: "#FFFFFF" }}>{appointmentInfo.worker}</div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>
                  Service
                </div>
                <div style={{ color: "#FFFFFF" }}>{appointmentInfo.service}</div>
              </div>
              <div>
                <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>
                  When
                </div>
                <div style={{ color: "#FFFFFF" }}>
                  {appointmentInfo.date} • {appointmentInfo.time}
                </div>
              </div>
            </div>
          </div>

          <BeforeAfterImages appointmentId={appointmentInfo.id.toString()} theme="dark" />

          <AppointmentNotes appointmentId={appointmentInfo.id.toString()} theme="dark" />
        </>
      )}
      </div>
    </div>
  );
}
