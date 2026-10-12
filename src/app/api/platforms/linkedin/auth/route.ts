import { NextRequest, NextResponse } from "next/server";
import { getLinkedInOAuthStatus, getLinkedInCredentials } from "@/lib/platforms/linkedin";
import crypto from "crypto";

function getRequestOrigin(req: NextRequest): string {
  const forwardedHost = req.headers.get("x-forwarded-host");
  const forwardedProto = req.headers.get("x-forwarded-proto");
  if (forwardedHost) {
    const proto = forwardedProto || "https";
    return `${proto}://${forwardedHost}`;
  }
  return req.nextUrl.origin;
}

export async function GET(req: NextRequest) {
  const origin = getRequestOrigin(req);
  const creatorId = req.nextUrl.searchParams.get("creatorId") || "default";

  const { clientId, clientSecret } = getLinkedInCredentials();

  if (!clientId || !clientSecret) {
    console.warn("[LinkedIn Auth] Credentials missing from .env.local on server.");
    return NextResponse.redirect(
      new URL(
        "/profile?linkedin_error=credentials_missing&error_description=LinkedIn+API+credentials+not+configured.+Please+set+LINKEDIN_CLIENT_ID+and+LINKEDIN_CLIENT_SECRET+in+.env.local",
        origin
      )
    );
  }

  // Generate cryptographically secure CSRF state token
  const randomBytes = crypto.randomBytes(24).toString("hex");
  const statePayload = `${randomBytes}__${encodeURIComponent(creatorId)}`;

  const status = getLinkedInOAuthStatus(origin, statePayload);

  if (!status.authUrl) {
    console.error("[LinkedIn Auth] Failed to generate LinkedIn authorization URL.");
    return NextResponse.redirect(
      new URL("/profile?linkedin_error=auth_url_failed&error_description=Failed+to+generate+LinkedIn+authorization+URL.", origin)
    );
  }

  console.log("[LinkedIn Auth] Initiating OAuth redirect to LinkedIn. Redirect URI:", status.redirectUri);

  const response = NextResponse.redirect(status.authUrl);

  const isHttps = req.nextUrl.protocol === "https:" || req.headers.get("x-forwarded-proto") === "https";

  // Store CSRF state token in secure HTTP-only cookie (10 minute expiry)
  response.cookies.set("li_oauth_state", statePayload, {
    httpOnly: true,
    secure: isHttps,
    sameSite: "lax",
    path: "/",
    maxAge: 600, // 10 minutes
  });

  return response;
}
