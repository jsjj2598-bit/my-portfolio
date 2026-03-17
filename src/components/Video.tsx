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
      title: '小米影像作品 1',
      category: 'AI视频',
      description: '用 AI 技术创造的精彩影像，展现无限创意。',
      color: 'from-indigo-600 via-purple-600 to-pink-600',
      emoji: '🎬',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731016/%E5%B0%8F%E4%BA%91%E9%9B%80_1772815120360_0_m_wfuebj.mp4'
    },
    {
      id: 2,
      title: '小米影像作品 2',
      category: 'AI视频',
      description: '探索 AI 创意的无限可能，每一个画面都是想象力的延伸。',
      color: 'from-blue-600 via-indigo-600 to-purple-600',
      emoji: '🌌',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731014/%E5%B0%8F%E4%BA%91%E9%9B%80_1772612068608_0_m_regmvd.mp4'
    },
    {
      id: 3,
      title: '小米影像作品 3',
      category: 'AI视频',
      description: '用人工智能技术打造的独特视觉体验。',
      color: 'from-emerald-600 via-teal-600 to-cyan-600',
      emoji: '🏯',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731014/%E5%B0%8F%E4%BA%91%E9%9B%80_1773304008397_0_m_auraed.mp4'
    },
    {
      id: 4,
      title: '小米影像作品 4',
      category: 'AI视频',
      description: 'AI 与艺术的完美结合，创造令人惊叹的视觉效果。',
      color: 'from-rose-600 via-pink-600 to-fuchsia-600',
      emoji: '🎨',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731011/%E5%B0%8F%E4%BA%91%E9%9B%80_1773304000591_0_m_fy2wh1.mp4'
    },
    {
      id: 5,
      title: '小米影像作品 5',
      category: 'AI视频',
      description: '用 AI 技术讲述精彩故事，每一帧都是艺术品。',
      color: 'from-cyan-600 via-blue-600 to-indigo-600',
      emoji: '⚡',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773731007/%E5%B0%8F%E4%BA%91%E9%9B%80_1772814569791_0_m_ziyiod.mp4'
    },
    {
      id: 6,
      title: '创意视频 1',
      category: 'AI视频',
      description: '独特的创意视角，展现不一样的世界。',
      color: 'from-green-700 via-emerald-600 to-teal-500',
      emoji: '🌿',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773730810/video_20260310_174352_edit_frwaiw.mp4'
    },
    {
      id: 7,
      title: '小米影像作品 6',
      category: 'AI视频',
      description: '用镜头和 AI 捕捉生活中的美好瞬间。',
      color: 'from-violet-600 via-purple-600 to-fuchsia-600',
      emoji: '🎮',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773730815/%E5%B0%8F%E4%BA%91%E9%9B%80_1772272611317_0_m_ygp4ou.mp4'
    },
    {
      id: 8,
      title: '小米影像作品 7',
      category: 'AI视频',
      description: '探索 AI 创作的无限边界，让想象力自由飞翔。',
      color: 'from-green-600 via-lime-600 to-yellow-600',
      emoji: '🎲',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773730803/%E5%B0%8F%E4%BA%91%E9%9B%80_1772263833021_0_m_zkzoux.mp4'
    },
    {
      id: 9,
      title: '创意视频 2',
      category: 'AI视频',
      description: '用 AI 技术创造独特的视觉体验。',
      color: 'from-amber-600 via-orange-600 to-red-600',
      emoji: '🌟',
      videoSrc: 'https://res.cloudinary.com/dgslwbfw2/video/upload/v1773730800/video_20260228_184806_edit_mitmon.mp4'
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
