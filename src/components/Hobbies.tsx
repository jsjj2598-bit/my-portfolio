import React, { useState } from 'react';

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

const Hobbies: React.FC = () => {
  const [selectedItem, setSelectedItem] = useState<HobbyItem | null>(null);

  const animeList: HobbyItem[] = [
    {
      id: 1,
      title: '完美世界',
      description: '大荒世界的传奇，石昊从卑微中崛起，铸就完美传说。',
      emoji: '🔥',
      color: 'from-orange-600 to-red-600',
      category: 'anime',
      tags: ['玄幻', '热血', '成长'],
      rating: 5
    },
    {
      id: 2,
      title: '吞噬星空',
      description: '未来世界的武者，罗峰在宇宙中探索，守护人类文明。',
      emoji: '🌌',
      color: 'from-blue-600 to-indigo-600',
      category: 'anime',
      tags: ['科幻', '热血', '战斗'],
      rating: 5
    },
    {
      id: 3,
      title: '凡人修仙传',
      description: '凡人韩立，步步为营，在修仙界中开创自己的大道。',
      emoji: '⚔️',
      color: 'from-emerald-600 to-teal-600',
      category: 'anime',
      tags: ['仙侠', '玄幻', '成长'],
      rating: 5
    },
    {
      id: 4,
      title: '仙逆',
      description: '顺为凡，逆为仙，王林逆天而行，证道长生。',
      emoji: '🌟',
      color: 'from-purple-600 to-violet-600',
      category: 'anime',
      tags: ['仙侠', '热血', '复仇'],
      rating: 5
    },
  ];

  const gameList: HobbyItem[] = [
    {
      id: 5,
      title: '王者荣耀',
      description: '5v5公平竞技MOBA，团队配合与策略的巅峰对决。',
      emoji: '⚔️',
      color: 'from-orange-600 to-red-600',
      category: 'game',
      tags: ['MOBA', '竞技', '团队'],
      rating: 5
    },
    {
      id: 6,
      title: '金铲铲之战',
      description: '自走棋策略游戏，阵容搭配与运气的完美结合。',
      emoji: '🎲',
      color: 'from-yellow-600 to-amber-600',
      category: 'game',
      tags: ['自走棋', '策略', '休闲'],
      rating: 5
    },
    {
      id: 7,
      title: '原神',
      description: '开放世界冒险，提瓦特大陆的奇幻之旅。',
      emoji: '⚡',
      color: 'from-cyan-600 to-blue-600',
      category: 'game',
      tags: ['开放世界', 'RPG', '冒险'],
      rating: 5
    },
    {
      id: 8,
      title: '永劫无间',
      description: '武侠动作竞技，飞索穿梭与剑气纵横的热血战斗。',
      emoji: '🗡️',
      color: 'from-red-600 to-orange-600',
      category: 'game',
      tags: ['动作', '竞技', '武侠'],
      rating: 5
    },
    {
      id: 9,
      title: '三角洲行动',
      description: '战术射击游戏，团队协作与精准射击的完美结合。',
      emoji: '🎯',
      color: 'from-green-600 to-emerald-600',
      category: 'game',
      tags: ['FPS', '战术', '射击'],
      rating: 5
    },
    {
      id: 10,
      title: '光遇',
      description: '社交冒险游戏，在云端王国探索与温暖相遇。',
      emoji: '✨',
      color: 'from-sky-600 to-indigo-600',
      category: 'game',
      tags: ['社交', '冒险', '治愈'],
      rating: 5
    },
    {
      id: 11,
      title: '鸣潮',
      description: '开放世界动作游戏，声骸力量与都市幻想的完美融合。',
      emoji: '🌊',
      color: 'from-violet-600 to-purple-600',
      category: 'game',
      tags: ['开放世界', '动作', 'RPG'],
      rating: 5
    },
    {
      id: 12,
      title: '崩坏星穹铁道',
      description: '银河冒险回合制RPG，星穹列车的星际之旅。',
      emoji: '🚀',
      color: 'from-pink-600 to-fuchsia-600',
      category: 'game',
      tags: ['回合制', 'RPG', '科幻'],
      rating: 5
    },
  ];



  const renderStars = (rating: number) => {
    return '⭐'.repeat(rating);
  };

  return (
    <section id="hobbies" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-pink-600/20 via-fuchsia-600/20 to-purple-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-600/20 via-blue-600/20 to-indigo-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1.5s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-to-r from-orange-600/15 via-amber-600/15 to-yellow-600/15 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 reveal">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 text-sm font-medium tracking-widest uppercase">兴趣爱好</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
            二次元 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 animate-pulse">与游戏世界</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            在动漫与游戏中寻找灵感，让想象力自由飞翔
          </p>
        </div>

        <div className="mb-16">
          <div className="flex items-center gap-4 mb-8 reveal">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-pink-500/50"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🎬</span>
              动漫推荐
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-pink-500/50"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {animeList.map((item, index) => (
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
                      <span className="text-xs font-medium uppercase tracking-wider text-pink-300">
                        🎬 动漫
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
        </div>

        <div>
          <div className="flex items-center gap-4 mb-8 reveal">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-indigo-500/50"></div>
            <h3 className="text-2xl md:text-3xl font-bold text-white flex items-center gap-3">
              <span className="text-3xl">🎮</span>
              游戏世界
            </h3>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-indigo-500/50"></div>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {gameList.map((item, index) => (
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
                      <span className="text-xs font-medium uppercase tracking-wider text-blue-300">
                        🎮 游戏
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
    </section>
  );
};

export default Hobbies;
