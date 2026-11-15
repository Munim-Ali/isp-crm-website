import { ImageResponse } from "next/og";
import { site } from "@/config/site";
export const alt = "A calmer way to run your ISP";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export default function OpenGraphImage() {
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        background: "linear-gradient(135deg,#F2F8FF,#B3D0FF)",
        padding: "80px",
        color: "#18181B",
      }}
    >
      <div
        style={{
          display: "flex",
          fontSize: 32,
          fontWeight: 700,
          color: "#004DFE",
          marginBottom: 54,
        }}
      >
        {site.name.toLowerCase()}.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: -3,
        }}
      >
        Less chasing details.
      </div>
      <div
        style={{
          display: "flex",
          fontSize: 72,
          fontWeight: 700,
          letterSpacing: -3,
          color: "#004DFE",
        }}
      >
        More human connections.
      </div>
      <div style={{ display: "flex", fontSize: 24, marginTop: 32 }}>
        A calmer way to run your ISP.
      </div>
    </div>,
    size,
  );
}
