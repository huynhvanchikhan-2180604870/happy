import React from 'react';
import { motion } from 'framer-motion';
import { Heart } from 'lucide-react';

const Loading = () => {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-romantic-pink/20 via-romantic-lavender/20 to-romantic-rose/20">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <motion.div
          animate={{ 
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360]
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="inline-block"
        >
          <Heart className="text-romantic-pink" size={64} fill="currentColor" />
        </motion.div>
        
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-6 font-handwriting text-2xl text-romantic-pink"
        >
          Đang chuẩn bị món quà...
        </motion.p>

        <div className="mt-4 flex justify-center gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              animate={{ 
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{ 
                duration: 1.5,
                repeat: Infinity,
                delay: i * 0.2
              }}
              className="w-2 h-2 bg-romantic-pink rounded-full"
            />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default Loading;