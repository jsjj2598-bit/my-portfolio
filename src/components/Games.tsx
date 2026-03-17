import React from 'react';

const Games: React.FC = () => {
  const games = [
    {
      id: 1,
      title: "开放世界冒险",
      platform: "PC, PS5, Xbox Series X",
      category: "RPG",
      color: 'bg-gradient-to-br from-primary to-pink'
    },
    {
      id: 2,
      title: "竞技射击游戏",
      platform: "PC, PS5, Xbox Series X",
      category: "FPS",
      color: 'bg-gradient-to-br from-secondary to-accent'
    },
    {
      id: 3,
      title: "策略经营游戏",
      platform: "PC",
      category: "策略",
      color: 'bg-gradient-to-br from-purple to-pink'
    },
    {
      id: 4,
      title: "独立冒险游戏",
      platform: "PC, Switch",
      category: "独立",
      color: 'bg-gradient-to-br from-green to-secondary'
    }
  ];

  return (
    <section id="games" className="py-20 bg-gradient-to-b from-white to-light">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16 animate-fade-in">
          <div className="inline-block px-4 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
            游戏世界
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold font-display mb-4 text-dark">游戏</h2>
          <p className="text-gray-600 max-w-2xl mx-auto text-lg">
            探索各种类型的游戏，分享游戏体验和攻略
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {games.map((game, index) => (
            <div 
              key={game.id} 
              className="group relative overflow-hidden rounded-xl shadow-card hover:shadow-card-hover transition-all duration-500 transform hover:-translate-y-2 animate-fade-in"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={`${game.color} relative overflow-hidden aspect-square bg-cover bg-center transition-all duration-700 group-hover:scale-110`}>
                <div className="absolute top-4 left-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <span className="text-xs font-medium bg-white/90 text-primary px-3 py-1 rounded-full">{game.category}</span>
                </div>
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end">
                  <div className="p-6 w-full">
                    <h3 className="text-white font-semibold text-lg mb-1">{game.title}</h3>
                    <p className="text-white/80 text-sm">{game.platform}</p>
                  </div>
                </div>
              </div>
              <div className="p-6 bg-white">
                <div className="flex justify-between items-start mb-3">
                  <h3 className="font-semibold text-lg text-dark">{game.title}</h3>
                  <span className="text-xs font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">{game.category}</span>
                </div>
                <p className="text-gray-600 text-sm mb-4">{game.platform}</p>
                <button className="w-full py-2 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2">
                  查看详情
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
        <div className="text-center mt-16">
          <button className="px-8 py-3 border border-primary text-primary hover:bg-primary hover:text-white font-medium rounded-lg transition-all duration-300">
            查看更多游戏
          </button>
        </div>
      </div>
    </section>
  );
};

export default Games;