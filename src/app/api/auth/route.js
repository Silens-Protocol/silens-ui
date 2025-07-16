import { NextResponse } from 'next/server';

export async function GET(req) {
  const clientId = process.env.GITHUB_CLIENT_ID;
  const { searchParams } = new URL(req.url);
  const username = searchParams.get('username');

  if (!username) {
    return NextResponse.json({ error: "Missing username" }, { status: 400 });
  }

  const redirectUri = `http://localhost:3000/api/auth/callback?username=${username}`;
  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=read:user`;

  return NextResponse.redirect(githubAuthUrl);
}
