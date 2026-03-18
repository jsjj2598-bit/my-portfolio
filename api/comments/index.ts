import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

interface CommentItem {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  createdAt: string;
}

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const comments = await kv.get<CommentItem[]>('comments');
      res.status(200).json(comments || []);
      return;
    }

    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: '未授权' });
        return;
      }

      const newComment = req.body as CommentItem;
      const comments = await kv.get<CommentItem[]>('comments') || [];
      const updated = [newComment, ...comments];
      await kv.set('comments', updated);
      res.status(200).json(newComment);
      return;
    }

    if (req.method === 'DELETE') {
      const { id } = req.body as { id: number };
      const comments = await kv.get<CommentItem[]>('comments') || [];
      const updated = comments.filter(item => item.id !== id);
      await kv.set('comments', updated);
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
