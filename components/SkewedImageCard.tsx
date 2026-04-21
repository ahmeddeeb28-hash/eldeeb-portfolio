import React from 'react';
import { motion } from 'motion/react';

interface SkewedImageCardProps {
  src: string;
  rotation?: number;
  scale?: number;
  zIndex?: number;
  translateY?: number;
  delay?: number;
}

/**
 * SkewedImageCard Component
 * Now updated with high-end motion animations and hover effects.
 */
export function SkewedImageCard({ 
  src, 
  rotation = 0, 
  scale = 1, 
  zIndex = 1,
  translateY = 0,
  delay = 0
}: SkewedImageCardProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 100, rotateY: rotation * 0.5, scale: scale * 0.9 }}
      animate={{ opacity: 1, y: translateY, rotateY: rotation, scale: scale }}
      transition={{ 
        delay, 
        duration: 1.2, 
        ease: [0.22, 1, 0.36, 1] 
      }}
      whileHover={{ 
        scale: scale * 1.05,
        y: translateY - 20,
        zIndex: 50,
        transition: { duration: 0.4, ease: "easeOut" }
      }}
      className="relative shrink-0 overflow-hidden rounded-[32px] bg-[#121212] cursor-pointer"
      style={{
        width: '320px',
        height: '420px',
        transformStyle: 'preserve-3d',
        perspective: '1200px',
        zIndex: zIndex,
        border: '1px solid rgba(255, 255, 255, 0.08)',
        boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.6), inset 0 0 0 1px rgba(255, 255, 255, 0.05)',
      }}
    >
      <img
        src={src}
        alt="Visual work sample"
        className="h-full w-full object-cover"
      />
      {/* Subtle glass reflection overlay */}
      <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none opacity-50" />
    </motion.div>
  );
}