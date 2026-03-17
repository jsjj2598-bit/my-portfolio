import React, { useState, useEffect } from 'react';

interface NavbarProps {
  onShowAllWorks?: () => void;
  showAllWorks?: boolean;
}

const Navbar: React.FC<NavbarProps> = ({ onShowAllWorks, showAllWorks }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setMobileMenuOpen(false);
    }
  };

  const navItems = [
    { id: 'about', label: '关于我' },
    { id: 'video', label: 'AI 视频' },
    { id: 'photography', label: '摄影作品' },
    { id: 'hobbies', label: '爱好' },
  ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled 
          ? 'glass-effect shadow-lg shadow-purple-900/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-20">
          <button 
            onClick={() => showAllWorks && onShowAllWorks ? onShowAllWorks() : scrollToSection('hero')}
            className="text-2xl font-bold gradient-text hover:opacity-80 transition-opacity"
          >
            LONG
          </button>

          <div className="hidden md:flex items-center gap-8">
            {!showAllWorks && navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-gray-300 hover:text-white relative group"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 transition-all duration-300 group-hover:w-full"></span>
              </button>
            ))}
            {!showAllWorks && onShowAllWorks && (
              <button
                onClick={onShowAllWorks}
                className="px-6 py-2 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white text-sm font-medium rounded-xl hover:opacity-90 transition-all duration-300"
              >
                所有作品
              </button>
            )}
            {showAllWorks && onShowAllWorks && (
              <button
                onClick={onShowAllWorks}
                className="px-6 py-2 glass-effect text-white text-sm font-medium rounded-xl hover:bg-white/10 transition-all duration-300 flex items-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                返回主页
              </button>
            )}
          </div>

          <button 
            className="md:hidden text-white p-2"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden pb-6 animate-fade-in">
            <div className="flex flex-col gap-4">
              {!showAllWorks && navItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="text-left py-3 text-gray-300 hover:text-white transition-colors"
                >
                  <span className="text-lg font-medium">{item.label}</span>
                </button>
              ))}
              {!showAllWorks && onShowAllWorks && (
                <button
                  onClick={onShowAllWorks}
                  className="text-left py-3 gradient-text text-lg font-medium"
                >
                  所有作品
                </button>
              )}
              {showAllWorks && onShowAllWorks && (
                <button
                  onClick={onShowAllWorks}
                  className="text-left py-3 text-gray-300 hover:text-white transition-colors flex items-center gap-2"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  返回主页
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
