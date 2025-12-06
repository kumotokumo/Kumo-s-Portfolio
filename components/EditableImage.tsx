import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import { EditableImageProps } from '../types';
import { getImageUrl } from '../utils/image';

export const EditableImage: React.FC<EditableImageProps> = ({ currentSrc, onUpload, isAdmin, className, alt }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number } | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  useEffect(() => {
    if (tooltip?.visible) {
      const timer = setTimeout(() => setTooltip(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [tooltip]);

  // Use the centralized image URL utility (memoized)
  const getImageSrc = useCallback((src: string): string => {
    return getImageUrl(src);
  }, []);

  const handleFileChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // 50MB Safety check (matched with App.tsx limit)
      if (file.size > 50 * 1024 * 1024) {
        alert("Image is too large (over 50MB). Please compress it.");
        e.target.value = '';
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        onUpload(reader.result as string);
        // Reset input so onChange triggers again if same file selected
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      };
      reader.onerror = () => {
        alert("Failed to read file");
        if (fileInputRef.current) {
           fileInputRef.current.value = '';
        }
      }
      reader.readAsDataURL(file);
    }
  }, [onUpload]);

  const handleClick = useCallback((e: React.MouseEvent) => {
    if (isAdmin) {
      e.stopPropagation(); // Prevent navigation if clicking to upload
      fileInputRef.current?.click();
    }
  }, [isAdmin]);

  const handleContextMenu = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  }, []);

  // Determine if we should use h-auto (for detail images) or h-full (for cover images)
  const useAutoHeight = useMemo(() => className?.includes('h-auto'), [className]);
  const isCoverImage = useMemo(() => className?.includes('absolute inset-0'), [className]);
  const isDetailPageCover = isCoverImage; // Detail page cover images should load immediately
  
  const imgClassName = useMemo(() => {
    return useAutoHeight 
      ? "w-full h-auto select-none block" 
      : "w-full h-full object-cover select-none block";
  }, [useAutoHeight]);
  
  const imgStyle = useMemo(() => {
    return useAutoHeight 
      ? { display: 'block' as const, margin: 0, padding: 0, verticalAlign: 'bottom' as const }
      : { 
          display: 'block' as const, 
          margin: 0, 
          padding: 0, 
          objectPosition: '50% 50%',
          objectFit: 'cover' as const
        };
  }, [useAutoHeight]);

  return (
    <div 
      className={`${isCoverImage ? 'absolute inset-0' : 'relative'} group ${className}`} 
      onContextMenu={handleContextMenu}
      style={useAutoHeight ? { lineHeight: 0, display: 'block' } : isCoverImage ? { display: 'flex', alignItems: 'center', justifyContent: 'center' } : {}}
    >
      <LazyLoadImage 
        src={getImageSrc(currentSrc)} 
        alt={alt} 
        className={imgClassName}
        draggable={false}
        effect="opacity"
        style={imgStyle}
        threshold={isDetailPageCover ? 1500 : 2000}
        loading={isDetailPageCover ? "eager" : "lazy"}
        delayMethod="throttle"
        delayTime={0}
        placeholder={<div className="w-full h-full bg-neutral-900" />}
        onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
          // Retry loading on error with fallback extensions
          const img = e.currentTarget;
          const originalSrc = img.src;
          
          // Try different extensions if retry count is low
          if (retryCount < 2) {
            setTimeout(() => {
              if (img.src !== originalSrc) return;
              
              let newSrc = originalSrc;
              // Try switching between .jpg and .webp
              if (originalSrc.includes('.webp')) {
                newSrc = originalSrc.replace(/\.webp(\?|$)/, '.jpg$1');
              } else if (originalSrc.includes('.jpg')) {
                newSrc = originalSrc.replace(/\.jpg(\?|$)/, '.webp$1');
              }
              
              // If extension changed, update retry count
              if (newSrc !== originalSrc) {
                setRetryCount(prev => prev + 1);
                img.src = newSrc;
              } else {
                // Otherwise, just retry with cache busting
                img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'retry=' + Date.now();
              }
            }, 1000);
          } else {
            // After 2 retries, just try cache busting
            setTimeout(() => {
              if (img.src !== originalSrc) return;
              img.src = originalSrc + (originalSrc.includes('?') ? '&' : '?') + 'retry=' + Date.now();
            }, 1000);
          }
        }}
      />
      
      {isAdmin && (
        <div 
          onClick={handleClick}
          className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center cursor-pointer transition-opacity z-20"
        >
          <div className="bg-white text-black px-4 py-2 rounded-full flex items-center gap-2 font-medium hover:scale-105 transition-transform">
            <Upload size={16} />
            <span>Change Image</span>
          </div>
          <input 
            type="file" 
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
        </div>
      )}

      {/* Copyright Tooltip */}
      <AnimatePresence>
        {tooltip?.visible && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            style={{ 
              position: 'fixed',
              left: tooltip.x, 
              top: tooltip.y,
              zIndex: 9999
            }}
            className="pointer-events-none bg-white text-black border border-white/20 px-3 py-1"
          >
            <span className="font-mono text-[10px] uppercase tracking-widest font-bold whitespace-nowrap">
              © kumo
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};