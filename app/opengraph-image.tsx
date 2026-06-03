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
          background: "linear-gradient(135deg, #ffffff 0%, #f7f5f1 56%, #e8e1d2 100%)",
          fontFamily: "Georgia, serif",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 116,
            fontWeight: 300,
            color: "#1A1A1A",
            letterSpacing: "0.3em",
            marginBottom: 34,
          }}
        >
          NOREVA
        </div>
        <div
          style={{
            fontSize: 34,
            color: "#1A1A1A",
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            textAlign: "center",
          }}
        >
          Smart Backpacks for Work and Travel
        </div>
        <div
          style={{
            width: 76,
            height: 2,
            backgroundColor: "#C9A96E",
            marginTop: 38,
          }}
        />
        <div
          style={{
            fontSize: 20,
            color: "#6F6A64",
            marginTop: 34,
            letterSpacing: "0.12em",
            textTransform: "uppercase",
          }}
        >
          Free Global Shipping · 30-Day Returns · 24-Month Warranty
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
