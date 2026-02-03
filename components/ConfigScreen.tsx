
import React, { useState } from 'react';
import { Film, Ticket, Sparkles, Tv, Mail, Layers, ChevronRight } from 'lucide-react';
import { BoothConfig, PhotoStyle, Orientation } from '../App.tsx';
import Marquee from './Marquee.tsx';

interface ConfigScreenProps {
  onConfirm: (config: BoothConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onConfirm }) => {
  const [style, setStyle] = useState<PhotoStyle>('FILM_ROLL');
  const [orientation, setOrientation] = useState<Orientation>('VERTICAL');

  const styles: { id: PhotoStyle, label: string, icon: any, desc: string, color: string }[] = [
    { id: 'FILM_ROLL', label: 'Film Roll', icon: Film, desc: 'Classic 35mm with sprockets', color: 'amber' },
    { id: 'ANALOG_STRIP', label: 'Analog Strip', icon: Layers, desc: 'Sepia toned vintage memory', color: 'zinc' },
    { id: 'MOVIE_TICKET', label: 'Ticket Stub', icon: Ticket, desc: 'Ticket to the childhood', color: 'red' },
    { id: 'RETRO_80S', label: '80s Neon', icon: Sparkles, desc: 'Retro colors and doodles', color: 'pink' },
    { id: 'VINTAGE_TV', label: 'TV View', icon: Tv, desc: 'Through the broadcast lens', color: 'blue' },
    { id: 'POSTCARD', label: 'Postcard', icon: Mail, desc: 'Aged paper and stamps', color: 'orange' },
  ];

  return (
    <div className="relative h-full w-full flex flex-col items-center bg-[#1a0a0a] overflow-y-auto p-4 sm:p-6 md:p-8">
      {/* Decorative Curtains Background */}
      <div className="fixed inset-0 velvet-curtain opacity-20 pointer-events-none"></div>
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-6 py-4 md:py-8">
        
        {/* Development Studio Card */}
        <div className="w-full bg-zinc-900/90 border border-amber-900/40 rounded-xl p-5 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl ring-1 ring-amber-500/10">
          <div className="relative w-full h-12 mb-6">
            <Marquee size="small" />
          </div>
          
          <div className="text-center mb-8">
            <h2 className="title-font text-3xl sm:text-4xl md:text-6xl text-amber-400 mb-2 tracking-tight leading-none">
              DEVELOPMENT STUDIO
            </h2>
            <p className="retro-font text-amber-200/40 uppercase tracking-[0.2em] text-[10px] sm:text-xs">
              Curate your vintage photobooth aesthetic
            </p>
          </div>

          <div className="space-y-8 md:space-y-12">
            {/* 1. Orientation */}
            <section className="space-y-4">
              <h3 className="retro-font text-amber-500/80 uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                <span className="w-6 sm:w-8 h-px bg-amber-900/50"></span>
                01. Select Layout
                <span className="flex-1 h-px bg-amber-900/50"></span>
              </h3>
              <div className="flex gap-3 sm:gap-4 max-w-md mx-auto">
                <button 
                  onClick={() => setOrientation('VERTICAL')}
                  className={`flex-1 flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 transition-all duration-300 ${orientation === 'VERTICAL' ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  <div className="w-4 h-7 sm:w-6 sm:h-10 border-2 border-current rounded-sm opacity-60"></div>
                  <span className="retro-font text-[9px] sm:text-[10px] uppercase font-bold tracking-tight">Vertical Strip</span>
                </button>
                <button 
                  onClick={() => setOrientation('HORIZONTAL')}
                  className={`flex-1 flex flex-col items-center gap-2 sm:gap-3 p-3 sm:p-4 border-2 transition-all duration-300 ${orientation === 'HORIZONTAL' ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
                >
                  <div className="w-7 h-4 sm:w-10 sm:h-6 border-2 border-current rounded-sm opacity-60"></div>
                  <span className="retro-font text-[9px] sm:text-[10px] uppercase font-bold tracking-tight">Horizontal Roll</span>
                </button>
              </div>
            </section>

            {/* 2. Style Grid */}
            <section className="space-y-4">
              <h3 className="retro-font text-amber-500/80 uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2">
                <span className="w-6 sm:w-8 h-px bg-amber-900/50"></span>
                02. Choose Aesthetic Style
                <span className="flex-1 h-px bg-amber-900/50"></span>
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
                {styles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`group relative flex flex-col p-3 sm:p-4 border-2 transition-all duration-300 text-left overflow-hidden ${style === s.id ? 'border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}`}
                  >
                    <div className={`mb-2 sm:mb-3 p-1.5 sm:p-2 rounded-lg w-fit transition-colors ${style === s.id ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'}`}>
                      <s.icon size={16} className="sm:size-5" />
                    </div>
                    <span className={`retro-font text-[10px] sm:text-xs uppercase font-black tracking-tight mb-1 transition-colors ${style === s.id ? 'text-amber-400' : 'text-zinc-300'}`}>
                      {s.label}
                    </span>
                    <span className="retro-font text-[8px] sm:text-[9px] text-zinc-500 uppercase leading-tight">
                      {s.desc}
                    </span>
                    {style === s.id && (
                      <div className="absolute top-2 right-2 w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse"></div>
                    )}
                  </button>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-8 md:mt-12 flex justify-center">
            <button
              onClick={() => onConfirm({ style, orientation })}
              className="group relative px-8 py-4 sm:px-12 sm:py-5 bg-amber-600 hover:bg-amber-500 transition-all duration-300 border-4 border-amber-200 shadow-2xl flex items-center gap-3 sm:gap-4 active:scale-95"
            >
              <div className="absolute -inset-1 border border-amber-200 opacity-30 group-hover:opacity-100 transition-opacity"></div>
              <span className="retro-font text-lg sm:text-xl text-zinc-950 font-black uppercase tracking-tighter">Enter Booth</span>
              <ChevronRight size={20} className="text-zinc-950 group-hover:translate-x-2 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
