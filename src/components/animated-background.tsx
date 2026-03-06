"use client";

export function AnimatedBackground() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden">
      {/* Deep black base */}
      <div className="absolute inset-0 bg-[#050507]" />

      {/* Dot grid overlay */}
      <div className="dot-grid absolute inset-0 opacity-60" />

      {/* Primary teal blob — top left */}
      <div
        className="gradient-blob absolute -top-[30%] -left-[15%] h-[70%] w-[55%] rounded-full opacity-[0.10]"
        style={{
          background:
            "radial-gradient(circle, #5CE8FF 0%, #06B6D4 30%, transparent 70%)",
        }}
      />

      {/* Secondary teal blob — bottom right */}
      <div
        className="gradient-blob-delayed absolute -right-[15%] -bottom-[20%] h-[60%] w-[45%] rounded-full opacity-[0.08]"
        style={{
          background:
            "radial-gradient(circle, #0891B2 0%, #06B6D4 25%, transparent 70%)",
        }}
      />

      {/* Subtle teal wash — center */}
      <div
        className="gradient-blob-slow absolute top-[20%] left-[30%] h-[50%] w-[40%] rounded-full opacity-[0.04]"
        style={{
          background:
            "radial-gradient(circle, #06B6D4 0%, transparent 70%)",
        }}
      />

      {/* Subtle bottom glow line */}
      <div
        className="absolute bottom-0 left-0 right-0 h-px opacity-30"
        style={{
          background:
            "linear-gradient(90deg, transparent 0%, #06B6D4 50%, transparent 100%)",
        }}
      />

      {/* Noise overlay */}
      <div className="noise-overlay" />
    </div>
  );
}
