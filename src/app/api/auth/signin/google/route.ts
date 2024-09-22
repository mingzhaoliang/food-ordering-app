import { google } from "@/lib/lucia/providers/google";
import { generateCodeVerifier, generateState } from "arctic";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  const searchParams = request.nextUrl.searchParams;
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const state = generateState();
  const codeVerifier = generateCodeVerifier();
  const scopes = ["email", "profile"];
  const url: URL = google.createAuthorizationURL(state, codeVerifier, scopes);

  cookies().set("google_oauth_state", state, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 5,
    sameSite: "lax",
  });

  cookies().set("google_oauth_code_verifier", codeVerifier, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 5,
    sameSite: "lax",
  });

  cookies().set("callbackUrl", callbackUrl, {
    path: "/",
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 5,
    sameSite: "lax",
  });

  return NextResponse.redirect(url);
}
