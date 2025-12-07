import { useCallback, useEffect, useRef, useState } from "react";
import RewardRing from "../../components/Rewards/RewardRing";
import RewardsPopup from "../../components/Rewards/RewardsPopup";

type Salon = {
  id: string;
  bid: number;
  name: string;
  points: number;
  goal: number;
  address?: string;
  programType?: string | null;
  rewardType?: string | null;
  rewardValue?: number | null;
};

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

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

export default function Home() {
  const [open, setOpen] = useState(false);
  const [salons, setSalons] = useState<Salon[]>([]);
  const [loading, setLoading] = useState(true);
  const [loyaltyError, setLoyaltyError] = useState<string | null>(null);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [prevAppointment, setPrevAppointment] = useState<any | null>(null);
  const [futureAppointment, setFutureAppointment] = useState<any | null>(null);
  const [apptLoading, setApptLoading] = useState(true);

  const mountedRef = useRef(true);
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  const fetchLoyaltyPoints = useCallback(async () => {
    setLoading(true);
    setLoyaltyError(null);
    try {
      const response = await fetch(`${API_BASE}/api/clients/view-loyalty-points`, {
        credentials: "include",
      });

      if (!mountedRef.current) {
        return;
      }

      if (response.ok) {
        const data = await response.json();
        setSalons(Array.isArray(data) ? data : []);
      } else {
        console.error("Failed to fetch loyalty points");
        setSalons([]);
        setLoyaltyError("Unable to load loyalty rewards right now.");
      }
    } catch (error) {
      console.error("Error fetching loyalty points:", error);
      if (mountedRef.current) {
        setSalons([]);
        setLoyaltyError("Unable to load loyalty rewards right now.");
      }
    } finally {
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, []);

  useEffect(() => {
    void fetchLoyaltyPoints();
  }, [fetchLoyaltyPoints]);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await fetch(`${API_BASE}/api/clients/view-cart`, { credentials: "include" });
        if (res.ok) {
          const data = await res.json();
          setCartItems(data.cart_items || data.items || []);
        } else {
          setCartItems([]);
        }
      } catch {
        setCartItems([]);
      } finally {
        setCartLoading(false);
      }
    };
    fetchCart();
  }, []);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const pastRes = await fetch(`${API_BASE}/api/clients/view-prev-appointments`, {
          credentials: "include",
        });
        let prev = null;
        if (pastRes.ok) {
          const data = await pastRes.json();
          if (Array.isArray(data) && data.length > 0) {
            prev = data[data.length - 1];
          }
        }
        setPrevAppointment(prev);

        const futureRes = await fetch(`${API_BASE}/api/clients/view-future-appointments`, {
          credentials: "include",
        });
        let future = null;
        if (futureRes.ok) {
          const data = await futureRes.json();
          if (Array.isArray(data) && data.length > 0) {
            future = data[0];
          }
        }
        setFutureAppointment(future);
      } catch {
        setPrevAppointment(null);
        setFutureAppointment(null);
      } finally {
        setApptLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  const topSalon = salons.length > 0 
    ? salons.reduce((max, salon) => salon.points > max.points ? salon : max, salons[0])
    : null;

  const currentPoints = topSalon?.points || 0;
  const goalPoints = topSalon?.goal || 100;

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
        Home
      </h1>

      <div
        style={{
          display: "flex",
          gap: 20,
          justifyContent: "space-between",
          flexWrap: "wrap",
        }}
      >
        {/* Loyalty Rewards Box */}
        {loading ? (
          <div
            style={{
              backgroundColor: "#DE9E48",
              borderRadius: 12,
              padding: 20,
              width: 300,
              minHeight: 340,
              color: "#FFFFFF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
            }}
          >
            Loading rewards...
          </div>
        ) : loyaltyError ? (
          <div
            style={{
              backgroundColor: "#DE9E48",
              borderRadius: 12,
              padding: 20,
              width: 300,
              minHeight: 340,
              color: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Loyalty Rewards</div>
            <div>{loyaltyError}</div>
          </div>
        ) : salons.length === 0 ? (
          <div
            style={{
              backgroundColor: "#DE9E48",
              borderRadius: 12,
              padding: 20,
              width: 300,
              minHeight: 340,
              color: "#FFFFFF",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
              textAlign: "center",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 8 }}>Loyalty Rewards</div>
            <div>No rewards yet. Visit a salon to start earning!</div>
          </div>
        ) : (
          <button
            type="button"
            onClick={() => setOpen(true)}
            aria-haspopup="dialog"
            aria-expanded={open}
            style={{ all: "unset", cursor: "pointer" }}
          >
            <RewardRing 
              current={currentPoints} 
              goal={goalPoints}
              salonName={topSalon?.name || "Salon"}
            />
          </button>
        )}

        {/* Cart Items Box */}
        <div
          style={{
            backgroundColor: "#DE9E48",
            borderRadius: 12,
            padding: 20,
            width: 300,
            minHeight: 320,
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
            Your Cart
          </div>
          {cartLoading ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              Loading cart...
            </div>
          ) : cartItems.length === 0 ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", textAlign: "center" }}>
              No items in cart.
            </div>
          ) : (
            <div style={{ flex: 1, overflowY: "auto" }}>
              {cartItems.slice(0, 2).map((item) => (
                <div
                  key={item.cart_id || item.name}
                  style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    padding: 10,
                    marginBottom: 10,
                    borderRadius: 8,
                  }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>{item.name}</div>
                  <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 4 }}>{item.business_name}</div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: "bold" }}>${item.price?.toFixed(2) ?? ""}</span>
                    <span style={{ fontSize: 13 }}>Qty: {item.amount ?? item.quantity ?? 1}</span>
                  </div>
                </div>
              ))}
              {cartItems.length > 2 && (
                <div style={{ fontSize: 13, opacity: 0.9, marginTop: 8 }}>
                  ...and {cartItems.length - 2} more item{cartItems.length - 2 !== 1 ? 's' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Appointments Box */}
        <div
          style={{
            backgroundColor: "#DE9E48",
            borderRadius: 12,
            padding: 20,
            width: 300,
            minHeight: 320,
            color: "#FFFFFF",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          }}
        >
          <div style={{ fontWeight: 700, fontSize: 18, marginBottom: 12 }}>
            Appointments
          </div>
          {apptLoading ? (
            <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center" }}>
              Loading appointments...
            </div>
          ) : (
            <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 12 }}>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Upcoming:</div>
                {futureAppointment ? (
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {futureAppointment.service_name || "Service"}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 2 }}>
                      {futureAppointment.employee_first_name && futureAppointment.employee_last_name
                        ? `${futureAppointment.employee_first_name} ${futureAppointment.employee_last_name}`
                        : ""}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>
                      {formatDate(futureAppointment.start_time)} at {formatTime(futureAppointment.start_time)}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 14, opacity: 0.8 }}>None scheduled</div>
                )}
              </div>
              <div>
                <div style={{ fontWeight: 600, marginBottom: 6 }}>Previous:</div>
                {prevAppointment ? (
                  <div
                    style={{
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      padding: 10,
                      borderRadius: 8,
                    }}
                  >
                    <div style={{ fontWeight: 600, marginBottom: 4 }}>
                      {prevAppointment.service_name || "Service"}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.9, marginBottom: 2 }}>
                      {prevAppointment.employee_first_name && prevAppointment.employee_last_name
                        ? `${prevAppointment.employee_first_name} ${prevAppointment.employee_last_name}`
                        : ""}
                    </div>
                    <div style={{ fontSize: 13, opacity: 0.9 }}>
                      {formatDate(prevAppointment.start_time)} at {formatTime(prevAppointment.start_time)}
                    </div>
                  </div>
                ) : (
                  <div style={{ fontSize: 14, opacity: 0.8 }}>None</div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

        <RewardsPopup
        open={open}
        onClose={() => setOpen(false)}
        salons={salons}
        onRedeemed={() => void fetchLoyaltyPoints()}
      />
    </div>
  );
}
