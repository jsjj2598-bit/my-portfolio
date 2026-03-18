import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

interface ActivityLog {
  id: number;
  type: 'visit' | 'login' | 'comment' | 'like';
  userId?: string;
  userName?: string;
  userAvatar?: string;
  targetId?: string;
  targetType?: string;
  details?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
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

      const logs = await kv.get<ActivityLog[]>('logs') || [];
      res.status(200).json(logs);
      return;
    }

    if (req.method === 'POST') {
      const logData = req.body as Omit<ActivityLog, 'id' | 'createdAt' | 'ip' | 'userAgent'>;
      
      const newLog: ActivityLog = {
        ...logData,
        id: Date.now(),
        createdAt: new Date().toISOString(),
        ip: req.headers['x-forwarded-for'] as string || req.socket?.remoteAddress,
        userAgent: req.headers['user-agent'],
      };

      const logs = await kv.get<ActivityLog[]>('logs') || [];
      logs.unshift(newLog);
      
      await kv.set('logs', logs);
      res.status(200).json(newLog);
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}