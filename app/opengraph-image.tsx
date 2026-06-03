import { ImageResponse } from "next/og";

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
          background: "linear-gradient(135deg, #ffffff 0%, #f3f0ea 55%, #d9d3c8 100%)",
          fontFamily: "Inter, sans-serif",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 94,
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: 28,
            letterSpacing: "-0.04em",
          }}
        >
          Nayo Smart
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#1A1A1A",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Official Smart Backpacks for Work and Travel
        </div>
        <div
          style={{
            width: 82,
            height: 2,
            backgroundColor: "#232933",
            marginTop: 34,
          }}
        />
        <div
          style={{
            fontSize: 20,
            color: "#5C5A57",
            marginTop: 32,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Urban U7 · Herman H6 · Herman H8 · Herman Pro
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
