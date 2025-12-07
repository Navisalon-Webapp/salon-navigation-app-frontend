import React, { useCallback, useEffect, useMemo, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import { useAuth } from "../../auth/AuthContext";

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

const convertFileToDataUrl = (file: File) =>
  new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Failed to read file"));
      }
    };
    reader.onerror = () => reject(reader.error ?? new Error("Failed to read file"));
    reader.readAsDataURL(file);
  });

export default function WorkerProfile() {
  const { user } = useAuth();
  const employeeId = user?.employeeId ?? null;
  const [profile, setProfile] = useState<ProfileViewModel | null>(null);
  const [photos, setPhotos] = useState<WorkPhoto[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [actionMessage, setActionMessage] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [savingField, setSavingField] = useState<string | null>(null);
  const [nameInput, setNameInput] = useState("");
  const [bioInput, setBioInput] = useState("");
  const [phoneInput, setPhoneInput] = useState("");
  const [businessInput, setBusinessInput] = useState("");
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [workImageFile, setWorkImageFile] = useState<File | null>(null);

  const clearActionFeedback = useCallback(() => {
    setActionMessage(null);
    setActionError(null);
  }, []);

  const refreshPhotos = useCallback(async () => {
    if (!employeeId) return;
    try {
      const res = await fetch(`${API_BASE}/employee/pictures/${employeeId}`, {
        method: "GET",
        credentials: "include",
      });
      if (!res.ok) {
        throw new Error(`Photos request failed (${res.status})`);
      }
      const photosJson = (await res.json()) as unknown;
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
    } catch (err) {
      console.error("Failed to refresh photos", err);
    }
  }, [employeeId]);

  const loadProfile = useCallback(async () => {
    if (!employeeId) return;
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

      setProfile(nextProfile);
      setNameInput(nextProfile.fullName);
      setBioInput(nextProfile.bio);
      setPhoneInput(nextProfile.phone);
      setBusinessInput(nextProfile.businessId);
      await refreshPhotos();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unexpected error while loading profile";
      setError(message);
      setProfile(null);
      setPhotos([]);
    } finally {
      setLoading(false);
    }
  }, [employeeId, refreshPhotos]);

  useEffect(() => {
    if (!employeeId) {
      setLoading(false);
      setProfile(null);
      setPhotos([]);
      setError("Employee profile is unavailable for this account.");
      return;
    }

    loadProfile();
  }, [employeeId, loadProfile]);

  const handleNameChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNameInput(event.target.value);
    clearActionFeedback();
  };

  const handleBioChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBioInput(event.target.value);
    clearActionFeedback();
  };

  const handlePhoneChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPhoneInput(event.target.value);
    clearActionFeedback();
  };

  const handleBusinessChange = (event: ChangeEvent<HTMLInputElement>) => {
    setBusinessInput(event.target.value);
    clearActionFeedback();
  };

  const handleProfileImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    clearActionFeedback();
    setProfileImageFile(event.target.files?.[0] ?? null);
  };

  const handleWorkImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    clearActionFeedback();
    setWorkImageFile(event.target.files?.[0] ?? null);
  };

  const handleNameSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearActionFeedback();
    const trimmed = nameInput.trim();
    if (!trimmed.length) {
      setActionError("Name cannot be empty.");
      return;
    }

    setSavingField("name");
    try {
      const res = await fetch(`${API_BASE}/employee/name/update`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: trimmed }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || (payload && payload.status && payload.status !== "success")) {
        throw new Error(
          payload && typeof payload.message === "string"
            ? payload.message
            : "Failed to update name."
        );
      }
      setProfile((prev) => (prev ? { ...prev, fullName: trimmed } : prev));
      setNameInput(trimmed);
      setActionMessage("Name updated successfully.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update name.");
    } finally {
      setSavingField(null);
    }
  };

  const handleBioSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearActionFeedback();
    const trimmed = bioInput.trim();
    if (!trimmed.length) {
      setActionError("Bio cannot be empty.");
      return;
    }

    setSavingField("bio");
    try {
      const res = await fetch(`${API_BASE}/employee/bio/update`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bio: trimmed }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || (payload && payload.status && payload.status !== "success")) {
        throw new Error(
          payload && typeof payload.message === "string"
            ? payload.message
            : "Failed to update bio."
        );
      }
      setProfile((prev) => (prev ? { ...prev, bio: trimmed } : prev));
      setBioInput(trimmed);
      setActionMessage("Bio updated successfully.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update bio.");
    } finally {
      setSavingField(null);
    }
  };

  const handlePhoneSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearActionFeedback();
    const sanitized = phoneInput.replace(/[^0-9]/g, "");
    if (!sanitized.length) {
      setActionError("Phone number cannot be empty.");
      return;
    }

    setSavingField("phone");
    try {
      const res = await fetch(`${API_BASE}/employee/phone/update`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: sanitized }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || (payload && payload.status && payload.status !== "success")) {
        throw new Error(
          payload && typeof payload.message === "string"
            ? payload.message
            : "Failed to update phone number."
        );
      }
      setProfile((prev) => (prev ? { ...prev, phone: sanitized } : prev));
      setPhoneInput(sanitized);
      setActionMessage("Phone number updated successfully.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update phone number.");
    } finally {
      setSavingField(null);
    }
  };

  const handleBusinessSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearActionFeedback();
    const trimmed = businessInput.trim();
    if (!trimmed.length) {
      setActionError("Business ID cannot be empty.");
      return;
    }

    setSavingField("business");
    try {
      const res = await fetch(`${API_BASE}/employee/business/update`, {
        method: "PATCH",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bid: trimmed }),
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || (payload && payload.status && payload.status !== "success")) {
        throw new Error(
          payload && typeof payload.message === "string"
            ? payload.message
            : "Failed to update business."
        );
      }
      await loadProfile();
      setActionMessage("Business updated. Approval will be required for the new location.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update business.");
    } finally {
      setSavingField(null);
    }
  };

  const handleProfileImageSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearActionFeedback();
    if (!profileImageFile) {
      setActionError("Select an image to upload.");
      return;
    }

    setSavingField("profile-picture");
    try {
      const formData = new FormData();
      formData.append("image", profileImageFile);
      const res = await fetch(`${API_BASE}/employee/profile-picture/upload`, {
        method: "PATCH",
        credentials: "include",
        body: formData,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || (payload && payload.status && payload.status !== "success")) {
        throw new Error(
          payload && typeof payload.message === "string"
            ? payload.message
            : "Failed to update profile picture."
        );
      }
      const dataUrl = await convertFileToDataUrl(profileImageFile);
      setProfile((prev) => (prev ? { ...prev, profilePicture: dataUrl } : prev));
      setProfileImageFile(null);
      event.currentTarget.reset();
      setActionMessage("Profile picture updated.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to update profile picture.");
    } finally {
      setSavingField(null);
    }
  };

  const handleWorkPhotoSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    clearActionFeedback();
    if (!workImageFile) {
      setActionError("Select an image to upload.");
      return;
    }

    setSavingField("portfolio");
    try {
      const formData = new FormData();
      formData.append("image", workImageFile);
      const res = await fetch(`${API_BASE}/employee/picture/upload`, {
        method: "POST",
        credentials: "include",
        body: formData,
      });
      const payload = await res.json().catch(() => null);
      if (!res.ok || (payload && payload.status && payload.status !== "success")) {
        throw new Error(
          payload && typeof payload.message === "string"
            ? payload.message
            : "Failed to upload photo."
        );
      }
      setWorkImageFile(null);
      event.currentTarget.reset();
      await refreshPhotos();
      setActionMessage("Added a new portfolio photo.");
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Failed to upload photo.");
    } finally {
      setSavingField(null);
    }
  };

  const initials = useMemo(() => {
    if (!profile?.fullName) return "";
    return profile.fullName
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0]?.toUpperCase() ?? "")
      .join("");
  }, [profile?.fullName]);

  if (!user) {
    return (
      <div style={pageContainer}>
        <div style={cardStyle}>
          <p style={labelMuted}>You must be signed in to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={pageContainer}>
      <div style={cardStyle}>
        <h1 style={headingStyle}>My Profile</h1>

        {loading && <p style={labelMuted}>Loading profile...</p>}

        {!loading && error && (
          <div style={errorBox}>
            <p style={{ margin: 0 }}>Unable to load profile: {error}</p>
          </div>
        )}

        {!loading && !error && profile && (
          <>
            <div style={summarySection}>
              {profile.profilePicture ? (
                <img
                  src={profile.profilePicture}
                  alt="Profile"
                  style={profileImageStyle}
                />
              ) : (
                <div style={placeholderAvatar}>
                  <span style={placeholderInitials}>{initials || "?"}</span>
                </div>
              )}

              <div style={{ flex: 1 }}>
                <h2 style={subheadingStyle}>{profile.fullName}</h2>
                {(profile.businessName || profile.businessId) && (
                  <p style={summaryText}>
                    <strong>Business:</strong> {profile.businessName || "—"}
                    {profile.businessId && (
                      <span style={summaryMetaText}> (ID: {profile.businessId})</span>
                    )}
                  </p>
                )}
                {profile.email && (
                  <p style={summaryText}>
                    <strong>Email:</strong> {profile.email}
                  </p>
                )}
                {profile.phone && (
                  <p style={summaryText}>
                    <strong>Phone:</strong> {profile.phone}
                  </p>
                )}
                <p style={summaryText}>
                  <strong>Status:</strong> {profile.approved ? "Approved" : "Pending Approval"}
                </p>
                {profile.bio && (
                  <p style={bioSummaryText}>
                    <strong>Bio:</strong> {profile.bio}
                  </p>
                )}
              </div>
            </div>

            <section style={sectionStyle}>
              <h3 style={sectionTitle}>Manage Profile</h3>
              <p style={helperTextStyle}>
                Update your details so clients always see the latest information.
              </p>
              {actionMessage && (
                <div style={successBox}>
                  <p style={{ margin: 0 }}>{actionMessage}</p>
                </div>
              )}
              {actionError && (
                <div style={inlineErrorBox}>
                  <p style={{ margin: 0 }}>{actionError}</p>
                </div>
              )}

              <form onSubmit={handleNameSubmit} style={formRow}>
                <label htmlFor="worker-name" style={labelStyle}>
                  Name
                </label>
                <input
                  id="worker-name"
                  type="text"
                  value={nameInput}
                  onChange={handleNameChange}
                  style={inputStyle}
                  disabled={savingField === "name"}
                />
                <div style={formButtonRow}>
                  <button
                    type="submit"
                    disabled={savingField === "name"}
                    style={{
                      ...buttonStyle,
                      opacity: savingField === "name" ? 0.6 : 1,
                      cursor: savingField === "name" ? "not-allowed" : "pointer",
                    }}
                  >
                    Save Name
                  </button>
                </div>
              </form>

              <form onSubmit={handleBioSubmit} style={formRow}>
                <label htmlFor="worker-bio" style={labelStyle}>
                  Bio
                </label>
                <textarea
                  id="worker-bio"
                  value={bioInput}
                  onChange={handleBioChange}
                  style={textareaStyle}
                  disabled={savingField === "bio"}
                />
                <div style={formButtonRow}>
                  <button
                    type="submit"
                    disabled={savingField === "bio"}
                    style={{
                      ...buttonStyle,
                      opacity: savingField === "bio" ? 0.6 : 1,
                      cursor: savingField === "bio" ? "not-allowed" : "pointer",
                    }}
                  >
                    Save Bio
                  </button>
                </div>
              </form>

              <form onSubmit={handlePhoneSubmit} style={formRow}>
                <label htmlFor="worker-phone" style={labelStyle}>
                  Phone Number
                </label>
                <input
                  id="worker-phone"
                  type="tel"
                  value={phoneInput}
                  onChange={handlePhoneChange}
                  style={inputStyle}
                  disabled={savingField === "phone"}
                />
                <div style={formButtonRow}>
                  <button
                    type="submit"
                    disabled={savingField === "phone"}
                    style={{
                      ...buttonStyle,
                      opacity: savingField === "phone" ? 0.6 : 1,
                      cursor: savingField === "phone" ? "not-allowed" : "pointer",
                    }}
                  >
                    Save Phone
                  </button>
                </div>
              </form>

              <form onSubmit={handleBusinessSubmit} style={formRow}>
                <label htmlFor="worker-business" style={labelStyle}>
                  Business ID
                </label>
                <input
                  id="worker-business"
                  type="text"
                  value={businessInput}
                  onChange={handleBusinessChange}
                  style={inputStyle}
                  disabled={savingField === "business"}
                />
                <p style={{ ...helperTextStyle, marginTop: -8 }}>
                  Changing your business resets approval while the owner reviews the request.
                </p>
                <div style={formButtonRow}>
                  <button
                    type="submit"
                    disabled={savingField === "business"}
                    style={{
                      ...buttonStyle,
                      opacity: savingField === "business" ? 0.6 : 1,
                      cursor: savingField === "business" ? "not-allowed" : "pointer",
                    }}
                  >
                    Update Business
                  </button>
                </div>
              </form>
            </section>

            <section style={sectionStyle}>
              <h3 style={sectionTitle}>Profile Picture</h3>
              <form onSubmit={handleProfileImageSubmit} style={formRow}>
                <label htmlFor="worker-profile-image" style={labelStyle}>
                  Upload a new profile photo
                </label>
                <input
                  id="worker-profile-image"
                  type="file"
                  accept="image/*"
                  onChange={handleProfileImageChange}
                  style={fileInputStyle}
                  disabled={savingField === "profile-picture"}
                />
                {profileImageFile && <span style={fileNameStyle}>{profileImageFile.name}</span>}
                <div style={formButtonRow}>
                  <button
                    type="submit"
                    disabled={savingField === "profile-picture" || !profileImageFile}
                    style={{
                      ...buttonStyle,
                      opacity:
                        savingField === "profile-picture" || !profileImageFile ? 0.6 : 1,
                      cursor:
                        savingField === "profile-picture" || !profileImageFile
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Upload Photo
                  </button>
                </div>
              </form>
            </section>

            <section style={sectionStyle}>
              <h3 style={sectionTitle}>Services</h3>
              {profile.services.length > 0 ? (
                <div style={chipContainer}>
                  {profile.services.map((service) => (
                    <span key={service} style={chipStyle}>
                      {service}
                    </span>
                  ))}
                </div>
              ) : (
                <p style={bodyText}>No services listed yet.</p>
              )}
            </section>

            <section style={sectionStyle}>
              <h3 style={sectionTitle}>Portfolio Photos</h3>
              <form onSubmit={handleWorkPhotoSubmit} style={formRow}>
                <label htmlFor="worker-work-image" style={labelStyle}>
                  Add a photo from previous appointments
                </label>
                <input
                  id="worker-work-image"
                  type="file"
                  accept="image/*"
                  onChange={handleWorkImageChange}
                  style={fileInputStyle}
                  disabled={savingField === "portfolio"}
                />
                {workImageFile && <span style={fileNameStyle}>{workImageFile.name}</span>}
                <div style={formButtonRow}>
                  <button
                    type="submit"
                    disabled={savingField === "portfolio" || !workImageFile}
                    style={{
                      ...buttonStyle,
                      opacity:
                        savingField === "portfolio" || !workImageFile ? 0.6 : 1,
                      cursor:
                        savingField === "portfolio" || !workImageFile
                          ? "not-allowed"
                          : "pointer",
                    }}
                  >
                    Upload Work Photo
                  </button>
                </div>
              </form>
              {photos.length > 0 ? (
                <div style={photoGrid}>
                  {photos.map((photo) => (
                    <div key={photo.id} style={photoCard}>
                      <img src={photo.picture} alt="Work example" style={workImageStyle} />
                    </div>
                  ))}
                </div>
              ) : (
                <p style={bodyText}>Add photos above to start building your portfolio.</p>
              )}
            </section>
          </>
        )}
      </div>
    </div>
  );
}

const pageContainer: React.CSSProperties = {
  backgroundColor: "#2A1F1D",
  position: "fixed",
  top: 64,
  left: 0,
  right: 0,
  bottom: 0,
  overflow: "auto",
  padding: "40px 20px",
};

const cardStyle: React.CSSProperties = {
  backgroundColor: "#372C2E",
  borderRadius: 12,
  padding: 40,
  boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
  border: "2px solid #DE9E48",
  maxWidth: 1200,
  margin: "0 auto",
  color: "#FFFFFF",
};

const headingStyle: React.CSSProperties = {
  marginTop: 0,
  borderBottom: "3px solid #DE9E48",
  paddingBottom: 16,
  marginBottom: 24,
};

const subheadingStyle: React.CSSProperties = {
  margin: "0 0 12px 0",
};

const sectionStyle: React.CSSProperties = {
  marginTop: 32,
};

const sectionTitle: React.CSSProperties = {
  margin: "0 0 12px 0",
  color: "#DE9E48",
  letterSpacing: 0.3,
  textTransform: "uppercase",
  fontSize: 14,
};

const bodyText: React.CSSProperties = {
  margin: 0,
  lineHeight: 1.6,
};

const labelMuted: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)",
  margin: 0,
};

const summarySection: React.CSSProperties = {
  display: "flex",
  gap: 24,
  alignItems: "center",
  flexWrap: "wrap",
};

const summaryText: React.CSSProperties = {
  margin: "4px 0",
  lineHeight: 1.5,
};

const summaryMetaText: React.CSSProperties = {
  opacity: 0.8,
  fontWeight: 400,
};

const bioSummaryText: React.CSSProperties = {
  ...summaryText,
  marginTop: 12,
  whiteSpace: "pre-line",
};

const profileImageStyle: React.CSSProperties = {
  width: 160,
  height: 160,
  borderRadius: "50%",
  objectFit: "cover",
  border: "3px solid #DE9E48",
};

const placeholderAvatar: React.CSSProperties = {
  width: 160,
  height: 160,
  borderRadius: "50%",
  border: "3px solid #DE9E48",
  backgroundColor: "#4A3A3C",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const placeholderInitials: React.CSSProperties = {
  fontSize: 48,
  fontWeight: 700,
  color: "#DE9E48",
};

const chipContainer: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: 12,
};

const chipStyle: React.CSSProperties = {
  backgroundColor: "#2A1F1D",
  border: "1px solid #DE9E48",
  borderRadius: 999,
  padding: "8px 16px",
};

const photoGrid: React.CSSProperties = {
  display: "grid",
  gap: 16,
  gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
};

const photoCard: React.CSSProperties = {
  backgroundColor: "#2A1F1D",
  borderRadius: 12,
  overflow: "hidden",
  border: "1px solid rgba(222, 158, 72, 0.4)",
};

const workImageStyle: React.CSSProperties = {
  width: "100%",
  height: 160,
  objectFit: "cover",
};

const errorBox: React.CSSProperties = {
  backgroundColor: "rgba(176, 0, 32, 0.15)",
  border: "1px solid rgba(176, 0, 32, 0.6)",
  borderRadius: 8,
  padding: "12px 16px",
  color: "#FFB4AB",
  marginBottom: 16,
};

const inlineErrorBox: React.CSSProperties = {
  ...errorBox,
  marginBottom: 12,
};

const successBox: React.CSSProperties = {
  backgroundColor: "rgba(49, 196, 141, 0.18)",
  border: "1px solid rgba(49, 196, 141, 0.6)",
  borderRadius: 8,
  padding: "12px 16px",
  color: "#D7FEE9",
  marginBottom: 16,
};

const helperTextStyle: React.CSSProperties = {
  margin: "0 0 16px 0",
  color: "rgba(255,255,255,0.7)",
  fontSize: 13,
};

const formRow: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 8,
  marginBottom: 20,
};

const labelStyle: React.CSSProperties = {
  fontWeight: 600,
  color: "#FFFFFF",
  fontSize: 14,
};

const inputStyle: React.CSSProperties = {
  backgroundColor: "#2A1F1D",
  border: "1px solid rgba(222, 158, 72, 0.6)",
  borderRadius: 8,
  padding: "12px 14px",
  color: "#FFFFFF",
};

const textareaStyle: React.CSSProperties = {
  ...inputStyle,
  minHeight: 140,
  resize: "vertical",
};

const formButtonRow: React.CSSProperties = {
  display: "flex",
  justifyContent: "flex-end",
  gap: 12,
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#DE9E48",
  color: "#372C2E",
  border: "none",
  borderRadius: 8,
  padding: "10px 18px",
  fontWeight: 600,
  cursor: "pointer",
};

const fileInputStyle: React.CSSProperties = {
  color: "#FFFFFF",
};

const fileNameStyle: React.CSSProperties = {
  color: "rgba(255,255,255,0.7)",
  fontSize: 12,
};
