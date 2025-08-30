import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Heart,
  RotateCcw,
  X,
} from "lucide-react";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import HTMLFlipBook from "react-pageflip";
import { useMetadata } from "../contexts/MetadataContext";

// Individual page component
const Page = forwardRef(({ children, pageNumber }, ref) => {
  return (
    <div
      ref={ref}
      className="page-content h-full w-full bg-white relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-romantic-cream/50 to-white" />
      <div className="relative z-10 h-full p-6 md:p-8">{children}</div>
      <div className="absolute bottom-4 right-4 text-xs text-gray-400">
        {pageNumber}
      </div>
    </div>
  );
});

Page.displayName = "Page";

const FlipBook = ({ onClose }) => {
  const { metadata } = useMetadata();
  const flipBookRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [showSwipeHint, setShowSwipeHint] = useState(true);
  const [showLandscapeHint, setShowLandscapeHint] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Split greeting message into pages (max 3 paragraphs per page)
  const splitMessageIntoPages = (message) => {
    if (!message || !Array.isArray(message)) return [];

    const pages = [];
    const paragraphsPerPage = 3;

    for (let i = 0; i < message.length; i += paragraphsPerPage) {
      pages.push(message.slice(i, i + paragraphsPerPage));
    }

    return pages;
  };

  // Split letter content into pages (max 2 paragraphs per page for better readability)
  const splitLetterIntoPages = (letterContent) => {
    if (!letterContent || !Array.isArray(letterContent)) return [];

    const pages = [];
    const paragraphsPerPage = 2; // Shorter for letter content

    for (let i = 0; i < letterContent.length; i += paragraphsPerPage) {
      pages.push(letterContent.slice(i, i + paragraphsPerPage));
    }

    return pages;
  };

  const greeting = metadata?.greeting?.vi || metadata?.greeting?.en || {};

  // Letter content for the final pages
  const letterContent = [
    "Có lẽ vì chúng ta mải mê sống trong từng giây phút, mải mê nắm tay nhau đi qua bao câu chuyện, mà quên mất lưu giữ lại bằng một tấm hình.",
  ];

  const messagePages = splitMessageIntoPages(greeting.message);
  const letterPages = splitLetterIntoPages(letterContent);
  const totalPages = 2 + messagePages.length + 2 + letterPages.length + 2; // Cover + Message pages + Photo pages + Letter pages + Header + Ending + Final

  // Check screen size and orientation
  useEffect(() => {
    const checkScreenSize = () => {
      const isSmallScreen = window.innerWidth < 768;
      const isLandscape = window.innerWidth > window.innerHeight;
      setIsMobile(isSmallScreen);

      // Show landscape hint for small screens in portrait mode
      if (isSmallScreen && !isLandscape && window.innerWidth < 500) {
        setShowLandscapeHint(true);
      } else {
        setShowLandscapeHint(false);
      }
    };

    checkScreenSize();
    window.addEventListener("resize", checkScreenSize);
    window.addEventListener("orientationchange", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
      window.removeEventListener("orientationchange", checkScreenSize);
    };
  }, []);

  const handlePageFlip = useCallback(
    (e) => {
      setCurrentPage(e.data);

      // Hide swipe hint after first page flip
      if (showSwipeHint) {
        setShowSwipeHint(false);
      }
    },
    [showSwipeHint]
  );

  return (
    <div className="fixed inset-0 z-50 animated-gradient backdrop-blur-sm">
      {/* Enhanced Close button with Liquid Glass */}
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
        className="absolute top-6 right-6 z-50 p-3 liquid-glass rounded-full text-gray-700 hover:text-romantic-pink transition-all duration-300 shadow-lg hover-glow"
      >
        <X size={24} />
      </motion.button>

      {/* Landscape Hint for small screens */}
      <AnimatePresence>
        {showLandscapeHint && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className=" absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="liquid-glass rounded-2xl p-6 text-center shadow-2xl border border-white/30 max-w-sm mx-4">
              <RotateCcw
                className="mx-auto mb-4 text-romantic-pink"
                size={48}
              />
              <h3 className="text-lg font-medium text-gray-700 mb-2">
                Quay ngang để xem tốt hơn
              </h3>
              <p className="text-sm text-gray-600">
                Giao diện sẽ đẹp hơn khi quay ngang điện thoại
              </p>
              <button
                onClick={() => setShowLandscapeHint(false)}
                className="mt-4 px-4 py-2 bg-romantic-pink/20 hover:bg-romantic-pink/30 rounded-lg text-sm transition-colors"
              >
                Đã hiểu
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Swipe Hint - Enhanced Liquid Glass */}
      <AnimatePresence>
        {showSwipeHint && currentPage === 0 && !showLandscapeHint && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-1/2 transform -translate-x-1/2 z-40"
          >
            <div className="liquid-glass rounded-2xl px-6 py-4 shadow-2xl border border-white/30">
              <div className="flex items-center gap-4 text-gray-700">
                <ArrowLeft
                  className="text-romantic-pink"
                  size={isMobile ? 28 : 20}
                />
                <span
                  className={`font-medium ${isMobile ? "text-lg" : "text-sm"}`}
                >
                  Vuốt để lật trang
                </span>
                <ArrowRight
                  className="text-romantic-pink"
                  size={isMobile ? 28 : 20}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Running Text Animation - "Anh yêu em" */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, duration: 1 }}
        className="absolute top-8 left-8 z-30 hidden md:block"
      >
        <div className="relative">
          {/* Text container with staggered layout */}
          <div className="flex flex-col items-start space-y-1">
            {/* First line: "Anh" */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: [0, 1, 1, 0],
                x: [0, 0, 0, 0],
              }}
              transition={{
                duration: 6,
                delay: 2.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="flex items-center"
            >
              <motion.span
                animate={{
                  color: ["#FF69B4", "#FF1493", "#FFB6C1", "#FF69B4"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
                className="text-xl font-bold font-handwriting"
              >
                Anh
              </motion.span>
            </motion.div>

            {/* Second line: "Yêu em!!" */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: [0, 0, 1, 1, 0, 0],
                x: [0, 0, 0, 0, 0, 0],
              }}
              transition={{
                duration: 6,
                delay: 3.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="flex items-center"
            >
              <motion.span
                animate={{
                  color: ["#E6E6FA", "#9370DB", "#8A2BE2", "#E6E6FA"],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 0.5,
                }}
                className="text-lg font-bold font-handwriting"
              >
                Yêu em!!
              </motion.span>
            </motion.div>

            {/* Third line: "Trái tim" */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{
                opacity: [0, 0, 0, 1, 1, 0],
                x: [0, 0, 0, 0, 0, 0],
              }}
              transition={{
                duration: 6,
                delay: 4.5,
                repeat: Infinity,
                repeatDelay: 2,
              }}
              className="flex items-center"
            ></motion.div>
          </div>

          {/* Floating hearts around text */}
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={`text-heart-${i}`}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 0.7, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 80],
                y: [0, -60 - Math.random() * 40],
              }}
              transition={{
                duration: 4,
                delay: 5 + i * 0.3,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute top-0 left-0"
            >
              <div
                className={`text-xs ${
                  i % 3 === 0
                    ? "text-romantic-pink"
                    : i % 3 === 1
                    ? "text-romantic-rose"
                    : "text-romantic-gold"
                }`}
              >
                {i % 2 === 0 ? "💖" : "💕"}
              </div>
            </motion.div>
          ))}

          {/* Background glow effect */}
          <motion.div
            animate={{
              opacity: [0.2, 0.4, 0.2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-romantic-pink/15 via-romantic-lavender/15 to-romantic-gold/15 rounded-lg blur-sm -z-10"
          />
        </div>
      </motion.div>

      {/* Love Animation in bottom left */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1, duration: 0.8 }}
        className="absolute bottom-8 left-8 z-30 hidden md:block"
      >
        <div className="relative">
          {/* Main Love Heart */}
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
              rotate: [0, 5, -5, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative"
          >
            <div className="text-6xl text-romantic-pink drop-shadow-lg">💖</div>

            {/* Sparkle effects around the heart */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0 }}
                animate={{
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0],
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.3,
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
                className="absolute text-yellow-300 text-lg"
                style={{
                  left: `${Math.cos((i * 60 * Math.PI) / 180) * 40}px`,
                  top: `${Math.sin((i * 60 * Math.PI) / 180) * 40}px`,
                }}
              >
                ✨
              </motion.div>
            ))}
          </motion.div>

          {/* Floating love bubbles */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={`bubble-${i}`}
              initial={{
                opacity: 0,
                scale: 0,
                x: 0,
                y: 0,
              }}
              animate={{
                opacity: [0, 0.8, 0],
                scale: [0, 1, 0],
                x: [0, (Math.random() - 0.5) * 200],
                y: [0, -150 - Math.random() * 100],
              }}
              transition={{
                duration: 4,
                delay: i * 0.4,
                repeat: Infinity,
                repeatDelay: 3,
              }}
              className="absolute top-0 left-1/2 transform -translate-x-1/2"
            >
              <div
                className={`text-lg ${
                  i % 3 === 0
                    ? "text-romantic-pink"
                    : i % 3 === 1
                    ? "text-romantic-rose"
                    : "text-romantic-gold"
                }`}
              >
                {i % 2 === 0 ? "💕" : "💖"}
              </div>
            </motion.div>
          ))}

          {/* Love text animation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: [0, 1, 0], y: [20, 0, -10] }}
            transition={{
              duration: 3,
              delay: 2,
              repeat: Infinity,
              repeatDelay: 2,
            }}
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap"
          >
            <span className="text-xs font-handwriting text-romantic-pink bg-white/20 px-2 py-1 rounded-full backdrop-blur-sm">
              Yêu em ❤️
            </span>
          </motion.div>
        </div>
      </motion.div>

      {/* Flipbook container - Improved for mobile */}
      <div className="h-full w-full flex items-center justify-center p-2 md:p-4 pt-5 pb-5">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className={`relative flex items-center justify-center ${
            isMobile
              ? "w-full h-full max-w-none max-h-none"
              : "max-w-6xl w-full h-full max-h-[90vh]"
          }`}
        >
          {/* Enhanced Flipbook with responsive sizing */}
          <HTMLFlipBook
            ref={flipBookRef}
            width={isMobile ? Math.min(window.innerWidth - 64, 320) : 280}
            height={isMobile ? Math.min(window.innerHeight - 240, 480) : 400}
            size="stretch"
            minWidth={isMobile ? 240 : 250}
            maxWidth={isMobile ? 400 : 350}
            minHeight={isMobile ? 300 : 320}
            maxHeight={isMobile ? 600 : 560}
            maxShadowOpacity={0.6}
            showCover={true}
            mobileScrollSupport={true}
            onFlip={handlePageFlip}
            className="flipbook drop-shadow-2xl"
            style={{}}
            startPage={0}
            drawShadow={true}
            flippingTime={1000}
            usePortrait={!isMobile}
            startZIndex={0}
            autoSize={true}
            clickEventForward={false}
            swipeDistance={30}
            showPageCorners={true}
            disableFlipByClick={true}
          >
            {/* Page 1 - Cover (when opened) */}
            <Page pageNumber={1}>
              <div className="h-full flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  <Heart
                    className="mx-auto mb-6 text-romantic-pink animate-pulse"
                    size={isMobile ? 36 : 48}
                    fill="currentColor"
                  />
                  <h1
                    className={`font-serif font-bold text-gradient mb-4 ${
                      isMobile ? "text-2xl" : "text-3xl md:text-4xl"
                    }`}
                  >
                    {greeting.title || "Happy Birthday!"}
                  </h1>
                  <p
                    className={`text-gray-600 font-handwriting ${
                      isMobile ? "text-base" : "text-lg"
                    }`}
                  >
                    {greeting.subtitle}
                  </p>
                </motion.div>
              </div>
            </Page>

            {/* Dynamic Message Pages */}
            {messagePages.map((pageParagraphs, pageIndex) => (
              <Page key={`message-${pageIndex}`} pageNumber={2 + pageIndex}>
                <div className="h-full flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    {pageParagraphs.map((paragraph, index) => {
                      const globalIndex = pageIndex * 3 + index;
                      const isFirstParagraph = globalIndex === 0;
                      const isLastParagraph =
                        globalIndex === (greeting.message?.length || 0) - 1;

                      return (
                        <motion.p
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.1 * index }}
                          className={`
                          ${
                            isFirstParagraph
                              ? `font-handwriting text-romantic-pink ${
                                  isMobile ? "text-lg" : "text-xl"
                                }`
                              : ""
                          }
                          ${
                            isLastParagraph
                              ? `font-handwriting text-romantic-rose mt-6 ${
                                  isMobile ? "text-base" : "text-lg"
                                }`
                              : ""
                          }
                          ${
                            !isFirstParagraph && !isLastParagraph
                              ? `text-gray-700 leading-relaxed ${
                                  isMobile ? "text-sm" : ""
                                }`
                              : ""
                          }
                        `}
                        >
                          {paragraph}
                        </motion.p>
                      );
                    })}
                  </motion.div>
                </div>
              </Page>
            ))}

            {/* Photo Gallery 1 */}
            <Page pageNumber={2 + messagePages.length}>
              <div className="h-full">
                <h2
                  className={`font-serif text-center mb-6 text-gradient ${
                    isMobile ? "text-xl" : "text-2xl"
                  }`}
                >
                  Kỷ Niệm Của Chúng Ta
                </h2>
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {metadata?.photos?.slice(0, 4).map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedPhoto(photo)}
                      className="cursor-pointer"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden liquid-glass p-2 shadow-lg">
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-romantic-pink/20 to-romantic-lavender/20 rounded flex items-center justify-center hidden">
                          <div className="text-center p-2">
                            <Heart
                              className="mx-auto mb-2 text-romantic-pink/50"
                              size={isMobile ? 24 : 32}
                            />
                            <p
                              className={`text-gray-600 ${
                                isMobile ? "text-xs" : "text-xs"
                              }`}
                            >
                              {photo.caption}
                            </p>
                            <p
                              className={`text-gray-400 mt-1 flex items-center justify-center gap-1 ${
                                isMobile ? "text-xs" : "text-xs"
                              }`}
                            >
                              <Calendar size={isMobile ? 8 : 10} />
                              {photo.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Page>

            {/* Photo Gallery 2 */}
            <Page pageNumber={3 + messagePages.length}>
              <div className="h-full">
                <div className="grid grid-cols-2 gap-3 md:gap-4">
                  {metadata?.photos?.slice(4, 8).map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.1 * index }}
                      whileHover={{ scale: 1.05 }}
                      onClick={() => setSelectedPhoto(photo)}
                      className="cursor-pointer"
                    >
                      <div className="aspect-square rounded-lg overflow-hidden liquid-glass p-2 shadow-lg">
                        <img
                          src={photo.src}
                          alt={photo.caption}
                          className="w-full h-full object-cover rounded"
                          onError={(e) => {
                            e.target.style.display = "none";
                            e.target.nextSibling.style.display = "flex";
                          }}
                        />
                        <div className="w-full h-full bg-gradient-to-br from-romantic-rose/20 to-romantic-gold/20 rounded flex items-center justify-center hidden">
                          <div className="text-center p-2">
                            <Heart
                              className="mx-auto mb-2 text-romantic-rose/50"
                              size={isMobile ? 24 : 32}
                            />
                            <p
                              className={`text-gray-600 ${
                                isMobile ? "text-xs" : "text-xs"
                              }`}
                            >
                              {photo.caption}
                            </p>
                            <p
                              className={`text-gray-400 mt-1 flex items-center justify-center gap-1 ${
                                isMobile ? "text-xs" : "text-xs"
                              }`}
                            >
                              <Calendar size={isMobile ? 8 : 10} />
                              {photo.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </Page>

            {/* Letter Content Pages */}
            {letterPages.map((pageParagraphs, pageIndex) => (
              <Page
                key={`letter-${pageIndex}`}
                pageNumber={4 + messagePages.length + 2 + pageIndex}
              >
                <div className="h-full flex flex-col justify-center">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="space-y-4"
                  >
                    {pageParagraphs.map((paragraph, index) => (
                      <motion.p
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 * index }}
                        className="text-gray-700 leading-relaxed text-sm"
                      >
                        {paragraph}
                      </motion.p>
                    ))}
                  </motion.div>
                </div>
              </Page>
            ))}

            {/* Final Message */}
            <Page pageNumber={4 + messagePages.length + 2 + letterPages.length}>
              <div className="h-full flex flex-col items-center justify-center text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.8 }}
                >
                  <div className="relative">
                    <Heart
                      className="text-romantic-pink animate-pulse"
                      size={isMobile ? 60 : 80}
                      fill="currentColor"
                    />
                    <Heart
                      className="absolute inset-0 text-romantic-pink animate-ping"
                      size={isMobile ? 60 : 80}
                      fill="currentColor"
                    />
                  </div>
                </motion.div>
                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className={`font-handwriting text-romantic-pink mt-8 glow ${
                    isMobile ? "text-2xl" : "text-3xl"
                  }`}
                >
                  Yêu Em Mãi Mãi
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className={`text-gray-600 mt-4 ${isMobile ? "text-sm" : ""}`}
                >
                  {metadata?.girlfriendName} ❤️ Forever
                </motion.p>
              </div>
            </Page>
          </HTMLFlipBook>
        </motion.div>
      </div>

      {/* Enhanced Photo Lightbox with Liquid Glass and Close Button */}
      <AnimatePresence>
        {selectedPhoto && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedPhoto(null)}
            className="fixed inset-0 z-[60] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              onClick={(e) => e.stopPropagation()}
              className="max-w-2xl w-full relative"
            >
              {/* Close button for lightbox */}
              <button
                onClick={() => setSelectedPhoto(null)}
                className="absolute -top-4 -right-4 z-10 p-2 liquid-glass rounded-full text-gray-700 hover:text-romantic-pink transition-all duration-300 shadow-lg"
              >
                <X size={20} />
              </button>

              <div className="liquid-glass rounded-2xl p-6 shadow-2xl border border-white/30">
                <div className="aspect-video rounded-lg overflow-hidden bg-gradient-to-br from-romantic-pink/20 to-romantic-lavender/20">
                  <img
                    src={selectedPhoto.src}
                    alt={selectedPhoto.caption}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                  <div className="w-full h-full bg-gradient-to-br from-romantic-pink/20 to-romantic-lavender/20 flex items-center justify-center hidden">
                    <div className="text-center p-8">
                      <Heart
                        className="mx-auto mb-4 text-romantic-pink"
                        size={64}
                        fill="currentColor"
                      />
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
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FlipBook;
