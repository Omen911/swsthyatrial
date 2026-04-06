import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Leaf, RefreshCw } from 'lucide-react';
import { generateHerbImage } from '../lib/gemini';
import { cn } from '../lib/utils';

interface HerbImageProps {
  herbName: string;
  className?: string;
  fallbackUrl?: string;
}

const imageCache: Record<string, string> = {};

const HerbImage: React.FC<HerbImageProps> = ({ herbName, className, fallbackUrl }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(imageCache[herbName] || null);
  const [isLoading, setIsLoading] = useState(!imageCache[herbName]);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (imageCache[herbName]) {
      setImageUrl(imageCache[herbName]);
      setIsLoading(false);
      return;
    }

    const fetchImage = async () => {
      setIsLoading(true);
      setError(false);
      try {
        const url = await generateHerbImage(herbName);
        if (url) {
          imageCache[herbName] = url;
          setImageUrl(url);
        } else {
          setError(true);
        }
      } catch (err) {
        setError(true);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImage();
  }, [herbName]);

  return (
    <div className={cn("relative overflow-hidden bg-emerald-50 flex items-center justify-center", className)}>
      <AnimatePresence mode="wait">
        {isLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center gap-2"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
              className="text-emerald-300"
            >
              <RefreshCw size={24} />
            </motion.div>
            <span className="text-[8px] font-black uppercase tracking-widest text-emerald-300">AI Generating...</span>
          </motion.div>
        ) : imageUrl ? (
          <motion.img
            key="image"
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            src={imageUrl}
            alt={herbName}
            className="w-full h-full object-cover"
          />
        ) : (
          <motion.div
            key="fallback"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full"
          >
            <img 
              src={fallbackUrl || `https://picsum.photos/seed/${herbName}/400/400`} 
              alt={herbName} 
              className="w-full h-full object-cover opacity-50 grayscale"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <Leaf size={32} className="text-emerald-200" />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default HerbImage;
