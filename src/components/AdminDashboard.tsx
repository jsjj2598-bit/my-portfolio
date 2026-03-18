import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { api } from '../services/api';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
  createdAt: string;
}

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

const getCurrentTime = () => Date.now();

const AdminDashboard: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MediaItem>>({
    type: 'image',
    category: '摄影'
  });
  const [editingItem, setEditingItem] = useState<MediaItem | null>(null);
  const [previewItem, setPreviewItem] = useState<MediaItem | null>(null);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'title'>('newest');
  const [importData, setImportData] = useState('');

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 60000;

  const categories = ['摄影', 'AI视频', '动漫', '游戏', '其他'];

  useEffect(() => {
    let interval: number | null = null;
    if (isLocked) {
      const updateRemaining = () => {
        const remaining = Math.max(0, Math.ceil((lockoutTime - getCurrentTime()) / 1000));
        setRemainingTime(remaining);
        if (remaining <= 0) {
          setIsLocked(false);
          setLoginAttempts(0);
        }
      };
      updateRemaining();
      interval = window.setInterval(updateRemaining, 1000);
    }
    return () => {
      if (interval !== null) {
        clearInterval(interval);
      }
    };
  }, [isLocked, lockoutTime]);

  const loadMediaItems = useCallback(async () => {
    const items = await api.getMediaItems();
    setMediaItems(items);
  }, []);

  const loadActivityLogs = useCallback(async () => {
    const logs = await api.getLogs('');
    setActivityLogs(logs);
  }, []);

  const handleLogin = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (isLocked) {
      alert(`登录已锁定，请等待 ${remainingTime} 秒后重试`);
      return;
    }

    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      setLoginAttempts(0);
      loadMediaItems();
      loadActivityLogs();
    } else {
      const newAttempts = loginAttempts + 1;
      setLoginAttempts(newAttempts);
      
      if (newAttempts >= MAX_LOGIN_ATTEMPTS) {
        setIsLocked(true);
        setLockoutTime(getCurrentTime() + LOCKOUT_DURATION);
        alert(`登录失败次数过多，已锁定 ${LOCKOUT_DURATION / 1000} 秒`);
        
        setTimeout(() => {
          setIsLocked(false);
          setLoginAttempts(0);
        }, LOCKOUT_DURATION);
      } else {
        alert(`密码错误！还剩 ${MAX_LOGIN_ATTEMPTS - newAttempts} 次尝试机会`);
      }
    }
  }, [password, isLocked, remainingTime, loginAttempts, ADMIN_PASSWORD, loadMediaItems]);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    const item: MediaItem = {
      ...newItem,
      id: Date.now(),
      title: newItem.title || '未命名作品',
      url: newItem.url || '',
      createdAt: new Date().toISOString()
    } as MediaItem;

    await api.addMediaItem(item);
    const updated = [...mediaItems, item];
    setMediaItems(updated);
    setShowAddModal(false);
    setNewItem({ type: 'image', category: '摄影' });
  };

  const handleEditItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    await api.updateMediaItem(editingItem);
    const updated = mediaItems.map(item => 
      item.id === editingItem.id ? editingItem : item
    );
    setMediaItems(updated);
    setShowEditModal(false);
    setEditingItem(null);
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('确定要删除这个作品吗？')) {
      await api.deleteMediaItem(id);
      const updated = mediaItems.filter(item => item.id !== id);
      setMediaItems(updated);
    }
  };

  const handleDeleteAll = async () => {
    if (confirm('确定要删除所有作品吗？此操作不可恢复！')) {
      for (const item of mediaItems) {
        await api.deleteMediaItem(item.id);
      }
      setMediaItems([]);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(mediaItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-media-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = async () => {
    try {
      const data = JSON.parse(importData);
      if (Array.isArray(data)) {
        for (const item of data) {
          await api.addMediaItem(item);
        }
        setMediaItems(prev => [...prev, ...data]);
        setShowImportModal(false);
        setImportData('');
        alert('导入成功！');
      } else {
        alert('数据格式不正确，请导入有效的 JSON 数组');
      }
    } catch {
      alert('JSON 解析失败，请检查数据格式');
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let filtered = [...mediaItems];

    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.description?.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    if (filterType !== 'all') {
      filtered = filtered.filter(item => item.type === filterType);
    }

    if (filterCategory !== 'all') {
      filtered = filtered.filter(item => item.category === filterCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'newest') {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }
      if (sortBy === 'oldest') {
        return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      }
      return a.title.localeCompare(b.title, 'zh-CN');
    });

    return filtered;
  }, [mediaItems, searchTerm, filterType, filterCategory, sortBy]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-6">
        <div className="glass-effect rounded-3xl p-8 max-w-md w-full">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            🔐 后台管理
          </h2>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-gray-300 text-sm font-medium mb-2">
                管理员密码
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                placeholder="请输入密码"
              />
            </div>
            <button
              type="submit"
              className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300"
            >
              登录
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold text-white">
            🎛️ 后台管理系统
          </h1>
          <div className="flex gap-4">
            <button
              onClick={() => setShowAddModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2"
            >
              ➕ 添加作品
            </button>
            <button
              onClick={handleExport}
              className="px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2"
            >
              📥 导出数据
            </button>
            <button
              onClick={() => setShowImportModal(true)}
              className="px-6 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 flex items-center gap-2"
            >
              📤 导入数据
            </button>
            <button
              onClick={() => setIsAuthenticated(false)}
              className="px-6 py-3 glass-effect text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300"
            >
              退出
            </button>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            📊 作品统计
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-indigo-400">{mediaItems.length}</div>
              <div className="text-gray-400">总作品数</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-pink-400">
                {mediaItems.filter(i => i.type === 'image').length}
              </div>
              <div className="text-gray-400">图片</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-cyan-400">
                {mediaItems.filter(i => i.type === 'video').length}
              </div>
              <div className="text-gray-400">视频</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-amber-400">
                {new Set(mediaItems.map(i => i.category)).size}
              </div>
              <div className="text-gray-400">分类数</div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            📈 用户活动统计
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-green-400">
                {activityLogs.filter(l => l.type === 'visit').length}
              </div>
              <div className="text-gray-400">访问次数</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-blue-400">
                {activityLogs.filter(l => l.type === 'login').length}
              </div>
              <div className="text-gray-400">登录次数</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-purple-400">
                {activityLogs.filter(l => l.type === 'comment').length}
              </div>
              <div className="text-gray-400">评论数</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-pink-400">
                {activityLogs.filter(l => l.type === 'like').length}
              </div>
              <div className="text-gray-400">点赞数</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <h3 className="text-lg font-bold text-white mb-4">活动日志</h3>
            {activityLogs.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                暂无活动记录
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">时间</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">类型</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">用户</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">详情</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">IP</th>
                  </tr>
                </thead>
                <tbody>
                  {activityLogs.slice(0, 50).map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-gray-300 text-sm">
                        {new Date(log.createdAt).toLocaleString('zh-CN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.type === 'visit' ? 'bg-green-500/20 text-green-400' :
                          log.type === 'login' ? 'bg-blue-500/20 text-blue-400' :
                          log.type === 'comment' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-pink-500/20 text-pink-400'
                        }`}>
                          {log.type === 'visit' ? '👁️ 访问' :
                           log.type === 'login' ? '🔐 登录' :
                           log.type === 'comment' ? '💬 评论' :
                           '❤️ 点赞'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-white">
                        {log.userName ? (
                          <div className="flex items-center gap-2">
                            {log.userAvatar && (
                              <img
                                src={log.userAvatar}
                                alt={log.userName}
                                className="w-6 h-6 rounded-full"
                              />
                            )}
                            <span>{log.userName}</span>
                          </div>
                        ) : (
                          <span className="text-gray-500">访客</span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm max-w-xs truncate">
                        {log.details || (log.targetType ? `${log.targetType} - ${log.targetId}` : '-')}
                      </td>
                      <td className="py-3 px-4 text-gray-500 text-sm font-mono">
                        {log.ip || '-'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            🔍 搜索和筛选
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            <div>
              <input
                type="text"
                placeholder="搜索标题或描述..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
              />
            </div>
            <div>
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">全部类型</option>
                <option value="image">仅图片</option>
                <option value="video">仅视频</option>
              </select>
            </div>
            <div>
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">全部分类</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">最新优先</option>
                <option value="oldest">最早优先</option>
                <option value="title">标题排序</option>
              </select>
            </div>
            {mediaItems.length > 0 && (
              <button
                onClick={handleDeleteAll}
                className="w-full py-3 bg-red-600/20 text-red-400 font-medium rounded-xl hover:bg-red-600/30 transition-colors border border-red-500/30"
              >
                🗑️ 清空全部
              </button>
            )}
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              📁 作品列表
            </h2>
            <span className="text-gray-400">
              显示 {filteredAndSortedItems.length} / {mediaItems.length} 个作品
            </span>
          </div>
          
          {filteredAndSortedItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-400">
                {mediaItems.length === 0 ? '暂无作品，点击上方按钮添加！' : '没有找到匹配的作品'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">预览</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">标题</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">类型</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">分类</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">创建时间</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredAndSortedItems.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4">
                        <button
                          onClick={() => {
                            setPreviewItem(item);
                            setShowPreviewModal(true);
                          }}
                          className="w-16 h-12 rounded-lg overflow-hidden bg-gray-800 hover:opacity-80 transition-opacity"
                        >
                          {item.type === 'image' ? (
                            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              🎬
                            </div>
                          )}
                        </button>
                      </td>
                      <td className="py-4 px-4 text-white max-w-xs truncate">{item.title}</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          item.type === 'image' 
                            ? 'bg-indigo-500/20 text-indigo-400' 
                            : 'bg-pink-500/20 text-pink-400'
                        }`}>
                          {item.type === 'image' ? '🖼️ 图片' : '🎬 视频'}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-white">{item.category}</td>
                      <td className="py-4 px-4 text-gray-400 text-sm">
                        {new Date(item.createdAt).toLocaleString('zh-CN')}
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setPreviewItem(item);
                              setShowPreviewModal(true);
                            }}
                            className="px-3 py-2 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                          >
                            👁️
                          </button>
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowEditModal(true);
                            }}
                            className="px-3 py-2 bg-amber-500/20 text-amber-400 rounded-lg hover:bg-amber-500/30 transition-colors text-sm"
                          >
                            ✏️
                          </button>
                          <button
                            onClick={() => handleDeleteItem(item.id)}
                            className="px-3 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                          >
                            🗑️
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="glass-effect rounded-3xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">添加新作品</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleAddItem} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">媒体类型</label>
                <select
                  value={newItem.type}
                  onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'image' | 'video' })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                >
                  <option value="image">图片</option>
                  <option value="video">视频</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">标题</label>
                <input
                  type="text"
                  value={newItem.title || ''}
                  onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  placeholder="作品标题"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">URL 链接</label>
                <input
                  type="url"
                  value={newItem.url || ''}
                  onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">分类</label>
                <select
                  value={newItem.category}
                  onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">描述（可选）</label>
                <textarea
                  value={newItem.description || ''}
                  onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  rows={3}
                  placeholder="作品描述..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 glass-effect text-gray-400 font-medium rounded-xl hover:text-white transition-all duration-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300"
                >
                  添加
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="glass-effect rounded-3xl p-8 max-w-lg w-full" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">编辑作品</h3>
              <button
                onClick={() => {
                  setShowEditModal(false);
                  setEditingItem(null);
                }}
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>
            <form onSubmit={handleEditItem} className="space-y-4">
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">媒体类型</label>
                <select
                  value={editingItem.type}
                  onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as 'image' | 'video' })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                >
                  <option value="image">图片</option>
                  <option value="video">视频</option>
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">标题</label>
                <input
                  type="text"
                  value={editingItem.title}
                  onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  placeholder="作品标题"
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">URL 链接</label>
                <input
                  type="url"
                  value={editingItem.url}
                  onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  placeholder="https://..."
                  required
                />
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">分类</label>
                <select
                  value={editingItem.category}
                  onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">描述（可选）</label>
                <textarea
                  value={editingItem.description || ''}
                  onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                  className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  rows={3}
                  placeholder="作品描述..."
                />
              </div>
              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => {
                    setShowEditModal(false);
                    setEditingItem(null);
                  }}
                  className="flex-1 py-3 glass-effect text-gray-400 font-medium rounded-xl hover:text-white transition-all duration-300"
                >
                  取消
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3 bg-gradient-to-r from-amber-600 via-orange-600 to-red-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300"
                >
                  保存修改
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showPreviewModal && previewItem && (
        <div 
          className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4"
          onClick={() => {
            setShowPreviewModal(false);
            setPreviewItem(null);
          }}
        >
          <div className="max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => {
                setShowPreviewModal(false);
                setPreviewItem(null);
              }}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="aspect-video bg-black rounded-2xl overflow-hidden mb-6">
              {previewItem.type === 'image' ? (
                <img 
                  src={previewItem.url} 
                  alt={previewItem.title}
                  className="w-full h-full object-contain"
                />
              ) : (
                <video 
                  src={previewItem.url}
                  className="w-full h-full object-contain"
                  controls
                  autoPlay
                />
              )}
            </div>

            <div className="text-center">
              <span className={`text-sm font-medium uppercase tracking-wider mb-2 block ${
                previewItem.type === 'image' ? 'text-indigo-400' : 'text-pink-400'
              }`}>
                {previewItem.type === 'image' ? '🖼️ 图片' : '🎬 视频'}
              </span>
              <h3 className="text-3xl font-bold text-white mb-2">{previewItem.title}</h3>
              <p className="text-gray-400 mb-2">{previewItem.category}</p>
              {previewItem.description && (
                <p className="text-gray-300">{previewItem.description}</p>
              )}
              <p className="text-gray-500 text-sm mt-4">
                创建于 {new Date(previewItem.createdAt).toLocaleString('zh-CN')}
              </p>
            </div>
          </div>
        </div>
      )}

      {showImportModal && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setShowImportModal(false)}
        >
          <div 
            className="glass-effect rounded-3xl p-8 max-w-lg w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-white">导入作品数据</h3>
              <button
                onClick={() => setShowImportModal(false)}
                className="text-gray-400 hover:text-white text-3xl"
              >
                ×
              </button>
            </div>
            <p className="text-gray-400 mb-4">
              粘贴从其他设备导出的 JSON 数据：
            </p>
            <textarea
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full h-48 p-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500 font-mono text-sm"
              placeholder='[{"id": 1, "title": "作品标题", ...}]'
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setShowImportModal(false);
                  setImportData('');
                }}
                className="flex-1 py-3 glass-effect text-gray-400 text-sm font-medium rounded-xl hover:text-white transition-all duration-300"
              >
                取消
              </button>
              <button
                onClick={handleImport}
                className="flex-1 py-3 bg-gradient-to-r from-emerald-600 to-green-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-300"
              >
                确认导入
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
