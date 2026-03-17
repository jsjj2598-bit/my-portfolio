import React from 'react';

const About: React.FC = () => {
  const skills = [
    { icon: '📷', title: '摄影', desc: '光影艺术' },
    { icon: '🎬', title: 'AI 视频', desc: '创意无限' },
    { icon: '🎮', title: '游戏', desc: '虚拟世界' },
    { icon: '🎨', title: '动漫', desc: '二次元' },
  ];

  return (
    <section id="about" className="py-24 lg:py-32 relative">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="text-center mb-16 reveal">
          <span className="text-indigo-400 text-sm font-medium tracking-widest uppercase">关于我</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mt-4 mb-6">
            探索 <span className="gradient-text">创意边界</span>
          </h2>
          <p className="text-gray-400 text-lg max-w-2xl mx-auto">
            热爱创作，追求极致，用镜头和AI讲述故事
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          <div className="reveal">
            <div className="relative">
              <div className="aspect-square rounded-3xl overflow-hidden gradient-border">
                <div className="gradient-border-inner h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <div className="w-40 h-40 mx-auto mb-6 rounded-full bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center animate-float">
                      <span className="text-6xl">👋</span>
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">LONG</h3>
                    <p className="text-gray-400">创意工作者</p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl opacity-20 blur-xl"></div>
              <div className="absolute -bottom-4 -left-4 w-32 h-32 bg-gradient-to-br from-purple-600 to-pink-600 rounded-2xl opacity-20 blur-xl"></div>
            </div>
          </div>

          <div className="space-y-6 reveal">
            <p className="text-gray-300 text-lg leading-relaxed">
              你好！我是 LONG，一名充满热情的创意工作者。我相信每一张照片、每一段视频都是一个故事，
              等待被讲述。通过镜头，我捕捉生活中那些转瞬即逝的美好瞬间。
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              随着 AI 技术的发展，我开始探索用人工智能来创作视频，这为我的创意打开了全新的世界。
              从传统摄影到现代 AI 创作，我享受每一个探索的过程。
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              在工作之余，我沉浸在动漫和游戏的世界里。这些爱好不仅是我的娱乐方式，更是我灵感的源泉。
              二次元的想象力和游戏的叙事方式，深深影响着我的创作风格。
            </p>

            <div className="grid grid-cols-2 gap-4 pt-4">
              {skills.map((skill, index) => (
                <div 
                  key={skill.title} 
                  className="glass-effect p-6 rounded-2xl text-center card-hover"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <span className="text-4xl mb-3 block">{skill.icon}</span>
                  <h4 className="text-white font-semibold mb-1">{skill.title}</h4>
                  <p className="text-gray-400 text-sm">{skill.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
