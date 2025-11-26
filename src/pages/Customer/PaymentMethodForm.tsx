import React, { useCallback, useEffect, useState } from "react";
import { useAuth } from "../../auth/AuthContext";

const API = "http://localhost:5000";

type PaymentMethod = {
  id: number;
  payment_type: string;
  card_number: string | null;
};

export default function PaymentMethodForm() {
  const { user } = useAuth();
  const [cardNumber, setCardNumber] = useState("");
  const [cardType, setCardType] = useState<"credit" | "debit">("credit");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [fetching, setFetching] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const fetchMethods = useCallback(async () => {
    if (!user) {
      setMethods([]);
      return;
    }
    setFetching(true);
    try {
      const res = await fetch(`${API}/payment/${user.id}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        setMethods(Array.isArray(data) ? data : []);
      } else {
        setMethods([]);
      }
    } catch {
      setMethods([]);
    } finally {
      setFetching(false);
    }
  }, [user]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  function last4(card?: string | null) {
    if (!card) return "••••";
    const s = String(card).replace(/\s+/g, "");
    return s.length <= 4 ? s : s.slice(-4);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("idle");
    setFeedback(null);

    if (!user) {
      setStatus("error");
      setFeedback("Please sign in to manage payment methods.");
      return;
    }

    if (!cardNumber.trim()) {
      setStatus("error");
      setFeedback("Please provide your card number.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/payment/new/${user.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payment_type: cardType, card_number: cardNumber }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Payment method save failed", data);
        setStatus("error");
        setFeedback(data?.message || "Failed to save payment method.");
      } else {
        setCardNumber("");
        setCardType("credit");
        setStatus("success");
        setFeedback("Payment method saved!");
        await fetchMethods();
      }
    } catch (err: any) {
      console.error("Payment method save errored", err);
      setStatus("error");
      setFeedback("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  const containerStyle: React.CSSProperties = { display: "grid", gap: 16 };
  const inputStyle: React.CSSProperties = { padding: 8, borderRadius: 4, border: "1px solid #ddd" };

  return (
    <div style={containerStyle}>
      <div>
        <h1 style={{ margin: 0, color: "#372C2E" }}>Payment Methods</h1>
        <p style={{ marginTop: 6, color: "#6B6B6B" }}>Add and manage payment methods for your account.</p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        <form
          onSubmit={handleSubmit}
          style={{
            display: "grid",
            gap: 12,
            padding: "16px 18px",
            border: "1px solid #E6E6E6",
            borderRadius: 12,
            background: "#fff",
          }}
        >
          <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>
            <label style={{ display: "flex", flexDirection: "column", minWidth: 160, flex: "1 1 150px" }}>
              <span style={{ fontWeight: 600, color: "#372C2E", marginBottom: 4 }}>Card Type</span>
              <select
                value={cardType}
                onChange={(e) => {
                  const value = e.target.value === "debit" ? "debit" : "credit";
                  setCardType(value);
                  setStatus("idle");
                  setFeedback(null);
                }}
                style={inputStyle}
              >
                <option value="credit">Credit</option>
                <option value="debit">Debit</option>
              </select>
            </label>

            <label style={{ display: "flex", flexDirection: "column", flex: "2 1 220px" }}>
              <span style={{ fontWeight: 600, color: "#372C2E", marginBottom: 4 }}>Card Number</span>
              <input
                value={cardNumber}
                onChange={(e) => {
                  setCardNumber(e.target.value);
                  setStatus("idle");
                  setFeedback(null);
                }}
                placeholder="4242 4242 4242 4242"
                style={inputStyle}
              />
            </label>
          </div>

          <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "12px 18px",
                fontWeight: 700,
                borderRadius: 10,
                background: "#DE9E48",
                color: "#372C2E",
                border: "none",
                cursor: loading ? "not-allowed" : "pointer",
              }}
            >
              {loading ? "Saving..." : "Save payment method"}
            </button>
            {status === "success" && feedback && <span style={{ color: "#0C7C59" }}>{feedback}</span>}
            {status === "error" && feedback && <span style={{ color: "#C23B22" }}>{feedback}</span>}
          </div>
        </form>

        <div>
          <h2 style={{ margin: "8px 0", color: "#372C2E" }}>Saved payment methods</h2>
          <div style={{ display: "grid", gap: 12 }}>
            {fetching && <div style={{ color: "#6B6B6B" }}>Loading your payment methods...</div>}
            {!fetching && methods.length === 0 && <div style={{ color: "#6B6B6B" }}>No saved payment methods.</div>}
            {methods.map((m) => {
              const type = (m.payment_type || "").toLowerCase();
              const isCardLike = type === "card" || type === "credit" || type === "debit";
              const friendlyLabel =
                type === "credit"
                  ? "Credit Card"
                  : type === "debit"
                  ? "Debit Card"
                  : type === "card"
                  ? "Card"
                  : m.payment_type;

              return (
                <div
                  key={m.id}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    padding: "14px 16px",
                    border: "1px solid #E6E6E6",
                    borderRadius: 12,
                    background: "#fff",
                  }}
                >
                  <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                    <div
                      style={{
                        width: 44,
                        height: 32,
                        background: "#FFF8EC",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        borderRadius: 8,
                        fontWeight: 700,
                        fontSize: 18,
                      }}
                    >
                      {isCardLike ? "💳" : "💵"}
                    </div>
                    <div>
                      <div style={{ fontWeight: 700, color: "#372C2E" }}>{friendlyLabel}</div>
                      <div style={{ color: "#6B6B6B", fontSize: 14 }}>
                        {isCardLike ? `•••• ${last4(m.card_number)}` : "Cash payments"}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
