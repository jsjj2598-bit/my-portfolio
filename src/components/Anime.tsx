import React from 'react';

interface AnimeItem {
  id: number;
  title: string;
  description: string;
  category: string;
  color: string;
}

const Anime: React.FC = () => {
  const animeList: AnimeItem[] = [
    { id: 1, title: "Attack on Titan", description: "A dark fantasy epic about humanity's struggle for survival", category: 'Anime', color: 'from-red-700 to-red-900' },
    { id: 2, title: "Demon Slayer", description: "Beautiful animation and emotional storytelling", category: 'Anime', color: 'from-rose-700 to-pink-900' },
    { id: 3, title: "Jujutsu Kaisen", description: "Modern action with stunning visuals", category: 'Anime', color: 'from-violet-700 to-purple-900' },
    { id: 4, title: "Genshin Impact", description: "Open world adventure with rich lore", category: 'Game', color: 'from-cyan-700 to-blue-900' },
  ];

  const gameList: AnimeItem[] = [
    { id: 5, title: "The Legend of Zelda", description: "Adventure that defines a generation", category: 'Game', color: 'from-green-700 to-emerald-900' },
    { id: 6, title: "Arknights", description: "Strategic gameplay with compelling narrative", category: 'Game', color: 'from-slate-600 to-zinc-800' },
    { id: 7, title: "Blue Archive", description: "Charming characters and engaging story", category: 'Game', color: 'from-sky-700 to-blue-900' },
    { id: 8, title: "Uma Musume", description: "Heartwarming stories of athletic horses", category: 'Game', color: 'from-amber-600 to-yellow-800' },
  ];

  return (
    <section id="anime" className="py-24 bg-surface-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-400 text-sm font-medium tracking-widest uppercase">Interests</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Anime & Games</h2>
          <p className="text-surface-400 max-w-xl mx-auto">
            Some of my favorite anime series and games that inspire my creative work
          </p>
        </div>

        <div className="mb-16">
          <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-brand-500 rounded-full"></span>
            Favorite Anime
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {animeList.map((item, index) => (
              <div
                key={item.id}
                className="group bg-surface-800/50 border border-surface-700/50 hover:border-brand-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-32 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <span className="text-4xl opacity-80">🎬</span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-brand-400 uppercase tracking-wider">{item.category}</span>
                  <h4 className="text-lg font-semibold text-white mt-2 mb-2">{item.title}</h4>
                  <p className="text-surface-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-white mb-8 flex items-center gap-3">
            <span className="w-1 h-8 bg-brand-500 rounded-full"></span>
            Favorite Games
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {gameList.map((item, index) => (
              <div
                key={item.id}
                className="group bg-surface-800/50 border border-surface-700/50 hover:border-brand-500/30 rounded-xl overflow-hidden transition-all duration-300 hover:shadow-xl hover:shadow-brand-500/5 animate-fade-up"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={`h-32 bg-gradient-to-br ${item.color} flex items-center justify-center`}>
                  <span className="text-4xl opacity-80">🎮</span>
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium text-brand-400 uppercase tracking-wider">{item.category}</span>
                  <h4 className="text-lg font-semibold text-white mt-2 mb-2">{item.title}</h4>
                  <p className="text-surface-400 text-sm">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Anime;
