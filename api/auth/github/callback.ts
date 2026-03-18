import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

interface User {
  id: string;
  githubId: number;
  login: string;
  name: string;
  avatarUrl: string;
  email?: string;
  bio?: string;
  website?: string;
  location?: string;
  createdAt: string;
  lastLoginAt: string;
  isAdmin: boolean;
}

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

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

    console.log('GitHub OAuth: Starting token exchange');
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
    console.log('GitHub OAuth: Token response received');
    
    if (tokenData.error) {
      console.error('GitHub OAuth: Token error', tokenData.error);
      res.status(400).json(tokenData);
      return;
    }

    console.log('GitHub OAuth: Fetching user info');
    const userResponse = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${tokenData.access_token}`,
      },
    });

    const userData = await userResponse.json();
    console.log('GitHub OAuth: User info received');

    console.log('GitHub OAuth: Saving user to database');
    const users = await kv.get<User[]>('users') || [];
    const userId = `github_${userData.id}`;
    const existingUserIndex = users.findIndex(u => u.id === userId);
    
    const now = new Date().toISOString();
    
    if (existingUserIndex >= 0) {
      users[existingUserIndex] = {
        ...users[existingUserIndex],
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        email: userData.email,
        bio: userData.bio,
        website: userData.blog,
        location: userData.location,
        lastLoginAt: now,
      };
    } else {
      const newUser: User = {
        id: userId,
        githubId: userData.id,
        login: userData.login,
        name: userData.name || userData.login,
        avatarUrl: userData.avatar_url,
        email: userData.email,
        bio: userData.bio,
        website: userData.blog,
        location: userData.location,
        createdAt: now,
        lastLoginAt: now,
        isAdmin: false,
      };
      users.push(newUser);
    }

    await kv.set('users', users);
    console.log('GitHub OAuth: User saved successfully');

    res.status(200).json({
      access_token: tokenData.access_token,
      user: userData
    });
  } catch (error) {
    console.error('GitHub OAuth error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}