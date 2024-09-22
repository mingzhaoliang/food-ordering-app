import { createAuthSession } from "@/lib/lucia/auth";
import { google } from "@/lib/lucia/providers/google";
import { Account } from "@/schemas/mongoose/auth/account.model";
import { createUser } from "@/services/mongoose/auth/user.dal";
import { ArcticFetchError, OAuth2RequestError } from "arctic";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest): Promise<NextResponse> {
  // get the state and code from the search params
  const url = new URL(request.url);

  const state = url.searchParams.get("state");
  const code = url.searchParams.get("code");

  // get the state and code verifier from the cookies
  const storedState = cookies().get("google_oauth_state")?.value ?? null;
  const storedCodeVerifier = cookies().get("google_oauth_code_verifier")?.value ?? null;

  const callbackUrl = cookies().get("callbackUrl")?.value ?? "/";

  // check if the state and code are valid & compare state with stored state
  if (!code || !state || !storedState || !storedCodeVerifier || state !== storedState) {
    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: "/auth",
      },
    });
  }

  try {
    // validate the authorization code in the search params
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);
    const accessToken = tokens.accessToken();

    // fetch the user's information
    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    const user = await response.json();

    // check if the user is already registered
    const existingAccount = await Account.findOne({
      _id: { providerId: "google", providerUserId: user.sub },
    }).exec();

    if (existingAccount) {
      // if the user is already registered, create a new session and redirect the user to the home page
      await createAuthSession(existingAccount.userId);
    } else {
      const userId = await createUser({
        user: {
          email: user.email,
          firstName: user.given_name,
          lastName: user.family_name,
          emailVerified: user.email_verified,
        },
        account: { providerId: "google", providerUserId: user.sub },
      });

      await createAuthSession(userId);
    }

    return new NextResponse(null, {
      status: 302,
      headers: {
        Location: callbackUrl,
      },
    });
  } catch (error) {
    console.error(error);

    if (error instanceof OAuth2RequestError) {
      return new NextResponse("Invalid authorization code", { status: 400 });
    }

    if (error instanceof ArcticFetchError) {
      return new NextResponse("Failed to fetch tokens", { status: 500 });
    }

    return new NextResponse("An unexpected error occurred", { status: 500 });
  }
}
