import { useEffect, useState, useCallback } from "react";

const API_BASE = "http://localhost:5000";

type Props = {
  appointmentId?: string;
  theme?: "light" | "dark";
};

export default function BeforeAfterImages({
  appointmentId = "demo-appointment-1",
  theme = "light",
}: Props) {
  const [beforeSrc, setBeforeSrc] = useState<string | null>(null);
  const [afterSrc, setAfterSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState<"before" | "after" | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}/images`, {
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Image data received:", data);
        if (data.before_image) {
          setBeforeSrc(data.before_image);
        }
        if (data.after_image) {
          setAfterSrc(data.after_image);
        }
      } else {
        const errorData = await res.json();
        console.error("Failed to load images:", errorData);
        setError(errorData.message || "Failed to load images");
      }
    } catch (err: any) {
      console.error("Failed to load images:", err);
      setError(err?.message ?? String(err));
    } finally {
      setLoading(false);
    }
  }, [appointmentId]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      await loadImages();
      if (!mounted) return;
    })();
    return () => {
      mounted = false;
    };
  }, [loadImages]);

  const handleFileUpload = async (type: "before" | "after", file: File) => {
    if (!file) return;
    
    setUploading(type);
    setError(null);
    
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("type", type);
      
      const res = await fetch(`${API_BASE}/api/appointments/${appointmentId}/upload-image`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        console.log("Upload response:", data);
        if (type === "before" && data.before_image) {
          setBeforeSrc(data.before_image);
        } else if (type === "after" && data.after_image) {
          setAfterSrc(data.after_image);
        }
      } else {
        const errorData = await res.json();
        console.error("Upload failed:", errorData);
        setError(errorData.message || "Failed to upload image");
      }
    } catch (err: any) {
      console.error("Upload error:", err);
      setError("Failed to upload image");
    } finally {
      setUploading(null);
    }
  };

  const handleFileChange = (type: "before" | "after") => (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(type, file);
    }
  };

  return (
    <div style={{ 
      marginTop: 24, 
      backgroundColor: theme === "dark" ? "#563727" : "#FFF9F4", 
      padding: 16, 
      borderRadius: 8, 
      border: theme === "dark" ? "2px solid #7A431D" : "2px solid #DE9E48" 
    }}>
      <h2 style={{ color: theme === "dark" ? "#FFFFFF" : "#372C2E", marginBottom: 12, marginTop: 0, fontSize: "1.25rem", fontWeight: 600 }}>
        Before & After Images
      </h2>

      {loading && (
        <div style={{ color: theme === "dark" ? "#FFFFFF" : "#372C2E", marginBottom: 12 }}>Loading images…</div>
      )}

      {error && (
        <div style={{ 
          color: theme === "dark" ? "#FFFFFF" : "#C62828", 
          marginBottom: 12, 
          padding: "0.75rem", 
          backgroundColor: theme === "dark" ? "#D62828" : "#FFEBEE", 
          borderRadius: 4,
          border: theme === "dark" ? "2px solid #8B0000" : "1px solid #EF5350"
        }}>
          {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12, minWidth: 0 }}>
        {/* Before Image */}
        <div style={{ flex: 1 }}>
          <figure style={{ margin: 0 }}>
            {beforeSrc ? (
              <img
                src={beforeSrc}
                alt="Before"
                style={{
                  width: "100%",
                  height: 380,
                  borderRadius: 8,
                  display: "block",
                  objectFit: "cover",
                  border: theme === "dark" ? "2px solid #7A431D" : "2px solid #DE9E48",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 380,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme === "dark" ? "#372C2E" : "#FFFFFF",
                  border: theme === "dark" ? "2px dashed #7A431D" : "2px dashed #DE9E48",
                  color: theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(55, 44, 46, 0.5)",
                }}
              >
                No image uploaded
              </div>
            )}
            <figcaption
              style={{ color: theme === "dark" ? "#FFFFFF" : "#372C2E", textAlign: "center", marginTop: 8, marginBottom: 8, fontWeight: 600 }}
            >
              Before
            </figcaption>
          </figure>
          <label style={{ display: "block", textAlign: "center" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange("before")}
              disabled={uploading === "before"}
              style={{ display: "none" }}
              id={`before-upload-${appointmentId}`}
            />
            <button
              onClick={() => document.getElementById(`before-upload-${appointmentId}`)?.click()}
              disabled={uploading === "before"}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: uploading === "before" ? "#C4925A" : "#DE9E48",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                cursor: uploading === "before" ? "not-allowed" : "pointer",
                fontWeight: 600,
                width: "100%",
              }}
            >
              {uploading === "before" ? "Uploading..." : beforeSrc ? "Replace Image" : "Upload Image"}
            </button>
          </label>
        </div>

        {/* After Image */}
        <div style={{ flex: 1 }}>
          <figure style={{ margin: 0 }}>
            {afterSrc ? (
              <img
                src={afterSrc}
                alt="After"
                style={{
                  width: "100%",
                  height: 380,
                  borderRadius: 8,
                  display: "block",
                  objectFit: "cover",
                  border: theme === "dark" ? "2px solid #7A431D" : "2px solid #DE9E48",
                }}
              />
            ) : (
              <div
                style={{
                  width: "100%",
                  height: 380,
                  borderRadius: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backgroundColor: theme === "dark" ? "#372C2E" : "#FFFFFF",
                  border: theme === "dark" ? "2px dashed #7A431D" : "2px dashed #DE9E48",
                  color: theme === "dark" ? "rgba(255, 255, 255, 0.5)" : "rgba(55, 44, 46, 0.5)",
                }}
              >
                No image uploaded
              </div>
            )}
            <figcaption
              style={{ color: theme === "dark" ? "#FFFFFF" : "#372C2E", textAlign: "center", marginTop: 8, marginBottom: 8, fontWeight: 600 }}
            >
              After
            </figcaption>
          </figure>
          <label style={{ display: "block", textAlign: "center" }}>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange("after")}
              disabled={uploading === "after"}
              style={{ display: "none" }}
              id={`after-upload-${appointmentId}`}
            />
            <button
              onClick={() => document.getElementById(`after-upload-${appointmentId}`)?.click()}
              disabled={uploading === "after"}
              style={{
                padding: "0.5rem 1rem",
                backgroundColor: uploading === "after" ? "#C4925A" : "#DE9E48",
                color: "#FFFFFF",
                border: "none",
                borderRadius: 6,
                cursor: uploading === "after" ? "not-allowed" : "pointer",
                fontWeight: 600,
                width: "100%",
              }}
            >
              {uploading === "after" ? "Uploading..." : afterSrc ? "Replace Image" : "Upload Image"}
            </button>
          </label>
        </div>
      </div>
    </div>
  );
}
