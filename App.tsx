
import React, { useState } from 'react';
import LandingScreen from './components/LandingScreen';
import ConfigScreen from './components/ConfigScreen';
import BoothInterior from './components/BoothInterior';
import ResultView from './components/ResultView';

export enum AppState {
  LANDING = 'LANDING',
  CONFIG = 'CONFIG',
  BOOTH = 'BOOTH',
  RESULTS = 'RESULTS'
}

export type PhotoStyle = 'FILM_ROLL' | 'ANALOG_STRIP' | 'MOVIE_TICKET' | 'RETRO_80S' | 'CAMERA_FRAME' | 'POSTCARD';
export type Orientation = 'VERTICAL' | 'HORIZONTAL';

export interface BoothConfig {
  style: PhotoStyle;
  orientation: Orientation;
}

const App: React.FC = () => {
  const [currentState, setCurrentState] = useState<AppState>(AppState.LANDING);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);
  const [config, setConfig] = useState<BoothConfig>({
    style: 'FILM_ROLL',
    orientation: 'VERTICAL'
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

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-zinc-950 text-amber-50 selection:bg-amber-900">
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
    </div>
  );
};

export default App;
