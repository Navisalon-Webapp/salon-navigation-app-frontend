import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import visa from "../assets/visa.png";
import mastercard from "../assets/mastercard.png";
import amex from "../assets/amex.png";
import discover from "../assets/discover.png";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

type PaymentMethod = {
  id: number;
  payment_type: string;
  cardholder_name: string;
  card_number: string;
  exp_month: string;
  exp_year: string;
};

interface AppliedDiscount {
  id: number | string;
  name: string;
  amount: number;
}

export default function PaymentMethodForm({ onSelectMethod, onClose, bid, isProductPurchase}: { onSelectMethod?: (method: PaymentMethod) => void; onClose?: () => void; bid: number; isProductPurchase?: boolean;}) {
  const { user } = useAuth();
  const [cardHolder, setCardHolder] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpMonth, setCardExpMonth] = useState("");
  const [cardExpYear, setCardExpYear] = useState("");
  const [cardCVV, setCardCVV] = useState("");
  const [cardType, setCardType] = useState<"visa" | "mastercard" | "amex" | "discover" | "debit">("debit");
  const [subtotal, setSubtotal] = useState(0);
  const [tax, setTax] = useState(0);
  const [total, setTotal] = useState(0);
  const [appliedDiscounts, setAppliedDiscounts] = useState<AppliedDiscount[]>([]);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<"idle" | "success" | "error">("idle");
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [saveMethod, setSaveMethod] = useState(true);
  const [selectedMethodId, setSelectedMethodId] = useState<number | "new" | null>(null);
  const [applicablePromos, setApplicablePromos] = useState<any[]>([]);
  const [applicableRewards, setApplicableRewards] = useState<any[]>([]);
  const [loyaltyBalance, setLoyaltyBalance] = useState(0);
  const [pointValue, setPointValue] = useState(0.1);
  const [pointsToRedeem, setPointsToRedeem] = useState(0);

  const manualDiscount = useMemo(() => {
    const raw = pointsToRedeem * pointValue;
    if (!Number.isFinite(raw) || raw < 0) {
      return 0;
    }
    return Number(raw.toFixed(2));
  }, [pointsToRedeem, pointValue]);

  const maxRedeemablePoints = useMemo(() => {
    const balanceCap = Math.floor(Math.max(loyaltyBalance, 0));
    if (!Number.isFinite(balanceCap) || balanceCap <= 0) {
      return 0;
    }
    if (pointValue <= 0) {
      return balanceCap;
    }
    const totalCap = Math.floor(Math.max(total, 0) / pointValue);
    if (!Number.isFinite(totalCap)) {
      return balanceCap;
    }
    return Math.max(0, Math.min(balanceCap, totalCap));
  }, [loyaltyBalance, pointValue, total]);

  useEffect(() => {
    setPointsToRedeem((prev) => Math.min(prev, maxRedeemablePoints));
  }, [maxRedeemablePoints]);

  const handleRedeemChange = useCallback(
    (value: string) => {
      const parsed = Number.parseInt(value, 10);
      if (Number.isNaN(parsed) || parsed < 0) {
        setPointsToRedeem(0);
        return;
      }
      setPointsToRedeem(Math.min(parsed, maxRedeemablePoints));
    },
    [maxRedeemablePoints]
  );

  const displayDiscounts = useMemo(() => {
    const base = appliedDiscounts || [];
    if (manualDiscount > 0) {
      return [
        ...base,
        {
          id: "loyalty-points",
          name: `Redeem ${pointsToRedeem} points`,
          amount: manualDiscount,
        },
      ];
    }
    return base;
  }, [appliedDiscounts, manualDiscount, pointsToRedeem]);

  const adjustedTotal = useMemo(() => {
    const remaining = total - manualDiscount;
    return remaining > 0 ? remaining.toFixed(2) : "0.00";
  }, [total, manualDiscount]);

  const shouldShowDiscountPanel = useMemo(() => {
    return (
      applicablePromos.length > 0 ||
      applicableRewards.length > 0 ||
      loyaltyBalance > 0 ||
      manualDiscount > 0
    );
  }, [applicablePromos.length, applicableRewards.length, loyaltyBalance, manualDiscount]);

  function detectCardType(num: string): string {
    const clean = num.replace(/\D/g, "");

    const patterns: Record<string, RegExp> = {
      visa: /^4[0-9]{6,}$/,
      mastercard: /^(5[1-5][0-9]{5,}|2[2-7][0-9]{5,})$/,
      amex: /^3[47][0-9]{5,}$/,
      discover: /^6(?:011|5[0-9]{2})[0-9]{3,}$/,
    };

    for (const brand in patterns) {
      if (patterns[brand].test(clean)) return brand;
    }
    return "debit";
  }


  const fetchMethods = useCallback(async () => {
    if (!user) {
      setMethods([]);
      return;
    }
    try {
      const res = await fetch(`${API}/payment/${user.id}`, { credentials: "include" });
      if (res.ok) {
        const data = await res.json();
        console.log("API Response for checkout modal:", data);
        setMethods(Array.isArray(data) ? data : []);
      } else {
        setMethods([]);
      }
    } catch {
      setMethods([]);
    }
  }, [user]);

  useEffect(() => {
    fetchMethods();
  }, [fetchMethods]);

  useEffect(() => {
  async function fetchDiscounts() {
    if (!user || !bid) return;

    const purchaseQuery = isProductPurchase ? "true" : "false";
    const res = await fetch(`${API}/transactions/details?is_product_purchase=${purchaseQuery}&bid=${bid}`, {
      credentials: "include"
    });

    if (res.ok) {
      const data = await res.json();
      const newSubtotal = Number(data.subtotal ?? 0);
      const newTax = Number(data.tax ?? 0);
      const newTotal = Number(data.total ?? 0);
      const newBalance = Number(data.loyalty_balance ?? 0);
      const newPointValue = Number(data.loyalty_point_value ?? 0.1);

      setApplicablePromos(Array.isArray(data.promotions) ? data.promotions : []);
      setApplicableRewards(Array.isArray(data.loyalty_progs) ? data.loyalty_progs : []);
      setSubtotal(Number.isFinite(newSubtotal) ? newSubtotal : 0);
      setTax(Number.isFinite(newTax) ? newTax : 0);
      setTotal(Number.isFinite(newTotal) ? newTotal : 0);
      setLoyaltyBalance(Number.isFinite(newBalance) ? newBalance : 0);
      setPointValue(Number.isFinite(newPointValue) && newPointValue > 0 ? newPointValue : 0.1);
      setPointsToRedeem((prev) => Math.min(prev, Math.floor(Math.max(Number.isFinite(newBalance) ? newBalance : 0, 0))));
      setAppliedDiscounts([
        ...(Array.isArray(data.promotions) ? data.promotions : []).map((p: any, idx: number) => ({
          id: p.promo_id ?? `promo-${idx}`,
          name: p.title || p.description || "Promotion",
          amount: Number(p.rwd_value ?? 0)
        })),
        ...(Array.isArray(data.loyalty_progs) ? data.loyalty_progs : []).map((r: any, idx: number) => ({
          id: r.rwd_id ?? `reward-${idx}`,
          name: r.title || r.description || "Reward",
          amount: Number(r.rwd_value ?? 0)
        }))
      ]);
    } else {
      setApplicablePromos([]);
      setApplicableRewards([]);
      setSubtotal(0);
      setTax(0);
      setTotal(0);
      setAppliedDiscounts([]);
      setLoyaltyBalance(0);
      setPointsToRedeem(0);
    }
  }

  fetchDiscounts();
}, [user, bid, isProductPurchase]);

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

    if (!cardHolder.trim()) {
      setStatus("error");
      setFeedback("Please provide the card holder's name.");
      return;
    }

    if (!cardNumber.trim()) {
      setStatus("error");
      setFeedback("Please provide your card number.");
      return;
    }

    if (!cardType.trim()) {
      setStatus("error");
      setFeedback("Please provide the card's type.");
      return;
    }

    if (!cardExpMonth.trim()) {
      setStatus("error");
      setFeedback("Please provide your card expiration month.");
      return;
    }

    if (!cardExpYear.trim()) {
      setStatus("error");
      setFeedback("Please provide your card expiration year.");
      return;
    }

    if (!cardCVV.trim()) {
      setStatus("error");
      setFeedback("Please provide your card CVV.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API}/payment/new/${user.id}`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment_type: cardType,
          cardholder_name: cardHolder,
          card_number: cardNumber,
          cvv: cardCVV,
          exp_month: cardExpMonth,
          exp_year: cardExpYear
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        console.error("Payment method save failed", data);
        setStatus("error");
        setFeedback(data?.message || "Failed to save payment method.");
      } else {
        setCardNumber("");
        setCardType("debit");
        setStatus("success");
        setFeedback("Payment method saved!");
        await fetchMethods();
        setSelectedMethodId(data.id); // automatically select new payment method
        if (onSelectMethod) onSelectMethod(data);

      }
    } catch (err: any) {
      console.error("Payment method save errored", err);
      setStatus("error");
      setFeedback("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  async function handleCheckout() {
    if (!selectedMethodId || selectedMethodId === "new" || typeof selectedMethodId !== "number") {
      setStatus("error");
      setFeedback("Please select a payment method");
      return;
    }

    const sanitizedPoints = Math.max(0, Math.min(pointsToRedeem, maxRedeemablePoints));
    const payload = {
      payment_method_id: selectedMethodId,
      bid,
      is_product_purchase: Boolean(isProductPurchase),
      loyalty_points_to_redeem: sanitizedPoints
    };

    console.log("CHECKOUT PAYLOAD:", payload);

    setLoading(true);
    setStatus("idle");
    setFeedback(null);

    try {
      const res = await fetch(`${API}/transactions/checkout/`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        setStatus("success");
        setFeedback("Checkout successful!");
        // Wait to show success message, then close and reload
        setTimeout(() => {
          onClose?.();
          // Reload the page to refresh cart
          window.location.reload();
        }, 2000);
      } else {
        const errorData = await res.json();
        setStatus("error");
        setFeedback(errorData.message || "Checkout failed. Please try again.");
      }
    } catch (error) {
      console.error("Checkout error:", error);
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
        <h1 style={{ marginBottom: 6, color: "#372C2E" }}>Checkout</h1>
        <h3 style={{ margin: 0, color: "#372C2E" }}>Payment Methods</h3>
        <p style={{ marginTop: 6, color: "#6B6B6B" }}>Add and manage payment methods for your account.</p>
      </div>

      <div style={{ display: "grid", gap: 12 }}>
        

        <div>
          <h2 style={{ margin: "8px 0", color: "#372C2E" }}>Saved payment methods</h2>
          <label
            style={{
              display: "flex",
              gap: 12,
              cursor: "pointer",
              padding: "14px 16px",
              border: "1px solid #E6E6E6",
              borderRadius: 12,
              background: "#fff",
              alignItems: "center"
            }}
          >
            <input
              type="radio"
              name="paymentSelect"
              value="new"
              checked={selectedMethodId === "new"}
              onChange={() => setSelectedMethodId("new")}
            />
            <div style={{ fontWeight: 600 }}>Add new payment method</div>
            
          </label>
          {selectedMethodId === "new" && (
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
            <label style={{ display: "flex", flexDirection: "column", flex: "2 1 220px" }}>
              <span style={{ fontWeight: 600, color: "#372C2E", marginBottom: 4 }}>Cardholder's Name</span>
              <input
                value={cardHolder}
                onChange={(e) => {
                  setCardHolder(e.target.value);
                  setStatus("idle");
                  setFeedback(null);
                }}
                placeholder="Jane Doe"
                style={inputStyle}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", flex: "2 1 220px" }}>
              <span style={{ fontWeight: 600, color: "#372C2E", marginBottom: 4 }}>Card Number</span>
              <input
                value={cardNumber}
                onChange={(e) => {
                  const type = detectCardType(e.target.value) as "visa" | "mastercard" | "amex" | "discover" | "debit";
                  setCardType(type);
                  setCardNumber(e.target.value);
                  setStatus("idle");
                  setFeedback(null);
                }}
                placeholder="XXXXXXXXXXXXXXXX"
                maxLength={19}
                style={inputStyle}
              />
            </label>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 16 }}>

              <label style={{ display: "flex", flexDirection: "column", flex: "1 1 150px" }}>
                <span style={{ fontWeight: 600, color: "#372C2E", marginBottom: 4 }}>Card Type</span>
                <div style={{ flex: "1", display: "flex", flexDirection: "row", gap: 16 }}>
                  <select
                    value={cardType}
                    onChange={(e) => {
                      setCardType(e.target.value as any);
                      setStatus("idle");
                      setFeedback(null);
                    }}
                    style={inputStyle}
                  >
                    <option value="">Select Type</option>
                    <option value="debit">Debit</option>
                    <option value="visa">Visa</option>
                    <option value="mastercard">Mastercard</option>
                    <option value="amex">American Express</option>
                    <option value="discover">Discover</option>
                  </select>
                  <div style={{ width: 40 }}>
                    {cardType === "visa" && <img src={visa} style={{ width: "100%" }} />}
                    {cardType === "mastercard" && <img src={mastercard} style={{ width: "100%" }} />}
                    {cardType === "amex" && <img src={amex} style={{ width: "100%" }} />}
                    {cardType === "discover" && <img src={discover} style={{ width: "100%" }} />}
                  </div>
                </div>
              </label>
              <div style={{ display: "flex", gap: 16 }}>
                <label style={{ flex: "1 1 120px", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600, color: "#372C2E", marginBottom: 4 }}>CVV</span>
                  <input
                    value={cardCVV}
                    onChange={(e) => setCardCVV(e.target.value)}
                    placeholder="XXX"
                    maxLength={4}
                    style={inputStyle}
                  />
                </label>
                <div style={{ flex: "1 1 160px", display: "flex", flexDirection: "column" }}>
                  <span style={{ fontWeight: 600, color: "#372C2E", marginBottom: 4 }}>
                    Expiration
                  </span>
                  <div style={{ display: "flex", gap: 8 }}>
                    <input
                      value={cardExpMonth}
                      onChange={(e) => setCardExpMonth(e.target.value)}
                      placeholder="MM"
                      maxLength={2}
                      style={{ ...inputStyle, width: "60px" }}
                    />
                    <label>/</label>
                    <input
                      value={cardExpYear}
                      onChange={(e) => setCardExpYear(e.target.value)}
                      placeholder="YYYY"
                      maxLength={4}
                      style={{ ...inputStyle, width: "60px" }}
                    />
                  </div>
                </div>
              </div>

              <label>
                <input
                  type="checkbox"
                  checked={saveMethod}
                  onChange={() => setSaveMethod(!saveMethod)}
                />
                Save this card to my account
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
                  color: "#FFFFFF",
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
        )}

          {/* Existing saved cards */}
          {methods.map((m) => {
            const type = m.payment_type.toLowerCase();

            return (
              <label
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "14px 16px",
                  border: "1px solid #E6E6E6",
                  borderRadius: 12,
                  background: "#fff",
                  cursor: "pointer",
                }}
              >
                <input
                  type="radio"
                  name="paymentSelect"
                  value={m.id}
                  checked={selectedMethodId === m.id}
                  onChange={() => setSelectedMethodId(m.id)}
                  style={{ marginRight: 12 }}
                />

                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <img
                    src={
                      type === "visa" ? visa :
                        type === "mastercard" ? mastercard :
                          type === "amex" ? amex :
                            type === "discover" ? discover :
                              visa
                    }
                    style={{ width: 36 }}
                  />

                  <div>
                    <div style={{ fontWeight: 700 }}>
                      {m.cardholder_name} •••• {last4(m.card_number)}
                    </div>
                    <div style={{ fontSize: 14, color: "#6B6B6B" }}>
                      Expires: {m.exp_month}/{m.exp_year}
                    </div>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={async (e) => {
                    e.stopPropagation();
                  }}
                  style={{
                    padding: "8px 12px",
                    borderRadius: 8,
                    border: "1px solid #E6E6E6",
                    background: "#FFF8EC",
                    color: "#C23B22",
                    fontWeight: 600,
                    cursor: "pointer",
                  }}
                >
                  Remove
                </button>
              </label>
            );
          })}
            {shouldShowDiscountPanel && (
  <div className="discount-box" style={{ padding: 16, backgroundColor: "#f9f9f9", borderRadius: 12, marginTop: 20 }}>
    {applicablePromos.length > 0 && (
      <div style={{ marginBottom: 16 }}>
        <h3>Active Promotions</h3>
        {applicablePromos.map(p => (
          <p key={p.promo_id} style={{ marginBottom: 6 }}>
            <strong>{p.title}</strong>: {p.description}
            {p.threshold && p.reward_type && (
              <span>
                {" "}
                —{" "}
                {p.reward_type === "product" 
                  ? `Buy ${p.threshold} get ${p.reward} free` 
                  : p.reward_type === "discount" 
                  ? `${p.reward}% off` 
                  : `${p.reward} ${p.reward_type}`}
              </span>
            )}
          </p>
        ))}
      </div>
    )}

    {applicableRewards.length > 0 && (
      <div style={{ marginBottom: 16 }}>
        <h3>Loyalty Rewards</h3>
        {applicableRewards.map(r => (
          <p key={r.rwd_id} style={{ marginBottom: 6 }}>
            {r.description}
            {r.threshold && r.reward_type && (
              <span>
                {" "}
                —{" "}
                {r.reward_type === "product" 
                  ? `Buy ${r.threshold} get ${r.reward} free` 
                  : r.reward_type === "discount" 
                  ? `${r.reward}% off` 
                  : `${r.reward} ${r.reward_type}`}
              </span>
            )}
          </p>
        ))}
      </div>
    )}

    <div style={{
      marginBottom: 16,
      padding: 16,
      background: "#FFFFFF",
      borderRadius: 10,
      border: "1px solid #ddd"
    }}>
      <h3 style={{ marginTop: 0 }}>Redeem Loyalty Points</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 6, fontSize: 14 }}>
        <span>Available balance: <strong>{Math.floor(loyaltyBalance)}</strong> pts</span>
        <span>Conversion: 1 pt = ${pointValue.toFixed(2)}</span>
      </div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, alignItems: "center", marginTop: 12 }}>
        <input
          type="number"
          min={0}
          max={maxRedeemablePoints}
          value={pointsToRedeem}
          onChange={(e) => handleRedeemChange(e.target.value)}
          disabled={loyaltyBalance <= 0 || pointValue <= 0}
          style={{
            padding: "8px 10px",
            borderRadius: 8,
            border: "1px solid #ccc",
            width: 120
          }}
        />
        <button
          type="button"
          onClick={() => setPointsToRedeem(maxRedeemablePoints)}
          disabled={maxRedeemablePoints <= 0}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #DE9E48",
            background: maxRedeemablePoints > 0 ? "#FFF2DE" : "#F3F3F3",
            color: "#372C2E",
            cursor: maxRedeemablePoints > 0 ? "pointer" : "not-allowed",
            fontWeight: 600
          }}
        >
          Use Max
        </button>
        <button
          type="button"
          onClick={() => setPointsToRedeem(0)}
          style={{
            padding: "8px 14px",
            borderRadius: 8,
            border: "1px solid #ccc",
            background: "#FFFFFF",
            color: "#372C2E",
            cursor: "pointer"
          }}
        >
          Clear
        </button>
      </div>
      <div style={{ marginTop: 10, fontWeight: 600, color: "#372C2E" }}>
        Instant discount: ${manualDiscount.toFixed(2)}
      </div>
      {maxRedeemablePoints < Math.floor(loyaltyBalance) && pointValue > 0 && (
        <div style={{ marginTop: 8, fontSize: 12, color: "#6B6B6B" }}>
          Limited to keep total above $0.00 for this checkout.
        </div>
      )}
    </div>

    <div style={{ marginTop: 12, paddingTop: 12, borderTop: "1px solid #ddd" }}>
      <h4>Transaction Total</h4>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span>Subtotal:</span>
        <span>${Number.isFinite(subtotal) ? subtotal.toFixed(2) : "0.00"}</span>
      </div>
      {displayDiscounts.length > 0 && (
        <div style={{ marginTop: 8 }}>
          {displayDiscounts.map((d) => {
            const amountValue = Number(d.amount ?? 0);
            const formattedAmount = Number.isFinite(amountValue) ? amountValue.toFixed(2) : "0.00";
            return (
              <div key={d.id} style={{ display: "flex", justifyContent: "space-between", color: "#C23B22" }}>
                <span>{d.name}</span>
                <span>- ${formattedAmount}</span>
              </div>
            );
          })}
        </div>
      )}
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span>Tax (6.125%):</span>
        <span>${Number.isFinite(tax) ? tax.toFixed(2) : "0.00"}</span>
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", fontWeight: 700, fontSize: 18 }}>
        <span>Total:</span>
        <span>${adjustedTotal}</span>
      </div>
    </div>
  </div>
)}

          {selectedMethodId !== null && (
  <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
    
    {/* Feedback message for checkout */}
    {feedback && (
      <div style={{
        padding: "12px",
        borderRadius: 8,
        textAlign: "center",
        fontWeight: 600,
        backgroundColor: status === "success" ? "#d4edda" : status === "error" ? "#f8d7da" : "#fff3cd",
        color: status === "success" ? "#155724" : status === "error" ? "#721c24" : "#856404",
        border: `1px solid ${status === "success" ? "#c3e6cb" : status === "error" ? "#f5c6cb" : "#ffeeba"}`
      }}>
        {feedback}
      </div>
    )}

    <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
    <button
      style={{
        flex: 1,
        padding: "14px",
        background: "#DE9E48",
        color: "#fff",
        border: "none",
        borderRadius: 10,
        fontWeight: 700,
        cursor: loading ? "not-allowed" : "pointer",
        opacity: loading ? 0.6 : 1,
      }}
      onClick={handleCheckout}
      disabled={loading}
    >
      {loading ? "Processing..." : "Checkout"}
    </button>

    <button
      style={{
        flex: 1,
        padding: "12px",
        border: "1px solid #ddd",
        borderRadius: 10,
        cursor: "pointer",
      }}
      onClick={() => {setSelectedMethodId(null); if (onSelectMethod) onSelectMethod(null as any); if (onClose) onClose();}}
    >
      Cancel
    </button>
    </div>
  </div>
)}

        </div>
      </div>
    </div>
  );
}
