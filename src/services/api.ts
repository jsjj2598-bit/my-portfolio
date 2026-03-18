export interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
  createdAt: string;
}

export interface CommentItem {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail: string;
  content: string;
  mediaUrl?: string;
  mediaType?: 'image' | 'video';
  targetId?: string;
  targetType?: string;
  createdAt: string;
}

export interface LikeItem {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  targetId: string;
  targetType: string;
  createdAt: string;
}

export interface ActivityLog {
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

export interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  isAdmin: boolean;
}

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:8080/api';

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
    try {
      const response = await fetch(`${API_BASE}/media`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to add');
      return await response.json();
    } catch (error) {
      console.error('Error adding media item:', error);
      throw error;
    }
  },

  async updateMediaItem(item: MediaItem): Promise<MediaItem> {
    try {
      const response = await fetch(`${API_BASE}/media`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item),
      });
      if (!response.ok) throw new Error('Failed to update');
      return await response.json();
    } catch (error) {
      console.error('Error updating media item:', error);
      throw error;
    }
  },

  async deleteMediaItem(id: number): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/media?id=${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete');
    } catch (error) {
      console.error('Error deleting media item:', error);
      throw error;
    }
  },

  async getComments(targetId?: string, targetType?: string): Promise<{ comments: CommentItem[], likes: LikeItem[] }> {
    try {
      let url = `${API_BASE}/comments`;
      if (targetId && targetType) {
        url += `?targetId=${targetId}&targetType=${targetType}`;
      }
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch');
      return await response.json();
    } catch (error) {
      console.error('Error fetching comments:', error);
      return { comments: [], likes: [] };
    }
  },

  async addComment(comment: Omit<CommentItem, 'id' | 'createdAt'>, token: string): Promise<CommentItem> {
    try {
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
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  },

  async deleteComment(id: number, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/comments?id=${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to delete comment');
    } catch (error) {
      console.error('Error deleting comment:', error);
      throw error;
    }
  },

  async toggleLike(like: Omit<LikeItem, 'id' | 'createdAt'>, token: string): Promise<{ likes: LikeItem[], liked: boolean }> {
    try {
      const response = await fetch(`${API_BASE}/comments/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(like),
      });
      if (!response.ok) throw new Error('Failed to toggle like');
      return await response.json();
    } catch (error) {
      console.error('Error toggling like:', error);
      throw error;
    }
  },

  async getLogs(token: string): Promise<ActivityLog[]> {
    try {
      const response = await fetch(`${API_BASE}/logs`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to fetch logs');
      return await response.json();
    } catch (error) {
      console.error('Error fetching logs:', error);
      return [];
    }
  },

  async addLog(log: Omit<ActivityLog, 'id' | 'createdAt' | 'ip' | 'userAgent'>): Promise<ActivityLog> {
    try {
      const response = await fetch(`${API_BASE}/logs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(log),
      });
      if (!response.ok) throw new Error('Failed to add log');
      return await response.json();
    } catch (error) {
      console.error('Error adding log:', error);
      throw error;
    }
  },

  async register(email: string, password: string, name: string): Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '注册失败');
      }
      return await response.json();
    } catch (error) {
      console.error('Error registering user:', error);
      throw error;
    }
  },

  async login(email: string, password: string): Promise<{ token: string; user: User }> {
    try {
      const response = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || '登录失败');
      }
      return await response.json();
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  },

  async getUsers(token: string): Promise<User[]> {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error('Failed to get users');
      return await response.json();
    } catch (error) {
      console.error('Error getting users:', error);
      throw error;
    }
  },

  async updateUserAdmin(id: string, isAdmin: boolean, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id, isAdmin }),
      });
      if (!response.ok) throw new Error('Failed to update user');
    } catch (error) {
      console.error('Error updating user admin status:', error);
      throw error;
    }
  },

  async deleteUser(id: string, token: string): Promise<void> {
    try {
      const response = await fetch(`${API_BASE}/users`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ id }),
      });
      if (!response.ok) throw new Error('Failed to delete user');
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },
};