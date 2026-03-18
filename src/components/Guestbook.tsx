import React, { useState, useEffect, useCallback } from 'react';
import { api, type CommentItem } from '../services/api';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

interface GuestbookProps {
  currentUser?: User | null;
  userToken?: string | null;
  onLoginClick: () => void;
}

const Guestbook: React.FC<GuestbookProps> = ({ currentUser, userToken, onLoginClick }) => {
  const [comments, setComments] = useState<CommentItem[]>([]);
  const [content, setContent] = useState('');
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  const [mediaUrl, setMediaUrl] = useState('');
  const [uploading, setUploading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);

  const loadComments = useCallback(async () => {
    const { comments } = await api.getComments();
    setComments(comments);
  }, []);

  useEffect(() => {
    loadComments();
  }, [loadComments]);

  const handleUploadMedia = async (file: File) => {
    if (!userToken) return;
    
    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || '');

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
        setMediaType(file.type.startsWith('video/') ? 'video' : 'image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setShowError(true);
      setTimeout(() => setShowError(false), 3000);
    } finally {
      setUploading(false);
    }
  };

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !userToken || !content.trim()) return;

    const newCommentData = {
      userId: currentUser.id,
      userName: currentUser.name,
      userAvatar: currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`,
      userEmail: currentUser.email,
      content: content.trim(),
      mediaUrl: mediaUrl || undefined,
      mediaType: mediaUrl ? mediaType : undefined,
    };

    try {
      const newComment = await api.addComment(newCommentData, userToken);
      setComments([newComment, ...comments]);
      setContent('');
      setMediaUrl('');
      
      await api.addLog({
        type: 'comment',
        userId: currentUser.id,
        userName: currentUser.name,
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

  return (
    <div className="glass-effect rounded-3xl p-8">
      <h2 className="text-3xl font-bold text-white mb-6">留言板</h2>

      {showSuccess && (
        <div className="mb-4 p-4 bg-green-500/20 border border-green-500/30 rounded-xl text-green-400">
          操作成功！
        </div>
      )}

      {showError && (
        <div className="mb-4 p-4 bg-red-500/20 border border-red-500/30 rounded-xl text-red-400">
          操作失败，请重试
        </div>
      )}

      {!currentUser ? (
        <div className="text-center py-8">
          <p className="text-gray-400 mb-4">登录后即可留言</p>
          <button
            onClick={onLoginClick}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300"
          >
            登录 / 注册
          </button>
        </div>
      ) : (
        <form onSubmit={handleSubmitComment} className="mb-8">
          <div className="flex items-start gap-4 mb-4">
            <img
              src={currentUser.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentUser.name)}&background=random`}
              alt={currentUser.name}
              className="w-12 h-12 rounded-full"
            />
            <div className="flex-1">
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full p-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-purple-500 resize-none"
                placeholder="写下你的留言..."
                rows={4}
                required
              />
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex gap-2">
              <label className="px-4 py-2 glass-effect rounded-xl text-gray-300 cursor-pointer hover:text-white transition-colors">
                📷 上传图片
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => e.target.files?.[0] && handleUploadMedia(e.target.files[0])}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
              <label className="px-4 py-2 glass-effect rounded-xl text-gray-300 cursor-pointer hover:text-white transition-colors">
                🎥 上传视频
                <input
                  type="file"
                  accept="video/*"
                  onChange={(e) => e.target.files?.[0] && handleUploadMedia(e.target.files[0])}
                  className="hidden"
                  disabled={uploading}
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={uploading || !content.trim()}
              className="px-6 py-3 bg-gradient-to-r from-purple-600 via-pink-600 to-red-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 disabled:opacity-50"
            >
              {uploading ? '⏳ 上传中...' : '发布留言'}
            </button>
          </div>

          {mediaUrl && (
            <div className="mt-4 p-4 glass-effect rounded-xl">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-400 text-sm">已添加媒体</span>
                <button
                  type="button"
                  onClick={() => setMediaUrl('')}
                  className="text-red-400 hover:text-red-300 text-sm"
                >
                  移除
                </button>
              </div>
              {mediaType === 'image' ? (
                <img src={mediaUrl} alt="Preview" className="max-h-48 rounded-lg" />
              ) : (
                <video src={mediaUrl} controls className="max-h-48 rounded-lg" />
              )}
            </div>
          )}
        </form>
      )}

      <div className="space-y-4">
        <h3 className="text-xl font-bold text-white">
          留言列表 ({comments.length})
        </h3>
        {comments.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            暂无留言，快来抢沙发吧！
          </div>
        ) : (
          comments.map((comment) => (
            <div key={comment.id} className="glass-effect rounded-2xl p-6">
              <div className="flex items-start gap-4 mb-4">
                <img
                  src={comment.userAvatar}
                  alt={comment.userName}
                  className="w-12 h-12 rounded-full"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="text-white font-bold">{comment.userName}</h4>
                      <p className="text-gray-400 text-xs">{comment.userEmail}</p>
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
                          className="max-h-64 rounded-lg"
                        />
                      ) : (
                        <video
                          src={comment.mediaUrl}
                          controls
                          className="max-h-64 rounded-lg"
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

export default Guestbook;