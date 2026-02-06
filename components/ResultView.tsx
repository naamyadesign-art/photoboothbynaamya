
import React, { useEffect, useState, useRef } from 'react';
import { Download, RefreshCw } from 'lucide-react';
import { BoothConfig } from '../App.tsx';
import { generateProcessedStrip } from '../utils/processing.ts';

interface ResultViewProps {
  photos: string[];
  config: BoothConfig;
  onRestart: () => void;
}

const ResultView: React.FC<ResultViewProps> = ({ photos, config, onRestart }) => {
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const processImages = async () => {
      if (!canvasRef.current) return;
      setIsProcessing(true);
      
      const canvas = canvasRef.current;
      await generateProcessedStrip(canvas, photos, config);
      
      setResultUrl(canvas.toDataURL('image/png', 1.0));
      setIsProcessing(false);
    };

    processImages();
  }, [photos, config]);

  const handleDownload = () => {
    if (!resultUrl) return;
    const link = document.createElement('a');
    link.download = `carnival-${config.style}-${config.orientation}-${Date.now()}.png`;
    link.href = resultUrl;
    link.click();
  };

  return (
    <div className="relative h-full w-full bg-[#1a0a0a] flex flex-col items-center overflow-y-auto p-4 md:p-8">
      <div className="fixed inset-0 opacity-10 pointer-events-none">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/aged-paper.png')]"></div>
      </div>

      <div className="relative z-10 w-full max-w-5xl flex flex-col items-center gap-8 py-10 md:py-16 pb-32">
        <div className="text-center">
          <h2 className="title-font text-5xl md:text-7xl text-amber-400 drop-shadow-md">
            VOILÀ!
          </h2>
          <p className="retro-font text-amber-200/60 mt-2 uppercase tracking-[0.3em]">Your Masterpiece is Developed</p>
        </div>

        <div className="relative group p-4 bg-zinc-900 border border-amber-900/20 shadow-2xl">
          {isProcessing ? (
            <div className={`flex flex-col items-center justify-center bg-zinc-950 border-2 border-zinc-800 rounded-sm ${config.orientation === 'VERTICAL' ? 'w-[300px] h-[600px]' : 'w-[800px] h-[300px] max-w-full'}`}>
              <RefreshCw className="w-12 h-12 animate-spin text-amber-600 mb-4" />
              <p className="retro-font text-amber-600 animate-pulse uppercase">Developing Film...</p>
            </div>
          ) : (
            <div className="overflow-hidden">
              <img 
                src={resultUrl || ''} 
                alt="Photobooth Strip" 
                className="max-w-full max-h-[75vh] block shadow-2xl transition-transform hover:scale-[1.01]"
              />
            </div>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <button
            onClick={handleDownload}
            disabled={isProcessing}
            className="group flex items-center gap-3 px-10 py-5 bg-amber-600 hover:bg-amber-500 border-4 border-amber-200 shadow-xl active:scale-95 transition-all disabled:opacity-50"
          >
            <Download size={24} className="text-zinc-950" />
            <span className="retro-font text-xl text-zinc-950 uppercase font-bold">Collect Strip</span>
          </button>

          <button
            onClick={onRestart}
            className="group flex items-center gap-2 px-8 py-5 border-2 border-zinc-700 hover:bg-zinc-800/50 text-zinc-300 transition-all active:scale-95"
          >
            <RefreshCw size={20} />
            <span className="retro-font uppercase">Take More Photos</span>
          </button>
        </div>
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default ResultView;
