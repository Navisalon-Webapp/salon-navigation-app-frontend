import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Appt from '../../components/AppointmentCard';

const API = "http://localhost:5000";

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
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    setLoading(true);
    setError("");
    
    try {
      const res = await fetch(`${API}/api/clients/view-prev-appointments`, {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setAppointments(data);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to fetch appointments");
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
    <div>
      <h1>Past Appointments</h1>
      <br/>
      <br/>
      
      {loading && <div>Loading appointments...</div>}
      
      {error && (
        <div style={{ color: 'red', marginBottom: '1rem' }}>
          {error}
        </div>
      )}
      
      {!loading && !error && appointments.length === 0 && (
        <div>No past appointments found.</div>
      )}
      
      {!loading && !error && appointments.length > 0 && (
        <div>
          {appointments.map(item => (
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
      
      <br/>
    </div>
  );
}