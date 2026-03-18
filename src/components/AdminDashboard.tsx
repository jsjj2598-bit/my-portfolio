import React, { useState, useCallback, useMemo } from 'react';
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

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  createdAt: string;
  lastLoginAt?: string;
  isAdmin: boolean;
}

const getCurrentTime = () => Date.now();

const AdminDashboard: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([]);
  const [users, setUsers] = useState<User[]>([]);
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
  const [importData, setImportData] = useState('');
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(getCurrentTime());
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest'>('newest');

  const [adminToken, setAdminToken] = useState<string | null>(null);

  const remainingTime = Math.max(0, 60000 - (getCurrentTime() - lastAttemptTime));
  const isLocked = loginAttempts >= 5 && remainingTime > 0;

  const loadMediaItems = useCallback(async () => {
    const items = await api.getMediaItems();
    setMediaItems(items);
  }, []);

  const loadActivityLogs = useCallback(async () => {
    if (!adminToken) return;
    const logs = await api.getLogs(adminToken);
    setActivityLogs(logs);
  }, [adminToken]);

  const loadUsers = useCallback(async () => {
    if (!adminToken) return;
    const users = await api.getUsers(adminToken);
    setUsers(users);
  }, [adminToken]);

  const handleLogin = useCallback(async () => {
    if (isLocked) return;
    
    try {
      // 使用固定的管理员邮箱和密码登录
      const { user, token } = await api.login('admin@example.com', password);
      if (user.isAdmin) {
        setIsAuthenticated(true);
        setAdminToken(token);
        setLoginAttempts(0);
        loadMediaItems();
        loadActivityLogs();
        loadUsers();
      } else {
        setLoginAttempts(prev => prev + 1);
        setLastAttemptTime(getCurrentTime());
        alert('非管理员账号');
      }
    } catch {
      setLoginAttempts(prev => prev + 1);
      setLastAttemptTime(getCurrentTime());
      alert('密码错误');
    }
  }, [password, isLocked, loadMediaItems, loadActivityLogs, loadUsers]);

  const handleAddItem = async () => {
    if (!newItem.title || !newItem.url) return;
    await api.addMediaItem({
      id: Date.now(),
      title: newItem.title,
      type: newItem.type as 'image' | 'video',
      url: newItem.url,
      category: newItem.category || '摄影',
      description: newItem.description,
      createdAt: new Date().toISOString(),
    });
    setShowAddModal(false);
    setNewItem({ type: 'image', category: '摄影' });
    loadMediaItems();
  };

  const handleUpdateItem = async () => {
    if (!editingItem) return;
    await api.updateMediaItem(editingItem);
    setShowEditModal(false);
    setEditingItem(null);
    loadMediaItems();
  };

  const handleDeleteItem = async (id: number) => {
    if (confirm('确定要删除这个作品吗？')) {
      await api.deleteMediaItem(id);
      loadMediaItems();
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

  const handleToggleAdmin = async (user: User) => {
    if (!confirm(`确定要${user.isAdmin ? '取消' : '设置'} ${user.name} 的管理员权限吗？`)) return;
    if (!adminToken) return;
    try {
      await api.updateUserAdmin(user.id, !user.isAdmin, adminToken);
      const updatedUsers = users.map(u => 
        u.id === user.id ? { ...u, isAdmin: !user.isAdmin } : u
      );
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error updating user:', error);
      alert('操作失败');
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`确定要删除用户 ${user.name} 吗？此操作不可恢复！`)) return;
    if (!adminToken) return;
    try {
      await api.deleteUser(user.id, adminToken);
      const updatedUsers = users.filter(u => u.id !== user.id);
      setUsers(updatedUsers);
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('删除失败');
    }
  };

  const handleImport = async () => {
    try {
      const items = JSON.parse(importData);
      await api.addMediaItem({
        ...items,
        id: Date.now(),
        createdAt: new Date().toISOString(),
      });
      setShowImportModal(false);
      setImportData('');
      loadMediaItems();
    } catch (error) {
      console.error('Import error:', error);
      alert('导入失败，请检查数据格式');
    }
  };

  const filteredAndSortedItems = useMemo(() => {
    let result = [...mediaItems];

    if (searchTerm) {
      result = result.filter(item =>
        item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (typeFilter !== 'all') {
      result = result.filter(item => item.type === typeFilter);
    }

    if (categoryFilter !== 'all') {
      result = result.filter(item => item.category === categoryFilter);
    }

    result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortOrder === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return result;
  }, [mediaItems, searchTerm, typeFilter, categoryFilter, sortOrder]);

  const categories = useMemo(() => {
    const cats = new Set(mediaItems.map(item => item.category));
    return Array.from(cats);
  }, [mediaItems]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-dark-900 flex items-center justify-center p-4">
        <div className="glass-effect rounded-3xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-white mb-6 text-center">
            🔐 后台管理系统
          </h1>
          {isLocked ? (
            <div className="text-center">
              <p className="text-red-400 mb-4">
                尝试次数过多，请等待 {Math.ceil(remainingTime / 1000)} 秒
              </p>
            </div>
          ) : (
            <>
              <input
                type="password"
                placeholder="请输入管理员密码"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleLogin()}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500 mb-4"
              />
              <button
                onClick={handleLogin}
                className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300"
              >
                登录
              </button>
              {loginAttempts > 0 && (
                <p className="text-center text-gray-400 mt-4 text-sm">
                  已尝试 {loginAttempts} 次
                </p>
              )}
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
            🎯 后台管理系统
          </h1>
          <button
            onClick={() => {
              setIsAuthenticated(false);
              setAdminToken(null);
            }}
            className="px-6 py-3 glass-effect rounded-xl text-gray-300 hover:text-white transition-colors"
          >
            退出登录
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="glass-effect rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">作品总数</p>
                <p className="text-4xl font-bold text-purple-400">{mediaItems.length}</p>
              </div>
              <div className="text-5xl">📸</div>
            </div>
          </div>
          <div className="glass-effect rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">用户总数</p>
                <p className="text-4xl font-bold text-pink-400">{users.length}</p>
              </div>
              <div className="text-5xl">👥</div>
            </div>
          </div>
          <div className="glass-effect rounded-3xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400 mb-2">活动记录</p>
                <p className="text-4xl font-bold text-blue-400">{activityLogs.length}</p>
              </div>
              <div className="text-5xl">📊</div>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">
              🎨 作品管理
            </h2>
            <div className="flex gap-3">
              <button
                onClick={() => setShowImportModal(true)}
                className="px-6 py-3 glass-effect rounded-xl text-gray-300 hover:text-white transition-colors"
              >
                📥 导入
              </button>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300"
              >
                ➕ 添加作品
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedItems.map((item) => (
              <div key={item.id} className="glass-effect rounded-2xl overflow-hidden group">
                <div className="relative overflow-hidden">
                  {item.type === 'image' ? (
                    <img
                      src={item.url}
                      alt={item.title}
                      className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  ) : (
                    <video
                      src={item.url}
                      className="w-full h-48 object-cover"
                      controls
                    />
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-3">
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                    >
                      👁 查看
                    </button>
                    <button
                      onClick={() => setEditingItem(item)}
                      className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-white hover:bg-white/30 transition-colors"
                    >
                      ✏️ 编辑
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="px-4 py-2 bg-red-500/50 backdrop-blur-sm rounded-lg text-white hover:bg-red-500/70 transition-colors"
                    >
                      🗑 删除
                    </button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                  <div className="flex items-center justify-between text-sm text-gray-400">
                    <span>{item.category}</span>
                    <span>{item.type === 'image' ? '📸' : '🎥'} {item.type}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredAndSortedItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              暂无作品
            </div>
          )}
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            👥 用户管理
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-cyan-400">{users.length}</div>
              <div className="text-gray-400">总用户数</div>
            </div>
            <div className="text-center p-4 glass-effect rounded-2xl">
              <div className="text-3xl font-bold text-amber-400">
                {users.filter(u => u.isAdmin).length}
              </div>
              <div className="text-gray-400">管理员</div>
            </div>
          </div>

          <div className="overflow-x-auto">
            {users.length === 0 ? (
              <div className="text-center py-8 text-gray-400">
                暂无用户
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">用户</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">邮箱</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">用户 ID</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">注册时间</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">最后登录</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">角色</th>
                    <th className="text-left py-3 px-4 text-gray-400 font-medium">操作</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
                            alt={user.name}
                            className="w-10 h-10 rounded-full"
                          />
                          <span className="text-white font-medium">{user.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-gray-400">{user.email}</td>
                      <td className="py-3 px-4 text-gray-400 font-mono text-sm">{user.id}</td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(user.createdAt).toLocaleString('zh-CN')}
                      </td>
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {user.lastLoginAt ? new Date(user.lastLoginAt).toLocaleString('zh-CN') : '-'}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          user.isAdmin 
                            ? 'bg-amber-500/20 text-amber-400' 
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {user.isAdmin ? '👑 管理员' : '👤 用户'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex gap-2">
                          <button
                            onClick={() => handleToggleAdmin(user)}
                            className="px-3 py-1 text-sm rounded-lg transition-colors duration-200 bg-blue-500/20 text-blue-400 hover:bg-blue-500/30"
                          >
                            {user.isAdmin ? '取消管理员' : '设为管理员'}
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user)}
                            className="px-3 py-1 text-sm rounded-lg transition-colors duration-200 bg-red-500/20 text-red-400 hover:bg-red-500/30"
                          >
                            删除
                          </button>
                        </div>
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
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">所有类型</option>
                <option value="image">图片</option>
                <option value="video">视频</option>
              </select>
            </div>
            <div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
              >
                <option value="all">所有分类</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
            <div>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value as 'newest' | 'oldest')}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
              >
                <option value="newest">最新优先</option>
                <option value="oldest">最旧优先</option>
              </select>
            </div>
            <div>
              <button
                onClick={() => {
                  setSearchTerm('');
                  setTypeFilter('all');
                  setCategoryFilter('all');
                  setSortOrder('newest');
                }}
                className="w-full py-3 px-4 glass-effect rounded-xl text-gray-300 hover:text-white transition-colors"
              >
                重置筛选
              </button>
            </div>
          </div>
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-8">
          <h2 className="text-2xl font-bold text-white mb-4">
            📊 活动日志
          </h2>
          <div className="overflow-x-auto">
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
                  {activityLogs.map((log) => (
                    <tr key={log.id} className="border-b border-white/5 hover:bg-white/5">
                      <td className="py-3 px-4 text-gray-400 text-sm">
                        {new Date(log.createdAt).toLocaleString('zh-CN')}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          log.type === 'visit' ? 'bg-blue-500/20 text-blue-400' :
                          log.type === 'login' ? 'bg-green-500/20 text-green-400' :
                          log.type === 'comment' ? 'bg-purple-500/20 text-purple-400' :
                          'bg-pink-500/20 text-pink-400'
                        }`}>
                          {log.type === 'visit' ? '👁 访问' :
                           log.type === 'login' ? '🔐 登录' :
                           log.type === 'comment' ? '💬 评论' :
                           '❤️ 点赞'}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        {log.userAvatar ? (
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
            ⚠️ 危险操作
          </h2>
          <button
            onClick={handleDeleteAll}
            className="px-6 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 transition-colors"
          >
            🗑 删除所有作品
          </button>
        </div>
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="glass-effect rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">添加作品</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="标题"
                value={newItem.title}
                onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <input
                type="url"
                placeholder="URL"
                value={newItem.url}
                onChange={(e) => setNewItem({ ...newItem, url: e.target.value })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <select
                value={newItem.type}
                onChange={(e) => setNewItem({ ...newItem, type: e.target.value as 'image' | 'video' })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500"
              >
                <option value="image">图片</option>
                <option value="video">视频</option>
              </select>
              <input
                type="text"
                placeholder="分类"
                value={newItem.category}
                onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <textarea
                placeholder="描述"
                value={newItem.description}
                onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleAddItem}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300"
                >
                  添加
                </button>
                <button
                  onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 glass-effect rounded-xl text-gray-300 hover:text-white transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showEditModal && editingItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="glass-effect rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">编辑作品</h2>
            <div className="space-y-4">
              <input
                type="text"
                placeholder="标题"
                value={editingItem.title}
                onChange={(e) => setEditingItem({ ...editingItem, title: e.target.value })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <input
                type="url"
                placeholder="URL"
                value={editingItem.url}
                onChange={(e) => setEditingItem({ ...editingItem, url: e.target.value })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <select
                value={editingItem.type}
                onChange={(e) => setEditingItem({ ...editingItem, type: e.target.value as 'image' | 'video' })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500"
              >
                <option value="image">图片</option>
                <option value="video">视频</option>
              </select>
              <input
                type="text"
                placeholder="分类"
                value={editingItem.category}
                onChange={(e) => setEditingItem({ ...editingItem, category: e.target.value })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500"
              />
              <textarea
                placeholder="描述"
                value={editingItem.description}
                onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value || '' })}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
                rows={3}
              />
              <div className="flex gap-3">
                <button
                  onClick={handleUpdateItem}
                  className="flex-1 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300"
                >
                  保存
                </button>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="flex-1 py-3 glass-effect rounded-xl text-gray-300 hover:text-white transition-colors"
                >
                  取消
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {showPreviewModal && previewItem && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="glass-effect rounded-3xl p-8 max-w-2xl w-full">
            <h2 className="text-2xl font-bold text-white mb-4">{previewItem.title}</h2>
            <div className="mb-4">
              {previewItem.type === 'image' ? (
                <img
                  src={previewItem.url}
                  alt={previewItem.title}
                  className="w-full rounded-xl"
                />
              ) : (
                <video
                  src={previewItem.url}
                  controls
                  className="w-full rounded-xl"
                />
              )}
            </div>
            <p className="text-gray-400 mb-4">{previewItem.description}</p>
            <div className="flex items-center justify-between text-sm text-gray-500 mb-6">
              <span>{previewItem.category}</span>
              <span>{new Date(previewItem.createdAt).toLocaleString('zh-CN')}</span>
            </div>
            <button
              onClick={() => setShowPreviewModal(false)}
              className="w-full py-3 glass-effect rounded-xl text-gray-300 hover:text-white transition-colors"
            >
              关闭
            </button>
          </div>
        </div>
      )}

      {showImportModal && (
        <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4">
          <div className="glass-effect rounded-3xl p-8 max-w-md w-full">
            <h2 className="text-2xl font-bold text-white mb-6">导入作品</h2>
            <textarea
              placeholder="粘贴 JSON 数据..."
              value={importData}
              onChange={(e) => setImportData(e.target.value)}
              className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
              rows={8}
            />
            <div className="flex gap-3 mt-4">
              <button
                onClick={handleImport}
                className="flex-1 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300"
              >
                导入
              </button>
              <button
                onClick={() => setShowImportModal(false)}
                className="flex-1 py-3 glass-effect rounded-xl text-gray-300 hover:text-white transition-colors"
              >
                取消
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;