
import React from 'react';

interface MarqueeProps {
  size?: 'normal' | 'small';
}

const Marquee: React.FC<MarqueeProps> = ({ size = 'normal' }) => {
  const bulbCount = size === 'normal' ? 12 : 8;
  const bulbs = Array.from({ length: bulbCount });

  return (
    <div className={`absolute pointer-events-none inset-0 border-[3px] border-amber-800 shadow-inner rounded-sm ${size === 'normal' ? 'm-4' : 'm-0'}`}>
      {/* Top Bulbs */}
      <div className="absolute -top-4 left-0 right-0 flex justify-around">
        {bulbs.map((_, i) => (
          <div key={`top-${i}`} className={`w-3 h-3 md:w-5 md:h-5 rounded-full bg-amber-200 glowing-bulb`} style={{ animationDelay: `${i * 0.2}s` }}></div>
        ))}
      </div>
      {/* Bottom Bulbs */}
      <div className="absolute -bottom-4 left-0 right-0 flex justify-around">
        {bulbs.map((_, i) => (
          <div key={`bottom-${i}`} className={`w-3 h-3 md:w-5 md:h-5 rounded-full bg-amber-200 glowing-bulb`} style={{ animationDelay: `${i * 0.2 + 0.5}s` }}></div>
        ))}
      </div>
      {/* Left Bulbs */}
      <div className="absolute -left-4 top-0 bottom-0 flex flex-col justify-around">
        {bulbs.slice(0, 6).map((_, i) => (
          <div key={`left-${i}`} className={`w-3 h-3 md:w-5 md:h-5 rounded-full bg-amber-200 glowing-bulb`} style={{ animationDelay: `${i * 0.3}s` }}></div>
        ))}
      </div>
      {/* Right Bulbs */}
      <div className="absolute -right-4 top-0 bottom-0 flex flex-col justify-around">
        {bulbs.slice(0, 6).map((_, i) => (
          <div key={`right-${i}`} className={`w-3 h-3 md:w-5 md:h-5 rounded-full bg-amber-200 glowing-bulb`} style={{ animationDelay: `${i * 0.3 + 0.2}s` }}></div>
        ))}
      </div>
    </div>
  );
};

export default Marquee;
