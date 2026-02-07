
import React, { useState, useMemo } from 'react';
import { Film, Ticket, Sparkles, Tv, Mail, Layers, ChevronRight, User, ToggleLeft, ToggleRight, Type, Heart, Circle, Star, Lock } from 'lucide-react';
import { BoothConfig, PhotoStyle, Orientation } from '../App.tsx';
import Marquee from './Marquee.tsx';

// Custom Lips Icon for Valentine's Styles
const LipsIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 16C15.5 16 19 14.5 21 12.5C21 12.5 19 11 17 11.5C15 12 13 13 12 13C11 13 9 12 7 11.5C5 11 3 12.5 3 12.5C5 14.5 8.5 16 12 16Z" />
    <path d="M12 8C8.5 8 5 9.5 3 11.5C3 11.5 5 11 7 10.5C9 10 11 9 12 9C13 9 15 10 17 10.5C19 11 21 11.5 21 11.5C19 9.5 15.5 8 12 8Z" />
  </svg>
);

// Custom Bow Icon for Valentine's Styles
const BowIcon = ({ size = 24, className = "" }) => (
  <svg 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="currentColor" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M12 10C12 10 10 6 6 6C2 6 2 12 6 12C8 12 10 11 12 10ZM12 10C12 10 14 6 18 6C22 6 22 12 18 12C16 12 14 11 12 10Z" />
    <rect x="10.5" y="9" width="3" height="3" rx="1" />
    <path d="M11 12L8 18M13 12L16 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

interface ConfigScreenProps {
  onConfirm: (config: BoothConfig) => void;
}

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onConfirm }) => {
  // Check if it's February 1-14
  const isValentinesSeason = useMemo(() => {
    const now = new Date();
    return now.getMonth() === 1 && now.getDate() <= 14;
  }, []);

  // Set initial view to CLASSIC as requested
  const [viewMode, setViewMode] = useState<'CLASSIC' | 'VALENTINE'>('CLASSIC');
  const [style, setStyle] = useState<PhotoStyle>('FILM_ROLL');
  const [orientation, setOrientation] = useState<Orientation>('VERTICAL');
  const [annotation1, setAnnotation1] = useState('NAME 1');
  const [annotation2, setAnnotation2] = useState('NAME 2');
  const [enableAnnotations, setEnableAnnotations] = useState(true);
  const [annotationFont, setAnnotationFont] = useState('Playfair Display');
  
  const today = new Date().toLocaleDateString('en-GB', { 
    day: '2-digit', 
    month: '2-digit', 
    year: '2-digit' 
  }).replace(/\//g, '.');
  const [date, setDate] = useState(today);

  const fonts = [
    { name: 'Playfair Display', label: 'Classic Serif' },
    { name: 'Special Elite', label: 'Typewriter' },
    { name: 'Pacifico', label: 'Vintage Script' },
    { name: 'Dancing Script', label: 'Flowy Hand' },
    { name: 'Bungee Shade', label: 'Retro Block' }
  ];

  const classicStyles: { id: PhotoStyle, label: string, icon: any, desc: string }[] = [
    { id: 'FILM_ROLL', label: 'Film Roll', icon: Film, desc: 'Classic 35mm with sprockets' },
    { id: 'ANALOG_STRIP', label: 'Analog Strip', icon: Layers, desc: 'Sepia toned vintage memory' },
    { id: 'MOVIE_TICKET', label: 'Ticket Stub', icon: Ticket, desc: 'Ticket to the childhood' },
    { id: 'RETRO_80S', label: '80s Neon', icon: Sparkles, desc: 'Retro colors and doodles' },
    { id: 'VINTAGE_TV', label: 'TV View', icon: Tv, desc: 'Through the broadcast lens' },
    { id: 'POSTCARD', label: 'Postcard', icon: Mail, desc: 'Aged paper and stamps' },
  ];

  const valentineStyles: { id: PhotoStyle, label: string, icon: any, desc: string }[] = [
    { id: 'VAL_HAPPY_CHERRY', label: 'Sweet Hearts', icon: Heart, desc: 'Scalloped heart frames with cherries' },
    { id: 'VAL_BE_MINE', label: 'Be Mine', icon: Circle, desc: 'Cherry circles & pink pattern' },
    { id: 'VAL_BOWS', label: 'Pink Bows', icon: BowIcon, desc: 'Ribbons & bows aesthetic' },
    { id: 'VAL_KISSES', label: 'Lip Prints', icon: LipsIcon, desc: 'Kisses & oval vintage frames' },
    { id: 'VAL_RIBBON', label: 'Red Ribbon', icon: BowIcon, desc: 'Big ribbon header & classic red' },
  ];

  const currentStyles = viewMode === 'VALENTINE' ? valentineStyles : classicStyles;
  const isVal = viewMode === 'VALENTINE';

  const handleModeChange = (mode: 'CLASSIC' | 'VALENTINE') => {
    setViewMode(mode);
    setStyle(mode === 'VALENTINE' ? 'VAL_HAPPY_CHERRY' : 'FILM_ROLL');
    setAnnotationFont(mode === 'VALENTINE' ? 'Pacifico' : 'Playfair Display');
    setAnnotation1('NAME 1');
    setAnnotation2('NAME 2');
  };

  return (
    <div className={`relative h-full w-full flex flex-col items-center overflow-y-auto p-4 sm:p-6 md:p-8 transition-colors duration-700 ${isVal ? 'bg-rose-50' : 'bg-[#1a0a0a]'}`}>
      <div className={`fixed inset-0 pointer-events-none transition-opacity duration-700 ${isVal ? 'bg-rose-100/30 opacity-100' : 'velvet-curtain opacity-20'}`}></div>
      
      <div className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-6 py-6 md:py-12 pb-24">
        
        <div className={`w-full border rounded-2xl p-6 sm:p-8 md:p-10 shadow-2xl backdrop-blur-xl ring-1 transition-all duration-700 ${isVal ? 'bg-white/95 border-rose-200 ring-rose-300/30' : 'bg-zinc-900/90 border-amber-900/40 ring-amber-500/10'}`}>
          <div className="relative w-full h-12 mb-8">
            <Marquee size="small" variant={isVal ? 'valentine' : 'classic'} />
          </div>
          
          <div className="text-center mb-10">
            <h2 className={`title-font text-4xl sm:text-5xl md:text-7xl mb-2 tracking-tight leading-none transition-colors duration-700 ${isVal ? 'text-rose-600 drop-shadow-[0_2px_2px_rgba(255,255,255,1)]' : 'text-amber-400'}`}>
              {isVal ? 'LOVE CAPSULE' : 'DEVELOPMENT STUDIO'}
            </h2>
            <p className={`retro-font uppercase tracking-[0.2em] text-[10px] sm:text-xs transition-colors duration-700 ${isVal ? 'text-rose-500 font-bold' : 'text-amber-200/40'}`}>
              Curate your {isVal ? 'romantic' : 'vintage'} photobooth aesthetic
            </p>
          </div>

          <div className="flex justify-center mb-10 gap-6">
            <button 
              onClick={() => handleModeChange('CLASSIC')}
              className={`px-8 py-3 rounded-full border-2 retro-font text-xs transition-all font-bold ${!isVal ? 'bg-amber-500 text-zinc-950 border-amber-200 shadow-lg scale-105' : 'border-rose-200 text-rose-400 hover:border-rose-400 hover:text-rose-600'}`}
            >
              CLASSIC
            </button>
            <button 
              onClick={() => handleModeChange('VALENTINE')}
              className={`px-8 py-3 rounded-full border-2 retro-font text-xs transition-all flex items-center gap-2 font-bold ${isVal ? 'bg-rose-500 text-white border-rose-200 shadow-rose-200 shadow-xl scale-105' : 'border-zinc-800 text-zinc-500 hover:border-rose-400 hover:text-rose-500'}`}
            >
              <Heart size={16} className={isVal ? 'fill-white' : ''} />
              {isValentinesSeason ? "VALENTINE'S SPECIAL" : "PREMIUM: LOVE CAPSULE"}
              {!isValentinesSeason && !isVal && <Lock size={14} className="opacity-60 ml-1" />}
            </button>
          </div>

          <div className="space-y-12 md:space-y-16">
            
            {/* 01. Strip Layout */}
            <section className="space-y-6">
              <h3 className={`retro-font uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 transition-colors duration-700 ${isVal ? 'text-rose-600 font-black' : 'text-amber-500/80'}`}>
                <span className={`w-6 sm:w-8 h-px transition-colors duration-700 ${isVal ? 'bg-rose-300' : 'bg-amber-900/50'}`}></span>
                01. Strip Layout
                <span className={`flex-1 h-px transition-colors duration-700 ${isVal ? 'bg-rose-300' : 'bg-amber-900/50'}`}></span>
              </h3>
              <div className="flex gap-4 max-w-md mx-auto">
                <button 
                  onClick={() => setOrientation('VERTICAL')}
                  className={`flex-1 flex flex-col items-center justify-center gap-3 p-5 border-2 transition-all duration-300 rounded-xl ${orientation === 'VERTICAL' ? (isVal ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-md' : 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-md') : (isVal ? 'border-rose-100 bg-rose-50/30 text-rose-400 hover:border-rose-300 hover:text-rose-500' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700')}`}
                >
                  <div className={`w-5 h-9 border-2 border-current rounded-sm transition-opacity ${orientation === 'VERTICAL' ? 'opacity-100' : 'opacity-40'}`}></div>
                  <span className="retro-font text-[10px] uppercase font-bold tracking-tight text-center w-full">Vertical</span>
                </button>
                <button 
                  onClick={() => setOrientation('HORIZONTAL')}
                  className={`flex-1 flex flex-col items-center justify-center gap-3 p-5 border-2 transition-all duration-300 rounded-xl ${orientation === 'HORIZONTAL' ? (isVal ? 'border-rose-500 bg-rose-50 text-rose-600 shadow-md' : 'border-amber-400 bg-amber-400/10 text-amber-400 shadow-md') : (isVal ? 'border-rose-100 bg-rose-50/30 text-rose-400 hover:border-rose-300 hover:text-rose-500' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700')}`}
                >
                  <div className={`w-9 h-5 border-2 border-current rounded-sm transition-opacity ${orientation === 'HORIZONTAL' ? 'opacity-100' : 'opacity-40'}`}></div>
                  <span className="retro-font text-[10px] uppercase font-bold tracking-tight text-center w-full">Horizontal</span>
                </button>
              </div>
            </section>

            {/* 02. Personalization / Signature */}
            <section className="space-y-6">
              <div className="flex justify-between items-end gap-4">
                <h3 className={`retro-font uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 flex-1 transition-colors duration-700 ${isVal ? 'text-rose-600 font-black' : 'text-amber-500/80'}`}>
                  <span className={`w-6 sm:w-8 h-px transition-colors duration-700 ${isVal ? 'bg-rose-300' : 'bg-amber-900/50'}`}></span>
                  02. Signature
                  <span className={`flex-1 h-px transition-colors duration-700 ${isVal ? 'bg-rose-300' : 'bg-amber-900/50'}`}></span>
                </h3>
                <button 
                  onClick={() => setEnableAnnotations(!enableAnnotations)}
                  className={`flex items-center gap-2 px-4 py-2 border rounded-full transition-colors shrink-0 ${isVal ? 'bg-rose-50 border-rose-300 hover:bg-rose-100' : 'bg-zinc-800 border-zinc-700 hover:bg-zinc-700'}`}
                >
                  {enableAnnotations ? <ToggleRight className={isVal ? 'text-rose-500' : 'text-amber-400'} size={20} /> : <ToggleLeft className="text-zinc-500" size={20} />}
                  <span className={`retro-font text-[10px] uppercase font-bold ${isVal ? 'text-rose-700' : 'text-amber-100/70'}`}>{enableAnnotations ? 'Active' : 'Muted'}</span>
                </button>
              </div>

              <div className={`space-y-8 transition-all duration-300 ${enableAnnotations ? 'opacity-100 translate-y-0' : 'opacity-40 pointer-events-none -translate-y-2'}`}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                  <div className="space-y-2">
                    <label className={`retro-font text-[10px] uppercase ml-1 font-bold ${isVal ? 'text-rose-600' : 'text-amber-200/50'}`}>Name 1</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isVal ? 'text-rose-400' : 'text-amber-400/40'}`} />
                      <input 
                        type="text" 
                        value={annotation1}
                        disabled={!enableAnnotations}
                        onChange={(e) => setAnnotation1(e.target.value.toUpperCase())}
                        className={`w-full rounded-xl px-10 py-3 retro-font focus:outline-none transition-all ${isVal ? 'bg-white border-2 border-rose-100 text-rose-700 focus:border-rose-500 shadow-sm' : 'bg-black/40 border border-zinc-800 text-amber-200 focus:border-amber-400'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`retro-font text-[10px] uppercase ml-1 font-bold ${isVal ? 'text-rose-600' : 'text-amber-200/50'}`}>Name 2</label>
                    <div className="relative">
                      <User className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${isVal ? 'text-rose-400' : 'text-amber-400/40'}`} />
                      <input 
                        type="text" 
                        value={annotation2}
                        disabled={!enableAnnotations}
                        onChange={(e) => setAnnotation2(e.target.value.toUpperCase())}
                        className={`w-full rounded-xl px-10 py-3 retro-font focus:outline-none transition-all ${isVal ? 'bg-white border-2 border-rose-100 text-rose-700 focus:border-rose-500 shadow-sm' : 'bg-black/40 border border-zinc-800 text-amber-200 focus:border-amber-400'}`}
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className={`retro-font text-[10px] uppercase ml-1 font-bold ${isVal ? 'text-rose-600' : 'text-amber-200/50'}`}>{isVal ? 'Date of Passion' : 'Studio Date'}</label>
                    <input 
                      type="text" 
                      value={date}
                      disabled={!enableAnnotations}
                      onChange={(e) => setDate(e.target.value)}
                      className={`w-full rounded-xl px-4 py-3 retro-font focus:outline-none transition-all ${isVal ? 'bg-white border-2 border-rose-100 text-rose-700 focus:border-rose-500 shadow-sm' : 'bg-black/40 border border-zinc-800 text-amber-200 focus:border-amber-400'}`}
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Type className={`w-4 h-4 ${isVal ? 'text-rose-500' : 'text-amber-500/60'}`} />
                    <label className={`retro-font text-[10px] uppercase font-bold ${isVal ? 'text-rose-600' : 'text-amber-200/50'}`}>Handwriting Style</label>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {fonts.map((f) => (
                      <button
                        key={f.name}
                        onClick={() => setAnnotationFont(f.name)}
                        className={`px-6 py-3 rounded-xl border-2 transition-all duration-200 ${annotationFont === f.name ? (isVal ? 'border-rose-500 bg-rose-500 text-white shadow-lg' : 'border-amber-400 bg-amber-400/10 text-amber-200') : (isVal ? 'border-rose-200 bg-white text-rose-500 hover:border-rose-400 hover:text-rose-700' : 'border-zinc-800 text-zinc-500 hover:border-zinc-700')}`}
                        style={{ fontFamily: f.name }}
                      >
                        <span className="text-sm font-bold tracking-tight">{f.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 03. Frame Aesthetic */}
            <section className="space-y-6">
              <h3 className={`retro-font uppercase tracking-widest text-[10px] sm:text-xs flex items-center gap-2 transition-colors duration-700 ${isVal ? 'text-rose-600 font-black' : 'text-amber-500/80'}`}>
                <span className={`w-6 sm:w-8 h-px transition-colors duration-700 ${isVal ? 'bg-rose-300' : 'bg-amber-900/50'}`}></span>
                03. Frame Aesthetic
                <span className={`flex-1 h-px transition-colors duration-700 ${isVal ? 'bg-rose-300' : 'bg-amber-900/50'}`}></span>
              </h3>
              <div className={`grid gap-4 ${isVal ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-2 md:grid-cols-3'}`}>
                {currentStyles.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => setStyle(s.id)}
                    className={`group relative flex flex-col p-5 border-2 transition-all duration-300 text-left overflow-hidden rounded-xl ${style === s.id ? (isVal ? 'border-rose-500 bg-rose-50 shadow-xl shadow-rose-200/40 ring-1 ring-rose-400' : 'border-amber-400 bg-amber-400/5 shadow-lg shadow-amber-900/20') : (isVal ? 'border-rose-100 bg-white/40 text-rose-500 hover:border-rose-300 hover:text-rose-700 hover:bg-white' : 'border-zinc-800 hover:border-zinc-700')}`}
                  >
                    <div className={`mb-4 p-3 rounded-xl w-fit transition-colors ${style === s.id ? (isVal ? 'bg-rose-500 text-white scale-110' : 'bg-amber-400 text-zinc-950') : (isVal ? 'bg-rose-100 text-rose-500' : 'bg-zinc-800 text-zinc-400 group-hover:bg-zinc-700')}`}>
                      {/* Check if s.icon is a component or a Lucide icon */}
                      {typeof s.icon === 'function' ? <s.icon size={28} /> : <s.icon size={28} className={style === s.id && isVal ? 'fill-white' : ''} />}
                    </div>
                    <span className={`retro-font text-sm uppercase font-black tracking-tight mb-1 transition-colors ${style === s.id ? (isVal ? 'text-rose-700' : 'text-amber-400') : (isVal ? 'text-rose-500' : 'text-zinc-300')}`}>
                      {s.label}
                    </span>
                    <span className={`retro-font text-[10px] uppercase leading-tight transition-colors ${isVal ? 'text-rose-400' : 'text-zinc-500'}`}>
                      {s.desc}
                    </span>
                  </button>
                ))}
              </div>
            </section>

          </div>

          <div className="mt-14 md:mt-20 flex justify-center">
            <button
              onClick={() => onConfirm({ style, orientation, annotation1, annotation2, date, enableAnnotations, annotationFont })}
              className={`group relative px-12 py-6 sm:px-16 sm:py-7 transition-all duration-300 border-4 shadow-2xl flex items-center gap-4 active:scale-95 rounded-xl ${isVal ? 'bg-rose-500 hover:bg-rose-600 border-rose-200 shadow-rose-300/50' : 'bg-amber-600 hover:bg-amber-500 border-amber-200'}`}
            >
              <div className={`absolute -inset-1 border opacity-30 group-hover:opacity-100 transition-opacity rounded-xl ${isVal ? 'border-white' : 'border-amber-200'}`}></div>
              <span className={`retro-font text-xl sm:text-3xl font-black uppercase tracking-tighter ${isVal ? 'text-white' : 'text-zinc-950'}`}>
                {isVal ? 'Create Love' : 'Enter The Booth'}
              </span>
              <ChevronRight size={28} className={`${isVal ? 'text-white' : 'text-zinc-950'} group-hover:translate-x-2 transition-transform`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConfigScreen;
