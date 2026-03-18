import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@vercel/kv';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
  createdAt: string;
}

const kv = createClient({
  url: process.env.KV_REST_API_URL || '',
  token: process.env.KV_REST_API_TOKEN || '',
});

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    if (req.method === 'GET') {
      const mediaItems = await kv.get<MediaItem[]>('mediaItems');
      res.status(200).json(mediaItems || []);
      return;
    }

    if (req.method === 'POST') {
      const newItem = req.body as MediaItem;
      const mediaItems = await kv.get<MediaItem[]>('mediaItems') || [];
      const updated = [...mediaItems, newItem];
      await kv.set('mediaItems', updated);
      res.status(200).json(newItem);
      return;
    }

    if (req.method === 'PUT') {
      const updatedItem = req.body as MediaItem;
      const mediaItems = await kv.get<MediaItem[]>('mediaItems') || [];
      const updated = mediaItems.map(item => 
        item.id === updatedItem.id ? updatedItem : item
      );
      await kv.set('mediaItems', updated);
      res.status(200).json(updatedItem);
      return;
    }

    if (req.method === 'DELETE') {
      const { id } = req.body as { id: number };
      const mediaItems = await kv.get<MediaItem[]>('mediaItems') || [];
      const updated = mediaItems.filter(item => item.id !== id);
      await kv.set('mediaItems', updated);
      res.status(200).json({ success: true });
      return;
    }

    res.status(405).json({ error: 'Method not allowed' });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
