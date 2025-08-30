import React, { useRef, useState, forwardRef, useCallback } from 'react';
import HTMLFlipBook from 'react-pageflip';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, X, Heart, Calendar, MapPin } from 'lucide-react';
import { useMetadata } from '../contexts/MetadataContext';

// Individual page component
const Page = forwardRef(({ children, pageNumber }, ref) => {
  return (
    <div ref={ref} className="page-content h-full w-full bg-white relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-romantic-cream/50 to-white" />
      <div className="relative z-10 h-full p-6 md:p-8">
        {children}
      </div>
      <div className="absolute bottom-4 right-4 text-xs text-gray-400">
        {pageNumber}
      </div>
    </div>
  );
});

Page.displayName = 'Page';

const FlipBook = ({ onClose }) => {
  const { metadata } = useMetadata();
  const flipBookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isFlipping, setIsFlipping] = useState(false);

  const greeting = metadata?.greeting?.vi || metadata?.greeting?.en || {};
  const photos = metadata?.photos || [];

  const handlePageFlip = useCallback((e) => {
    setCurrentPage(e.data);
    setIsFlipping(true);
    setTimeout(() => setIsFlipping(false), 600);
  }, []);

  const nextPage = () => {
    flipBookRef.current?.pageFlip?.flipNext();
  };

  const prevPage = () => {
    flipBookRef.current?.pageFlip?.flipPrev();
  };

  const totalPages = 5; // Cover + Greeting + Photos pages

  return (
    <div className="fixed inset-0 z-50 bg-gradient-to-br from-romantic-pink/30 via-romantic-lavender/30 to-romantic-rose/30">
      {/* Close button */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 liquid-glass rounded-full text-gray-700 hover:text-romantic-pink transition-colors"
      >
        <X size={24} />
      </motion.button>

      {/* Flipbook container */}
      <div className="h-full w-full flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="relative max-w-6xl w-full h-full max-h-[90vh] flex items-center justify-center"
        >
          {/* Navigation buttons for mobile */}
          <button
            onClick={prevPage}
            className={`absolute left-2 z-40 p-3 liquid-glass rounded-full transition-all ${
              currentPage === 0 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
            } md:hidden`}
            disabled={currentPage === 0}
          >
            <ChevronLeft size={20} />
          </button>

          <button
            onClick={nextPage}
            className={`absolute right-2 z-40 p-3 liquid-glass rounded-full transition-all ${
              currentPage >= totalPages - 1 ? 'opacity-30 cursor-not-allowed' : 'hover:scale-110'
            } md:hidden`}
            disabled={currentPage >= totalPages - 1}
          >
            <ChevronRight size={20} />
          </button>

          {/* Flipbook */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={350}
            height={500}
            size="stretch"
            minWidth={280}
            maxWidth={500}
            minHeight={400}
            maxHeight={700}
            maxShadowOpacity={0.5}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handlePageFlip}
            className="flipbook"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={true}
            startZIndex={0}
            autoSize={true}
            clickEventForward={true}
            swipeDistance={50}
            showPageCorners={true}
            disableFlipByClick={false}
          >
            {/* Page 1 - Cover (when opened) */}
            <Page pageNumber={1}>
              <div className="h-full flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart className="mx-auto mb-6 text-romantic-pink animate-pulse" size={48} fill="currentColor" />
                  <h1 className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-4">
                    {greeting.title || 'Happy Birthday!'}
                  </h1>
                  <p className="text-lg text-gray-600 font-handwriting">
                    {greeting.subtitle}
                  </p>
                </motion.div>
              </div>
            </Page>

            {/* Page 2 - Greeting Message */}
            <Page pageNumber={2}>
              <div className="h-full flex flex-col justify-center">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3 }}
                  className="space-y-4"
                >
                  {greeting.message && greeting.message.map((paragraph, index) => (
                    <motion.p
                      key={index}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 * index }}
                      className={`
                        ${index === 0 ? 'font-handwriting text-xl text-romantic-pink' : ''}
                        ${index === greeting.message.length - 1 ? 'font-handwriting text-lg text-romantic-rose mt-6' : ''}
                        ${index !== 0 && index !== greeting.message.length - 1 ? 'text-gray-700 leading-relaxed' : ''}
                      `}
                    >
                      {paragraph}
                    </motion.p>
                  ))}
                </motion.div>
              </div>
            </Page>

            {/* Page 3 - Photo Gallery 1 */}
            <Page pageNumber={3}>
              <div className="h-full">
                <h2 className="font-serif text-2xl text-center mb-6 text-gradient">
                  Kỷ Niệm Của Chúng Ta
                </h2>
                <div className="grid grid-cols-2 gap-4">
                  {photos.slice(0, 4).map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedPhoto(photo)}
                      className="cursor-pointer"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden liquid-glass p-2">
                        <div className="w-full h-full bg-gradient-to-br from-romantic-pink/20 to-romantic-lavender/20 rounded flex items-center justify-center">
                          <div className="text-center p-2">
                            <Heart className="mx-auto mb-2 text-romantic-pink/50" size={32} />
                            <p className="text-xs text-gray-600">{photo.caption}</p>
                            {photo.date && (
                              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                                <Calendar size={10} />
                                {photo.date}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Page>

            {/* Page 4 - Photo Gallery 2 */}
            <Page pageNumber={4}>
              <div className="h-full">
                <div className="grid grid-cols-2 gap-4">
                  {photos.slice(4, 8).map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedPhoto(photo)}
                      className="cursor-pointer"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden liquid-glass p-2">
                        <div className="w-full h-full bg-gradient-to-br from-romantic-rose/20 to-romantic-gold/20 rounded flex items-center justify-center">
                          <div className="text-center p-2">
                            <Heart className="mx-auto mb-2 text-romantic-rose/50" size={32} />
                            <p className="text-xs text-gray-600">{photo.caption}</p>
                            {photo.date && (
                              <p className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                                <Calendar size={10} />
                                {photo.date}
                              </p>
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Page>

            {/* Page 5 - Final Message */}
            <Page pageNumber={5}>
              <div className="h-full flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <div className="relative">
                    <Heart className="text-romantic-pink animate-pulse" size={80} fill="currentColor" />
                    <Heart className="absolute inset-0 text-romantic-pink animate-ping" size={80} fill="currentColor" />
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="font-handwriting text-3xl text-romantic-pink mt-8 glow"
                >
                  Yêu Em Mãi Mãi
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-gray-600 mt-4"
                >
                  {metadata?.girlfriendName} ❤️ Forever
                </motion.p>
              </div>
            </Page>
          </HTMLFlipBook>
        </motion.div>
      </div>

      {/* Page indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-2">
        {Array.from({ length: totalPages }).map((_, index) => (
          <div
            key={index}
            className={`w-2 h-2 rounded-full transition-all ${
              currentPage === index ? 'bg-romantic-pink w-8' : 'bg-gray-400/50'
            }`}
          />
        ))}
      </div>

      {/* Photo Lightbox */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[60] bg-black/80 flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full"
            >
              <div className="liquid-glass rounded-2xl p-4">
                <div className="aspect-video bg-gradient-to-br from-romantic-pink/20 to-romantic-lavender/20 rounded-lg flex items-center justify-center">
                  <div className="text-center p-8">
                    <Heart className="mx-auto mb-4 text-romantic-pink" size={64} fill="currentColor" />
                    <h3 className="text-xl font-handwriting text-gray-700 mb-2">
                      {selectedPhoto.caption}
                    </h3>
                    {selectedPhoto.date && (
                      <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
                        <Calendar size={14} />
                        {selectedPhoto.date}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlipBook;