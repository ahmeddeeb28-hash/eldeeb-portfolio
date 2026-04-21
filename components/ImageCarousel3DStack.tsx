import { useState, useEffect, useRef } from 'react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ImageCarousel3DStackProps {
  images?: string[];
  autoPlay?: boolean;
  duration?: number;
  cardDepth?: number;
  rotationStrength?: number;
}

export function ImageCarousel3DStack({
  images = [],
  autoPlay = true,
  duration = 3000,
  cardDepth = 40,
  rotationStrength = 15
}: ImageCarousel3DStackProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [dragOffset, setDragOffset] = useState(0);
  const autoPlayRef = useRef<NodeJS.Timeout | null>(null);

  // Sample gradient placeholders if no images provided
  const sampleImages = images.length > 0 ? images : [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #30cfd0 0%, #330867 100%)',
    'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)'
  ];

  const totalSlides = sampleImages.length;

  // Auto-play functionality
  useEffect(() => {
    if (autoPlay && !isDragging) {
      autoPlayRef.current = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % totalSlides);
      }, duration);
    }

    return () => {
      if (autoPlayRef.current) {
        clearInterval(autoPlayRef.current);
      }
    };
  }, [autoPlay, duration, totalSlides, isDragging]);

  // Calculate card position and style
  const getCardStyle = (index: number) => {
    const diff = index - activeIndex;
    const absDiff = Math.abs(diff);
    
    // Position calculation
    const baseOffset = diff * 280; // Horizontal spacing
    const depthOffset = absDiff * cardDepth; // Depth effect
    const rotation = diff * rotationStrength; // Rotation
    const scale = diff === 0 ? 1 : Math.max(0.75, 1 - absDiff * 0.15);
    const opacity = diff === 0 ? 1 : Math.max(0.3, 1 - absDiff * 0.25);
    const zIndex = 100 - absDiff;
    const blur = diff === 0 ? 0 : Math.min(absDiff * 2, 4);

    return {
      transform: `translateX(calc(-50% + ${baseOffset}px)) translateZ(${-depthOffset}px) rotateY(${rotation}deg) scale(${scale})`,
      opacity,
      zIndex,
      filter: `blur(${blur}px)`,
      transition: 'all 600ms cubic-bezier(0.34, 1.56, 0.64, 1)'
    };
  };

  // Drag handlers
  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    setStartX(clientX);
  };

  const handleDragMove = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const offset = clientX - startX;
    setDragOffset(offset);
  };

  const handleDragEnd = () => {
    if (!isDragging) return;
    
    if (dragOffset > 100) {
      // Swipe right - go to previous
      setActiveIndex((prev) => (prev - 1 + totalSlides) % totalSlides);
    } else if (dragOffset < -100) {
      // Swipe left - go to next
      setActiveIndex((prev) => (prev + 1) % totalSlides);
    }
    
    setIsDragging(false);
    setDragOffset(0);
  };

  const handleCardClick = (index: number) => {
    if (index !== activeIndex) {
      setActiveIndex(index);
    }
  };

  return (
    <div className="relative w-full" style={{ height: '400px', perspective: '1200px' }}>
      {/* Arc background curve */}
      <div 
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
        style={{
          width: '900px',
          height: '500px',
          border: '1px solid rgba(255, 255, 255, 0.03)',
          borderRadius: '50%',
          opacity: 0.4
        }}
      />

      {/* Carousel container */}
      <div
        className="relative w-full h-full"
        onMouseDown={handleDragStart}
        onMouseMove={handleDragMove}
        onMouseUp={handleDragEnd}
        onMouseLeave={handleDragEnd}
        onTouchStart={handleDragStart}
        onTouchMove={handleDragMove}
        onTouchEnd={handleDragEnd}
        style={{ 
          transformStyle: 'preserve-3d',
          cursor: isDragging ? 'grabbing' : 'grab'
        }}
      >
        {sampleImages.map((image, index) => {
          const cardStyle = getCardStyle(index);
          const isActive = index === activeIndex;

          return (
            <div
              key={index}
              className="absolute top-1/2 left-1/2 rounded-[20px] overflow-hidden group"
              style={{
                width: '340px',
                height: '240px',
                ...cardStyle,
                boxShadow: isActive 
                  ? '0 25px 60px rgba(0, 0, 0, 0.5), 0 0 80px rgba(255, 255, 255, 0.05)'
                  : '0 10px 30px rgba(0, 0, 0, 0.3)',
                willChange: 'transform'
              }}
              onClick={() => handleCardClick(index)}
            >
              {/* Image or gradient background */}
              {image.startsWith('http') || image.startsWith('figma:') ? (
                <ImageWithFallback
                  src={image}
                  alt={`Project ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div 
                  className="w-full h-full flex items-center justify-center"
                  style={{ background: image }}
                >
                  <span 
                    className="text-white text-opacity-80"
                    style={{ 
                      fontSize: '18px',
                      fontWeight: '600',
                      fontFamily: 'Inter, system-ui, sans-serif'
                    }}
                  >
                    Project {index + 1}
                  </span>
                </div>
              )}

              {/* Hover effect overlay */}
              {isActive && (
                <div 
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{
                    background: 'radial-gradient(circle at center, rgba(255, 255, 255, 0.1), transparent 70%)',
                    pointerEvents: 'none'
                  }}
                />
              )}
            </div>
          );
        })}
      </div>

      {/* Navigation dots */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 flex gap-2 z-[200]">
        {sampleImages.map((_, index) => (
          <button
            key={index}
            onClick={() => setActiveIndex(index)}
            className="transition-all duration-300"
            style={{
              width: index === activeIndex ? '32px' : '8px',
              height: '8px',
              borderRadius: '4px',
              backgroundColor: index === activeIndex 
                ? 'rgba(255, 255, 255, 0.9)' 
                : 'rgba(255, 255, 255, 0.3)',
            }}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>

      {/* Active card hover scale effect */}
      <style dangerouslySetInnerHTML={{
        __html: `
          .group:hover {
            transform: translateX(calc(-50%)) translateZ(0px) rotateY(0deg) scale(1.03) !important;
          }
        `
      }} />
    </div>
  );
}
