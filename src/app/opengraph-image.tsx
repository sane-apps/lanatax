import { ImageResponse } from "next/og";

export const dynamic = "force-static";
export const alt = "LanaTax — Free Solana Tax Calculator";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          background: "#050507",
          fontFamily: "sans-serif",
          position: "relative",
        }}
      >
        {/* Top gradient accent line */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 4,
            display: "flex",
            backgroundImage: "linear-gradient(to right, #0E7490, #5CE8FF, #0E7490)",
          }}
        />

        {/* Subtle background glow */}
        <div
          style={{
            position: "absolute",
            top: -100,
            right: -100,
            width: 500,
            height: 500,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(6, 182, 212, 0.08) 0%, transparent 70%)",
            display: "flex",
          }}
        />

        {/* Logo row */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 48 }}>
          <div
            style={{
              width: 56,
              height: 56,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backgroundImage: "linear-gradient(135deg, #0E7490, #5CE8FF)",
              borderRadius: 14,
              marginRight: 20,
            }}
          >
            <span style={{ color: "white", fontSize: 30, fontWeight: 800 }}>
              L
            </span>
          </div>
          <span style={{ color: "white", fontSize: 36, fontWeight: 700 }}>
            LanaTax
          </span>
          <span
            style={{
              color: "rgba(255,255,255,0.3)",
              fontSize: 18,
              fontWeight: 400,
              marginLeft: 16,
            }}
          >
            by SaneApps
          </span>
        </div>

        {/* Main headline */}
        <div
          style={{
            color: "#ffffff",
            fontSize: 56,
            fontWeight: 800,
            lineHeight: 1.15,
            marginBottom: 20,
            display: "flex",
          }}
        >
          Free Solana Tax Calculator
        </div>

        {/* Subtitle */}
        <div
          style={{
            color: "rgba(255,255,255,0.9)",
            fontSize: 24,
            marginBottom: 48,
            display: "flex",
          }}
        >
          Paste your wallet. Get tax-ready CSV for Koinly & CoinLedger.
        </div>

        {/* Trust badges */}
        <div style={{ display: "flex", gap: 16 }}>
          {["100% Free", "On-Device", "No Sign-up", "Unlimited"].map(
            (badge) => (
              <div
                key={badge}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "10px 22px",
                  background: "rgba(6, 182, 212, 0.08)",
                  border: "1px solid rgba(6, 182, 212, 0.2)",
                  borderRadius: 10,
                  color: "#06B6D4",
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {badge}
              </div>
            )
          )}
        </div>

        {/* Bottom URL */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            display: "flex",
            color: "rgba(255,255,255,0.6)",
            fontSize: 18,
          }}
        >
          tax.saneapps.com
        </div>

        {/* Bottom gradient accent line */}
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 2,
            display: "flex",
            backgroundImage: "linear-gradient(to right, transparent, #06B6D4, transparent)",
          }}
        />
      </div>
    ),
    { ...size }
  );
}
