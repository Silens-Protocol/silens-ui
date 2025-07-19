import { NextResponse } from 'next/server';

export async function GET(req) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;
  
  const redirectUri = `${baseUrl}/api/auth/callback?username=${username}`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user&prompt=consent`;

  return NextResponse.redirect(githubAuthUrl);
}
