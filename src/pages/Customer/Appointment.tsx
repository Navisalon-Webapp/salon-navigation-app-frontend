import { useCallback, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppointmentNotes from "../../components/AppointmentNotes";
import BeforeAfterImages from "../../components/BeforeAfterImages";
import { useAuth } from "../../auth/AuthContext";

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

type SavedPaymentMethod = {
  id: number;
  payment_type: string;
  cardholder_name?: string;
  card_last4?: string;
  exp_month?: string;
  exp_year?: string;
};

const formatCurrency = (value: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value || 0);

export default function AppointmentPage() {
  const { appointmentId } = useParams<{ appointmentId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [appointmentInfo, setAppointmentInfo] = useState<AppointmentInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<SavedPaymentMethod[]>([]);
  const [selectedPaymentId, setSelectedPaymentId] = useState<number | "">("");
  const [depositFeedback, setDepositFeedback] = useState<string | null>(null);
  const [depositError, setDepositError] = useState<string | null>(null);
  const [payingDeposit, setPayingDeposit] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const [savingCard, setSavingCard] = useState(false);
  const [newCardHolder, setNewCardHolder] = useState("");
  const [newCardNumber, setNewCardNumber] = useState("");
  const [newCardMonth, setNewCardMonth] = useState("");
  const [newCardYear, setNewCardYear] = useState("");
  const [newCardCvv, setNewCardCvv] = useState("");
  const [newCardType, setNewCardType] = useState("debit");
  const addCardLabelStyle = { display: "flex", flexDirection: "column" as const, gap: 4, width: "100%" };
  const addCardInputStyle = {
    padding: 8,
    borderRadius: 6,
    border: "1px solid #DE9E48",
    width: "100%",
    boxSizing: "border-box" as const,
  };

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
        setDepositError(null);
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

  const fetchPaymentMethods = useCallback(async () => {
    if (!user) {
      setPaymentMethods([]);
      setSelectedPaymentId("");
      return;
    }

    try {
      const res = await fetch(`${API}/payment/${user.id}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        const parsed: SavedPaymentMethod[] = Array.isArray(data)
          ? data.map((item) => ({
              id: item.id,
              payment_type: item.payment_type,
              cardholder_name: item.cardholder_name,
              card_last4: item.card_last4,
              exp_month: item.exp_month,
              exp_year: item.exp_year,
            }))
          : [];
        setPaymentMethods(parsed);
        setSelectedPaymentId((prev) => {
          if (parsed.length === 0) return "";
          return prev === "" ? parsed[0].id : prev;
        });
      } else {
        setPaymentMethods([]);
        setSelectedPaymentId("");
      }
    } catch (err) {
      console.error("Failed to load payment methods", err);
      setPaymentMethods([]);
      setSelectedPaymentId("");
    }
  }, [user]);

  useEffect(() => {
    if (appointmentId) {
      setDepositFeedback(null);
      setDepositError(null);
      fetchAppointment(appointmentId);
    }
  }, [appointmentId]);

  useEffect(() => {
    fetchPaymentMethods();
  }, [fetchPaymentMethods]);

  const handlePayDeposit = async () => {
    if (!appointmentInfo || appointmentInfo.payments?.deposit_outstanding === undefined) return;
    if (!selectedPaymentId) {
      setDepositError("Please select a payment method.");
      return;
    }

    setPayingDeposit(true);
    setDepositError(null);
    setDepositFeedback(null);

    try {
      const res = await fetch(`${API}/deposit/appointment`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aid: appointmentInfo.id, payment_id: selectedPaymentId }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to pay deposit");
      }

      setDepositFeedback(
        `Deposit payment successful. Charged ${formatCurrency(data.deposit ?? appointmentInfo.payments.deposit_required)}.`
      );
      await fetchAppointment(String(appointmentInfo.id));
      await fetchPaymentMethods();
    } catch (err: any) {
      console.error("Deposit payment failed", err);
      setDepositError(err.message || "Failed to pay deposit");
    } finally {
      setPayingDeposit(false);
    }
  };

  const handleSaveCard = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setDepositError("Please sign in to save a payment method.");
      return;
    }

    if (!newCardHolder || !newCardNumber || !newCardMonth || !newCardYear || !newCardCvv) {
      setDepositError("Please complete all card fields.");
      return;
    }

    setSavingCard(true);
    setDepositError(null);
    setDepositFeedback(null);

    try {
      const res = await fetch(`${API}/payment/new/${user.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_type: newCardType,
          cardholder_name: newCardHolder,
          card_number: newCardNumber,
          cvv: newCardCvv,
          exp_month: newCardMonth,
          exp_year: newCardYear,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to save payment method");
      }

      await fetchPaymentMethods();
      setSelectedPaymentId(Number(data.payment_id));
      setShowAddCard(false);
      setDepositFeedback("Payment method saved.");
      setNewCardHolder("");
      setNewCardNumber("");
      setNewCardMonth("");
      setNewCardYear("");
      setNewCardCvv("");
      setNewCardType("debit");
    } catch (err: any) {
      console.error("Saving card failed", err);
      setDepositError(err.message || "Failed to save payment method");
    } finally {
      setSavingCard(false);
    }
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
          color: "#7A431D",
          fontWeight: 600,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        ← Back to appointments
      </button>

      {loading && (
        <div style={{ color: "#372C2E", padding: "2rem" }}>
          Loading appointment details...
        </div>
      )}

      {error && (
        <div style={{ 
          color: "#C62828", 
          padding: "1rem", 
          backgroundColor: "#FFEBEE", 
          borderRadius: 8,
          border: "1px solid #EF5350",
          marginBottom: 16
        }}>
          {error}
        </div>
      )}

      {!loading && !error && appointmentInfo && (
        <>
          <div
            style={{
              background: "#FFF9F4",
              border: "1px solid #DE9E48",
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
                <div style={{ color: "rgba(55, 44, 46, 0.7)", fontSize: 12, fontWeight: 600 }}>
                  Appointment ID
                </div>
                <div style={{ color: "#372C2E", fontWeight: 600 }}>
                  {appointmentInfo.id}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(55, 44, 46, 0.7)", fontSize: 12, fontWeight: 600 }}>
                  Status
                </div>
                <div style={{ color: "#DE9E48", fontWeight: 600 }}>
                  {appointmentInfo.status}
                </div>
              </div>
              <div>
                <div style={{ color: "rgba(55, 44, 46, 0.7)", fontSize: 12, fontWeight: 600 }}>
                  Client
                </div>
                <div style={{ color: "#372C2E" }}>{appointmentInfo.client}</div>
              </div>
              <div>
                <div style={{ color: "rgba(55, 44, 46, 0.7)", fontSize: 12, fontWeight: 600 }}>
                  Worker
                </div>
                <div style={{ color: "#372C2E" }}>{appointmentInfo.worker}</div>
              </div>
              <div>
                <div style={{ color: "rgba(55, 44, 46, 0.7)", fontSize: 12, fontWeight: 600 }}>
                  Service
                </div>
                <div style={{ color: "#372C2E" }}>{appointmentInfo.service}</div>
              </div>
              <div>
                <div style={{ color: "rgba(55, 44, 46, 0.7)", fontSize: 12, fontWeight: 600 }}>
                  When
                </div>
                <div style={{ color: "#372C2E" }}>
                  {appointmentInfo.date} • {appointmentInfo.time}
                </div>
              </div>
            </div>
          </div>

          {appointmentInfo.payments && (
            <div
              style={{
                background: "#FFF9F4",
                border: "1px solid #DE9E48",
                borderRadius: 8,
                padding: 16,
                marginBottom: 16,
              }}
            >
              <h3 style={{ marginTop: 0, marginBottom: 12, color: "#372C2E" }}>Payment Summary</h3>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12 }}>
                <div>
                  <div style={{ color: "rgba(55,44,46,0.7)", fontSize: 12, fontWeight: 600 }}>Service Price</div>
                  <div style={{ color: "#372C2E", fontWeight: 600 }}>{formatCurrency(appointmentInfo.price)}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(55,44,46,0.7)", fontSize: 12, fontWeight: 600 }}>Deposit Required</div>
                  <div style={{ color: "#372C2E" }}>{formatCurrency(appointmentInfo.payments.deposit_required)}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(55,44,46,0.7)", fontSize: 12, fontWeight: 600 }}>Paid So Far</div>
                  <div style={{ color: "#372C2E" }}>{formatCurrency(appointmentInfo.payments.total_paid)}</div>
                </div>
                <div>
                  <div style={{ color: "rgba(55,44,46,0.7)", fontSize: 12, fontWeight: 600 }}>Balance Due</div>
                  <div style={{ color: "#372C2E" }}>{formatCurrency(appointmentInfo.payments.balance_due)}</div>
                </div>
              </div>
              <div style={{ marginTop: 12, color: "rgba(55,44,46,0.7)", fontSize: 13 }}>
                Deposit rate: {(appointmentInfo.payments.deposit_rate * 100).toFixed(0)}%
              </div>

              {appointmentInfo.payments.deposit_outstanding > 0 ? (
                <div style={{ marginTop: 16 }}>
                  <h4 style={{ margin: "0 0 8px", color: "#372C2E" }}>Deposit Outstanding</h4>
                  <p style={{ margin: "0 0 12px", color: "#372C2E" }}>
                    You still owe {formatCurrency(appointmentInfo.payments.deposit_outstanding)} to secure this appointment.
                  </p>

                  {paymentMethods.length > 0 ? (
                    <label style={{ display: "flex", flexDirection: "column", gap: 6, maxWidth: 320 }}>
                      <span style={{ color: "rgba(55,44,46,0.7)", fontSize: 12, fontWeight: 600 }}>Select a payment method</span>
                      <select
                        value={selectedPaymentId}
                        onChange={(e) => setSelectedPaymentId(e.target.value === "" ? "" : Number(e.target.value))}
                        style={{ padding: 10, borderRadius: 6, border: "1px solid #DE9E48" }}
                      >
                        <option value="">— Select —</option>
                        {paymentMethods.map((method) => (
                          <option key={method.id} value={method.id}>
                            {method.cardholder_name || "Card"} •••• {method.card_last4 || ""}
                          </option>
                        ))}
                      </select>
                    </label>
                  ) : (
                    <div style={{ marginBottom: 12, color: "#C62828" }}>
                      No saved payment methods yet. Add one below to pay the deposit.
                    </div>
                  )}

                  <div style={{ display: "flex", gap: 12, marginTop: 12, flexWrap: "wrap" }}>
                    <button
                      onClick={handlePayDeposit}
                      disabled={payingDeposit || !selectedPaymentId}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "none",
                        background: "#DE9E48",
                        color: "#372C2E",
                        fontWeight: 600,
                        cursor: payingDeposit || !selectedPaymentId ? "not-allowed" : "pointer",
                        opacity: payingDeposit || !selectedPaymentId ? 0.7 : 1,
                      }}
                    >
                      {payingDeposit ? "Processing..." : `Pay ${formatCurrency(appointmentInfo.payments.deposit_outstanding)}`}
                    </button>

                    <button
                      type="button"
                      onClick={() => setShowAddCard((prev) => !prev)}
                      style={{
                        padding: "10px 16px",
                        borderRadius: 8,
                        border: "1px solid #7A431D",
                        background: "transparent",
                        color: "#7A431D",
                        fontWeight: 600,
                        cursor: "pointer",
                      }}
                    >
                      {showAddCard ? "Cancel" : "Add new card"}
                    </button>
                  </div>

                  {depositError && (
                    <div style={{ marginTop: 10, color: "#C62828" }}>{depositError}</div>
                  )}
                  {depositFeedback && (
                    <div style={{ marginTop: 10, color: "#0C7C59" }}>{depositFeedback}</div>
                  )}

                  {showAddCard && (
                    <form
                      onSubmit={handleSaveCard}
                      style={{
                        marginTop: 16,
                        display: "grid",
                        gap: 12,
                        padding: 16,
                        border: "1px solid #DE9E48",
                        borderRadius: 8,
                        background: "#FFFFFF",
                        maxWidth: 480,
                        width: "100%",
                        boxSizing: "border-box",
                      }}
                    >
                      <label style={addCardLabelStyle}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#372C2E" }}>Cardholder name</span>
                        <input
                          value={newCardHolder}
                          onChange={(e) => setNewCardHolder(e.target.value)}
                          style={addCardInputStyle}
                          placeholder="Jane Doe"
                        />
                      </label>

                      <label style={addCardLabelStyle}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#372C2E" }}>Card number</span>
                        <input
                          value={newCardNumber}
                          onChange={(e) => setNewCardNumber(e.target.value)}
                          style={addCardInputStyle}
                          placeholder="1234 5678 9012 3456"
                        />
                      </label>

                      <div
                        style={{
                          display: "grid",
                          gap: 12,
                          gridTemplateColumns: "repeat(auto-fit, minmax(110px, 1fr))",
                          width: "100%",
                        }}
                      >
                        <label style={{ ...addCardLabelStyle, flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#372C2E" }}>Exp. month</span>
                          <input
                            value={newCardMonth}
                            onChange={(e) => setNewCardMonth(e.target.value)}
                            style={addCardInputStyle}
                            placeholder="MM"
                          />
                        </label>
                        <label style={{ ...addCardLabelStyle, flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#372C2E" }}>Exp. year</span>
                          <input
                            value={newCardYear}
                            onChange={(e) => setNewCardYear(e.target.value)}
                            style={addCardInputStyle}
                            placeholder="YYYY"
                          />
                        </label>
                        <label style={{ ...addCardLabelStyle, flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: 12, fontWeight: 600, color: "#372C2E" }}>CVV</span>
                          <input
                            value={newCardCvv}
                            onChange={(e) => setNewCardCvv(e.target.value)}
                            style={addCardInputStyle}
                            placeholder="123"
                          />
                        </label>
                      </div>

                      <label style={addCardLabelStyle}>
                        <span style={{ fontSize: 12, fontWeight: 600, color: "#372C2E" }}>Card type</span>
                        <select
                          value={newCardType}
                          onChange={(e) => setNewCardType(e.target.value)}
                          style={addCardInputStyle}
                        >
                          <option value="debit">Debit</option>
                          <option value="visa">Visa</option>
                          <option value="mastercard">Mastercard</option>
                          <option value="amex">American Express</option>
                          <option value="discover">Discover</option>
                        </select>
                      </label>

                      <button
                        type="submit"
                        disabled={savingCard}
                        style={{
                          padding: "10px 16px",
                          borderRadius: 8,
                          border: "none",
                          background: "#DE9E48",
                          color: "#372C2E",
                          fontWeight: 600,
                          cursor: savingCard ? "not-allowed" : "pointer",
                          opacity: savingCard ? 0.7 : 1,
                          width: "100%",
                        }}
                      >
                        {savingCard ? "Saving..." : "Save card"}
                      </button>
                    </form>
                  )}
                </div>
              ) : (
                <div style={{ marginTop: 16, color: "#0C7C59", fontWeight: 600 }}>
                  Deposit fully paid. Thank you!
                </div>
              )}
            </div>
          )}

          <BeforeAfterImages appointmentId={appointmentInfo.id.toString()} />

          <AppointmentNotes appointmentId={appointmentInfo.id.toString()} />
        </>
      )}
    </div>
  );
}
