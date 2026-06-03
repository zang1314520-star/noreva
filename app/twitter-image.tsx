import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 600,
};

export const contentType = "image/png";

export default function TwitterImage() {
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
          fontFamily: "Inter, sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 92,
            fontWeight: 700,
            color: "#1A1A1A",
            marginBottom: 26,
          }}
        >
          Nayo Smart
        </div>
        <div
          style={{
            fontSize: 28,
            color: "#5C5A57",
            letterSpacing: "0.14em",
            textTransform: "uppercase",
          }}
        >
          Official smart backpacks
        </div>
        <div
          style={{
            width: 64,
            height: 2,
            backgroundColor: "#232933",
            marginTop: 28,
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
