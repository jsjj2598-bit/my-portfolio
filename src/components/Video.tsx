import React, { useState } from 'react';

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
      title: '赛博朋克之夜',
      category: '赛博朋克',
      description: '霓虹灯光下的未来都市，科技与艺术的完美融合。',
      color: 'from-fuchsia-500 via-purple-600 to-blue-500',
      emoji: '🌃',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731016/%E5%B0%8F%E4%BA%91%E9%9B%80_1772815120360_0_m_wfuebj.mp4'
    },
    {
      id: 2,
      title: '星际穿越',
      category: '科幻',
      description: '穿梭于浩瀚宇宙，探索未知星系的神秘与美丽。',
      color: 'from-cyan-400 via-blue-600 to-indigo-700',
      emoji: '🚀',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731014/%E5%B0%8F%E4%BA%91%E9%9B%80_1772612068608_0_m_regmvd.mp4'
    },
    {
      id: 3,
      title: '东方幻境',
      category: '国风',
      description: '水墨丹青，意境悠远，展现东方美学的独特魅力。',
      color: 'from-teal-400 via-emerald-500 to-green-600',
      emoji: '🎋',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731014/%E5%B0%8F%E4%BA%91%E9%9B%80_1773304008397_0_m_auraed.mp4'
    },
    {
      id: 4,
      title: '梦幻花园',
      category: '奇幻',
      description: '盛开的花朵与飞舞的蝴蝶，编织成最美的梦境。',
      color: 'from-pink-400 via-rose-500 to-red-500',
      emoji: '🌸',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731011/%E5%B0%8F%E4%BA%91%E9%9B%80_1773304000591_0_m_fy2wh1.mp4'
    },
    {
      id: 5,
      title: '极光之舞',
      category: '自然',
      description: '北极光在夜空中绚烂绽放，大自然的神奇魔法。',
      color: 'from-green-400 via-teal-500 to-cyan-500',
      emoji: '✨',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731007/%E5%B0%8F%E4%BA%91%E9%9B%80_1772814569791_0_m_ziyiod.mp4'
    },
    {
      id: 6,
      title: '机械纪元',
      category: '机械',
      description: '精密的机械装置与流畅的运动，工业美学的极致体现。',
      color: 'from-orange-400 via-amber-500 to-yellow-500',
      emoji: '⚙️',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773730810/video_20260310_174352_edit_frwaiw.mp4'
    },
    {
      id: 7,
      title: '游戏人生',
      category: '游戏',
      description: '像素世界与游戏场景，回忆那些美好的游戏时光。',
      color: 'from-violet-500 via-purple-600 to-fuchsia-600',
      emoji: '🎮',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773730815/%E5%B0%8F%E4%BA%91%E9%9B%80_1772272611317_0_m_ygp4ou.mp4'
    },
    {
      id: 8,
      title: '魔法森林',
      category: '魔幻',
      description: '神秘的森林深处，精灵与魔法生物的家园。',
      color: 'from-lime-400 via-green-500 to-emerald-600',
      emoji: '🌲',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773730803/%E5%B0%8F%E4%BA%91%E9%9B%80_1772263833021_0_m_zkzoux.mp4'
    },
    {
      id: 9,
      title: '火焰重生',
      category: '热血',
      description: '熊熊燃烧的火焰，象征着热情与力量的觉醒。',
      color: 'from-red-500 via-orange-500 to-yellow-400',
      emoji: '🔥',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773730800/video_20260228_184806_edit_mitmon.mp4'
    },
  ];

  return (
    <section id="video" className="py-24 lg:py-32 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-r from-fuchsia-600/20 via-purple-600/20 to-blue-600/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-r from-cyan-600/20 via-teal-600/20 to-green-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-orange-600/10 via-pink-600/10 to-violet-600/10 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative z-10">
        <div className="text-center mb-16 reveal">
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 text-sm font-medium tracking-widest uppercase">AI 创作</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
            视频 <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 animate-pulse">作品展示</span>
          </h2>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
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
              <div className={`bg-gradient-to-br ${video.color} p-1 rounded-2xl overflow-hidden card-hover cursor-pointer`}>
                <div className="relative aspect-video overflow-hidden rounded-xl bg-gray-900">
                  <video 
                    src={video.videoSrc}
                    className="w-full h-full object-cover"
                    muted
                    loop
                    playsInline
                    preload="metadata"
                    poster={`https://res.cloudinary.com/dgslwbfw2/video/upload/f_jpg,q_auto,w_400/${video.videoSrc.split('/').pop()?.split('.')[0] || ''}.jpg`}
                    onMouseEnter={(e) => e.currentTarget.play().catch(() => {})}
                    onMouseLeave={(e) => {
                      e.currentTarget.pause();
                      e.currentTarget.currentTime = 0;
                    }}
                    onError={() => {
                      console.error('Video loading error:', video.title);
                    }}
                  >
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <div className="text-center">
                        <div className="text-4xl mb-2">{video.emoji}</div>
                        <p className="text-gray-400 text-sm">视频加载中...</p>
                      </div>
                    </div>
                  </video>
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                  
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-colors duration-300 flex items-center justify-center">
                    <div className={`w-16 h-16 bg-gradient-to-br ${video.color} rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transform scale-75 group-hover:scale-100 transition-all duration-300 shadow-lg`}>
                      <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                  </div>

                  <div className="absolute top-4 right-4">
                    <span className={`px-3 py-1 bg-gradient-to-r ${video.color} text-white text-sm font-medium rounded-full shadow-lg`}>
                      {video.emoji} {video.category}
                    </span>
                  </div>

                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-lg font-bold text-white mb-1 drop-shadow-lg">{video.title}</h3>
                    <p className="text-white/80 text-sm line-clamp-2 drop-shadow">{video.description}</p>
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
