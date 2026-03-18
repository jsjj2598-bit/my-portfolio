interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
  createdAt: string;
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
};
