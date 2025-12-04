import React, { useRef, useState, useEffect } from 'react';
import { Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { EditableImageProps } from '../types';

export const EditableImage: React.FC<EditableImageProps> = ({ currentSrc, onUpload, isAdmin, className, alt }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [tooltip, setTooltip] = useState<{ visible: boolean; x: number; y: number } | null>(null);

  useEffect(() => {
    if (tooltip?.visible) {
      const timer = setTimeout(() => setTooltip(null), 1500);
      return () => clearTimeout(timer);
    }
  }, [tooltip]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
  };

  const handleClick = (e: React.MouseEvent) => {
    if (isAdmin) {
      e.stopPropagation(); // Prevent navigation if clicking to upload
      fileInputRef.current?.click();
    }
  };

  const handleContextMenu = (e: React.MouseEvent) => {
    e.preventDefault();
    setTooltip({
      visible: true,
      x: e.clientX,
      y: e.clientY
    });
  };

  // Determine if we should use h-auto (for detail images) or h-full (for cover images)
  const useAutoHeight = className?.includes('h-auto');
  const imgClassName = useAutoHeight 
    ? "w-full h-auto select-none" 
    : "w-full h-full object-cover select-none";

  return (
    <div 
      className={`relative group ${className}`} 
      onContextMenu={handleContextMenu}
    >
      <img 
        src={currentSrc} 
        alt={alt} 
        className={imgClassName}
        draggable={false}
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