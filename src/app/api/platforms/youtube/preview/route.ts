import { NextRequest, NextResponse } from "next/server";
import { getPreviewSession } from "@/lib/platforms/previewCache";

export async function GET(req: NextRequest) {
  // 1. Try server-side memory cache first (via session ID cookie)
  const sessionIdCookie = req.cookies.get("ce_yt_session");
  if (sessionIdCookie?.value) {
    const cached = getPreviewSession(sessionIdCookie.value);
    if (cached) {
      return NextResponse.json({
        success: true,
        preview: cached,
        source: "server_cache",
      });
    }
  }

  // 2. Try compact cookie fallback
  const cookie = req.cookies.get("ce_yt_preview");
  if (cookie?.value) {
    try {
      const jsonString = Buffer.from(cookie.value, "base64").toString("utf-8");
      const previewData = JSON.parse(jsonString);

      return NextResponse.json({
        success: true,
        preview: previewData,
        source: "cookie_fallback",
      });
    } catch {
      // Ignore parse failure
    }
  }

  return NextResponse.json(
    {
      success: false,
      error: "NO_PREVIEW_SESSION",
      message: "No active YouTube channel preview session found.",
    },
    { status: 404 }
  );
}
