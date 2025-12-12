import React, { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_URL || "http://localhost:5000";

type ExpertiseEntry = {
  exp_id?: number | string;
  expertise?: string | null;
};

type ProfileResponse = {
  status?: string;
  message?: string;
  [key: string]: unknown;
};

type ProfileViewModel = {
  fullName: string;
  businessName: string;
  businessId: string;
  bio: string;
  email: string;
  phone: string;
  services: string[];
  approved: boolean;
  profilePicture?: string | null;
};

type WorkPhoto = {
  id: number | string;
  picture: string;
  active?: boolean;
};

type Review = {
  rvw_id: number | string;
  reviewerName: string;
  rating: number;
  comment: string;
};

export default function CustomerWorkerProfile() {
  const { employeeId } = useParams<{ employeeId: string }>();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<ProfileViewModel | null>(null);
  const [photos, setPhotos] = useState<WorkPhoto[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!employeeId) {
      setError("Worker profile not available.");
      setLoading(false);
      return;
    }

    let isCancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`${API_BASE}/employee/profile/${employeeId}`, {
          method: "GET",
          credentials: "include",
        });

        if (!res.ok) {
          throw new Error(`Profile request failed (${res.status})`);
        }

        const profileJson = (await res.json()) as ProfileResponse;
        if (profileJson.status !== "success") {
          throw new Error(
            typeof profileJson.message === "string"
              ? profileJson.message
              : "Profile data unavailable"
          );
        }

        const employeeName = Array.isArray(profileJson["employee name"]) ? profileJson["employee name"] : [];
        const businessInfo = Array.isArray(profileJson.business) ? profileJson.business : [];
        const contactInfo = Array.isArray(profileJson["contact info"]) ? profileJson["contact info"] : [];
        const expertise = Array.isArray(profileJson.expertise)
          ? (profileJson.expertise as ExpertiseEntry[])
          : [];
        const profilePicture = (profileJson["profile picture"] as string | undefined) ?? null;

        const nextProfile: ProfileViewModel = {
          fullName: employeeName.filter(Boolean).join(" ") || "Employee",
          businessName: (businessInfo[1] as string | undefined) ?? "",
          businessId:
            businessInfo[0] !== undefined && businessInfo[0] !== null
              ? String(businessInfo[0])
              : "",
          bio: (profileJson.bio as string | undefined) ?? "",
          email: (contactInfo[0] as string | undefined) ?? "",
          phone: (contactInfo[1] as string | undefined) ?? "",
          services: expertise
            .map((entry) => (entry?.expertise ?? "").trim())
            .filter((name) => name.length > 0),
          approved: Boolean(profileJson.approved),
          profilePicture,
        };

        if (!isCancelled) {
          setProfile(nextProfile);
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : "Unexpected error while loading profile";
        if (!isCancelled) {
          setError(message);
          setProfile(null);
          setPhotos([]);
          setReviews([]);
        }
      } finally {
        if (!isCancelled) {
          setLoading(false);
        }
      }
    };

    const loadPhotos = async () => {
      try {
        const res = await fetch(`${API_BASE}/employee/pictures/${employeeId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) return;
        const photosJson = await res.json();
        if (!isCancelled) {
          if (Array.isArray(photosJson)) {
            setPhotos(
              photosJson
                .filter((item): item is WorkPhoto => typeof item === "object" && item !== null && "picture" in item)
                .map((item) => ({
                  id:
                    (item as WorkPhoto).id ??
                    (typeof crypto !== "undefined" && "randomUUID" in crypto
                      ? crypto.randomUUID()
                      : `${Date.now()}-${Math.random()}`),
                  picture: (item as WorkPhoto).picture,
                  active: (item as WorkPhoto).active,
                }))
            );
          } else {
            setPhotos([]);
          }
        }
      } catch (err) {
        console.error("Failed to load worker photos", err);
      }
    };

    const loadReviews = async () => {
      try {
        const res = await fetch(`${API_BASE}/employee/reviews/${employeeId}`, {
          method: "GET",
          credentials: "include",
        });
        if (!res.ok) return;
        const reviewsJson = await res.json();
        if (!isCancelled) {
          if (Array.isArray(reviewsJson)) {
            setReviews(
              reviewsJson
                .filter(
                  (item): item is Review =>
                    typeof item === "object" &&
                    item !== null &&
                    "rvw_id" in item &&
                    "comment" in item &&
                    "rating" in item
                )
                .map((item: any) => ({
                  rvw_id: item.rvw_id,
                  reviewerName: `${item.first_name ?? ""} ${item.last_name ?? ""}`.trim() || "Anonymous",
                  rating: Number(item.rating ?? 0),
                  comment: typeof item.comment === "string" ? item.comment : "",
                }))
            );
          } else {
            setReviews([]);
          }
        }
      } catch (err) {
        console.error("Failed to load worker reviews", err);
      }
    };

    loadProfile()
      .then(() => {
        if (!isCancelled) {
          void loadPhotos();
          void loadReviews();
        }
      })
      .catch(() => {
        /* handled in loadProfile */
      });

    return () => {
      isCancelled = true;
    };
  }, [employeeId]);

  const initials = useMemo(() => {
    if (!profile?.fullName) return "";
    return profile.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [profile?.fullName]);

  const renderStars = (rating: number) => (
    <span style={{ color: "#DE9E48", fontSize: 18 }}>
      {"★".repeat(Math.max(0, Math.min(5, Math.round(rating))))}
      {"☆".repeat(5 - Math.max(0, Math.min(5, Math.round(rating))))}
    </span>
  );

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <button onClick={() => navigate(-1)} style={backButtonStyle}>
          ← Back
        </button>

        {loading && <p style={mutedTextStyle}>Loading worker profile...</p>}

        {!loading && error && (
          <div style={errorBox}>
            <p style={{ margin: 0 }}>Unable to load worker profile: {error}</p>
          </div>
        )}

        {!loading && !error && profile && (
          <>
            <div style={summarySection}>
              {profile.profilePicture ? (
                <img src={profile.profilePicture} alt="Profile" style={profileImageStyle} />
              ) : (
                <div style={placeholderAvatar}>
                  <span style={placeholderInitials}>{initials || "?"}</span>
                </div>
              )}

              <div style={{ flex: 1 }}>
                <h1 style={headingStyle}>{profile.fullName}</h1>
                {profile.businessName && (
                  <p style={summaryText}>
                    <strong>Salon:</strong> {profile.businessName}
                  </p>
                )}
                {profile.services.length > 0 && (
                  <p style={summaryText}>
                    <strong>Services:</strong> {profile.services.join(", ")}
                  </p>
                )}
                {(profile.email || profile.phone) && (
                  <p style={summaryText}>
                    <strong>Contact:</strong> {[profile.email, profile.phone].filter(Boolean).join(" • ")}
                  </p>
                )}
                <p style={{ ...summaryText, fontStyle: "italic" }}>
                  {profile.approved ? "Verified by salon" : "Pending salon approval"}
                </p>
              </div>
            </div>

            <section style={sectionStyle}>
              <h2 style={sectionTitle}>Bio</h2>
              <p style={bodyTextStyle}>
                {profile.bio && profile.bio.trim().length > 0
                  ? profile.bio
                  : "This professional hasn\'t shared a bio yet."}
              </p>
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitle}>Portfolio</h2>
              {photos.length === 0 ? (
                <p style={mutedTextStyle}>No photos shared yet.</p>
              ) : (
                <div style={photoGrid}>
                  {photos.map((photo) => (
                    <div key={photo.id} style={photoCard}>
                      <img src={photo.picture} alt="Work sample" style={workImageStyle} />
                    </div>
                  ))}
                </div>
              )}
            </section>

            <section style={sectionStyle}>
              <h2 style={sectionTitle}>Client Reviews</h2>
              {reviews.length === 0 ? (
                <p style={mutedTextStyle}>No reviews yet.</p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {reviews.map((review) => (
                    <div key={review.rvw_id} style={reviewCard}>
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <strong>{review.reviewerName}</strong>
                        {renderStars(review.rating)}
                      </div>
                      <p style={{ margin: "8px 0 0" }}>{review.comment}</p>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

const pageContainer: React.CSSProperties = {
  display: "flex",
  justifyContent: "center",
  padding: "20px 0",
};

const cardStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: 960,
  backgroundColor: "#FFFFFF",
  borderRadius: 16,
  padding: "32px 36px",
  border: "2px solid #DE9E48",
  boxShadow: "0 12px 32px rgba(0,0,0,0.12)",
  color: "#372C2E",
};

const summarySection: React.CSSProperties = {
  display: "flex",
  gap: 24,
  alignItems: "flex-start",
  marginBottom: 32,
};

const headingStyle: React.CSSProperties = {
  margin: "0 0 12px",
  fontSize: 32,
};

const summaryText: React.CSSProperties = {
  margin: "6px 0",
  lineHeight: 1.5,
};

const mutedTextStyle: React.CSSProperties = {
  color: "#6F5B4C",
  margin: 0,
};

const profileImageStyle: React.CSSProperties = {
  width: 180,
  height: 180,
  objectFit: "cover",
  borderRadius: "50%",
  border: "3px solid #DE9E48",
};

const placeholderAvatar: React.CSSProperties = {
  width: 180,
  height: 180,
  borderRadius: "50%",
  backgroundColor: "#F5E4D7",
  border: "3px solid #DE9E48",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const placeholderInitials: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 700,
  color: "#DE9E48",
};

const sectionStyle: React.CSSProperties = {
  marginTop: 32,
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 16px",
  color: "#DE9E48",
  fontSize: 22,
};

const bodyTextStyle: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.6,
  color: "#372C2E",
  whiteSpace: "pre-line",
};

const photoGrid: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
  gap: 16,
};

const photoCard: React.CSSProperties = {
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid rgba(222,158,72,0.6)",
  backgroundColor: "#FFF9F4",
};

const workImageStyle: React.CSSProperties = {
  width: "100%",
  height: 180,
  objectFit: "cover",
};

const reviewCard: React.CSSProperties = {
  border: "1px solid #DE9E48",
  borderRadius: 12,
  padding: 16,
  backgroundColor: "#FFF9F4",
};

const errorBox: React.CSSProperties = {
  backgroundColor: "rgba(176, 0, 32, 0.12)",
  border: "1px solid rgba(176, 0, 32, 0.55)",
  borderRadius: 8,
  padding: "12px 16px",
  color: "#8C1C13",
};

const backButtonStyle: React.CSSProperties = {
  marginBottom: 16,
  backgroundColor: "transparent",
  color: "#DE9E48",
  border: "none",
  fontSize: 16,
  cursor: "pointer",
  display: "flex",
  alignItems: "center",
  gap: 8,
  padding: 0,
};
