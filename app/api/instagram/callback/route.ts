import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const returnedState = url.searchParams.get("state");
  const stateCookie = request.headers.get("cookie")?.match(/(?:^|;\s*)instagram_oauth_state=([^;]+)/)?.[1];
  const appId = process.env.INSTAGRAM_APP_ID;
  const appSecret = process.env.INSTAGRAM_APP_SECRET;
  const redirectUri = process.env.INSTAGRAM_REDIRECT_URI;

  if (!code || !returnedState || returnedState !== stateCookie) {
    return NextResponse.json({ error: "Resposta OAuth inválida." }, { status: 400 });
  }

  if (!appId || !appSecret || !redirectUri) {
    return NextResponse.json({ error: "Configure as credenciais do Instagram no ambiente." }, { status: 503 });
  }

  const tokenResponse = await fetch("https://graph.facebook.com/v23.0/oauth/access_token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({ client_id: appId, client_secret: appSecret, redirect_uri: redirectUri, code }),
  });

  if (!tokenResponse.ok) {
    return NextResponse.json({ error: "Não foi possível concluir a conexão com o Instagram." }, { status: 502 });
  }

  const token = (await tokenResponse.json()) as { access_token?: string };
  if (!token.access_token) {
    return NextResponse.json({ error: "A Meta não devolveu um token válido." }, { status: 502 });
  }

  const response = NextResponse.redirect(new URL("/?instagram=connected", request.url));
  response.cookies.set("instagram_access_token", token.access_token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 30,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  response.cookies.delete("instagram_oauth_state");
  return response;
}