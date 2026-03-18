import React, { useEffect, useState } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Video from './components/Video';
import Photography from './components/Photography';
import Hobbies from './components/Hobbies';
import WorksUpload from './components/WorksUpload';
import AllWorks from './components/AllWorks';
import Footer from './components/Footer';
import Guestbook from './components/Guestbook';
import AuthModal from './components/AuthModal';
import { api } from './services/api';

interface MediaItem {
  id: number;
  title: string;
  type: 'image' | 'video';
  url: string;
  category: string;
  description?: string;
  createdAt: string;
}

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
}

const App: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [showAllWorks, setShowAllWorks] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  useEffect(() => {
    const loadItems = async () => {
      const items = await api.getMediaItems();
      setMediaItems(items);
    };
    loadItems();
    
    api.addLog({ type: 'visit' }).catch(() => {});
    
    const savedToken = localStorage.getItem('user_token');
    const savedUser = localStorage.getItem('user_info');
    if (savedToken && savedUser) {
      setUserToken(savedToken);
      setCurrentUser(JSON.parse(savedUser));
    }
  }, []);

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
  }, [mediaItems, showAllWorks, currentUser]);

  const addMediaItem = async (item: MediaItem) => {
    await api.addMediaItem(item);
    setMediaItems([...mediaItems, item]);
  };

  const deleteMediaItem = async (id: number) => {
    await api.deleteMediaItem(id);
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

  const importMediaItems = async (items: MediaItem[]) => {
    for (const item of items) {
      await api.addMediaItem(item);
    }
    setMediaItems(prev => [...prev, ...items]);
  };

  const handleLoginSuccess = (user: User, token: string) => {
    setCurrentUser(user);
    setUserToken(token);
    setShowAuthModal(false);
    
    api.addLog({
      type: 'login',
      userId: user.id,
      userName: user.name,
    }).catch(() => {});
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
          <Guestbook 
            currentUser={currentUser}
            userToken={userToken}
            onLoginClick={() => setShowAuthModal(true)}
          />
          <WorksUpload onUpload={addMediaItem} mediaCount={mediaItems.length} mediaItems={mediaItems} onExport={exportMediaItems} onImport={importMediaItems} />
        </main>
        <Footer />
      </div>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        onLoginSuccess={handleLoginSuccess}
      />
    </div>
  );
};

export default App;