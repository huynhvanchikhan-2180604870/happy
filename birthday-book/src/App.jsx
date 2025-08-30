import React, { useState, useEffect } from 'react';
import { AnimatePresence } from 'framer-motion';
import { MetadataProvider, useMetadata } from './contexts/MetadataContext';
import LandingPage from './components/LandingPage';
import FlipBook from './components/FlipBook';
import MusicPlayer from './components/MusicPlayer';
import Loading from './components/Loading';

function AppContent() {
  const { loading } = useMetadata();
  const [showBook, setShowBook] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Simulate initial loading
    const timer = setTimeout(() => {
      setIsReady(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (loading || !isReady) {
    return <Loading />;
  }

  return (
    <>
      <AnimatePresence mode="wait">
        {!showBook ? (
          <LandingPage key="landing" onOpen={() => setShowBook(true)} />
        ) : (
          <FlipBook key="book" onClose={() => setShowBook(false)} />
        )}
      </AnimatePresence>
      
      {/* Music Player is always rendered but hidden initially */}
      <MusicPlayer />
    </>
  );
}

function App() {
  return (
    <MetadataProvider>
      <AppContent />
    </MetadataProvider>
  );
}

export default App;