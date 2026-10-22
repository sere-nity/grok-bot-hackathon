import { ImageResponse } from "@vercel/og";
import { NextRequest } from "next/server";

export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const title = searchParams.get("title") || "Community Event";
    const date = searchParams.get("date") || "";
    const venue = searchParams.get("venue") || "";
    
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
            backgroundColor: "#0a0a0f",
            backgroundImage: "radial-gradient(circle at 25% 25%, rgba(99, 102, 241, 0.1) 0%, transparent 50%), radial-gradient(circle at 75% 75%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              padding: "80px",
              textAlign: "center",
              maxWidth: "1000px",
            }}
          >
            <div
              style={{
                fontSize: 72,
                fontWeight: 700,
                background: "linear-gradient(to bottom right, #ffffff, #a8a8a8)",
                backgroundClip: "text",
                color: "transparent",
                marginBottom: 32,
                lineHeight: 1.2,
              }}
            >
              {title}
            </div>
            
            {date && (
              <div
                style={{
                  fontSize: 32,
                  color: "#a1a1aa",
                  marginBottom: 16,
                  display: "flex",
                  alignItems: "center",
                }}
              >
                📅 {date}
              </div>
            )}
            
            {venue && (
              <div
                style={{
                  fontSize: 28,
                  color: "#71717a",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                📍 {venue}
              </div>
            )}
            
            <div
              style={{
                position: "absolute",
                bottom: 60,
                display: "flex",
                alignItems: "center",
                fontSize: 24,
                color: "#52525b",
              }}
            >
              Event Autopilot
            </div>
          </div>
        </div>
      ),
      {
        width: 1200,
        height: 630,
      }
    );
  } catch (error) {
    console.error(error);
    return new Response("Failed to generate image", { status: 500 });
  }
}
