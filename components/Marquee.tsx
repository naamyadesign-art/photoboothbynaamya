
import React from 'react';

interface MarqueeProps {
  size?: 'normal' | 'small';
}

const Marquee: React.FC<MarqueeProps> = ({ size = 'normal' }) => {
  const bulbCount = size === 'normal' ? 12 : 8;
  const bulbs = Array.from({ length: bulbCount });

  // Bulb size classes
  const bulbSize = size === 'normal' 
    ? "w-2 h-2 sm:w-3 sm:h-3 md:w-5 md:h-5" 
    : "w-1.5 h-1.5 sm:w-2 sm:h-2 md:w-3 md:h-3";

  // Position offsets based on size
  const offset = size === 'normal' ? "-top-3 sm:-top-4" : "-top-2 sm:-top-3";
  const bottomOffset = size === 'normal' ? "-bottom-3 sm:-bottom-4" : "-bottom-2 sm:-bottom-3";
  const leftOffset = size === 'normal' ? "-left-3 sm:-left-4" : "-left-2 sm:-left-3";
  const rightOffset = size === 'normal' ? "-right-3 sm:-right-4" : "-right-2 sm:-right-3";

  return (
    <div className={`absolute pointer-events-none inset-0 border-[2px] sm:border-[3px] border-amber-800 shadow-inner rounded-sm ${size === 'normal' ? 'm-3 sm:m-4' : 'm-0'}`}>
      {/* Top Bulbs */}
      <div className={`absolute ${offset} left-0 right-0 flex justify-around px-2`}>
        {bulbs.map((_, i) => (
          <div key={`top-${i}`} className={`${bulbSize} rounded-full bg-amber-200 glowing-bulb`} style={{ animationDelay: `${i * 0.2}s` }}></div>
        ))}
      </div>
      {/* Bottom Bulbs */}
      <div className={`absolute ${bottomOffset} left-0 right-0 flex justify-around px-2`}>
        {bulbs.map((_, i) => (
          <div key={`bottom-${i}`} className={`${bulbSize} rounded-full bg-amber-200 glowing-bulb`} style={{ animationDelay: `${i * 0.2 + 0.5}s` }}></div>
        ))}
      </div>
      {/* Left Bulbs */}
      <div className={`absolute ${leftOffset} top-0 bottom-0 flex flex-col justify-around py-2`}>
        {bulbs.slice(0, 6).map((_, i) => (
          <div key={`left-${i}`} className={`${bulbSize} rounded-full bg-amber-200 glowing-bulb`} style={{ animationDelay: `${i * 0.3}s` }}></div>
        ))}
      </div>
      {/* Right Bulbs */}
      <div className={`absolute ${rightOffset} top-0 bottom-0 flex flex-col justify-around py-2`}>
        {bulbs.slice(0, 6).map((_, i) => (
          <div key={`right-${i}`} className={`${bulbSize} rounded-full bg-amber-200 glowing-bulb`} style={{ animationDelay: `${i * 0.3 + 0.2}s` }}></div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
