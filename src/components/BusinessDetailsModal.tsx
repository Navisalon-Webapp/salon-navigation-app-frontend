import { useState, useEffect } from "react";

interface BusinessDetailsModalProps {
  open: boolean;
  onClose: () => void;
  businessId: number;
  businessName: string;
}

interface BusinessInfo {
  name: string;
  street: string;
  city: string;
  state: string;
  country: string;
  zip_code: string;
  phone?: string;
  email?: string;
}

interface Review {
  id: string;
  reviewerName: string;
  rating: number;
  comment: string;
  createdAt: string;
  reply?: {
    text: string;
    createdAt: string;
    ownerName: string;
  };
}

interface Product {
  pid: number;
  product_name: string;
  description: string;
  price: number;
  stock: number;
  image?: string | null;

}

export default function BusinessDetailsModal({
  open,
  onClose,
  businessId,
  businessName,
}: BusinessDetailsModalProps) {
  const [activeTab, setActiveTab] = useState<"info" | "reviews" | "products">("info");
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [_loading, setLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [cartQuantities, setCartQuantities] = useState<{ [key: number]: number }>({});
  const [addingToCart, setAddingToCart] = useState<number | null>(null);

  const backendBase = import.meta.env.VITE_API_URL || "http://localhost:5000";

  useEffect(() => {
    if (open) {
      fetchBusinessInfo();
      fetchReviews();
      fetchProducts();
    }
  }, [open, businessId]);

  const fetchBusinessInfo = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${backendBase}/api/client/business-info/${businessId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setBusinessInfo(data);
      }
    } catch (err) {
      console.error("Error fetching business info:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${backendBase}/api/client/get-reviews/${businessId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (err) {
      console.error("Error fetching reviews:", err);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch(`${backendBase}/api/client/business-products/${businessId}`, {
        credentials: "include",
      });
      if (res.ok) {
        const data = await res.json();
        setProducts(data || []);
        const initialQuantities: { [key: number]: number } = {};
        if (Array.isArray(data)) {
          data.forEach((product: Product) => {
            initialQuantities[product.pid] = 1;
          });
        }
        setCartQuantities(initialQuantities);
      } else {
        console.error("Failed to fetch products, status:", res.status);
        setProducts([]);
      }
    } catch (err) {
      console.error("Error fetching products:", err);
      setProducts([]);
    }
  };

  const handleAddToCart = async (productId: number) => {
    const amount = cartQuantities[productId] || 1;
    setAddingToCart(productId);
    
    try {
      const res = await fetch(`${backendBase}/api/clients/manage-carts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({
          pid: productId,
          amount: amount,
          bid: businessId,
        }),
      });

      if (res.ok) {
        alert("Product added to cart successfully!");
        fetchProducts();
      } else {
        const data = await res.json();
        alert(data.message || "Failed to add to cart");
      }
    } catch (err) {
      console.error("Error adding to cart:", err);
      alert("Error adding to cart");
    } finally {
      setAddingToCart(null);
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div style={{ display: "flex", gap: 2 }}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} style={{ color: star <= rating ? "#DE9E48" : "#DDD", fontSize: 18 }}>
            ★
          </span>
        ))}
      </div>
    );
  };

  if (!open) return null;

  return (
    <div
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
      }}
      onClick={onClose}
    >
      <div
        style={{
          backgroundColor: "#FFFFFF",
          borderRadius: 12,
          width: "90%",
          maxWidth: 900,
          maxHeight: "90vh",
          overflow: "auto",
          boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
          border: "2px solid #DE9E48",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: "24px 32px",
            borderBottom: "2px solid #DE9E48",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <h2 style={{ margin: 0, color: "#372C2E" }}>{businessName}</h2>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              fontSize: 28,
              cursor: "pointer",
              color: "#372C2E",
              padding: 0,
              width: 32,
              height: 32,
            }}
          >
            ×
          </button>
        </div>

        {/* Tabs */}
        <div
          style={{
            display: "flex",
            borderBottom: "1px solid #DE9E48",
            padding: "0 32px",
            gap: 8,
          }}
        >
          {["info", "reviews", "products"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              style={{
                padding: "12px 24px",
                border: "none",
                background: activeTab === tab ? "#DE9E48" : "transparent",
                color: activeTab === tab ? "#FFFFFF" : "#372C2E",
                cursor: "pointer",
                borderRadius: "8px 8px 0 0",
                textTransform: "capitalize",
                fontWeight: activeTab === tab ? "bold" : "normal",
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ padding: 32 }}>
          {activeTab === "info" && (
            <div>
              {businessInfo ? (
                <div style={{ color: "#372C2E" }}>
                  <h3 style={{ marginTop: 0, color: "#DE9E48" }}>Business Information</h3>
                  <p><strong>Address:</strong> {businessInfo.street}</p>
                  <p><strong>City:</strong> {businessInfo.city}, {businessInfo.state} {businessInfo.zip_code}</p>
                  <p><strong>Country:</strong> {businessInfo.country}</p>
                  {businessInfo.phone && <p><strong>Phone:</strong> {businessInfo.phone}</p>}
                  {businessInfo.email && <p><strong>Email:</strong> {businessInfo.email}</p>}
                </div>
              ) : (
                <p style={{ color: "#563727" }}>Loading business information...</p>
              )}
            </div>
          )}

          {activeTab === "reviews" && (
            <div>
              <h3 style={{ marginTop: 0, color: "#DE9E48" }}>Customer Reviews</h3>
              {reviews.length === 0 ? (
                <p style={{ color: "#563727" }}>No reviews yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {reviews.map((review) => (
                    <div
                      key={review.id}
                      style={{
                        border: "1px solid #DE9E48",
                        borderRadius: 8,
                        padding: 16,
                        backgroundColor: "#FFF9F4",
                      }}
                    >
                      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                        <strong style={{ color: "#372C2E" }}>{review.reviewerName}</strong>
                        {renderStars(review.rating)}
                      </div>
                      <p style={{ color: "#372C2E", margin: "8px 0" }}>{review.comment}</p>
                      <p style={{ color: "#563727", fontSize: 12, margin: 0 }}>
                        {new Date(review.createdAt).toLocaleDateString()}
                      </p>
                      {review.reply && (
                        <div
                          style={{
                            marginTop: 12,
                            paddingTop: 12,
                            borderTop: "1px solid #DE9E48",
                          }}
                        >
                          <p style={{ color: "#372C2E", fontSize: 14, margin: "4px 0" }}>
                            <strong>Response from {review.reply.ownerName}:</strong>
                          </p>
                          <p style={{ color: "#372C2E", fontSize: 14, margin: "4px 0" }}>
                            {review.reply.text}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === "products" && (
            <div>
              <h3 style={{ marginTop: 0, color: "#DE9E48" }}>Products</h3>
              {!Array.isArray(products) || products.length === 0 ? (
                <p style={{ color: "#563727" }}>No products available.</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
                    gap: 16,
                  }}
                >
                  {products.map((product) => (
                    <div
                      key={product.pid}
                      style={{
                        border: "1px solid #DE9E48",
                        borderRadius: 8,
                        padding: 16,
                        backgroundColor: "#FFF9F4",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                    {/* Product Image */}
                    {product.image ? (
                    <img
                        src={typeof product.image === 'string' ? product.image : ''}
                        alt={product.product_name}
                        onError={(_e) => {
                        console.error('Image load error for product:', product.product_name);
                        }}
                        style={{
                        width: 150,
                        height: 150,
                        objectFit: "cover",
                        borderRadius: "0.375rem",
                        border: "1px solid #DE9E48",
                        marginBottom: 8,
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
                        border: "1px solid #DE9E48",
                        backgroundColor: "rgba(222,158,72,0.05)",
                        fontSize: 10,
                        color: "#DE9E48",
                        marginBottom: 8,
                        }}
                    >
                        No Image
                    </div>
                    )}
                      <h4 style={{ margin: "0 0 8px 0", color: "#372C2E", textAlign: "center" }}>
                        {product.product_name}
                      </h4>
                      <p style={{ color: "#372C2E", fontSize: 14, margin: "4px 0", textAlign: "center" }}>
                        {product.description || "No description available"}
                      </p>
                      <p style={{ color: "#DE9E48", fontWeight: "bold", margin: "8px 0", textAlign: "center" }}>
                        ${typeof product.price === 'number' ? product.price.toFixed(2) : '0.00'}
                      </p>
                      <p style={{ color: "#563727", fontSize: 12, margin: "4px 0", textAlign: "center" }}>
                        Stock: {product.stock || 0}
                      </p>
                      <div style={{ display: "flex", gap: 8, marginTop: 12, alignItems: "center", width: "100%" }}>
                        <button
                          onClick={() => handleAddToCart(product.pid)}
                          disabled={product.stock === 0 || addingToCart === product.pid}
                          style={{
                            flex: 1,
                            backgroundColor: product.stock === 0 ? "#CCC" : "#DE9E48",
                            color: "#FFFFFF",
                            border: "none",
                            borderRadius: 6,
                            padding: "8px 12px",
                            cursor: product.stock === 0 ? "not-allowed" : "pointer",
                          }}
                        >
                          {addingToCart === product.pid
                            ? "Adding..."
                            : product.stock === 0
                            ? "Out of Stock"
                            : "Add to Cart"}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}