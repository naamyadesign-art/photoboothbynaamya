
import React, { useState } from 'react';
import { Film, Ticket, Sparkles, Camera, Mail, Layers, ChevronRight } from 'lucide-react';
import { BoothConfig, PhotoStyle, Orientation } from '../App.tsx';
import Marquee from './Marquee.tsx';

interface ConfigScreenProps {
  onConfirm: (config: BoothConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onConfirm }) => {
  const [style, setStyle] = useState<PhotoStyle>('FILM_ROLL');
  const [orientation, setOrientation] = useState<Orientation>('VERTICAL');

  const styles: { id: PhotoStyle, label: string, icon: any, desc: string, color: string }[] = [
    { id: 'FILM_ROLL', label: 'Film Roll', icon: Film, desc: '35mm cinematic celluloid', color: 'amber' },
    { id: 'ANALOG_STRIP', label: 'Analog Strip', icon: Layers, desc: 'Soft classic faded memory', color: 'zinc' },
    { id: 'MOVIE_TICKET', label: 'Cinema Ticket', icon: Ticket, desc: 'Vintage "Admit One" frames', color: 'red' },
    { id: 'RETRO_80S', label: 'Retro 80s', icon: Sparkles, desc: 'Playful doodles & pastels', color: 'pink' },
    { id: 'CAMERA_FRAME', label: 'Camera View', icon: Camera, desc: 'Through the retro lens', color: 'blue' },
    { id: 'POSTCARD', label: 'Old Postcard', icon: Mail, desc: 'Textured paper & stamps', color: 'orange' },
  ];

  return (
    <div className="relative h-full w-full flex flex-col items-center justify-center p-4 md:p-8 overflow-y-auto">
      <div className="absolute inset-0 velvet-curtain opacity-30"></div>
      
      <div className="relative z-10 w-full max-w-5xl bg-zinc-900/95 border border-amber-900/30 rounded-xl p-6 md:p-10 shadow-2xl backdrop-blur-2xl my-8">
        <Marquee size="small" />
        
        <div className="text-center mb-8">
          <h2 className="title-font text-4xl md:text-6xl text-amber-400 mb-2 tracking-tight">DEVELOPMENT STUDIO</h2>
          <p className="retro-font text-amber-200/50 uppercase tracking-[0.2em] text-xs">Curate your vintage photobooth aesthetic</p>
        </div>

        <div className="space-y-10">
          {/* 1. Orientation */}
          <section className="space-y-4">
            <h3 className="retro-font text-amber-500 uppercase tracking-widest text-sm flex items-center gap-2">
              <span className="w-8 h-px bg-amber-900/50"></span>
              01. Select Layout
              <span className="flex-1 h-px bg-amber-900/50"></span>
            </h3>
            <div className="flex gap-4 max-w-md mx-auto">
              <button 
                onClick={() => setOrientation('VERTICAL')}
                className={`flex-1 flex flex-col items-center gap-3 p-4 border-2 transition-all duration-300 ${orientation === 'VERTICAL' ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
              >
                <div className="w-6 h-10 border-2 border-current rounded-sm opacity-60"></div>
                <span className="retro-font text-[10px] uppercase font-bold">Vertical Strip</span>
              </button>
              <button 
                onClick={() => setOrientation('HORIZONTAL')}
                className={`flex-1 flex flex-col items-center gap-3 p-4 border-2 transition-all duration-300 ${orientation === 'HORIZONTAL' ? 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-[0_0_15px_rgba(251,191,36,0.2)]' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700'}`}
              >
                <div className="w-10 h-6 border-2 border-current rounded-sm opacity-60"></div>
                <span className="retro-font text-[10px] uppercase font-bold">Horizontal Roll</span>
              </button>
            </div>
          </section>

          {/* 2. Style Grid */}
          <section className="space-y-4">
            <h3 className="retro-font text-amber-500 uppercase tracking-widest text-sm flex items-center gap-2">
              <span className="w-8 h-px bg-amber-900/50"></span>
              02. Choose Aesthetic Style
              <span className="flex-1 h-px bg-amber-900/50"></span>
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {styles.map((s) => (
                <button
                  key={s.id}
                  onClick={() => setStyle(s.id)}
                  className={`group relative flex flex-col p-4 border-2 transition-all duration-300 text-left overflow-hidden ${style === s.id ? 'border-amber-400 bg-amber-400/5 shadow-[0_0_20px_rgba(251,191,36,0.1)]' : 'border-zinc-800 hover:border-zinc-700'}`}
                >
                  <div className={`mb-3 p-2 rounded-lg w-fit transition-colors ${style === s.id ? 'bg-amber-400 text-zinc-950' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700'}`}>
                    <s.icon size={20} />
                  </div>
                  <span className={`retro-font text-xs uppercase font-black tracking-tight mb-1 transition-colors ${style === s.id ? 'text-amber-400' : 'text-zinc-300'}`}>
                    {s.label}
                  </span>
                  <span className="retro-font text-[9px] text-zinc-500 uppercase leading-none">
                    {s.desc}
                  </span>
                  {style === s.id && (
                    <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-amber-400 animate-pulse"></div>
                  )}
                </button>
              ))}
            </div>
          </section>
        </div>

        <div className="mt-10 flex justify-center">
          <button
            onClick={() => onConfirm({ style, orientation })}
            className="group relative px-12 py-5 bg-amber-600 hover:bg-amber-500 transition-all duration-300 border-4 border-amber-200 shadow-2xl flex items-center gap-4 active:scale-95"
          >
            <div className="absolute -inset-1 border border-amber-200 opacity-30 group-hover:opacity-100 transition-opacity"></div>
            <span className="retro-font text-xl text-zinc-950 font-black uppercase tracking-tighter">Enter Booth</span>
            <ChevronRight className="text-zinc-950 group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
