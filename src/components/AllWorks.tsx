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

interface AllWorksProps {
  mediaItems: MediaItem[];
  onDelete: (id: number) => void;
  onBack: () => void;
}

const AllWorks: React.FC<AllWorksProps> = ({ mediaItems, onDelete, onBack }) => {
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all');
  const [lightboxItem, setLightboxItem] = useState<MediaItem | null>(null);

  const categories = ['全部', ...new Set(mediaItems.map(item => item.category))];

  const filteredItems = mediaItems.filter(item => {
    const categoryMatch = selectedCategory === '全部' || item.category === selectedCategory;
    const typeMatch = selectedType === 'all' || item.type === selectedType;
    return categoryMatch && typeMatch;
  });

  const groupByCategory = () => {
    const grouped: { [key: string]: MediaItem[] } = {};
    filteredItems.forEach(item => {
      if (!grouped[item.category]) {
        grouped[item.category] = [];
      }
      grouped[item.category].push(item);
    });
    return grouped;
  };

  const groupedItems = groupByCategory();

  return (
    <div className="pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-12 reveal active">
          <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase">作品库</span>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
            所有 <span className="gradient-text">作品</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            浏览和管理你上传的所有作品
          </p>
        </div>

        <div className="glass-effect rounded-3xl p-6 mb-8 reveal active">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-3">
              <span className="text-gray-400 text-sm font-medium">分类筛选:</span>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                      : 'glass-effect text-gray-400 hover:text-white'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setSelectedType('all')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 ${
                  selectedType === 'all'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'glass-effect text-gray-400 hover:text-white'
                }`}
              >
                全部
              </button>
              <button
                onClick={() => setSelectedType('image')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedType === 'image'
                    ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                    : 'glass-effect text-gray-400 hover:text-white'
                }`}
              >
                <span>🖼️</span>
                图片
              </button>
              <button
                onClick={() => setSelectedType('video')}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  selectedType === 'video'
                    ? 'bg-gradient-to-r from-pink-600 to-rose-600 text-white'
                    : 'glass-effect text-gray-400 hover:text-white'
                }`}
              >
                <span>🎬</span>
                视频
              </button>
            </div>
          </div>
        </div>

        {filteredItems.length === 0 ? (
          <div className="glass-effect rounded-3xl p-12 text-center reveal active">
            <div className="text-8xl mb-6">📭</div>
            <h3 className="text-2xl font-bold text-white mb-4">暂无作品</h3>
            <p className="text-gray-400 mb-8">
              还没有上传任何作品，快去上传你的第一个作品吧！
            </p>
            <button
              onClick={onBack}
              className="px-8 py-3 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white font-medium rounded-xl hover:opacity-90 transition-all duration-300"
            >
              返回主页上传作品
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {Object.entries(groupedItems).map(([category, items]) => (
              <div key={category} className="reveal active">
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center">
                    <span className="text-xl">
                      {category === '摄影' ? '📷' : category === 'AI视频' ? '🎬' : category === '动漫' ? '🎨' : category === '游戏' ? '🎮' : '📁'}
                    </span>
                  </div>
                  <h2 className="text-2xl font-bold text-white">{category}</h2>
                  <span className="px-3 py-1 glass-effect rounded-full text-gray-400 text-sm">
                    {items.length} 个作品
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {items.map((item) => (
                    <div
                      key={item.id}
                      className="glass-effect rounded-2xl overflow-hidden group hover:scale-[1.02] transition-all duration-300 cursor-pointer"
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
                            controls
                          />
                        )}
                        <div className="absolute top-3 right-3 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              onDelete(item.id);
                            }}
                            className="p-2 bg-red-500/80 hover:bg-red-500 rounded-lg text-white transition-colors"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        </div>
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
                      <div className="p-5">
                        <h3 className="text-lg font-bold text-white mb-2">{item.title}</h3>
                        {item.description && (
                          <p className="text-gray-400 text-sm">{item.description}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
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
      </div>
    </div>
  );
};

export default AllWorks;