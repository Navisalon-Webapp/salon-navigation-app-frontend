import { useEffect, useState } from "react";
import beforeImg from "../assets/before_example.png";
import afterImg from "../assets/after_example.png";

type Props = {
  appointmentId?: string;
};

// Side-by-side Fetches image URLs from backend if available; if the
// response is not JSON (e.g. an HTML error page) we silently fallback to the
// bundled assets to avoid JSON parse errors.
export default function BeforeAfterImages({
  appointmentId = "demo-appointment-1",
}: Props) {
  const [beforeSrc, setBeforeSrc] = useState<string>(beforeImg);
  const [afterSrc, setAfterSrc] = useState<string>(afterImg);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    const controller = new AbortController();

    async function fetchImages() {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/appointments/${appointmentId}/images`, {
          signal: controller.signal,
        });
        if (!res.ok) {
          return;
        }

        const contentType = res.headers.get("content-type") || "";
        if (!contentType.includes("application/json")) {
          return;
        }

        const data = await res.json();
        const beforeUrl = data.before ?? data.beforeUrl;
        const afterUrl = data.after ?? data.afterUrl;
        if (mounted) {
          if (beforeUrl) setBeforeSrc(beforeUrl);
          if (afterUrl) setAfterSrc(afterUrl);
        }
      } catch (err: any) {
        if (!controller.signal.aborted) {
          setError(err.message ?? String(err));
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchImages();

    return () => {
      mounted = false;
      controller.abort();
    };
  }, [appointmentId]);

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ color: "#FFFFFF", marginBottom: 12 }}>
        Before & After Images
      </h2>

      {loading && (
        <div style={{ color: "#fff", marginBottom: 12 }}>Loading images…</div>
      )}
      {error && (
        <div style={{ color: "#f88", marginBottom: 12 }}>
          Failed to load images: {error}
        </div>
      )}

      <div style={{ display: "flex", gap: 12 }}>
        <figure style={{ flex: 1, margin: 0 }}>
          <img
            src={beforeSrc}
            alt="Before"
            style={{
              width: "100%",
              height: 320,
              borderRadius: 8,
              display: "block",
              objectFit: "cover",
            }}
          />
          <figcaption
            style={{ color: "#fff", textAlign: "center", marginTop: 8 }}
          >
            Before
          </figcaption>
        </figure>

        <figure style={{ flex: 1, margin: 0 }}>
          <img
            src={afterSrc}
            alt="After"
            style={{
              width: "100%",
              height: 320,
              borderRadius: 8,
              display: "block",
              objectFit: "cover",
            }}
          />
          <figcaption
            style={{ color: "#fff", textAlign: "center", marginTop: 8 }}
          >
            After
          </figcaption>
        </figure>
      </div>
    </div>
  );
}
