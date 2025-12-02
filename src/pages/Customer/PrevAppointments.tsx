import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Appt from '../../components/AppointmentCard';

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

interface Appointment {
  appointment_id: number;
  service_name: string;
  service_price: number;
  employee_first_name: string;
  employee_last_name: string;
  employee_id: number;
  start_time: string;
  expected_end_time: string;
  end_time: string;
}

export default function CustomerAppointments(){
  const navigate = useNavigate();
  const [pastAppointments, setPastAppointments] = useState<Appointment[]>([]);
  const [futureAppointments, setFutureAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    
    try {
      // Fetch past appointments
      const pastRes = await fetch(`${API}/api/clients/view-prev-appointments`, {
        credentials: "include",
      });
      
      // Fetch future appointments
      const futureRes = await fetch(`${API}/api/clients/view-future-appointments`, {
        credentials: "include",
      });
      
      if (pastRes.ok && futureRes.ok) {
        const pastData = await pastRes.json();
        const futureData = await futureRes.json();
        setPastAppointments(pastData);
        setFutureAppointments(futureData);
      } else {
        setError("Failed to fetch appointments");
      }
    } catch (err) {
      console.error("Failed to fetch appointments:", err);
      setError("An error occurred while fetching appointments");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'numeric', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (dateString: string) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  };

  const handleAppointmentClick = (appointmentId: number) => {
    navigate(`/customer/appointment/${appointmentId}`);
  };

  return (
    <div
      style={{
        backgroundColor: "#FFFFFF",
        borderRadius: 12,
        padding: 40,
        boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        border: "2px solid #DE9E48",
      }}
    >
      <h1
        style={{
          color: "#372C2E",
          marginTop: 0,
          borderBottom: "3px solid #DE9E48",
          paddingBottom: 16,
          marginBottom: 24,
        }}
      >
        Appointments
      </h1>
      
      {loading && <div style={{ color: "#372C2E", padding: 20 }}>Loading appointments...</div>}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      {!loading && !error && (
        <>
          {/* Future Appointments Section */}
          <div style={{ marginBottom: 40 }}>
            <h2
              style={{
                color: "#372C2E",
                fontSize: "1.5rem",
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: "2px solid #DE9E48",
              }}
            >
              Upcoming Appointments
            </h2>
            
            {futureAppointments.length === 0 ? (
              <div style={{ color: "#372C2E", padding: 20 }}>No upcoming appointments.</div>
            ) : (
              <div>
                {futureAppointments.map(item => (
                  <div 
                    key={item.appointment_id} 
                    onClick={() => handleAppointmentClick(item.appointment_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Appt 
                      name={`${item.employee_first_name} ${item.employee_last_name}`}
                      salon={item.service_name}
                      time={formatTime(item.start_time)}
                      date={formatDate(item.start_time)}
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
                color: "#372C2E",
                fontSize: "1.5rem",
                marginBottom: 16,
                paddingBottom: 8,
                borderBottom: "2px solid #DE9E48",
              }}
            >
              Past Appointments
            </h2>
            
            {pastAppointments.length === 0 ? (
              <div style={{ color: "#372C2E", padding: 20 }}>No past appointments.</div>
            ) : (
              <div>
                {pastAppointments.map(item => (
                  <div 
                    key={item.appointment_id} 
                    onClick={() => handleAppointmentClick(item.appointment_id)}
                    style={{ cursor: 'pointer' }}
                  >
                    <Appt 
                      name={`${item.employee_first_name} ${item.employee_last_name}`}
                      salon={item.service_name}
                      time={formatTime(item.start_time)}
                      date={formatDate(item.start_time)}
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}