import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

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

const GITHUB_CLIENT_ID = import.meta.env.VITE_GITHUB_CLIENT_ID || '';
const GITHUB_REDIRECT_URI = import.meta.env.VITE_GITHUB_REDIRECT_URI || window.location.origin;

console.log('GITHUB_CLIENT_ID:', GITHUB_CLIENT_ID);
console.log('GITHUB_REDIRECT_URI:', GITHUB_REDIRECT_URI);

const Guestbook: React.FC = () => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [loading, setLoading] = useState(false);

  const loadComments = useCallback(async () => {
    const { comments } = await api.getComments();
    setComments(comments);
  }, []);

  useEffect(() => {
    loadComments();

    const urlParams = new URLSearchParams(window.location.search);
    const code = urlParams.get('code');
    if (code) {
      handleGitHubCallback(code);
    }

    const savedToken = localStorage.getItem('github_token');
    const savedUser = localStorage.getItem('github_user');
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, [loadComments]);

  const handleGitHubLogin = () => {
    console.log('handleGitHubLogin clicked');
    console.log('GITHUB_CLIENT_ID:', GITHUB_CLIENT_ID);
    console.log('GITHUB_REDIRECT_URI:', GITHUB_REDIRECT_URI);
    
    if (!GITHUB_CLIENT_ID) {
      alert('GitHub Client ID 未配置，请先在环境变量中配置 VITE_GITHUB_CLIENT_ID');
      return;
    }
    
    const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLIENT_ID}&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}&scope=read:user`;
    console.log('Redirecting to:', authUrl);
    window.location.href = authUrl;
  };

  const handleGitHubCallback = async (code: string) => {
    setLoading(true);
    console.log('Starting GitHub callback with code:', code);
    try {
      console.log('Calling backend API...');
      const data = await api.githubOAuthCallback(code);
      console.log('Backend response:', data);
      if (data.access_token && data.user) {
        setAccessToken(data.access_token);
        setUser(data.user);
        localStorage.setItem('github_token', data.access_token);
        localStorage.setItem('github_user', JSON.stringify(data.user));
        
        await api.addLog({
          type: 'login',
          userId: data.user.id.toString(),
          userName: data.user.name || data.user.login,
          userAvatar: data.user.avatar_url,
        });
        
        window.history.replaceState({}, document.title, window.location.pathname);
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      } else {
        console.error('Invalid response from backend:', data);
        setShowError(true);
        setTimeout(() => setShowError(false), 5000);
      }
    } catch (error) {
      console.error('GitHub login error:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 5000);
      alert('登录失败，请检查控制台获取详细信息');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('github_token');
    localStorage.removeItem('github_user');
  };

  const handleMediaUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = mediaType === 'image' ? 'image/*' : 'video/*';
    input.onchange = async (e: Event) => {
      const target = e.target as HTMLInputElement;
      const file = target.files?.[0];
      if (file) {
        setUploading(true);
        try {
          const formData = new FormData();
          formData.append('file', file);
          formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'my_preset');

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/auto/upload`,
            {
              method: 'POST',
              body: formData,
            }
          );

          const data = await response.json();
          if (data.secure_url) {
            setMediaUrl(data.secure_url);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          }
        } catch (error) {
          console.error('Upload error:', error);
          setShowError(true);
          setTimeout(() => setShowError(false), 3000);
        } finally {
          setUploading(false);
        }
      }
    };
    input.click();
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accessToken || !content.trim()) return;

    const newCommentData = {
      userId: user.id.toString(),
      userName: user.name || user.login,
      userAvatar: user.avatar_url,
      content: content.trim(),
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? mediaType : undefined,
    };

    try {
      const newComment = await api.addComment(newCommentData, accessToken);
      setComments([newComment, ...comments]);
      setContent('');
      setMediaUrl('');
      
      await api.addLog({
        type: 'comment',
        userId: user.id.toString(),
        userName: user.name || user.login,
        userAvatar: user.avatar_url,
        details: content.trim(),
      });
      
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error adding comment:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!user || !accessToken) return;
    if (!confirm('确定要删除这条留言吗？')) return;

    try {
      await api.deleteComment(id, accessToken);
      setComments(comments.filter(c => c.id !== id));
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error deleting comment:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    }
  };

  return (
    <section id="guestbook" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>

      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="glass-effect rounded-2xl px-6 py-4 flex items-center gap-3 border border-green-500/30">
            <span className="text-2xl">✅</span>
            <span className="text-green-400 font-medium">操作成功！</span>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="glass-effect rounded-2xl px-6 py-4 flex items-center gap-3 border border-red-500/30">
            <span className="text-2xl">❌</span>
            <span className="text-red-400 font-medium">操作失败，请重试！</span>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="text-center mb-12 reveal">
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">留言板</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
            留下 <span className="gradient-text">你的足迹</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            使用 GitHub 登录后即可留言和分享图片、视频
          </p>
        </div>

        {!user ? (
          <div className="text-center reveal">
            <div className="glass-effect rounded-3xl p-12 max-w-md mx-auto">
              <div className="text-6xl mb-6">💬</div>
              <h3 className="text-2xl font-bold text-white mb-4">登录 GitHub 开始留言</h3>
              <p className="text-gray-400 mb-8">使用 GitHub 账号安全登录，分享你的想法</p>
              <button
                onClick={handleGitHubLogin}
                className="w-full py-4 bg-gray-900 hover:bg-gray-800 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-3"
              >
                <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
                </svg>
                用 GitHub 登录
              </button>
            </div>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1 reveal">
              <div className="glass-effect rounded-3xl p-8 sticky top-24">
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={user.avatar_url}
                    alt={user.name || user.login}
                    className="w-16 h-16 rounded-full"
                  />
                  <div>
                    <h3 className="text-xl font-bold text-white">{user.name || user.login}</h3>
                    <p className="text-gray-400">@{user.login}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full py-3 glass-effect text-gray-400 font-medium rounded-xl hover:text-white transition-all duration-300"
                >
                  退出登录
                </button>

                <div className="border-t border-white/10 mt-6 pt-6">
                  <h4 className="text-lg font-bold text-white mb-4">发布留言</h4>
                  <form onSubmit={handleSubmitComment} className="space-y-4">
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="说点什么..."
                      rows={4}
                      className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
                      required
                    />

                    {mediaUrl && (
                      <div className="aspect-video bg-dark-800 rounded-xl overflow-hidden relative">
                        {mediaType === 'image' ? (
                          <img src={mediaUrl} alt="Preview" className="w-full h-full object-cover" />
                        ) : (
                          <video src={mediaUrl} className="w-full h-full object-cover" controls />
                        )}
                        <button
                          type="button"
                          onClick={() => setMediaUrl('')}
                          className="absolute top-2 right-2 p-1 bg-black/50 rounded-full text-white hover:bg-black/70"
                        >
                          ×
                        </button>
                      </div>
                    )}

                    <div className="flex gap-3">
                      <button
                        type="button"
                        onClick={() => setMediaType('image')}
                        className={`flex-1 py-2 rounded-xl text-sm transition-all duration-300 ${
                          mediaType === 'image'
                            ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                            : 'glass-effect text-gray-400 hover:text-white'
                        }`}
                      >
                        🖼️ 图片
                      </button>
                      <button
                        type="button"
                        onClick={() => setMediaType('video')}
                        className={`flex-1 py-2 rounded-xl text-sm transition-all duration-300 ${
                          mediaType === 'video'
                            ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                            : 'glass-effect text-gray-400 hover:text-white'
                        }`}
                      >
                        🎬 视频
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={handleMediaUpload}
                      disabled={uploading}
                      className="w-full py-3 glass-effect text-white font-medium rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {uploading ? '⏳ 上传中...' : '📤 上传媒体'}
                    </button>

                    <button
                      type="submit"
                      disabled={!content.trim()}
                      className="w-full py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                    >
                      发布留言
                    </button>
                  </form>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2 reveal" style={{ animationDelay: '0.1s' }}>
              {comments.length === 0 ? (
                <div className="glass-effect rounded-3xl p-12 text-center">
                  <div className="text-6xl mb-6">📭</div>
                  <h3 className="text-2xl font-bold text-white mb-4">暂无留言</h3>
                  <p className="text-gray-400">成为第一个留言的人吧！</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="glass-effect rounded-3xl p-6 hover:scale-[1.01] transition-all duration-300"
                    >
                      <div className="flex items-start gap-4">
                        <img
                          src={comment.userAvatar}
                          alt={comment.userName}
                          className="w-12 h-12 rounded-full"
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-bold text-white">{comment.userName}</span>
                              <span className="text-gray-400 text-sm ml-2">
                                {new Date(comment.createdAt).toLocaleString('zh-CN')}
                              </span>
                            </div>
                            {user && user.id.toString() === comment.userId && (
                              <button
                                onClick={() => handleDeleteComment(comment.id)}
                                className="text-gray-400 hover:text-red-400 transition-colors"
                              >
                                🗑️
                              </button>
                            )}
                          </div>
                          <p className="text-gray-300 mb-4 whitespace-pre-wrap">{comment.content}</p>
                          {comment.mediaUrl && (
                            <div className="aspect-video bg-dark-800 rounded-xl overflow-hidden">
                              {comment.mediaType === 'image' ? (
                                <img
                                  src={comment.mediaUrl}
                                  alt="Comment media"
                                  className="w-full h-full object-cover cursor-pointer hover:scale-105 transition-transform"
                                />
                              ) : (
                                <video
                                  src={comment.mediaUrl}
                                  className="w-full h-full object-cover"
                                  controls
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Guestbook;
