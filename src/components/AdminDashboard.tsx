import React, { useState, useEffect, useCallback } from 'react';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
  createdAt: string;
}

const getCurrentTime = () => Date.now();

const AdminDashboard: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newItem, setNewItem] = useState<Partial<MediaItem>>({
    type: 'image',
    category: '摄影'
  });
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isLocked, setIsLocked] = useState(false);
  const [lockoutTime, setLockoutTime] = useState(0);
  const [remainingTime, setRemainingTime] = useState(0);

  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';
  const MAX_LOGIN_ATTEMPTS = 5;
  const LOCKOUT_DURATION = 60000;

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

  const loadMediaItems = useCallback(() => {
    const saved = localStorage.getItem('mediaItems');
    if (saved) {
      setMediaItems(JSON.parse(saved));
    }
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

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: MediaItem = {
      ...newItem,
      id: Date.now(),
      title: newItem.title || '未命名作品',
      url: newItem.url || '',
      createdAt: new Date().toISOString()
    } as MediaItem;

    const updated = [...mediaItems, item];
    setMediaItems(updated);
    localStorage.setItem('mediaItems', JSON.stringify(updated));
    setShowAddModal(false);
    setNewItem({ type: 'image', category: '摄影' });
  };

  const handleDeleteItem = (id: number) => {
    if (confirm('确定要删除这个作品吗？')) {
      const updated = mediaItems.filter(item => item.id !== id);
      setMediaItems(updated);
      localStorage.setItem('mediaItems', JSON.stringify(updated));
    }
  };

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
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300"
            >
              ➕ 添加作品
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

        <div className="glass-effect rounded-3xl p-6">
          <h2 className="text-2xl font-bold text-white mb-6">
            📁 作品列表
          </h2>
          {mediaItems.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📭</div>
              <p className="text-gray-400">暂无作品，点击上方按钮添加！</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">ID</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">标题</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">类型</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">分类</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">创建时间</th>
                    <th className="text-left py-4 px-4 text-gray-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {mediaItems.map((item) => (
                    <tr key={item.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-4 px-4 text-white">{item.id}</td>
                      <td className="py-4 px-4 text-white">{item.title}</td>
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
                        <button
                          onClick={() => handleDeleteItem(item.id)}
                          className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                        >
                          删除
                        </button>
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
                  <option value="摄影">摄影</option>
                  <option value="AI视频">AI视频</option>
                  <option value="动漫">动漫</option>
                  <option value="游戏">游戏</option>
                  <option value="其他">其他</option>
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
    </div>
  );
};

export default AdminDashboard;
