import React from 'react';
import photo1 from '../assets/微信图片_20260316172017_2_9.jpg';
import photo2 from '../assets/微信图片_20260316172021_3_9.jpg';
import photo3 from '../assets/微信图片_20260316172026_4_9.jpg';
import photo4 from '../assets/微信图片_20260316172031_5_9.jpg';
import photo5 from '../assets/微信图片_20260316172034_6_9.jpg';
import photo6 from '../assets/微信图片_20260316172049_10_9.jpg';

const Works: React.FC = () => {
  const photos = [
    { src: photo1, title: '摄影作品 01' },
    { src: photo2, title: '摄影作品 02' },
    { src: photo3, title: '摄影作品 03' },
    { src: photo4, title: '摄影作品 04' },
    { src: photo5, title: '摄影作品 05' },
    { src: photo6, title: '摄影作品 06' },
  ];

  return (
    <section id="works" className="py-24 bg-light">
      <div className="max-w-6xl mx-auto px-6">
        <div className="text-center mb-16">
          <p className="text-secondary text-sm tracking-widest mb-3 uppercase">
            作品集
          </p>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            精选作品
          </h2>
        </div>

        <div className="mb-20">
          <h3 className="text-xl font-semibold mb-8">摄影作品</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {photos.map((photo, index) => (
              <div key={index} className="group aspect-[4/3] overflow-hidden bg-gray-200">
                <img
                  src={photo.src}
                  alt={photo.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-8">AI 视频创作</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((item) => (
              <div key={item} className="aspect-video bg-gray-200 flex items-center justify-center">
                <div className="text-center text-secondary">
                  <div className="text-4xl mb-2">▶</div>
                  <p className="text-sm">AI 视频作品 {item}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Works;
