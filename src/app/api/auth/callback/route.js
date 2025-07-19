import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const inputUsername = searchParams.get('username');

  const protocol = req.headers.get('x-forwarded-proto') || 'http';
  const host = req.headers.get('host') || 'localhost:3000';
  const baseUrl = `${protocol}://${host}`;

  if (!code || !inputUsername) {
    return NextResponse.redirect(`${baseUrl}/signup?verified=false&reason=missing_params`);
  }

  try {
    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    if (!tokenRes.ok) {
      throw new Error('Failed to fetch access token');
    }

    const tokenData = await tokenRes.json();
    const accessToken = tokenData.access_token;

    if (!accessToken) {
      throw new Error('No access token received');
    }

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/json',
      },
    });

    if (!userRes.ok) {
      throw new Error('Failed to fetch user info');
    }

    const userData = await userRes.json();
    const githubUsername = userData.login?.toLowerCase();
    const expectedUsername = inputUsername.toLowerCase();

    if (githubUsername !== expectedUsername) {
      return NextResponse.redirect(`${baseUrl}/signup?verified=false&reason=username_mismatch`);
    }

    return NextResponse.redirect(`${baseUrl}/signup?verified=true&username=${githubUsername}`);
  } catch (err) {
    console.error(err);
    return NextResponse.redirect(`${baseUrl}/signup?verified=false&reason=oauth_error`);
  }
}
