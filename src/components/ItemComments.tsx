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

interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
  name: string;
}

interface ItemCommentsProps {
  targetId: string;
  targetType: string;
}

const ItemComments: React.FC<ItemCommentsProps> = ({ targetId, targetType }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [user, setUser] = useState<GitHubUser | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  const loadData = useCallback(async () => {
    const { comments: fetchedComments, likes: fetchedLikes } = await api.getComments(targetId, targetType);
    setComments(fetchedComments);
    setLikes(fetchedLikes);
  }, [targetId, targetType]);

  useEffect(() => {
    loadData();

    const savedToken = localStorage.getItem('github_token');
    const savedUser = localStorage.getItem('github_user');
    if (savedToken && savedUser) {
      setAccessToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, [loadData]);

  const isLiked = user ? likes.some(l => l.userId === user.id.toString()) : false;
  const likeCount = likes.length;

  const handleLike = async () => {
    if (!user || !accessToken) {
      setShowLoginRequired(true);
      setTimeout(() => setShowLoginRequired(false), 3000);
      return;
    }

    try {
      const { likes: newLikes, liked } = await api.toggleLike({
        userId: user.id.toString(),
        userName: user.name || user.login,
        userAvatar: user.avatar_url,
        targetId,
        targetType,
      }, accessToken);

      setLikes(newLikes);

      if (liked) {
        await api.addLog({
          type: 'like',
          userId: user.id.toString(),
          userName: user.name || user.login,
          userAvatar: user.avatar_url,
          targetId,
          targetType,
        });
      }
    } catch (error) {
      console.error('Error toggling like:', error);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !accessToken || !content.trim()) return;

    try {
      const newComment = await api.addComment({
        userId: user.id.toString(),
        userName: user.name || user.login,
        userAvatar: user.avatar_url,
        content: content.trim(),
        targetId,
        targetType,
      }, accessToken);

      setComments([newComment, ...comments]);
      setContent('');

      await api.addLog({
        type: 'comment',
        userId: user.id.toString(),
        userName: user.name || user.login,
        userAvatar: user.avatar_url,
        targetId,
        targetType,
        details: content.trim(),
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleDeleteComment = async (id: number) => {
    if (!user || !accessToken) return;
    if (!confirm('确定要删除这条评论吗？')) return;

    try {
      await api.deleteComment(id, accessToken);
      setComments(comments.filter(c => c.id !== id));
    } catch (error) {
      console.error('Error deleting comment:', error);
    }
  };

  return (
    <div className="mt-8">
      {showLoginRequired && (
        <div className="glass-effect rounded-xl p-4 mb-4 border border-yellow-500/30 text-yellow-400 text-center">
          请先登录 GitHub 才能点赞和评论
        </div>
      )}

      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleLike}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 ${
            isLiked
              ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
              : 'glass-effect text-gray-300 hover:text-white'
          }`}
        >
          <span className="text-xl">{isLiked ? '❤️' : '🤍'}</span>
          <span>{likeCount}</span>
        </button>
        <span className="text-gray-400">
          {comments.length} 条评论
        </span>
      </div>

      {user && (
        <form onSubmit={handleSubmitComment} className="glass-effect rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-4">
            <img
              src={user.avatar_url}
              alt={user.name || user.login}
              className="w-10 h-10 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="说点什么..."
                rows={3}
                className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
                required
              />
              <div className="flex justify-end mt-3">
                <button
                  type="submit"
                  disabled={!content.trim()}
                  className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50"
                >
                  发布评论
                </button>
              </div>
            </div>
          </div>
        </form>
      )}

      <div className="space-y-4">
        {comments.length === 0 ? (
          <div className="glass-effect rounded-2xl p-8 text-center">
            <div className="text-4xl mb-4">💬</div>
            <p className="text-gray-400">暂无评论，来抢沙发吧！</p>
          </div>
        ) : (
          comments.map((comment) => (
            <div
              key={comment.id}
              className="glass-effect rounded-2xl p-6"
            >
              <div className="flex items-start gap-4">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-10 h-10 rounded-full"
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
                  <p className="text-gray-300 whitespace-pre-wrap">{comment.content}</p>
                  {comment.mediaUrl && (
                    <div className="mt-4 aspect-video bg-dark-800 rounded-xl overflow-hidden">
                      {comment.mediaType === 'image' ? (
                        <img
                          src={comment.mediaUrl}
                          alt="Comment media"
                          className="w-full h-full object-cover"
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
          ))
        )}
      </div>
    </div>
  );
};

export default ItemComments;
