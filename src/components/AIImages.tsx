import React, { useState } from 'react';

interface VideoWork {
  id: number;
  title: string;
  description: string;
  category: string;
  color: string;
}

const AIImages: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoWork | null>(null);

  const works: VideoWork[] = [
    {
      id: 1,
      title: "Future City",
      description: "Exploring AI-driven urban design and futuristic cityscapes",
      category: 'AI Video',
      color: 'from-violet-600 to-purple-800'
    },
    {
      id: 2,
      title: "Digital Dreams",
      description: "Transforming dreams into visual art through AI",
      category: 'AI Video',
      color: 'from-blue-600 to-indigo-800'
    },
    {
      id: 3,
      title: "Virtual Reality",
      description: "The intersection of VR and reality",
      category: 'AI Video',
      color: 'from-emerald-600 to-teal-800'
    },
    {
      id: 4,
      title: "Cyberpunk",
      description: "Neon lights and high-tech aesthetics",
      category: 'AI Video',
      color: 'from-pink-600 to-rose-800'
    },
    {
      id: 5,
      title: "Fantasy World",
      description: "Where magic meets technology",
      category: 'AI Video',
      color: 'from-amber-600 to-orange-800'
    },
    {
      id: 6,
      title: "Space Odyssey",
      description: "Journey through the cosmos",
      category: 'AI Video',
      color: 'from-cyan-600 to-blue-800'
    }
  ];

  return (
    <section id="works" className="py-24 bg-surface-900">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="text-brand-400 text-sm font-medium tracking-widest uppercase">Portfolio</span>
          <h2 className="text-4xl md:text-5xl font-bold text-white mt-4 mb-6">Featured Works</h2>
          <p className="text-surface-400 max-w-xl mx-auto">
            A collection of AI-generated video projects showcasing creative vision and technical expertise
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {works.map((work, index) => (
            <div
              key={work.id}
              className="group bg-surface-800/50 backdrop-blur-sm rounded-2xl overflow-hidden border border-surface-700/50 hover:border-brand-500/30 transition-all duration-500 hover:shadow-2xl hover:shadow-brand-500/10 cursor-pointer animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedVideo(work)}
            >
              <div className={`aspect-video bg-gradient-to-br ${work.color} relative overflow-hidden`}>
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-300"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  </div>
                </div>
              </div>
              <div className="p-6">
                <span className="text-xs font-medium text-brand-400 uppercase tracking-wider">{work.category}</span>
                <h3 className="text-xl font-semibold text-white mt-2 mb-2">{work.title}</h3>
                <p className="text-surface-400 text-sm">{work.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedVideo(null)}>
          <div className="bg-surface-800 rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className={`aspect-video bg-gradient-to-br ${selectedVideo.color} flex items-center justify-center`}>
              <div className="w-20 h-20 bg-white/10 backdrop-blur-sm rounded-full flex items-center justify-center">
                <svg className="w-10 h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8 5v14l11-7z"/>
                </svg>
              </div>
            </div>
            <div className="p-8">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-brand-400 uppercase tracking-wider">{selectedVideo.category}</span>
                <button className="p-2 hover:bg-surface-700 rounded-lg transition-colors" onClick={() => setSelectedVideo(null)}>
                  <svg className="w-5 h-5 text-surface-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <h3 className="text-2xl font-bold text-white mb-3">{selectedVideo.title}</h3>
              <p className="text-surface-400 mb-6">{selectedVideo.description}</p>
              <div className="flex gap-3">
                <button className="flex-1 px-6 py-3 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-xl transition-colors">
                  Watch Video
                </button>
                <button className="px-6 py-3 border border-surface-600 text-surface-300 hover:text-white hover:border-surface-500 font-medium rounded-xl transition-colors">
                  External Link
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default AIImages;
