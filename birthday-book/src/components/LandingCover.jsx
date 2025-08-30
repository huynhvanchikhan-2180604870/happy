import { motion } from "framer-motion";
import { Heart, Music, Star } from "lucide-react";
import React from "react";
import { useMetadata } from "../contexts/MetadataContext";

const LandingCover = ({ onOpenBook }) => {
  const { metadata } = useMetadata();

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen animated-gradient flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="relative max-w-md w-full"
      >
        {/* Main Card with Liquid Glass */}
        <div className="liquid-glass rounded-3xl p-8 shadow-2xl border border-white/30 relative overflow-hidden hover-lift">
          {/* Background decoration */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent" />

          {/* Content */}
          <div className="relative z-10 text-center">
            {/* Star decoration */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2 sparkle"
            >
              <Star
                className="text-romantic-gold"
                size={24}
                fill="currentColor"
              />
            </motion.div>

            {/* Main title */}
            <motion.h1
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="font-serif text-3xl md:text-4xl font-bold text-gradient mb-4 fade-in"
            >
              Happy Birthday
            </motion.h1>

            {/* Subtitle */}
            <motion.p
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-romantic-pink font-handwriting text-xl mb-6 slide-in-left"
            >
              {metadata?.girlfriendName || "Em Yêu"}
            </motion.p>

            {/* Age and Date */}
            <motion.div
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-1 mb-4 slide-in-right"
            >
              <p className="text-gray-700 font-medium text-base">
                {metadata?.age || 22} tuổi
              </p>
              <p className="text-gray-600 text-sm">
                {formatDate(metadata?.birthdayDate) || "01/09/2025"}
              </p>
            </motion.div>

            {/* Open Book Button */}
            <motion.button
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenBook}
              className="w-full bg-gradient-to-r from-romantic-pink/30 to-romantic-lavender/30 hover:from-romantic-pink/40 hover:to-romantic-lavender/40 rounded-2xl p-4 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-300 group backdrop-blur-sm hover-glow scale-in"
            >
              <div className="flex items-center justify-center gap-3">
                <Heart
                  className="text-romantic-pink group-hover:scale-110 transition-transform heart-pulse"
                  size={18}
                />
                <span className="font-medium text-gray-700 text-lg">
                  Mở sách
                </span>
                <Heart
                  className="text-romantic-pink group-hover:scale-110 transition-transform heart-pulse"
                  size={18}
                />
              </div>
            </motion.button>

            {/* Bottom decoration */}
            <div className="mt-3 flex items-center justify-center gap-3 text-gray-400/60">
              <Music size={14} className="float-delay-1" />
              <Heart size={14} className="heart-pulse" />
              <Star size={14} className="sparkle" />
            </div>
          </div>
        </div>

        {/* Floating hearts animation */}
        <motion.div
          animate={{
            y: [0, -20, 0],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -top-4 -left-4 text-romantic-pink/30 float"
        >
          <Heart size={20} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -15, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
          className="absolute -bottom-2 -right-2 text-romantic-rose/30 float-delay-2"
        >
          <Heart size={16} />
        </motion.div>

        {/* Additional floating elements */}
        <motion.div
          animate={{
            y: [0, -10, 0],
            x: [0, 5, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
          className="absolute top-1/2 -left-8 text-romantic-gold/30 wave"
        >
          <Star size={12} />
        </motion.div>

        <motion.div
          animate={{
            y: [0, -8, 0],
            x: [0, -3, 0],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{
            duration: 3.5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1.5,
          }}
          className="absolute bottom-1/3 -right-6 text-romantic-lavender/30 bounce-gentle"
        >
          <Heart size={14} />
        </motion.div>
      </motion.div>
    </div>
  );
};

export default LandingCover;
