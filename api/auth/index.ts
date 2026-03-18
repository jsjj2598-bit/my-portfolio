import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';
import crypto from 'crypto';

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

function generateUserId(): string {
  const chars = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < 12; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

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
    const { action, email, password, name } = req.body as { 
      action: string; 
      email?: string; 
      password?: string;
      name?: string;
    };

    if (action === 'register') {
      // 注册
      if (!email || !password || !name) {
        res.status(400).json({ error: '缺少必要参数' });
        return;
      }

      const users = await kv.get<User[]>('users') || [];
      
      // 检查邮箱是否已存在
      const existingUser = users.find(u => u.email === email);
      if (existingUser) {
        res.status(400).json({ error: '该邮箱已被注册' });
        return;
      }

      const userId = generateUserId();
      const hashedPassword = hashPassword(password);
      
      const newUser: User = {
        id: userId,
        email,
        password: hashedPassword,
        name,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`,
        createdAt: new Date().toISOString(),
        isAdmin: false,
      };

      users.push(newUser);
      await kv.set('users', users);

      res.status(200).json({
        success: true,
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          avatar: newUser.avatar,
        },
      });
      return;
    }

    if (action === 'login') {
      // 登录
      if (!email || !password) {
        res.status(400).json({ error: '缺少邮箱或密码' });
        return;
      }

      const users = await kv.get<User[]>('users') || [];
      const user = users.find(u => u.email === email && u.password === hashPassword(password));

      if (!user) {
        res.status(401).json({ error: '邮箱或密码错误' });
        return;
      }

      // 更新最后登录时间
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, lastLoginAt: new Date().toISOString() } : u
      );
      await kv.set('users', updatedUsers);

      res.status(200).json({
        success: true,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          avatar: user.avatar,
        },
      });
      return;
    }

    res.status(400).json({ error: '无效的操作' });
  } catch (error) {
    console.error('Auth API Error:', error);
    res.status(500).json({ error: '服务器错误' });
  }
}