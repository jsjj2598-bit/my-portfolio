import React from 'react';
import Hero from '../components/Hero';
import About from '../components/About';
import Video from '../components/Video';
import Photography from '../components/Photography';
import Footer from '../components/Footer';

const HomePage: React.FC = () => {
  return (
    <>
      <main>
        <Hero />
        <About />
        <Video />
        <Photography />
      </main>
      <Footer />
    </>
  );
};

export default HomePage;
