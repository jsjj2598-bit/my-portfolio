import React, { useState } from 'react';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
  createdAt: string;
}

interface WorksUploadProps {
  onUpload: (item: MediaItem) => void;
  mediaCount: number;
  mediaItems: MediaItem[];
  onExport: () => void;
  onImport: (data: MediaItem[]) => void;
}

const WorksUpload: React.FC<WorksUploadProps> = ({ onUpload, mediaCount, mediaItems, onExport, onImport }) => {
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('摄影');
  const [uploadDescription, setUploadDescription] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importData, setImportData] = useState('');

  const categories = ['摄影', 'AI视频', '动漫', '游戏', '其他'];

  const handleUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = uploadType === 'image' ? 'image/*' : 'video/*';
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
              body: formData
            }
          );

          const data = await response.json();
          
          if (data.secure_url) {
            const newItem: MediaItem = {
              id: Date.now(),
              title: uploadTitle || file.name,
              type: uploadType,
              url: data.secure_url,
              category: uploadCategory,
              description: uploadDescription,
              createdAt: new Date().toISOString()
            };
            onUpload(newItem);
            setUploadTitle('');
            setUploadDescription('');
            setPreviewUrl(null);
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
          } else {
            throw new Error('Upload failed');
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

  return (
    <section id="upload" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent"></div>
      
      {showSuccess && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="glass-effect rounded-2xl px-6 py-4 flex items-center gap-3 border border-green-500/30">
            <span className="text-2xl">✅</span>
            <span className="text-green-400 font-medium">作品上传成功！</span>
          </div>
        </div>
      )}
      
      {showError && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-fade-in">
          <div className="glass-effect rounded-2xl px-6 py-4 flex items-center gap-3 border border-red-500/30">
            <span className="text-2xl">❌</span>
            <span className="text-red-400 font-medium">上传失败，请重试！</span>
          </div>
        </div>
      )}
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="text-center mb-12 reveal">
          <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase">作品管理</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
            上传 <span className="gradient-text">你的作品</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            添加你的精彩作品，记录每一个创意瞬间
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          <div className="reveal">
            <div className="glass-effect rounded-3xl p-8">
              <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📤</span>
                上传新作品
              </h3>
              
              <div className="grid gap-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">媒体类型</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setUploadType('image')}
                      className={`flex-1 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        uploadType === 'image'
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                          : 'glass-effect text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>🖼️</span>
                      图片
                    </button>
                    <button
                      onClick={() => setUploadType('video')}
                      className={`flex-1 py-3 rounded-xl transition-all duration-300 flex items-center justify-center gap-2 ${
                        uploadType === 'video'
                          ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                          : 'glass-effect text-gray-400 hover:text-white'
                      }`}
                    >
                      <span>🎬</span>
                      视频
                    </button>
                  </div>
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">分类</label>
                  <select
                    value={uploadCategory}
                    onChange={(e) => setUploadCategory(e.target.value)}
                    className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat} className="bg-dark-900">
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">标题</label>
                  <input
                    type="text"
                    value={uploadTitle}
                    onChange={(e) => setUploadTitle(e.target.value)}
                    placeholder="给你的作品起个名字..."
                    className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">描述</label>
                  <input
                    type="text"
                    value={uploadDescription}
                    onChange={(e) => setUploadDescription(e.target.value)}
                    placeholder="简单描述一下..."
                    className="w-full py-3 px-4 glass-effect rounded-xl text-white bg-transparent border border-white/10 focus:outline-none focus:border-indigo-500"
                  />
                </div>

                {previewUrl && (
                  <div className="aspect-video bg-dark-800 rounded-xl overflow-hidden">
                    {uploadType === 'image' ? (
                      <img src={previewUrl} alt="预览" className="w-full h-full object-cover" />
                    ) : (
                      <video src={previewUrl} className="w-full h-full object-cover" controls />
                    )}
                  </div>
                )}

                <button
                  onClick={handleUpload}
                  disabled={uploading}
                  className="w-full py-4 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-bold rounded-xl hover:opacity-90 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="text-xl">{uploading ? '⏳' : '📤'}</span>
                  {uploading ? '上传中...' : '选择并上传文件'}
                </button>
              </div>
            </div>
          </div>

          <div className="reveal" style={{ animationDelay: '0.1s' }}>
            <div className="glass-effect rounded-3xl p-8 h-full flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-white flex items-center gap-3">
                  <span className="text-3xl">📊</span>
                  作品统计
                </h3>
                <div className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full">
                  <span className="text-white font-bold">{mediaCount}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 flex-1">
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                    <span className="text-3xl">🖼️</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">图片</h4>
                  <p className="text-gray-400">静态作品</p>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                    <span className="text-3xl">🎬</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">视频</h4>
                  <p className="text-gray-400">动态作品</p>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center">
                    <span className="text-3xl">📷</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">摄影</h4>
                  <p className="text-gray-400">光影艺术</p>
                </div>
                <div className="glass-effect rounded-2xl p-6 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-fuchsia-500 flex items-center justify-center">
                    <span className="text-3xl">✨</span>
                  </div>
                  <h4 className="text-xl font-bold text-white mb-1">AI创作</h4>
                  <p className="text-gray-400">无限可能</p>
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-white/10 space-y-3">
                <p className="text-gray-400 text-center">
                  上传你的作品，<span className="gradient-text font-semibold">让创意闪耀</span>
                </p>
                <div className="flex gap-3">
                  <button
                    onClick={onExport}
                    className="flex-1 py-3 glass-effect text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>📥</span>
                    导出数据
                  </button>
                  <button
                    onClick={() => setShowImportModal(true)}
                    className="flex-1 py-3 glass-effect text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center justify-center gap-2"
                  >
                    <span>📤</span>
                    导入数据
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {mediaItems.length > 0 && (
          <div className="reveal active">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {mediaItems.slice(-6).reverse().map((item) => (
                <div
                  key={item.id}
                  className="glass-effect rounded-2xl overflow-hidden hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => setLightboxItem(item)}
                >
                  <div className="relative aspect-video bg-dark-800">
                    {item.type === 'image' ? (
                      <img
                        src={item.url}
                        alt={item.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <video
                        src={item.url}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute bottom-3 left-3">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        item.type === 'image'
                          ? 'bg-indigo-500/80 text-white'
                          : 'bg-pink-500/80 text-white'
                      }`}>
                        {item.type === 'image' ? '🖼️ 图片' : '🎬 视频'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="text-lg font-bold text-white mb-1">{item.title}</h4>
                    <p className="text-gray-400 text-sm">{item.category}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {lightboxItem && (
          <div 
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
            onClick={() => setLightboxItem(null)}
          >
            <button
              onClick={() => setLightboxItem(null)}
              className="absolute top-4 right-4 text-white text-4xl hover:text-gray-300 transition-colors"
            >
              ×
            </button>
            <div className="max-w-5xl max-h-[90vh]" onClick={(e) => e.stopPropagation()}>
              {lightboxItem.type === 'image' ? (
                <img
                  src={lightboxItem.url}
                  alt={lightboxItem.title}
                  className="max-w-full max-h-[80vh] object-contain"
                />
              ) : (
                <video
                  src={lightboxItem.url}
                  className="max-w-full max-h-[80vh]"
                  controls
                  autoPlay
                />
              )}
              <div className="mt-4 text-center">
                <h3 className="text-2xl font-bold text-white mb-2">{lightboxItem.title}</h3>
                <p className="text-gray-400">{lightboxItem.category}</p>
                {lightboxItem.description && (
                  <p className="text-gray-300 mt-2">{lightboxItem.description}</p>
                )}
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
                  onClick={() => setShowImportModal(false)}
                  className="flex-1 py-3 glass-effect text-gray-400 text-sm font-medium rounded-xl hover:text-white transition-all duration-300"
                >
                  取消
                </button>
                <button
                  onClick={() => {
                    try {
                      const data = JSON.parse(importData);
                      onImport(data);
                      setShowImportModal(false);
                      setImportData('');
                      setShowSuccess(true);
                      setTimeout(() => setShowSuccess(false), 3000);
                    } catch {
                      setShowError(true);
                      setTimeout(() => setShowError(false), 3000);
                    }
                  }}
                  className="flex-1 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-300"
                >
                  确认导入
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WorksUpload;