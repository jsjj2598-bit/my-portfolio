import React, { useState } from 'react';
import { Link } from 'react-router-dom';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
}

interface HobbyItem {
  id: number;
  title: string;
  description: string;
  emoji: string;
  color: string;
  category: 'anime' | 'game';
  tags: string[];
  rating?: number;
}

const HobbiesPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'all' | 'anime' | 'game' | 'media'>('all');
  const [selectedItem, setSelectedItem] = useState<HobbyItem | null>(null);
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [uploadType, setUploadType] = useState<'image' | 'video'>('image');
  const [uploadTitle, setUploadTitle] = useState('');
  const [uploadCategory, setUploadCategory] = useState('anime');
  const [uploadDescription, setUploadDescription] = useState('');

  const animeList: HobbyItem[] = [
    {
      id: 1,
      title: '进击的巨人',
      description: '震撼的剧情与深刻的世界观，探讨人性与自由的史诗之作。',
      emoji: '⚔️',
      color: 'from-red-600 to-orange-600',
      category: 'anime',
      tags: ['战斗', '奇幻', '剧情'],
      rating: 5
    },
    {
      id: 2,
      title: '鬼灭之刃',
      description: '绝美画面与动人故事，新世代动画的标杆之作。',
      emoji: '🗡️',
      color: 'from-pink-600 to-rose-600',
      category: 'anime',
      tags: ['战斗', '奇幻', '治愈'],
      rating: 5
    },
    {
      id: 3,
      title: '咒术回战',
      description: '现代战斗动画的巅峰，流畅的动作与精彩的设定。',
      emoji: '👁️',
      color: 'from-purple-600 to-indigo-600',
      category: 'anime',
      tags: ['战斗', '超自然', '热血'],
      rating: 5
    },
    {
      id: 4,
      title: '孤独摇滚',
      description: '社恐少女的音乐之旅，细腻的心理描写与精彩的演出。',
      emoji: '🎸',
      color: 'from-fuchsia-600 to-pink-600',
      category: 'anime',
      tags: ['音乐', '日常', '治愈'],
      rating: 5
    },
  ];

  const gameList: HobbyItem[] = [
    {
      id: 5,
      title: '原神',
      description: '开放世界冒险，提瓦特大陆的奇幻之旅。',
      emoji: '⚡',
      color: 'from-cyan-600 to-blue-600',
      category: 'game',
      tags: ['开放世界', 'RPG', '冒险'],
      rating: 5
    },
    {
      id: 6,
      title: '塞尔达传说',
      description: '任天堂的经典之作，探索与解谜的极致体验。',
      emoji: '🗡️',
      color: 'from-green-600 to-emerald-600',
      category: 'game',
      tags: ['开放世界', '冒险', '解谜'],
      rating: 5
    },
    {
      id: 7,
      title: '明日方舟',
      description: '策略塔防与深度剧情的完美结合。',
      emoji: '🎯',
      color: 'from-slate-600 to-gray-600',
      category: 'game',
      tags: ['塔防', '策略', '剧情'],
      rating: 5
    },
    {
      id: 8,
      title: '蔚蓝档案',
      description: '可爱的角色与温馨的校园故事。',
      emoji: '📚',
      color: 'from-sky-600 to-indigo-600',
      category: 'game',
      tags: ['养成', 'RPG', '日常'],
      rating: 5
    },
  ];

  const allItems = [...animeList, ...gameList];
  const filteredItems = activeTab === 'all' 
    ? allItems 
    : activeTab === 'anime' 
      ? animeList 
      : activeTab === 'game'
        ? gameList
        : [];

  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      const newItem: MediaItem = {
        id: Date.now(),
        title: uploadTitle || file.name,
        type: uploadType,
        url,
        category: uploadCategory,
        description: uploadDescription
      };
      setMediaItems([...mediaItems, newItem]);
      setUploadTitle('');
      setUploadDescription('');
    }
  };

  const deleteMediaItem = (id: number) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <Link to="/" className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          返回主页
        </Link>

        <div className="text-center mb-12 reveal">
          <span className="text-pink-400 text-sm font-medium tracking-widest uppercase">兴趣爱好</span>
          <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mt-4 mb-6">
            二次元 <span className="gradient-text animate-glow">与游戏世界</span>
          </h1>
          <p className="text-gray-400 text-xl max-w-3xl mx-auto">
            在动漫与游戏中寻找灵感，让想象力自由飞翔
          </p>
        </div>

        <div className="flex justify-center gap-3 flex-wrap mb-12">
          {[
            { key: 'all', label: '全部作品', color: 'from-indigo-500 to-purple-500', icon: '✨' },
            { key: 'anime', label: '动漫推荐', color: 'from-pink-500 to-rose-500', icon: '🎬' },
            { key: 'game', label: '游戏世界', color: 'from-blue-500 to-cyan-500', icon: '🎮' },
            { key: 'media', label: '我的收藏', color: 'from-amber-500 to-orange-500', icon: '📷' },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key as 'all' | 'anime' | 'game' | 'media')}
              className={`px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                activeTab === tab.key
                  ? `bg-gradient-to-r ${tab.color} text-white shadow-lg shadow-purple-500/30 transform scale-105`
                  : 'glass-effect text-gray-400 hover:text-white hover:bg-white/10'
              }`}
            >
              <span>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'media' && (
          <div className="mb-12 reveal">
            <div className="glass-effect rounded-3xl p-8">
              <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <span className="text-3xl">📤</span>
                添加新作品
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-gray-300 text-sm font-medium mb-2">媒体类型</label>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setUploadType('image')}
                      className={`flex-1 py-3 rounded-xl transition-all duration-300 ${
                        uploadType === 'image'
                          ? 'bg-gradient-to-r from-indigo-500 to-purple-500 text-white'
                          : 'glass-effect text-gray-400 hover:text-white'
                      }`}
                    >
                      🖼️ 图片
                    </button>
                    <button
                      onClick={() => setUploadType('video')}
                      className={`flex-1 py-3 rounded-xl transition-all duration-300 ${
                        uploadType === 'video'
                          ? 'bg-gradient-to-r from-pink-500 to-rose-500 text-white'
                          : 'glass-effect text-gray-400 hover:text-white'
                      }`}
                    >
                      🎬 视频
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
                    <option value="anime">🎬 动漫</option>
                    <option value="game">🎮 游戏</option>
                    <option value="other">✨ 其他</option>
                  </select>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6 mb-6">
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
              </div>

              <div>
                <label className="block text-gray-300 text-sm font-medium mb-2">上传文件</label>
                <label className="flex flex-col items-center justify-center w-full h-40 glass-effect rounded-2xl cursor-pointer hover:bg-white/10 transition-all duration-300 border-2 border-dashed border-white/20 hover:border-indigo-500">
                  <div className="text-center">
                    <span className="text-5xl mb-3 block">{uploadType === 'image' ? '🖼️' : '🎬'}</span>
                    <p className="text-gray-400">点击或拖拽文件到此处</p>
                    <p className="text-gray-500 text-sm mt-1">支持 {uploadType === 'image' ? 'JPG, PNG, GIF' : 'MP4, WebM'}</p>
                  </div>
                  <input
                    type="file"
                    className="hidden"
                    accept={uploadType === 'image' ? 'image/*' : 'video/*'}
                    onChange={handleFileUpload}
                  />
                </label>
              </div>
            </div>

            {mediaItems.length > 0 && (
              <div className="mt-12">
                <h3 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                  <span className="text-3xl">📁</span>
                  我的收藏 ({mediaItems.length})
                </h3>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {mediaItems.map((item, index) => (
                    <div key={item.id} className="group reveal" style={{ animationDelay: `${index * 0.1}s` }}>
                      <div className="glass-effect rounded-2xl overflow-hidden card-hover relative">
                        {item.type === 'image' ? (
                          <img src={item.url} alt={item.title} className="w-full aspect-square object-cover" />
                        ) : (
                          <video src={item.url} className="w-full aspect-video object-cover" muted loop />
                        )}
                        
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <div className="absolute bottom-0 left-0 right-0 p-4">
                            <h4 className="text-white font-bold mb-1">{item.title}</h4>
                            <p className="text-white/70 text-sm">{item.description}</p>
                          </div>
                        </div>

                        <button
                          onClick={() => deleteMediaItem(item.id)}
                          className="absolute top-3 right-3 w-8 h-8 bg-red-500/80 hover:bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
                        >
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="absolute top-3 left-3">
                          <span className="px-2 py-1 bg-black/60 backdrop-blur-sm rounded-full text-xs text-white">
                            {item.type === 'image' ? '🖼️' : '🎬'} {item.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab !== 'media' && (
          <>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredItems.map((item, index) => (
                <div 
                  key={item.id} 
                  className="group reveal"
                  style={{ animationDelay: `${index * 0.1}s` }}
                  onClick={() => setSelectedItem(item)}
                >
                  <div className="glass-effect rounded-2xl overflow-hidden card-hover cursor-pointer h-full relative">
                    <div className={`h-56 bg-gradient-to-br ${item.color} flex items-center justify-center relative overflow-hidden`}>
                      <span className="text-8xl group-hover:scale-125 transition-transform duration-500 z-10">{item.emoji}</span>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                      
                      {item.rating && (
                        <div className="absolute top-4 right-4 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
                          <span className="text-sm">{renderStars(item.rating)}</span>
                        </div>
                      )}

                      <div className="absolute bottom-4 left-4 right-4">
                        <span className={`text-xs font-medium uppercase tracking-wider ${
                          item.category === 'anime' ? 'text-pink-300' : 'text-blue-300'
                        }`}>
                          {item.category === 'anime' ? '🎬 动漫' : '🎮 游戏'}
                        </span>
                      </div>
                    </div>

                    <div className="p-6">
                      <h4 className="text-xl font-bold text-white mb-3 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-indigo-400 group-hover:via-purple-400 group-hover:to-pink-400 transition-all duration-300">
                        {item.title}
                      </h4>
                      
                      <p className="text-gray-400 text-sm mb-4 line-clamp-3">
                        {item.description}
                      </p>

                      <div className="flex flex-wrap gap-2">
                        {item.tags.map((tag, tagIndex) => (
                          <span 
                            key={tagIndex}
                            className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-xs text-gray-300"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-16 reveal">
              <div className="glass-effect rounded-3xl p-8 lg:p-12">
                <div className="text-center mb-10">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">
                    为什么喜欢这些？
                  </h3>
                  <p className="text-gray-400 text-lg max-w-3xl mx-auto">
                    无论是动漫还是游戏，它们都是故事的载体。在这些虚拟的世界里，
                    我们可以体验不同的人生，感受各种情感，获得成长的力量。
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <span className="text-4xl">📖</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">精彩故事</h4>
                    <p className="text-gray-400">
                      每一个作品都有独特的世界观和动人的剧情
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                      <span className="text-4xl">🎨</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">精美画面</h4>
                    <p className="text-gray-400">
                      无论是动画还是游戏，视觉效果都让人惊艳
                    </p>
                  </div>
                  <div className="text-center p-6">
                    <div className="w-20 h-20 mx-auto mb-4 rounded-2xl bg-gradient-to-br from-pink-500 to-rose-500 flex items-center justify-center">
                      <span className="text-4xl">💫</span>
                    </div>
                    <h4 className="text-xl font-bold text-white mb-2">灵感源泉</h4>
                    <p className="text-gray-400">
                      这些爱好为我的创作提供了无尽的灵感
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {selectedItem && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4"
          onClick={() => setSelectedItem(null)}
        >
          <div className="max-w-2xl w-full" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setSelectedItem(null)}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className={`aspect-video bg-gradient-to-br ${selectedItem.color} rounded-2xl flex items-center justify-center mb-6`}>
              <span className="text-9xl">{selectedItem.emoji}</span>
            </div>

            <div className="text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <span className={`text-xs font-medium uppercase tracking-wider ${
                  selectedItem.category === 'anime' ? 'text-pink-400' : 'text-blue-400'
                }`}>
                  {selectedItem.category === 'anime' ? '🎬 动漫' : '🎮 游戏'}
                </span>
                {selectedItem.rating && (
                  <span className="text-lg">{renderStars(selectedItem.rating)}</span>
                )}
              </div>
              <h3 className="text-3xl font-bold text-white mb-4">{selectedItem.title}</h3>
              <p className="text-gray-400 text-lg mb-6 leading-relaxed">{selectedItem.description}</p>
              
              <div className="flex flex-wrap justify-center gap-2">
                {selectedItem.tags.map((tag, tagIndex) => (
                  <span 
                    key={tagIndex}
                    className="px-4 py-2 glass-effect rounded-full text-sm text-gray-300"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default HobbiesPage;
