import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen.tsx';
import ConfigScreen from './components/ConfigScreen.tsx';
import BoothInterior from './components/BoothInterior.tsx';
import ResultView from './components/ResultView.tsx';

export enum AppState {
  LANDING = 'LANDING',
  CONFIG = 'CONFIG',
  BOOTH = 'BOOTH',
  RESULTS = 'RESULTS'
}

export type PhotoStyle = 
  | 'FILM_ROLL' 
  | 'ANALOG_STRIP' 
  | 'MOVIE_TICKET' 
  | 'RETRO_80S' 
  | 'VINTAGE_TV' 
  | 'POSTCARD'
  | 'VAL_BE_MINE'
  | 'VAL_BOWS'
  | 'VAL_KISSES'
  | 'VAL_RIBBON'
  | 'VAL_HAPPY_CHERRY';

export type Orientation = 'VERTICAL' | 'HORIZONTAL';

export interface BoothConfig {
  style: PhotoStyle;
  orientation: Orientation;
  annotation1: string;
  annotation2: string;
  date: string;
  enableAnnotations: boolean;
  annotationFont: string;
}

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.LANDING);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  
  const now = new Date();

  // Initialize with CLASSIC defaults as requested
  const [config, setConfig] = useState<BoothConfig>({
    style: 'FILM_ROLL',
    orientation: 'VERTICAL',
    annotation1: '',
    annotation2: '',
    date: now.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: '2-digit' }).replace(/\//g, '.'),
    enableAnnotations: true,
    annotationFont: 'Playfair Display'
  });

  const enterConfig = () => setCurrentState(AppState.CONFIG);
  
  const startBooth = (newConfig: BoothConfig) => {
    setConfig(newConfig);
    setCurrentState(AppState.BOOTH);
  };

  const handleCaptureComplete = (photos: string[]) => {
    setCapturedPhotos(photos);
    setCurrentState(AppState.RESULTS);
  };

  const handleRestart = () => {
    setCapturedPhotos([]);
    setCurrentState(AppState.CONFIG);
  };

  const isValentine = config.style.startsWith('VAL');

  return (
    <div className={`relative h-screen w-screen overflow-hidden transition-colors duration-700 ${isValentine ? 'bg-rose-50' : 'bg-zinc-950'} selection:bg-rose-200`}>
      {/* Conditionally render vignette based on theme */}
      <div className={`vignette fixed inset-0 z-[9998] pointer-events-none transition-opacity duration-700 ${isValentine ? 'opacity-0' : 'opacity-100'}`} />

      {currentState === AppState.LANDING && (
        <LandingScreen onEnter={enterConfig} />
      )}
      
      {currentState === AppState.CONFIG && (
        <ConfigScreen onConfirm={startBooth} />
      )}
      
      {currentState === AppState.BOOTH && (
        <BoothInterior config={config} onComplete={handleCaptureComplete} />
      )}

      {currentState === AppState.RESULTS && (
        <ResultView 
          photos={capturedPhotos} 
          config={config}
          onRestart={handleRestart} 
        />
      )}

      {/* Restored static watermark style */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] pointer-events-none transition-all duration-500">
        <span className="retro-font text-[10px] sm:text-xs text-amber-400 font-bold tracking-[0.3em] uppercase bg-black/40 px-4 py-2 rounded-full border border-amber-400/40 backdrop-blur-md shadow-[0_0_20px_rgba(251,191,36,0.2)]">
          @madebynaamya
        </span>
      </div>
    </div>
  );
};

export default App;