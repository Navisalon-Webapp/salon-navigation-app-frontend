import React, { useState, useEffect } from "react";

interface CartItem {
  cart_id: number;
  pid: number;
  name: string;
  price: number;
  amount: number;
  total: number;
  business_name: string;
  image?: string;
}

export default function Cart() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [checkoutModalOpen, setCheckoutModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    cardNumber: "",
    expiry: "",
    cvv: "",
  });

  const backendBase = "http://localhost:5000";

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${backendBase}/api/clients/view-cart`, {
        credentials: "include",
      });
      
      if (res.ok) {
        const data = await res.json();
        setCartItems(data.cart_items || []);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to fetch cart");
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
      setError("An error occurred while fetching your cart");
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (cartItemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;

    try {
      const res = await fetch(`${backendBase}/api/clients/alter-cart/${cartItemId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ amount: newQuantity }),
      });
      
      if (res.ok) {
        // Update UI
        setCartItems((prev) =>
          prev.map((item) =>
            item.cart_id === cartItemId
              ? { ...item, amount: newQuantity, total: item.price * newQuantity }
              : item
          )
        );
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to update quantity");
      }
    } catch (err) {
      console.error("Failed to update quantity:", err);
      setError("An error occurred while updating quantity");
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      const res = await fetch(`${backendBase}/api/clients/manage-carts/delete-cart-item/${cartItemId}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (res.ok) {
        // Update UI
        setCartItems((prev) =>
          prev.filter((item) => item.cart_id !== cartItemId)
        );
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Failed to remove item");
      }
    } catch (err) {
      console.error("Failed to remove item:", err);
      setError("An error occurred while removing item");
    }
  };

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setCheckoutLoading(true);
    setError(null);
    
    try {
      const res = await fetch(`${backendBase}/api/clients/checkout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(formData),
      });
      
      if (res.ok) {
        setCheckoutSuccess(true);
        setCartItems([]);
        setCheckoutModalOpen(false);
        setFormData({
          name: "",
          email: "",
          cardNumber: "",
          expiry: "",
          cvv: "",
        });
        setTimeout(() => setCheckoutSuccess(false), 5000);
      } else {
        const errorData = await res.json();
        setError(errorData.message || "Checkout failed");
      }
    } catch (err) {
      console.error("Checkout error:", err);
      setError("An error occurred during checkout");
    } finally {
      setCheckoutLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.amount,
    0
  );
  const tax = subtotal * 0.06125;
  const total = subtotal + tax;

  return (
  <div style={{ maxWidth: 1200, margin: "0 auto", padding: 20 }}>
    <h1 style={{ color: "#372C2E", marginBottom: 30 }}>
      Shopping Cart
    </h1>

    {checkoutSuccess && (
      <div
        style={{
          backgroundColor: "#d4edda",
          color: "#155724",
          padding: 15,
          borderRadius: 4,
          marginBottom: 20,
          textAlign: "center",
        }}
      >
        <strong>✓ Order placed successfully!</strong> Come in store for pickup.
      </div>
    )}

    {error && (
      <div
        style={{
          backgroundColor: "#f8d7da",
          color: "#721c24",
          padding: 15,
          borderRadius: 4,
          marginBottom: 20,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span>Error: {error}</span>
        <button
          onClick={() => setError(null)}
          style={{
            background: "none",
            border: "none",
            color: "#721c24",
            cursor: "pointer",
            fontSize: 18,
            fontWeight: "bold",
          }}
        >
          ×
        </button>
      </div>
    )}

    {loading ? (
      <p style={{ color: "#563727" }}>Loading cart...</p>
    ) : cartItems.length === 0 ? (
      <div style={{ textAlign: "center", padding: "40px 0", color: "#563727" }}>
        <p style={{ fontSize: 18, marginBottom: 8 }}>Your cart is empty</p>
        <p style={{ fontSize: 14, color: "#666" }}>
          Browse our products to add items to your cart
        </p>
      </div>
    ) : (
      <div style={{ display: "flex", gap: 30 }}>
          <div style={{ flex: 1 }}>
            {cartItems.map((item) => (
              <div
                key={item.cart_id}
                style={{
                  border: "1px solid #ddd",
                  padding: 15,
                  marginBottom: 15,
                  backgroundColor: "#fff",
                  display: "flex",
                  gap: 15,
                }}
              >
                <div
                  style={{
                    width: 80,
                    height: 80,
                    backgroundColor: "#f0f0f0",
                    flexShrink: 0,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{ width: "100%", height: "100%", objectFit: "cover" }}
                    />
                  ) : (
                    <span style={{ color: "#999", fontSize: 12 }}>No Image</span>
                  )}
                </div>

                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: "0 0 5px 0", color: "#372C2E" }}>
                    {item.name}
                  </h3>
                  <p style={{ margin: "0 0 8px 0", fontSize: 14, color: "#666" }}>
                    {item.business_name}
                  </p>
                  <p style={{ margin: 0, fontWeight: "bold", color: "#372C2E" }}>
                    ${item.price.toFixed(2)}
                  </p>
                </div>

                <div style={{ textAlign: "right" }}>
                  <button
                    onClick={() => removeItem(item.cart_id)}
                    style={{
                      background: "none",
                      border: "none",
                      color: "#DE9E48",
                      cursor: "pointer",
                      fontSize: 13,
                      marginBottom: 10,
                    }}
                  >
                    Remove
                  </button>

                  <div style={{ display: "flex", gap: 8 }}>
                    <button
                      onClick={() =>
                        updateQuantity(item.cart_id, item.amount - 1)
                      }
                      disabled={item.amount <= 1}
                      style={{
                        width: 30,
                        height: 30,
                        border: "1px solid #ddd",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        lineHeight: "6px",
                        paddingLeft: "8px",
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: 20, textAlign: "center", lineHeight: "30px" }}>
                      {item.amount}
                    </span>
                    <button
                      onClick={() =>
                        updateQuantity(item.cart_id, item.amount + 1)
                      }
                      style={{
                        width: 30,
                        height: 30,
                        border: "1px solid #ddd",
                        backgroundColor: "#fff",
                        cursor: "pointer",
                        lineHeight: "6px",
                        paddingLeft: "8px",
                      }}
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ width: 300 }}>
            <div
              style={{
                border: "1px solid #ddd",
                padding: 20,
                backgroundColor: "#f9f9f9",
                position: "sticky",
                top: 20,
              }}
            >
              <h2 style={{ margin: "0 0 20px 0", fontSize: 20, color: "#372C2E" }}>
                Order Summary
              </h2>

              <div style={{ marginBottom: 15, paddingBottom: 15, borderBottom: "1px solid #ddd" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Tax (6.125%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: 18,
                  fontWeight: "bold",
                  marginBottom: 20,
                }}
              >
                <span>Total:</span>
                <span>${total.toFixed(2)}</span>
              </div>

              <button
                onClick={() => setCheckoutModalOpen(true)}
                disabled={checkoutLoading}
                style={{
                  width: "100%",
                  backgroundColor: "#DE9E48",
                  color: "#fff",
                  border: "none",
                  padding: "12px",
                  fontSize: 16,
                  fontWeight: "bold",
                  cursor: checkoutLoading ? "not-allowed" : "pointer",
                  opacity: checkoutLoading ? 0.7 : 1,
                }}
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        </div>
      )}

      {checkoutModalOpen && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
          }}
          onClick={() => setCheckoutModalOpen(false)}
        >
          <div
            style={{
              backgroundColor: "#fff",
              padding: 30,
              maxWidth: 500,
              width: "90%",
              border: "1px solid #ddd",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ color: "#372C2E", marginTop: 0, marginBottom: 20 }}>
              Checkout
            </h2>

            <div>
              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                  placeholder="John Doe"
                />
              </div>

              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                  Email *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                  placeholder="john@example.com"
                />
              </div>

              <div style={{ marginBottom: 15 }}>
                <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                  Card Number *
                </label>
                <input
                  type="text"
                  required
                  value={formData.cardNumber}
                  onChange={(e) =>
                    setFormData({ ...formData, cardNumber: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: 8,
                    border: "1px solid #ddd",
                    fontSize: 14,
                    boxSizing: "border-box",
                  }}
                  placeholder="1234 5678 9012 3456"
                  maxLength={19}
                />
              </div>

              <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                    Expiry *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.expiry}
                    onChange={(e) =>
                      setFormData({ ...formData, expiry: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #ddd",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                    placeholder="MM/YY"
                    maxLength={5}
                  />
                </div>

                <div style={{ flex: 1 }}>
                  <label style={{ display: "block", marginBottom: 5, fontWeight: "bold" }}>
                    CVV *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.cvv}
                    onChange={(e) =>
                      setFormData({ ...formData, cvv: e.target.value })
                    }
                    style={{
                      width: "100%",
                      padding: 8,
                      border: "1px solid #ddd",
                      fontSize: 14,
                      boxSizing: "border-box",
                    }}
                    placeholder="123"
                    maxLength={4}
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: 10 }}>
                <button
                  type="button"
                  onClick={() => setCheckoutModalOpen(false)}
                  style={{
                    flex: 1,
                    padding: 10,
                    border: "1px solid #ddd",
                    backgroundColor: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleCheckout}
                  disabled={checkoutLoading}
                  style={{
                    flex: 1,
                    padding: 10,
                    border: "none",
                    backgroundColor: "#DE9E48",
                    color: "#fff",
                    fontWeight: "bold",
                    cursor: checkoutLoading ? "not-allowed" : "pointer",
                    opacity: checkoutLoading ? 0.7 : 1,
                  }}
                >
                  {checkoutLoading ? "Processing..." : "Submit Order"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}