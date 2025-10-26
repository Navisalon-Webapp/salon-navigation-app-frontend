import { useEffect, useState, useCallback } from "react";
import axios from "axios";
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
 
  const [, setError] = useState<string | null>(null);

  const loadImages = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`/api/appointments/${appointmentId}/images`, {

        timeout: 8000,

        headers: { Accept: "application/json" },

        params: { t: Date.now() },
      });

      const data = res?.data;
      if (data && typeof data === "object") {
        const beforeUrl = (data as any).before ?? (data as any).beforeUrl;
        const afterUrl = (data as any).after ?? (data as any).afterUrl;
        if (beforeUrl) setBeforeSrc(beforeUrl);
        if (afterUrl) setAfterSrc(afterUrl);
      }

    } catch (err: any) {

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

  return (
    <div style={{ marginTop: 24 }}>
      <h2 style={{ color: "#FFFFFF", marginBottom: 12 }}>
        Before & After Images
      </h2>

      {loading && (
        <div style={{ color: "#fff", marginBottom: 12 }}>Loading images…</div>
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
