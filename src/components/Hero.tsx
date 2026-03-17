import React from 'react';

const Hero: React.FC = () => {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="hero" className="min-h-screen flex items-center justify-center relative overflow-hidden pt-20">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-gradient-to-r from-fuchsia-600/30 via-purple-600/30 to-blue-600/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gradient-to-r from-cyan-600/30 via-teal-600/30 to-green-600/30 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-orange-600/20 via-pink-600/20 to-violet-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-gradient-to-r from-yellow-600/20 via-amber-600/20 to-orange-600/20 rounded-full blur-2xl animate-pulse" style={{ animationDelay: '0.5s' }}></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-6 text-center">
        <div className="animate-slide-up">
          <p className="text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-purple-400 to-cyan-400 text-sm tracking-[0.3em] mb-6 uppercase font-medium">
            创意工作者
          </p>
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-8 animate-slide-up" style={{ animationDelay: '0.1s' }}>
          <span className="text-white">用镜头捕捉</span>
          <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 animate-pulse">用AI创造无限</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto mb-12 leading-relaxed animate-slide-up" style={{ animationDelay: '0.2s' }}>
          我是 LONG，一名热爱摄影、AI 视频创作的创意工作者，
          <br className="hidden md:block" />
          在动漫与游戏的世界里寻找灵感，探索无限可能。
        </p>
        
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.3s' }}>
          <button 
            onClick={() => scrollToSection('video')}
            className="px-10 py-4 bg-gradient-to-r from-fuchsia-600 via-purple-600 to-blue-600 text-white text-lg font-semibold rounded-xl hover:opacity-90 transition-all duration-300 transform hover:scale-105 shadow-lg shadow-fuchsia-600/30"
          >
            探索作品
          </button>
          
          <button 
            onClick={() => scrollToSection('about')}
            className="px-10 py-4 border-2 border-white/20 text-white text-lg font-semibold rounded-xl hover:bg-white/10 transition-all duration-300 glass-effect"
          >
            了解更多
          </button>
        </div>
      </div>

      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
        <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
          <div className="w-1 h-3 bg-gradient-to-b from-fuchsia-400 to-purple-400 rounded-full mt-2 animate-pulse"></div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
