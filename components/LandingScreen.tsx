
import React, { useState } from 'react';
import Marquee from './Marquee.tsx';

interface LandingScreenProps {
  onEnter: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    // Delay the actual transition to allow the curtain animation to play
    setTimeout(onEnter, 1200);
  };

  return (
    <div className={`relative h-full w-full flex items-center justify-center transition-all duration-1000 ${isExiting ? 'scale-105' : 'opacity-100'}`}>
      {/* Cinematic Curtains Opening Animation */}
      <div className="absolute inset-0 flex overflow-hidden z-20 pointer-events-none">
        <div 
          className={`w-1/2 h-full velvet-curtain border-r border-black/60 shadow-[20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-[1200ms] ease-in-out ${isExiting ? '-translate-x-full' : 'translate-x-0'}`}
        ></div>
        <div 
          className={`w-1/2 h-full velvet-curtain border-l border-black/60 shadow-[-20px_0_50px_rgba(0,0,0,0.5)] transition-transform duration-[1200ms] ease-in-out ${isExiting ? 'translate-x-full' : 'translate-x-0'}`}
        ></div>
      </div>

      <div className={`relative z-10 transition-opacity duration-500 ${isExiting ? 'opacity-0' : 'opacity-100'}`}>
        <Marquee />
      </div>

      <div className={`relative z-30 text-center flex flex-col items-center gap-6 md:gap-8 px-6 max-w-full transition-all duration-700 ${isExiting ? 'opacity-0 -translate-y-10' : 'opacity-100'}`}>
        <div className="space-y-1 md:space-y-2">
          <h1 className="title-font text-4xl sm:text-6xl md:text-8xl text-amber-400 drop-shadow-[0_10px_10px_rgba(0,0,0,1)] leading-tight">
            PHOTOBOOTH
          </h1>
          <p className="retro-font text-sm sm:text-xl md:text-2xl text-amber-100/80 tracking-[0.15em] sm:tracking-widest uppercase">
            Grand Carnival • Est. 1924
          </p>
        </div>

        <button
          onClick={handleEnter}
          className="group relative px-8 py-4 md:px-12 md:py-6 bg-amber-600 hover:bg-amber-500 transition-all duration-300 border-[3px] md:border-4 border-amber-200 shadow-[0_0_50px_rgba(217,119,6,0.6)] active:scale-95"
        >
          <div className="absolute -inset-1 border border-amber-200 opacity-50 group-hover:opacity-100 transition-opacity"></div>
          <span className="retro-font text-lg sm:text-2xl md:text-3xl text-zinc-950 font-black tracking-tighter uppercase">
            Step Into The Booth
          </span>
        </button>

        <div className="mt-4 md:mt-8 px-4 py-2 border border-amber-400/30 rounded-full retro-font text-[10px] sm:text-xs uppercase text-amber-400/60 animate-pulse">
          Prepare for your close-up
        </div>
      </div>
    </div>
  );
};

export default LandingScreen;
