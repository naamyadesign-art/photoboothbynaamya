
import React, { useState } from 'react';
import Marquee from './Marquee.tsx';

interface LandingScreenProps {
  onEnter: () => void;
}

const LandingScreen: React.FC<LandingScreenProps> = ({ onEnter }) => {
  const [isExiting, setIsExiting] = useState(false);

  const handleEnter = () => {
    setIsExiting(true);
    setTimeout(onEnter, 1000);
  };

  return (
    <div className={`relative h-full w-full flex items-center justify-center transition-opacity duration-1000 ${isExiting ? 'opacity-0 scale-110' : 'opacity-100'}`}>
      {/* Decorative Curtains (Landing) */}
      <div className="absolute inset-0 flex overflow-hidden">
        <div className="w-1/2 h-full velvet-curtain border-r border-black/40"></div>
        <div className="w-1/2 h-full velvet-curtain border-l border-black/40"></div>
      </div>

      <Marquee />

      <div className="relative z-10 text-center flex flex-col items-center gap-6 md:gap-8 px-6 max-w-full">
        <div className="space-y-1 md:space-y-2">
          <h1 className="title-font text-4xl sm:text-6xl md:text-8xl text-amber-400 drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)] leading-tight">
            PHOTOBOOTH
          </h1>
          <p className="retro-font text-sm sm:text-xl md:text-2xl text-amber-100/80 tracking-[0.15em] sm:tracking-widest uppercase">
            Grand Carnival • Est. 1924
          </p>
        </div>

        <button
          onClick={handleEnter}
          className="group relative px-8 py-4 md:px-12 md:py-6 bg-amber-600 hover:bg-amber-500 transition-all duration-300 border-[3px] md:border-4 border-amber-200 shadow-[0_0_30px_rgba(217,119,6,0.5)] active:scale-95"
        >
          <div className="absolute -inset-1 border border-amber-200 opacity-50"></div>
          <span className="retro-font text-lg sm:text-2xl md:text-3xl text-zinc-950 font-bold tracking-tighter uppercase">
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
