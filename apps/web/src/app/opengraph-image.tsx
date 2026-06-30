import { ImageResponse } from "next/og";

export const alt = "My Doctor — Trusted Healthcare Platform in Bangladesh";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "1200px",
          height: "630px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #00BA6E 0%, #007A48 100%)",
          fontFamily: "system-ui, sans-serif",
          padding: "60px",
          position: "relative",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "20px",
          }}
        >
          <div
            style={{
              background: "rgba(255,255,255,0.15)",
              borderRadius: "20px",
              padding: "20px 48px",
              border: "2px solid rgba(255,255,255,0.3)",
              display: "flex",
            }}
          >
            <span
              style={{
                fontSize: "60px",
                fontWeight: "800",
                color: "white",
                letterSpacing: "-1px",
              }}
            >
              My Doctor
            </span>
          </div>
          <p
            style={{
              fontSize: "30px",
              color: "rgba(255,255,255,0.9)",
              textAlign: "center",
              margin: "0",
              fontWeight: "500",
              display: "flex",
            }}
          >
            Book Doctors, Telemedicine &amp; Healthcare Services
          </p>
          <p
            style={{
              fontSize: "22px",
              color: "rgba(255,255,255,0.7)",
              textAlign: "center",
              margin: "0",
              fontWeight: "400",
              display: "flex",
            }}
          >
            Available 24/7 across Bangladesh · mydoctor.com.bd
          </p>
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginTop: "8px",
            }}
          >
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "100px", padding: "8px 20px", color: "white", fontSize: "16px", fontWeight: "600", display: "flex" }}>Doctors</div>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "100px", padding: "8px 20px", color: "white", fontSize: "16px", fontWeight: "600", display: "flex" }}>Hospitals</div>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "100px", padding: "8px 20px", color: "white", fontSize: "16px", fontWeight: "600", display: "flex" }}>Telemedicine</div>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "100px", padding: "8px 20px", color: "white", fontSize: "16px", fontWeight: "600", display: "flex" }}>Ambulance</div>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: "100px", padding: "8px 20px", color: "white", fontSize: "16px", fontWeight: "600", display: "flex" }}>Diagnostics</div>
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
