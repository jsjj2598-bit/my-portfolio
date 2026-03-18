import React, { useEffect, useState } from 'react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Video from './components/Video';
import Photography from './components/Photography';
import Hobbies from './components/Hobbies';
import WorksUpload from './components/WorksUpload';
import AllWorks from './components/AllWorks';
import Footer from './components/Footer';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
}

const App: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>(() => {
    const saved = localStorage.getItem('mediaItems');
    return saved ? JSON.parse(saved) : [];
  });
  const [showAllWorks, setShowAllWorks] = useState(false);

  useEffect(() => {
    localStorage.setItem('mediaItems', JSON.stringify(mediaItems));
  }, [mediaItems]);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal');
    
    const revealOnScroll = () => {
      const windowHeight = window.innerHeight;
      const revealPoint = 150;
      
      revealElements.forEach((element) => {
        const elementTop = element.getBoundingClientRect().top;
        
        if (elementTop < windowHeight - revealPoint) {
          element.classList.add('active');
        }
      });
    };

    window.addEventListener('scroll', revealOnScroll);
    
    setTimeout(() => {
      revealOnScroll();
    }, 100);
    
    return () => window.removeEventListener('scroll', revealOnScroll);
  }, [mediaItems, showAllWorks]);

  const addMediaItem = (item: MediaItem) => {
    setMediaItems([...mediaItems, item]);
  };

  const deleteMediaItem = (id: number) => {
    setMediaItems(mediaItems.filter(item => item.id !== id));
  };

  const exportMediaItems = () => {
    const dataStr = JSON.stringify(mediaItems, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `portfolio-media-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const importMediaItems = (items: MediaItem[]) => {
    setMediaItems(prev => [...prev, ...items]);
  };

  if (showAllWorks) {
    return (
      <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
        <div className="fixed inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
        </div>
        <div className="relative z-10">
          <Navbar onShowAllWorks={() => setShowAllWorks(false)} showAllWorks={true} />
          <AllWorks 
            mediaItems={mediaItems} 
            onDelete={deleteMediaItem}
            onBack={() => setShowAllWorks(false)}
          />
        </div>
        <SpeedInsights />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-dark-900 text-white overflow-x-hidden">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-600/5 via-purple-600/5 to-pink-600/5 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10">
        <Navbar onShowAllWorks={() => setShowAllWorks(true)} showAllWorks={false} />
        <main>
          <Hero />
          <About />
          <Video />
          <Photography />
          <Hobbies />
          <WorksUpload onUpload={addMediaItem} mediaCount={mediaItems.length} mediaItems={mediaItems} onExport={exportMediaItems} onImport={importMediaItems} />
        </main>
        <Footer />
      </div>
      <SpeedInsights />
    </div>
  );
};

export default App;
