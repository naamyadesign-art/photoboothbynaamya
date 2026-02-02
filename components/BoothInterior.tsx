import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Camera, Upload, AlertCircle } from 'lucide-react';
import { BoothConfig } from '../App';
import Marquee from './Marquee';
import { playBeep, playShutter } from '../utils/audio';

interface BoothInteriorProps {
  config: BoothConfig;
  onComplete: (photos: string[]) => void;
}

const BoothInterior: React.FC<BoothInteriorProps> = ({ config, onComplete }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState(false);
  const [capturedSoFar, setCapturedSoFar] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    async function setupCamera() {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ 
          video: { 
            width: { ideal: 1280 },
            height: { ideal: 720 },
            facingMode: 'user'
          } 
        });
        setStream(s);
        if (videoRef.current) {
          videoRef.current.srcObject = s;
        }
      } catch (err) {
        console.warn("Camera access failed, providing upload-only mode", err);
        setError('Camera access denied. You can still upload images below!');
      }
    }
    setupCamera();

    return () => {
      if (stream) {
        stream.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const takeSinglePhoto = useCallback(() => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    const dataUrl = canvas.toDataURL('image/png');
    playShutter();
    setFlash(true);
    setTimeout(() => setFlash(false), 200);
    
    return dataUrl;
  }, []);

  const runCaptureCycle = (currentCount: number) => {
    if (currentCount >= 4) return;

    let seconds = 3;
    setCountdown(seconds);
    playBeep();

    const timer = setInterval(() => {
      seconds -= 1;
      if (seconds > 0) {
        setCountdown(seconds);
        playBeep();
      } else {
        clearInterval(timer);
        setCountdown(null);
        
        const photo = takeSinglePhoto();
        if (photo) {
          setCapturedSoFar(prev => {
            const next = [...prev, photo];
            if (next.length === 4) {
              setTimeout(() => onComplete(next), 600);
            } else {
              setTimeout(() => runCaptureCycle(currentCount + 1), 1000);
            }
            return next;
          });
        }
      }
    }, 1000);
  };

  const startSequence = () => {
    if (isCapturing || isUploading) return;
    setIsCapturing(true);
    runCaptureCycle(0);
  };

  // Fixed error: Argument of type 'unknown' is not assignable to parameter of type 'Blob'
  // by explicitly typing the 'file' argument in the map function.
  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    if (files.length !== 4) {
      alert("Please select exactly 4 images for the photobooth strip.");
      return;
    }

    setIsUploading(true);
    const photoPromises = Array.from(files).map((file: File) => {
      return new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      });
    });

    const photos = await Promise.all(photoPromises);
    onComplete(photos);
  };

  return (
    <div className="relative h-full w-full bg-[#1a0a0a] flex flex-col items-center justify-center p-4 md:p-8 overflow-hidden">
      <div className="absolute top-0 left-0 bottom-0 w-24 md:w-48 velvet-curtain z-0 shadow-2xl"></div>
      <div className="absolute top-0 right-0 bottom-0 w-24 md:w-48 velvet-curtain z-0 shadow-2xl"></div>

      <div className="relative z-10 w-full max-w-4xl flex flex-col gap-6 items-center">
        <div className="flex flex-col items-center gap-2">
          <Marquee size="small" />
          <div className="bg-amber-900/40 px-4 py-1 rounded-full border border-amber-500/30 flex gap-4 retro-font text-[10px] uppercase tracking-tighter text-amber-200">
            <span>Style: {config.style.replace('_', ' ')}</span>
            <span>Orientation: {config.orientation}</span>
          </div>
        </div>

        <div className="relative w-full aspect-[4/3] max-h-[55vh] bg-zinc-900 border-[12px] md:border-[20px] border-zinc-800 shadow-[0_0_50px_rgba(0,0,0,1)] rounded-sm overflow-hidden flex items-center justify-center">
          {error && !stream ? (
            <div className="p-8 text-center retro-font text-amber-500 bg-black/50 border border-amber-900/30 max-w-md">
              <AlertCircle className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p className="text-xl mb-4 font-bold uppercase">Camera Mode Unavailable</p>
              <p className="text-sm opacity-70">No worries! You can still use the "Upload Gallery" option below to create your vintage strip.</p>
            </div>
          ) : (
            <>
              <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover scale-x-[-1]" />
              
              <div className="absolute inset-0 border-[2px] border-amber-500/20 pointer-events-none flex flex-col justify-between p-4">
                <div className="flex justify-between items-start opacity-40">
                  <div className="w-12 h-12 border-t-2 border-l-2 border-amber-400"></div>
                  <div className="w-12 h-12 border-t-2 border-r-2 border-amber-400"></div>
                </div>
                <div className="flex justify-between items-end opacity-40">
                  <div className="w-12 h-12 border-b-2 border-l-2 border-amber-400"></div>
                  <div className="w-12 h-12 border-b-2 border-r-2 border-amber-400"></div>
                </div>
              </div>

              {countdown !== null && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px]">
                  <span className="title-font text-[10rem] md:text-[14rem] text-amber-500 drop-shadow-2xl animate-ping">
                    {countdown}
                  </span>
                </div>
              )}

              <div className={`absolute inset-0 bg-white z-50 transition-opacity duration-75 pointer-events-none ${flash ? 'opacity-100' : 'opacity-0'}`}></div>

              {isCapturing && (
                <div className="absolute top-4 left-4 bg-red-600 px-3 py-1 flex items-center gap-2 retro-font animate-pulse z-20">
                  <div className="w-2 h-2 rounded-full bg-white"></div>
                  REC ({capturedSoFar.length}/4)
                </div>
              )}
            </>
          )}
        </div>

        {!isCapturing && !isUploading && (
          <div className="flex flex-col md:flex-row gap-4 w-full justify-center">
            {stream && (
              <button
                onClick={startSequence}
                className="group flex items-center gap-4 px-10 py-5 bg-red-700 hover:bg-red-600 border-4 border-red-300 shadow-2xl active:scale-95 transition-all"
              >
                <Camera size={28} className="text-white" />
                <span className="retro-font text-xl text-white uppercase font-black tracking-tighter">Live Session</span>
              </button>
            )}

            <button
              onClick={() => fileInputRef.current?.click()}
              className="group flex items-center gap-4 px-10 py-5 bg-zinc-800 hover:bg-zinc-700 border-4 border-zinc-600 shadow-2xl active:scale-95 transition-all"
            >
              <Upload size={28} className="text-amber-400" />
              <div className="text-left">
                <span className="block retro-font text-lg text-amber-100 uppercase font-black leading-none tracking-tighter">Upload Photos</span>
                <span className="retro-font text-[9px] text-amber-400/60 uppercase">Select 4 from gallery</span>
              </div>
            </button>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              multiple 
              onChange={handleFileUpload} 
            />
          </div>
        )}

        {isUploading && (
          <div className="flex flex-col items-center gap-2 animate-pulse">
             <div className="w-8 h-8 border-4 border-amber-500 border-t-transparent rounded-full animate-spin"></div>
             <span className="retro-font text-amber-500 text-sm uppercase">Importing Gallery...</span>
          </div>
        )}
      </div>

      <canvas ref={canvasRef} className="hidden" />
    </div>
  );
};

export default BoothInterior;