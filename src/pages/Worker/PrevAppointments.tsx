import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Appt from '../../components/AppointmentCard';

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

type AppointmentInfo = {
  id: string;
  time: string;
  date: string;
  client: string;
  service: string;
  durationMins: number;
  status: string;
};

export default function WorkerAppointments() {
  const navigate = useNavigate();
  const [pastAppointments, setPastAppointments] = useState<AppointmentInfo[]>([]);
  const [futureAppointments, setFutureAppointments] = useState<AppointmentInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadAppointments();
  }, []);

  const loadAppointments = async () => {
    setLoading(true);
    setError(null);
    try {
      // Fetch past appointments
      const pastRes = await fetch(`${API_BASE}/worker/past-appointments`, {
        credentials: 'include',
      });
      
      // Fetch future appointments
      const futureRes = await fetch(`${API_BASE}/worker/future-appointments`, {
        credentials: 'include',
      });
      
      if (!pastRes.ok || !futureRes.ok) {
        throw new Error(`Failed to load appointments`);
      }
      
      const pastData: AppointmentInfo[] = await pastRes.json();
      const futureData: AppointmentInfo[] = await futureRes.json();
      
      setPastAppointments(pastData);
      setFutureAppointments(futureData);
    } catch (e: any) {
      setError(e?.message || "Something went wrong");
      setPastAppointments([]);
      setFutureAppointments([]);
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
        Appointments
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

      {!loading && !error && (
        <>
          {/* Future Appointments Section */}
          <div style={{ marginBottom: 40 }}>
            <h2
              style={{
                color: "#FFFFFF",
                fontSize: "1.5rem",
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: "2px solid #DE9E48",
              }}
            >
              Upcoming Appointments
            </h2>
            
            {futureAppointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.6)" }}>
                No upcoming appointments.
              </div>
            ) : (
              <div>
                {futureAppointments.map((appt) => (
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

          {/* Past Appointments Section */}
          <div>
            <h2
              style={{
                color: "#FFFFFF",
                fontSize: "1.5rem",
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: "2px solid #DE9E48",
              }}
            >
              Past Appointments
            </h2>
            
            {pastAppointments.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "rgba(255,255,255,0.6)" }}>
                No past appointments.
              </div>
            ) : (
              <div>
                {pastAppointments.map((appt) => (
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
        </>
      )}
      </div>
    </div>
  );
}