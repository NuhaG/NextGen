"use client";

import { cn } from "@/lib/utils";
import React, { useEffect, useRef, useState } from "react";

// FeatureCard component
const FeatureCard = ({ icon, title, description }) => {
  return (
    <div className="relative w-[300px] h-[200px] max-w-full shrink-0 rounded-2xl border border-zinc-200 bg-white/90 backdrop-blur-sm p-6 flex flex-col items-center text-center shadow-lg dark:border-zinc-700 dark:bg-zinc-800/90 hover:shadow-xl transition-shadow duration-300">
      <div className="text-4xl mb-4">{icon}</div>
      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
      <p className="text-gray-600 dark:text-gray-300 text-sm">{description}</p>
    </div>
  );
};

export const InfiniteMovingCards = ({
  items,
  direction = "left",
  speed = "fast",
  pauseOnHover = true,
  className,
}) => {
  const containerRef = useRef(null);
  const scrollerRef = useRef(null);
  const [start, setStart] = useState(false);

  // Create a stable reference to the items array length
  const itemsLength = items?.length || 0;
  const itemsJson = JSON.stringify(items?.map(item => ({
    title: item.title,
    icon: item.icon,
    description: item.description
  })) || []);

  useEffect(() => {
    if (!items?.length) return;
    
    const init = () => {
      if (!scrollerRef.current) return;
      
      // Clear any existing duplicates
      const scroller = scrollerRef.current;
      const currentItems = Array.from(scroller.children);
      
      // Only add duplicates if we haven't already
      if (currentItems.length <= items.length) {
        // Remove any existing duplicates first
        while (scroller.children.length > items.length) {
          scroller.removeChild(scroller.lastChild);
        }
        
        // Add duplicates
        const itemsToDuplicate = Array.from(scroller.children);
        itemsToDuplicate.forEach((item) => {
          const duplicatedItem = item.cloneNode(true);
          scroller.appendChild(duplicatedItem);
        });
      }
      
      setStart(true);
    };
    
    init();
    
    // Handle window resize
    const handleResize = () => {
      if (scrollerRef.current) {
        // Trigger reflow to ensure smooth animation restart
        scrollerRef.current.style.animation = 'none';
        void scrollerRef.current.offsetHeight; // Trigger reflow
        scrollerRef.current.style.animation = '';
      }
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [itemsLength, itemsJson]); // Use stable dependencies
  
  // Set animation duration based on speed prop
  const animationDuration = {
    fast: '20s',
    normal: '40s',
    slow: '80s',
  }[speed] || '40s';

  return (
    <div
      ref={containerRef}
      className={cn(
        "relative z-20 max-w-7xl overflow-hidden [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]",
        className
      )}
      style={{
        '--animation-duration': animationDuration,
        '--animation-direction': direction === 'left' ? 'normal' : 'reverse'
      }}
    >
      <ul
        ref={scrollerRef}
        className={cn(
          "flex w-max min-w-full shrink-0 flex-nowrap gap-4 py-4",
          start && "animate-scroll",
          pauseOnHover && "hover:pause-animation"
        )}
      >
        {items.map((item, idx) => (
          <li key={`${item.title}-${idx}`} className="flex-shrink-0 w-[300px] px-2">
            <FeatureCard
              icon={item.icon}
              title={item.title}
              description={item.description}
            />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InfiniteMovingCards; 