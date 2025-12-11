import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BeforeAfterImages from "../../components/BeforeAfterImages";
import AppointmentNotes from "../../components/AppointmentNotes";

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
  payments?: {
    deposit_rate: number;
    deposit_required: number;
    deposit_outstanding: number;
    total_paid: number;
    balance_due: number;
  };
}

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

export default function OwnerAppointmentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
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

        <button
          type="button"
          onClick={() => navigate(-1)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #DE9E48",
            background: "transparent",
            color: "#DE9E48",
            fontWeight: 600,
            cursor: "pointer",
            marginBottom: 20,
          }}
        >
          ← Back to appointments
        </button>

        {loading && (
          <div style={{ color: "#FFFFFF", padding: "2rem" }}>
            Loading appointment details...
          </div>
        )}

        {error && (
          <div
            style={{
              color: "#FFFFFF",
              padding: "1rem",
              backgroundColor: "#D62828",
              borderRadius: 8,
              border: "2px solid #8B0000",
              marginBottom: 16,
            }}
          >
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
                  gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                  gap: 12,
                }}
              >
                <DetailBlock label="Appointment ID" value={appointmentInfo.id} />
                <DetailBlock label="Status" value={appointmentInfo.status} highlight />
                <DetailBlock label="Client" value={appointmentInfo.client} />
                <DetailBlock label="Worker" value={appointmentInfo.worker} />
                <DetailBlock label="Service" value={appointmentInfo.service} />
                <DetailBlock label="When" value={`${appointmentInfo.date} • ${appointmentInfo.time}`} />
                <DetailBlock
                  label="Location"
                  value={`${appointmentInfo.address.street}, ${appointmentInfo.address.city}, ${appointmentInfo.address.state}`}
                />
              </div>
            </div>

            {appointmentInfo.payments && (
              <div
                style={{
                  background: "#563727",
                  border: "2px solid #7A431D",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                <h3 style={{ marginTop: 0, marginBottom: 12, color: "#FFFFFF" }}>Payment Overview</h3>
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
                    gap: 12,
                  }}
                >
                  <DetailBlock label="Service Price" value={formatCurrency(appointmentInfo.price)} />
                  <DetailBlock
                    label="Deposit Required"
                    value={formatCurrency(appointmentInfo.payments.deposit_required)}
                  />
                  <DetailBlock
                    label="Paid So Far"
                    value={formatCurrency(appointmentInfo.payments.total_paid)}
                  />
                  <DetailBlock
                    label="Balance Due"
                    value={formatCurrency(appointmentInfo.payments.balance_due)}
                  />
                </div>
                <div style={{ marginTop: 12, color: "rgba(255,255,255,0.75)", fontSize: 13 }}>
                  Deposit rate: {(appointmentInfo.payments.deposit_rate * 100).toFixed(0)}%
                </div>
                {appointmentInfo.payments.deposit_outstanding > 0 ? (
                  <div style={{ marginTop: 12, color: "#F2A365", fontWeight: 600 }}>
                    Deposit outstanding: {formatCurrency(appointmentInfo.payments.deposit_outstanding)}
                  </div>
                ) : (
                  <div style={{ marginTop: 12, color: "#0C7C59", fontWeight: 600 }}>
                    Deposit fully paid.
                  </div>
                )}
              </div>
            )}

            <BeforeAfterImages appointmentId={appointmentInfo.id.toString()} theme="dark" />
            <AppointmentNotes appointmentId={appointmentInfo.id.toString()} theme="dark" />
          </>
        )}
      </div>
    </div>
  );
}

function DetailBlock({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string | number | null | undefined;
  highlight?: boolean;
}) {
  return (
    <div>
      <div style={{ color: "rgba(255,255,255,0.7)", fontSize: 12, fontWeight: 600 }}>{label}</div>
      <div
        style={{
          color: highlight ? "#DE9E48" : "#FFFFFF",
          fontWeight: highlight ? 700 : 600,
        }}
      >
        {value ?? "—"}
      </div>
    </div>
  );
}
