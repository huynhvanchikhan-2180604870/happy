import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Sparkles, Gift, Music } from 'lucide-react';
import { useMetadata } from '../contexts/MetadataContext';
import { format } from 'date-fns';
import { vi } from 'date-fns/locale';

const LandingPage = ({ onOpen }) => {
  const { metadata } = useMetadata();
  const [isHovered, setIsHovered] = useState(false);
  const [tapCount, setTapCount] = useState(0);
  const [showEasterEgg, setShowEasterEgg] = useState(false);

  useEffect(() => {
    if (metadata?.easterEggs?.enabled && tapCount >= (metadata.easterEggs.tapCount || 7)) {
      setShowEasterEgg(true);
      setTimeout(() => {
        setShowEasterEgg(false);
        setTapCount(0);
      }, 3000);
    }
  }, [tapCount, metadata]);

  const handleTap = () => {
    setTapCount(prev => prev + 1);
    // Reset tap count after 2 seconds of no tapping
    setTimeout(() => setTapCount(0), 2000);
  };

  const birthdayDate = metadata ? new Date(metadata.birthdayDate) : new Date('2025-09-01');
  const formattedDate = format(birthdayDate, 'dd/MM/yyyy', { locale: vi });

  return (
    <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-romantic-pink/20 via-romantic-lavender/20 to-romantic-rose/20">
      {/* Animated background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        
        {/* Floating particles */}
        {metadata?.particles?.enabled && Array.from({ length: metadata.particles.count || 15 }).map((_, i) => (
          <motion.div
            key={i}
            className="absolute"
            initial={{
              x: Math.random() * window.innerWidth,
              y: window.innerHeight + 50,
            }}
            animate={{
              y: -50,
              x: Math.random() * window.innerWidth,
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5,
            }}
          >
            <Heart 
              className="text-romantic-pink/30" 
              size={Math.random() * 20 + 10}
              fill="currentColor"
            />
          </motion.div>
        ))}
      </div>

      {/* Main content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-full max-w-md"
          onClick={handleTap}
        >
          {/* Book cover */}
          <motion.div
            className="relative aspect-[3/4] max-h-[80vh] mx-auto"
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300 }}
            onHoverStart={() => setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
          >
            {/* Glass morphism book cover */}
            <div className="absolute inset-0 liquid-glass rounded-2xl overflow-hidden">
              {/* Shimmer effect */}
              <div className="absolute inset-0 shimmer opacity-30" />
              
              {/* Book spine effect */}
              <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-black/10 to-transparent" />
              
              {/* Content */}
              <div className="relative h-full flex flex-col items-center justify-center p-8 text-center">
                {/* Decorative elements */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                  className="absolute top-8 right-8"
                >
                  <Sparkles className="text-romantic-gold/50" size={32} />
                </motion.div>
                
                <motion.div
                  animate={{ rotate: -360 }}
                  transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
                  className="absolute bottom-8 left-8"
                >
                  <Gift className="text-romantic-rose/50" size={32} />
                </motion.div>

                {/* Title */}
                <motion.div
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                >
                  <h1 className="font-serif text-4xl md:text-5xl font-bold text-gradient mb-4">
                    Happy Birthday
                  </h1>
                  <h2 className="font-handwriting text-3xl md:text-4xl text-romantic-pink glow">
                    {metadata?.girlfriendName || 'Em Yêu'}
                  </h2>
                </motion.div>

                {/* Date and age */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.6 }}
                  className="mt-8 space-y-2"
                >
                  <p className="text-2xl font-serif text-gray-700">
                    {metadata?.age || 22} tuổi
                  </p>
                  <p className="text-lg text-gray-600">
                    {formattedDate}
                  </p>
                </motion.div>

                {/* CTA Button */}
                <motion.button
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.6 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onOpen}
                  className="mt-12 px-8 py-4 liquid-glass rounded-full font-medium text-gray-700 hover:text-romantic-pink transition-colors no-tap-highlight"
                >
                  <span className="flex items-center gap-2">
                    <Heart className="animate-pulse" size={20} />
                    Mở sách
                    <Heart className="animate-pulse" size={20} />
                  </span>
                </motion.button>

                {/* Music indicator */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.6 }}
                  transition={{ delay: 1, duration: 0.6 }}
                  className="absolute bottom-4 right-4"
                >
                  <Music className="text-gray-500" size={20} />
                </motion.div>
              </div>
            </div>

            {/* Hover effect glow */}
            <AnimatePresence>
              {isHovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 rounded-2xl"
                  style={{
                    boxShadow: '0 0 60px rgba(255, 182, 193, 0.4)',
                    pointerEvents: 'none',
                  }}
                />
              )}
            </AnimatePresence>
          </motion.div>

          {/* Tap instruction for mobile */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.6 }}
            transition={{ delay: 1.2, duration: 0.6 }}
            className="text-center mt-8 text-sm text-gray-600"
          >
            Chạm để mở ✨
          </motion.p>
        </motion.div>
      </div>

      {/* Easter egg message */}
      <AnimatePresence>
        {showEasterEgg && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.5, y: -50 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="liquid-glass rounded-2xl p-6 text-center">
              <h3 className="text-2xl font-handwriting text-romantic-pink glow">
                {metadata?.easterEggs?.message || 'Anh yêu em ❤️'}
              </h3>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LandingPage;