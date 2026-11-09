import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// iOS home-screen icon: the header's interchange mark on a white tile.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff" }}>
        <svg width="132" height="132" viewBox="0 0 32 32">
          <path d="M3.5 16h25" stroke="#f2b705" strokeWidth="6" strokeLinecap="round" />
          <path d="M16 3.5v25" stroke="#c4167c" strokeWidth="6" strokeLinecap="round" />
          <circle cx="16" cy="16" r="7" fill="#ffffff" stroke="#15171c" strokeWidth="4" />
        </svg>
      </div>
    ),
    size,
  );
}
