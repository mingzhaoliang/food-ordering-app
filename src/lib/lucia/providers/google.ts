import { Google } from "arctic";

export const google = new Google(
  process.env.OAUTH_GOOGLE_CLIENT_ID!,
  process.env.OAUTH_GOOGLE_CLIENT_SECRET!,
  process.env.BASE_URL! + "/api/auth/signin/google/callback"
);
