import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

interface User {
  id: string;
  email: string;
  password: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  isAdmin: boolean;
}

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.VITE_ADMIN_PASSWORD}`) {
        res.status(401).json({ error: '未授权' });
        return;
      }

      const users = await kv.get<User[]>('users') || [];
      // 返回用户列表（不包含密码）
      const safeUsers = users.map(u => ({
        id: u.id,
        email: u.email,
        name: u.name,
        avatar: u.avatar,
        createdAt: u.createdAt,
        lastLoginAt: u.lastLoginAt,
        isAdmin: u.isAdmin,
      }));
      res.status(200).json(safeUsers);
      return;
    }

    if (req.method === 'PUT') {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.VITE_ADMIN_PASSWORD}`) {
        res.status(401).json({ error: '未授权' });
        return;
      }

      const { id, isAdmin } = req.body as { id: string; isAdmin: boolean };
      const users = await kv.get<User[]>('users') || [];
      const updatedUsers = users.map(u => 
        u.id === id ? { ...u, isAdmin } : u
      );
      await kv.set('users', updatedUsers);
      res.status(200).json({ success: true });
      return;
    }

    if (req.method === 'DELETE') {
      const authHeader = req.headers.authorization;
      if (!authHeader || authHeader !== `Bearer ${process.env.VITE_ADMIN_PASSWORD}`) {
        res.status(401).json({ error: '未授权' });
        return;
      }

      const { id } = req.body as { id: string };
      const users = await kv.get<User[]>('users') || [];
      const updatedUsers = users.filter(u => u.id !== id);
      await kv.set('users', updatedUsers);
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('Users API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}