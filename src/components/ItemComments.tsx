import React, { useState, useEffect, useCallback } from 'react';
import { api, type User } from '../services/api';

interface CommentItem {
  id: number;
  userId: string;
  userName: string;
  userAvatar: string;
  userEmail?: string;
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

interface ItemCommentsProps {
  targetId: string;
  targetType: string;
}

const ItemComments: React.FC<ItemCommentsProps> = ({ targetId, targetType }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [likes, setLikes] = useState<LikeItem[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [content, setContent] = useState('');
  const [showLoginRequired, setShowLoginRequired] = useState(false);

  const loadData = useCallback(async () => {
    const { comments: fetchedComments, likes: fetchedLikes } = await api.getComments(targetId, targetType);
    setComments(fetchedComments);
    setLikes(fetchedLikes);
  }, [targetId, targetType]);

  useEffect(() => {
    // 在下一个事件循环中执行，避免同步调用 setState
    setTimeout(() => {
      loadData();
    }, 0);
  }, [loadData]);
  
  useEffect(() => {
    const initUser = () => {
      const savedToken = localStorage.getItem('user_token');
      const savedUser = localStorage.getItem('user_info');
      if (savedToken && savedUser) {
        setAccessToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    };
    
    // 在下一个事件循环中执行，避免同步调用 setState
    setTimeout(initUser, 0);
  }, []);

  const isLiked = user ? likes.some(l => l.userId === user.id) : false;
  const likeCount = likes.length;

  const handleLike = async () => {
    if (!user || !accessToken) {
      setShowLoginRequired(true);
      setTimeout(() => setShowLoginRequired(false), 3000);
      return;
    }

    try {
      const { likes: newLikes, liked } = await api.toggleLike({
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar || '',
        targetId,
        targetType,
      }, accessToken);

      setLikes(newLikes);

      if (liked) {
        await api.addLog({
          type: 'like',
          userId: user.id,
          userName: user.name,
          userAvatar: user.avatar || '',
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
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar || '',
        userEmail: user.email,
        content: content.trim(),
        targetId,
        targetType,
      }, accessToken);

      setComments([newComment, ...comments]);
      setContent('');

      await api.addLog({
        type: 'comment',
        userId: user.id,
        userName: user.name,
        userAvatar: user.avatar || '',
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
          请先登录才能点赞和评论
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
              src={user.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=random`}
              alt={user.name}
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
                      <h4 className="text-white font-bold">{comment.userName}</h4>
                      {comment.userEmail && (
                        <p className="text-gray-400 text-xs">{comment.userEmail}</p>
                      )}
                    </div>
                    <span className="text-gray-500 text-xs">
                      {new Date(comment.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                  <p className="text-gray-300 mb-3">{comment.content}</p>
                  {comment.mediaUrl && (
                    <div className="mt-3">
                      {comment.mediaType === 'image' ? (
                        <img
                          src={comment.mediaUrl}
                          alt="Attachment"
                          className="max-h-48 rounded-lg"
                        />
                      ) : (
                        <video
                          src={comment.mediaUrl}
                          controls
                          className="max-h-48 rounded-lg"
                        />
                      )}
                    </div>
                  )}
                  {user && user.id === comment.userId && (
                    <div className="mt-3 flex justify-end">
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        className="text-red-400 hover:text-red-300 text-sm"
                      >
                        删除
                      </button>
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