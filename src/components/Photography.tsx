import React, { useState } from 'react';

import photo1 from '../assets/微信图片_20260316172017_2_9.jpg';
import photo2 from '../assets/微信图片_20260316172021_3_9.jpg';
import photo3 from '../assets/微信图片_20260316172026_4_9.jpg';
import photo4 from '../assets/微信图片_20260316172031_5_9.jpg';
import photo5 from '../assets/微信图片_20260316172034_6_9.jpg';
import photo6 from '../assets/微信图片_20260316172049_10_9.jpg';

interface Photo {
  id: number;
  title: string;
  category: string;
  image: string;
}

const Photography: React.FC = () => {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const photos: Photo[] = [
    { id: 1, title: '城市光影', category: '建筑', image: photo1 },
    { id: 2, title: '自然之美', category: '风景', image: photo2 },
    { id: 3, title: '街头瞬间', category: '人文', image: photo3 },
    { id: 4, title: '黄昏时刻', category: '风景', image: photo4 },
    { id: 5, title: '夜色撩人', category: '夜景', image: photo5 },
    { id: 6, title: '人物特写', category: '人像', image: photo6 },
  ];

  const openLightbox = (photo: Photo, index: number) => {
    setSelectedPhoto(photo);
    setCurrentIndex(index);
  };

  const closeLightbox = () => {
    setSelectedPhoto(null);
  };

  const nextPhoto = () => {
    setCurrentIndex((prev) => (prev + 1) % photos.length);
    setSelectedPhoto(photos[(currentIndex + 1) % photos.length]);
  };

  const prevPhoto = () => {
    setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    setSelectedPhoto(photos[(currentIndex - 1 + photos.length) % photos.length]);
  };

  return (
    <section id="photography" className="py-24 lg:py-32 relative">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-indigo-900/5 to-transparent"></div>
      
      <div className="max-w-7xl mx-auto px-6 lg:px-12 relative">
        <div className="text-center mb-16 reveal">
          <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase">摄影作品</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
            光影 <span className="gradient-text">艺术画廊</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            用镜头捕捉世界的美好，每一张照片都是一个故事
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {photos.map((photo, index) => (
            <div 
              key={photo.id} 
              className="group reveal"
              style={{ animationDelay: `${index * 0.1}s` }}
              onClick={() => openLightbox(photo, index)}
            >
              <div className="relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer glass-effect">
                <img 
                  src={photo.image} 
                  alt={photo.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                  <span className="text-6xl">📷</span>
                </div>
                
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="absolute bottom-0 left-0 right-0 p-6 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                    <span className="text-indigo-400 text-sm font-medium tracking-wider uppercase mb-2 block">
                      {photo.category}
                    </span>
                    <h3 className="text-xl font-bold text-white">{photo.title}</h3>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selectedPhoto && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-lg"
          onClick={closeLightbox}
        >
          <button 
            className="absolute top-6 right-6 text-white hover:text-gray-300 transition-colors z-10"
            onClick={closeLightbox}
          >
            <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <button 
            className="absolute left-6 top-1/2 -translate-y-1/2 text-white hover:text-indigo-400 transition-colors p-3 glass-effect rounded-full z-10"
            onClick={(e) => { e.stopPropagation(); prevPhoto(); }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="max-w-5xl w-full px-4" onClick={e => e.stopPropagation()}>
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
              <img 
                src={selectedPhoto.image} 
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden absolute inset-0 bg-gradient-to-br from-slate-700 to-slate-900 flex items-center justify-center">
                <div className="text-center">
                  <span className="text-9xl mb-4 block">📷</span>
                  <p className="text-white text-xl">照片预览</p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-6">
              <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase mb-2 block">
                {selectedPhoto.category}
              </span>
              <h3 className="text-3xl font-bold text-white">{selectedPhoto.title}</h3>
              <p className="text-gray-400 mt-2">
                {currentIndex + 1} / {photos.length}
              </p>
            </div>
          </div>

          <button 
            className="absolute right-6 top-1/2 -translate-y-1/2 text-white hover:text-indigo-400 transition-colors p-3 glass-effect rounded-full z-10"
            onClick={(e) => { e.stopPropagation(); nextPhoto(); }}
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        </div>
      )}
    </section>
  );
};

export default Photography;
