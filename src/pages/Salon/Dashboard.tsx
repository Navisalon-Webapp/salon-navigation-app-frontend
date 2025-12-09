import React, { useEffect, useState } from "react";

type Salon = {
  bid: number;
  name: string;
  aid?: number;
  status: boolean;
  street?: string;
  city?: string;
  state?: string;
  zip_code?: string;
  year_est?: string;
};

type Product = {
  pid?: number;
  name: string;
  price: number;
  stock: number;
  description?: string;
  image?: string | null;
};

const pageBg = {
  position: "fixed" as const,
  inset: 0,
  background: "#372C2E",
  zIndex: -1,
};

const containerStyle: React.CSSProperties = {
  padding: "2rem",
  maxWidth: 1100,
  margin: "0 auto",
  color: "#FFFFFF",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  borderRadius: "0.5rem",
  padding: "1rem",
  color: "#FFFFFF",
};

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.5rem 0.75rem",
  borderRadius: "0.375rem",
  backgroundColor: "#563727",
  border: "1px solid #7A431D",
  color: "#FFFFFF",
  outline: "none",
};

const buttonPrimary: React.CSSProperties = {
  padding: "0.5rem 0.9rem",
  fontWeight: 600,
  borderRadius: "0.375rem",
  backgroundColor: "#DE9E48",
  color: "#372C2E",
  border: "none",
  cursor: "pointer",
};

const buttonGhost: React.CSSProperties = {
  padding: "0.45rem 0.75rem",
  fontWeight: 600,
  borderRadius: "0.375rem",
  backgroundColor: "transparent",
  color: "#FFFFFF",
  border: "1px solid #7A431D",
  cursor: "pointer",
};

const tableStyle: React.CSSProperties = {
  width: "100%",
  borderCollapse: "collapse",
  background: "transparent",
};

const thStyle: React.CSSProperties = {
  textAlign: "left",
  borderBottom: "1px solid rgba(255,255,255,0.08)",
  padding: "0.5rem",
  color: "rgba(255,255,255,0.9)",
  fontWeight: 600,
};

const tdStyle: React.CSSProperties = {
  padding: "0.625rem",
  borderBottom: "1px solid rgba(255,255,255,0.03)",
  color: "#FFFFFF",
  verticalAlign: "middle",
};

export default function BusinessDashboard() {
  const [salon, setSalon] = useState<Salon | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const [editName, setEditName] = useState("");
  const [editStreet, setEditStreet] = useState("");
  const [editCity, setEditCity] = useState("");
  const [editState, setEditState] = useState("");
  const [editZip, setEditZip] = useState("");
  const [editYearEst, setEditYearEst] = useState("");
  const [editStatus, setEditStatus] = useState(false);

  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState<number | "">("");
  const [newStock, setNewStock] = useState<number | "">("");
  const [newDescription, setNewDescription] = useState("");
  const [newImage, setNewImage] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      setLoading(true);
      
      try {
        const salonRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/owner/salon`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (salonRes.ok) {
          const salonData = await salonRes.json();
          setSalon(salonData);

          setEditName(salonData.name);
          setEditStreet(salonData.street || "");
          setEditCity(salonData.city || "");
          setEditState(salonData.state || "");
          setEditZip(salonData.zip_code || "");
          setEditYearEst(salonData.year_est || "");
          setEditStatus(salonData.status);
        }

        const prodRes = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/owner/products`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (prodRes.ok) {
          const prodData = await prodRes.json();
          setProducts(prodData);
        }
      } catch (error) {
        console.error("Error loading data:", error);
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  async function handleSaveSalon() {
    if (!salon) return;
    
    const updated: Salon = {
      ...salon,
      name: editName,
      street: editStreet,
      city: editCity,
      state: editState,
      zip_code: editZip,
      year_est: editYearEst,
      status: editStatus,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/owner/manage-details`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: editName,
          street: editStreet,
          city: editCity,
          state: editState,
          zip_code: editZip,
          year_est: editYearEst,
          status: editStatus,
        }),
      });

      if (res.ok) {
        setSalon(updated);
        alert("Salon details updated successfully!");
      } else {
        alert("Failed to update salon details");
      }
    } catch (error) {
      alert("Error saving salon details");
    }
  }

  async function handleAddProduct(e?: React.FormEvent) {
    e?.preventDefault();
    if (newName.trim() === "" || newPrice === "" || newStock === "") return;

    const product = {
      name: newName.trim(),
      price: Number(newPrice),
      stock: Number(newStock),
      description: newDescription.trim() || null,
      image: newImage,
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/owner/products`, {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      if (res.ok) {
        const result = await res.json();
        if (result.status === "success" && result.product) {
          setProducts((p) => [...p, result.product]);
          setNewName("");
          setNewPrice("");
          setNewStock("");
          setNewDescription("");
          setNewImage(null);
          setImagePreview(null);
        }
      } else {
        alert("Failed to add product");
      }
    } catch (error) {
      alert("Error adding product");
    }
  }

  function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) {
      setNewImage(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("Image size should be less than 5MB");
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setNewImage(base64String);
    };
    reader.readAsDataURL(file);
  }

  async function handleUpdateStock(pid: number | undefined, newStockValue: number) {
    if (!pid) return;
    
    setProducts((prev) => prev.map((p) => (p.pid === pid ? { ...p, stock: newStockValue } : p)));

    try {
      await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/owner/products/${pid}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ stock: newStockValue }),
      });
    } catch (error) {
      console.error("Error updating product stock:", error);
    }
  }

  async function handleDeleteProduct(pid: number | undefined) {
    if (!pid) return;
    
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || "http://localhost:5000"}/owner/products/${pid}`, {
        method: "DELETE",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
      });
      
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.pid !== pid));
      } else {
        alert("Failed to delete product");
      }
    } catch (error) {
      alert("Error deleting product");
    }
  }

  if (loading) return <div style={{ padding: 24, color: "#FFFFFF" }}>Loading...</div>;

  return (
    <>
      <div aria-hidden style={pageBg} />

      <div style={containerStyle}>
        <h2 style={{ fontSize: "1.5rem", fontWeight: 700, marginBottom: "1rem", color: "#FFFFFF" }}>
          Salon Owner — Manage Salon
        </h2>

        <section style={{ marginTop: 12, ...cardStyle }}>
          <h3 style={{ marginTop: 0, marginBottom: "0.5rem" }}>Salon Details</h3>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Name</span>
              <input value={editName} onChange={(e) => setEditName(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Street</span>
              <input value={editStreet} onChange={(e) => setEditStreet(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>City</span>
              <input value={editCity} onChange={(e) => setEditCity(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>State</span>
              <input value={editState} onChange={(e) => setEditState(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>ZIP</span>
              <input value={editZip} onChange={(e) => setEditZip(e.target.value)} style={inputStyle} />
            </label>
            <label style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Est. Year</span>
              <input value={editYearEst} onChange={(e) => setEditYearEst(e.target.value)} style={inputStyle} />
            </label>
          </div>
          <div style={{ marginTop: 12, display: "flex", alignItems: "center", gap: 12 }}>
            <button onClick={handleSaveSalon} style={buttonPrimary}>
              Save Salon Details
            </button>
          </div>
        </section>

        <section style={{ marginTop: 20, ...cardStyle }}>
          <h3 style={{ marginTop: 0, marginBottom: "0.75rem" }}>Products</h3>

          <form onSubmit={handleAddProduct} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
              <input placeholder="Product name" value={newName} onChange={(e) => setNewName(e.target.value)} style={inputStyle} />
              <input
                placeholder="Price"
                value={newPrice}
                onChange={(e) => setNewPrice(e.target.value === "" ? "" : Number(e.target.value))}
                type="number"
                step="0.01"
                style={{ ...inputStyle, width: 120 }}
              />
              <input
                placeholder="Stock"
                value={newStock}
                onChange={(e) => setNewStock(e.target.value === "" ? "" : Number(e.target.value))}
                type="number"
                min={0}
                style={{ ...inputStyle, width: 100 }}
              />
            </div>
            
            <div style={{ marginBottom: 12 }}>
              <textarea
                placeholder="Description (optional)"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                style={{
                  ...inputStyle,
                  minHeight: 60,
                  resize: "vertical",
                  fontFamily: "inherit",
                }}
              />
            </div>
            
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 12 }}>
              <label style={{ display: "flex", flexDirection: "column", gap: 6, flex: 1 }}>
                <span style={{ color: "rgba(255,255,255,0.85)", fontSize: 13 }}>Product Image (optional)</span>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  style={{
                    ...inputStyle,
                    padding: "0.4rem 0.75rem",
                    cursor: "pointer",
                  }}
                />
              </label>
              {imagePreview && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <img
                    src={imagePreview}
                    alt="Preview"
                    style={{
                      width: 60,
                      height: 60,
                      objectFit: "cover",
                      borderRadius: "0.375rem",
                      border: "1px solid #7A431D",
                    }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setNewImage(null);
                      setImagePreview(null);
                    }}
                    style={{ ...buttonGhost, padding: "0.3rem 0.6rem", fontSize: 12 }}
                  >
                    Remove
                  </button>
                </div>
              )}
            </div>

            <div>
              <button type="submit" style={buttonPrimary}>
                Add Product
              </button>
            </div>
          </form>

          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={thStyle}>Image</th>
                <th style={thStyle}>Name</th>
                <th style={thStyle}>Description</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Price</th>
                <th style={{ ...thStyle, textAlign: "right" }}>Stock</th>
                <th style={thStyle}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.pid}>
                  <td style={tdStyle}>
                    {p.image ? (
                      <img
                        src={typeof p.image === 'string' ? p.image : ''}
                        alt={p.name}
                        style={{
                          width: 50,
                          height: 50,
                          objectFit: "cover",
                          borderRadius: "0.375rem",
                          border: "1px solid #7A431D",
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: 50,
                          height: 50,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          borderRadius: "0.375rem",
                          border: "1px solid #7A431D",
                          backgroundColor: "rgba(255,255,255,0.05)",
                          fontSize: 10,
                          color: "rgba(255,255,255,0.4)",
                        }}
                      >
                        No Image
                      </div>
                    )}
                  </td>
                  <td style={tdStyle}>{p.name}</td>
                  <td style={tdStyle}>
                    <div style={{ maxWidth: 200, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {p.description || "-"}
                    </div>
                  </td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>${p.price.toFixed(2)}</td>
                  <td style={{ ...tdStyle, textAlign: "right" }}>{p.stock}</td>
                  <td style={tdStyle}>
                    <div style={{ display: "flex", gap: 8, alignItems: "center", flexWrap: "wrap" }}>
                      <button onClick={() => handleUpdateStock(p.pid, p.stock + 1)} style={buttonGhost}>
                        + Stock
                      </button>
                      <button onClick={() => handleUpdateStock(p.pid, Math.max(0, p.stock - 1))} style={buttonGhost}>
                        - Stock
                      </button>
                      <button 
                        onClick={() => handleDeleteProduct(p.pid)} 
                        style={{
                          ...buttonGhost,
                          borderColor: "#DC2626",
                          color: "#DC2626",
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </section>

        <style>{`
          input::placeholder { color: rgba(255, 255, 255, 0.5); }
          input:focus { border-color: #DE9E48 !important; }
          button:focus { outline: none; box-shadow: 0 0 0 3px rgba(222,158,72,0.12); }
        `}</style>
      </div>
    </>
  );
}