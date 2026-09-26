import { NextResponse } from "next/server";

export function GET(request: Request) {
  const appId = process.env.INSTAGRAM_APP_ID;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!appId || !redirectUri) {
    return NextResponse.json(
      { error: "Instagram OAuth não configurado. Defina INSTAGRAM_APP_ID e INSTAGRAM_REDIRECT_URI." },
      { status: 503 },
    );
  }

  const url = new URL("https://www.facebook.com/v23.0/dialog/oauth");
  url.searchParams.set("client_id", appId);
  url.searchParams.set("redirect_uri", redirectUri);
  url.searchParams.set("state", crypto.randomUUID());
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement");

  const response = NextResponse.redirect(url);
  response.cookies.set("instagram_oauth_state", url.searchParams.get("state") ?? "", {
    httpOnly: true,
    maxAge: 600,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
