interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
  createdAt: string;
}

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

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
}

const API_BASE = '/api';

export const api = {
  async getMediaItems(): Promise<MediaItem[]> {
    try {
      const response = await fetch(`${API_BASE}/media`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching media items:', error);
      return [];
    }
  },

  async addMediaItem(item: MediaItem): Promise<MediaItem> {
    const response = await fetch(`${API_BASE}/media`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to add');
    return await response.json();
  },

  async updateMediaItem(item: MediaItem): Promise<MediaItem> {
    const response = await fetch(`${API_BASE}/media`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    });
    if (!response.ok) throw new Error('Failed to update');
    return await response.json();
  },

  async deleteMediaItem(id: number): Promise<void> {
    const response = await fetch(`${API_BASE}/media`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('Failed to delete');
  },

  async getComments(): Promise<CommentItem[]> {
    try {
      const response = await fetch(`${API_BASE}/comments`);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return [];
    }
  },

  async addComment(comment: CommentItem, token: string): Promise<CommentItem> {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(comment),
    });
    if (!response.ok) throw new Error('Failed to add comment');
    return await response.json();
  },

  async deleteComment(id: number, token: string): Promise<void> {
    const response = await fetch(`${API_BASE}/comments`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error('Failed to delete comment');
  },

  async getGitHubUser(accessToken: string): Promise<GitHubUser> {
    const response = await fetch('https://api.github.com/user', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });
    if (!response.ok) throw new Error('Failed to get user');
    return await response.json();
  },
};
