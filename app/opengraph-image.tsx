import { ImageResponse } from "next/og";

export const runtime = "edge";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: "#ffffff",
          fontFamily: "Georgia, serif",
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 300,
            color: "#1A1A1A",
            letterSpacing: "0.3em",
            marginBottom: 40,
          }}
        >
          NOREVA
        </div>
        <div
          style={{
            fontSize: 24,
            color: "#8A8A8A",
            letterSpacing: "0.2em",
            textTransform: "uppercase",
          }}
        >
          Premium Fashion House
        </div>
        <div
          style={{
            width: 60,
            height: 1,
            backgroundColor: "#C9A96E",
            marginTop: 40,
          }}
        />
        <div
          style={{
            fontSize: 18,
            color: "#8A8A8A",
            marginTop: 40,
            letterSpacing: "0.1em",
          }}
        >
          Shanghai — Milan
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
