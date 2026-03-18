import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { code } = req.body as { code: string };

    if (!code) {
      res.status(400).json({ error: 'Missing code' });
      return;
    }

    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        client_id: process.env.VITE_GITHUB_CLIENT_ID || '',
        client_secret: process.env.VITE_GITHUB_CLIENT_SECRET || '',
        code,
        redirect_uri: process.env.VITE_GITHUB_REDIRECT_URI || '',
      }),
    });

    const tokenData = await tokenResponse.json();
    
    if (tokenData.error) {
      res.status(400).json(tokenData);
      return;
    }

    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();

    res.status(200).json({
      access_token: tokenData.access_token,
      user: userData
    });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
