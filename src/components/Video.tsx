import React, { useState } from 'react';

import video1 from '../assets/09ce04b1f9c1f90dfbfc0700ad960907.mp4';
import video2 from '../assets/754811a50cc8a6fae65b0e9b7ee0253f.mp4';
import video3 from '../assets/754811a50cc8a6fae65b0e9b7ee0253f(1).mp4';
import video4 from '../assets/78df6878971f733d6f22fdee55f2e0a7.mp4';
import video5 from '../assets/a47cff61179bab84f07564bae0520eb8.mp4';
import video6 from '../assets/ccd0fab0ad080c8f4ca9722131399338.mp4';
import video7 from '../assets/cd601e9a73f986f7c6e226f661662dfe.mp4';
import video8 from '../assets/ce5f6ea832fe4c28d94ec940ce28549c.mp4';
import video9 from '../assets/df68fb1817d6768067069ec73e1934fd.mp4';

interface VideoItem {
  id: number;
  title: string;
  category: string;
  description: string;
  color: string;
  emoji: string;
  videoSrc: string;
}

const Video: React.FC = () => {
  const [selectedVideo, setSelectedVideo] = useState<VideoItem | null>(null);

  const videos: VideoItem[] = [
    {
      id: 1,
      title: 'AI 科幻世界',
      category: '科幻',
      description: '未来科技与人工智能的完美融合，呈现令人震撼的视觉效果。',
      color: 'from-indigo-600 via-purple-600 to-pink-600',
      emoji: '🌃',
      videoSrc: video1
    },
    {
      id: 2,
      title: '梦幻宇宙',
      category: '奇幻',
      description: '穿越星云与银河，探索宇宙深处的神秘与美丽。',
      color: 'from-blue-600 via-indigo-600 to-purple-600',
      emoji: '🌌',
      videoSrc: video2
    },
    {
      id: 3,
      title: '东方美学',
      category: '国风',
      description: '融合传统东方美学与现代 AI 技术，创造独特的诗意画面。',
      color: 'from-emerald-600 via-teal-600 to-cyan-600',
      emoji: '🏯',
      videoSrc: video3
    },
    {
      id: 4,
      title: '数字艺术',
      category: '艺术',
      description: '色彩与形状的碰撞，探索抽象艺术的无限可能。',
      color: 'from-rose-600 via-pink-600 to-fuchsia-600',
      emoji: '🎨',
      videoSrc: video4
    },
    {
      id: 5,
      title: '赛博朋克',
      category: '科幻',
      description: '霓虹灯光与未来都市的完美结合，展现赛博朋克美学。',
      color: 'from-cyan-600 via-blue-600 to-indigo-600',
      emoji: '⚡',
      videoSrc: video5
    },
    {
      id: 6,
      title: '自然之美',
      category: '自然',
      description: 'AI 模拟的自然生态系统，展现生命的律动。',
      color: 'from-green-700 via-emerald-600 to-teal-500',
      emoji: '🌿',
      videoSrc: video6
    },
    {
      id: 7,
      title: '虚拟世界',
      category: '游戏',
      description: '探索虚拟游戏世界的无限可能与奇妙冒险。',
      color: 'from-violet-600 via-purple-600 to-fuchsia-600',
      emoji: '🎮',
      videoSrc: video7
    },
    {
      id: 8,
      title: '像素艺术',
      category: '艺术',
      description: '怀旧像素风格的动画短片，重温经典的快乐时光。',
      color: 'from-green-600 via-lime-600 to-yellow-600',
      emoji: '🎲',
      videoSrc: video8
    },
    {
      id: 9,
      title: '奇幻冒险',
      category: '奇幻',
      description: '踏上神秘的冒险之旅，探索未知的奇幻世界。',
      color: 'from-amber-600 via-orange-600 to-red-600',
      emoji: '🌟',
      videoSrc: video9
    },
  ];

  return (
    <section id="video" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="text-center mb-16 reveal">
          <span className="text-purple-400 text-sm font-medium tracking-widest uppercase">AI 创作</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
            视频 <span className="gradient-text">作品展示</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            用 AI 技术创造无限可能，每一部作品都是想象力的延伸
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video, index) => (
            <div 
              key={video.id} 
              className="group reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => setSelectedVideo(video)}
            >
              <div className="glass-effect rounded-2xl overflow-hidden card-hover cursor-pointer">
                <div className="relative aspect-video overflow-hidden">
                  <video 
                    src={video.videoSrc}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    onMouseEnter={(e) => e.currentTarget.play()}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                  >
                    您的浏览器不支持视频播放
                  </video>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent"></div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors duration-300 flex items-center justify-center">
                    <div className="w-16 h-16 bg-white/90 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300">
                      <svg className="w-8 h-8 text-indigo-600 ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-sm font-medium rounded-full">
                      {video.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1">{video.title}</h3>
                    <p className="text-white/70 text-sm line-clamp-2">{video.description}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedVideo && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg p-4"
          onClick={() => setSelectedVideo(null)}
        >
          <div className="max-w-5xl w-full" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors z-10"
              onClick={() => setSelectedVideo(null)}
            >
              <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="aspect-video rounded-2xl overflow-hidden mb-6">
              <video 
                src={selectedVideo.videoSrc}
                className="w-full h-full object-contain"
                controls
                autoPlay
              >
                您的浏览器不支持视频播放
              </video>
            </div>

            <div className="text-center">
              <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-2 block">
                {selectedVideo.category}
              </span>
              <h3 className="text-3xl font-bold text-white mb-4">{selectedVideo.title}</h3>
              <p className="text-gray-400 text-lg">{selectedVideo.description}</p>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};

export default Video;
