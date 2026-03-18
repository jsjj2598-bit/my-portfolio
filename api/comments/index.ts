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
  targetId?: string;
  targetType?: string;
  createdAt: string;
}

interface LikeItem {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  targetId: string;
  targetType: string;
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
      const { targetId, targetType } = req.query;
      
      if (targetId && targetType) {
        const comments = await kv.get<CommentItem[]>('comments') || [];
        const likes = await kv.get<LikeItem[]>('likes') || [];
        const filteredComments = comments.filter(c => 
          c.targetId === targetId && c.targetType === targetType
        );
        const filteredLikes = likes.filter(l => 
          l.targetId === targetId && l.targetType === targetType
        );
        res.status(200).json({ comments: filteredComments, likes: filteredLikes });
      } else {
        const comments = await kv.get<CommentItem[]>('comments');
        const likes = await kv.get<LikeItem[]>('likes');
        res.status(200).json({ comments: comments || [], likes: likes || [] });
      }
      return;
    }

    if (req.method === 'POST') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: '未授权' });
        return;
      }

      const { action, ...data } = req.body as any;

      if (action === 'like') {
        const newLike: LikeItem = {
          ...data,
          id: Date.now(),
          createdAt: new Date().toISOString(),
        };
        const likes = await kv.get<LikeItem[]>('likes') || [];
        const existingLikeIndex = likes.findIndex(l => 
          l.userId === newLike.userId && 
          l.targetId === newLike.targetId && 
          l.targetType === newLike.targetType
        );
        
        if (existingLikeIndex >= 0) {
          likes.splice(existingLikeIndex, 1);
        } else {
          likes.push(newLike);
        }
        
        await kv.set('likes', likes);
        res.status(200).json({ likes, liked: existingLikeIndex < 0 });
        return;
      }

      const newComment: CommentItem = {
        ...data,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      };
      const comments = await kv.get<CommentItem[]>('comments') || [];
      comments.push(newComment);
      await kv.set('comments', comments);
      res.status(200).json(newComment);
      return;
    }

    if (req.method === 'DELETE') {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        res.status(401).json({ error: '未授权' });
        return;
      }

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
