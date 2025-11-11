import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Appt from '../../components/AppointmentCard';

const API_BASE = "http://localhost:5000";

type AppointmentInfo = {
  id: string;
  time: string;
  date: string;
  client: string;
  service: string;
  durationMins: number;
  notes?: string;
  status: string;
};

export default function WorkerAppointments() {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState<AppointmentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadPastAppointments();
  }, []);

  const loadPastAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/worker/past-appointments`, {
        credentials: 'include',
      });
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      const data: AppointmentInfo[] = await res.json();
      setAppointments(data);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      setAppointments([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ 
      backgroundColor: "#2A1F1D", 
      position: "fixed",
      top: 64,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: "auto",
      padding: "40px 20px"
    }}>
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
        Past Appointments
      </h1>

      {error && (
        <div
          style={{
            backgroundColor: "#D62828",
            color: "#FFFFFF",
            padding: "0.6rem 0.8rem",
            borderRadius: "0.5rem",
            marginBottom: "0.75rem",
            textAlign: "center",
            border: "2px solid #8B0000",
          }}
        >
          {error}
        </div>
      )}

      {loading && (
        <div style={{ textAlign: "center", padding: "2rem", color: "#FFFFFF" }}>
          Loading appointments...
        </div>
      )}

      {!loading && appointments.length === 0 && !error && (
        <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.6)" }}>
          No past appointments found.
        </div>
      )}

      {!loading && appointments.length > 0 && (
        <div>
          {appointments.map((appt) => (
            <div
              key={appt.id}
              onClick={() => navigate(`/employee/appointment/${appt.id}`)}
              style={{ cursor: 'pointer' }}
            >
              <Appt
                name={appt.client}
                salon={appt.service}
                time={appt.time}
                date={appt.date}
                theme="dark"
              />
            </div>
          ))}
        </div>
      )}
      </div>
    </div>
  );
}