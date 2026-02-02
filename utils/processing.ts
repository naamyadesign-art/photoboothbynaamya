
import { BoothConfig } from '../App.tsx';

const loadImage = (url: string): Promise<HTMLImageElement> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = url;
  });
};

const applyGrain = (ctx: CanvasRenderingContext2D, width: number, height: number, intensity: number = 20) => {
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;
  for (let i = 0; i < data.length; i += 4) {
    const grain = (Math.random() - 0.5) * intensity;
    data[i] = Math.min(255, Math.max(0, data[i] + grain));
    data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + grain));
    data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + grain));
  }
  ctx.putImageData(imageData, 0, 0);
};

// Helper for serrated edges (Tickets)
const drawSerratedLine = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, size: number) => {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const distance = Math.sqrt(dx * dx + dy * dy);
  const steps = Math.floor(distance / (size * 2));
  
  ctx.save();
  ctx.globalCompositeOperation = 'destination-out';
  for (let i = 0; i <= steps; i++) {
    const px = x1 + (dx / steps) * i;
    const py = y1 + (dy / steps) * i;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
};

export const generateProcessedStrip = async (canvas: HTMLCanvasElement, photos: string[], config: BoothConfig) => {
  const images = await Promise.all(photos.map(loadImage));
  const isVertical = config.orientation === 'VERTICAL';
  
  const imgW = 800;
  const imgH = 600;
  const margin = 100;
  const spacing = 50;
  
  if (isVertical) {
    canvas.width = imgW + (margin * 2);
    canvas.height = (imgH * 4) + (spacing * 3) + (margin * 2) + (config.style === 'MOVIE_TICKET' ? 100 : 0);
  } else {
    canvas.width = (imgW * 4) + (spacing * 3) + (margin * 2) + (config.style === 'MOVIE_TICKET' ? 100 : 0);
    canvas.height = imgH + (margin * 2);
  }
  
  const ctx = canvas.getContext('2d')!;

  // 1. Background Fill
  switch (config.style) {
    case 'FILM_ROLL': ctx.fillStyle = '#0a0a0a'; break;
    case 'ANALOG_STRIP': ctx.fillStyle = '#f8f8f8'; break;
    case 'MOVIE_TICKET': ctx.fillStyle = '#cc4433'; break; // Vintage red
    case 'RETRO_80S': ctx.fillStyle = '#ffecf2'; break; // Pale pink
    case 'CAMERA_FRAME': ctx.fillStyle = '#222222'; break;
    case 'POSTCARD': ctx.fillStyle = '#ece0c8'; break; // Old paper
  }
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  
  // 2. Main Draw Loop
  images.forEach((img, i) => {
    let x, y;
    // Slight imperfect offset for Analog Strip
    const offset = config.style === 'ANALOG_STRIP' ? (Math.random() - 0.5) * 8 : 0;
    
    if (isVertical) {
      x = margin + offset;
      y = margin + (i * (imgH + spacing));
    } else {
      x = margin + (i * (imgW + spacing));
      y = margin + offset;
    }
    
    ctx.save();
    
    // Applying Style Specific Filters
    switch (config.style) {
      case 'FILM_ROLL': ctx.filter = 'sepia(0.2) contrast(1.1) brightness(0.95) saturate(1.2)'; break;
      case 'ANALOG_STRIP': ctx.filter = 'contrast(0.95) saturate(0.8) brightness(1.02) sepia(0.05)'; break;
      case 'MOVIE_TICKET': ctx.filter = 'contrast(1.2) grayscale(0.2) sepia(0.1)'; break;
      case 'RETRO_80S': ctx.filter = 'saturate(1.5) brightness(1.1) contrast(1.05)'; break;
      case 'CAMERA_FRAME': ctx.filter = 'contrast(1.1) brightness(0.9) grayscale(0.1)'; break;
      case 'POSTCARD': ctx.filter = 'sepia(0.3) contrast(1) brightness(1) saturate(0.9)'; break;
    }

    // Border/Container for each photo
    if (config.style === 'ANALOG_STRIP') {
      ctx.shadowColor = 'rgba(0,0,0,0.1)'; ctx.shadowBlur = 20;
    } else if (config.style === 'POSTCARD') {
      // Rounded corners for postcard photos
      ctx.beginPath();
      ctx.roundRect(x, y, imgW, imgH, 15);
      ctx.clip();
    }
    
    ctx.drawImage(img, x, y, imgW, imgH);
    ctx.restore();

    // 3. Style Specific Overlays (Per Photo)
    if (config.style === 'FILM_ROLL') {
       // Sprockets
       ctx.fillStyle = '#000';
       const holeW = 40; const holeH = 30; const holes = 12;
       if (isVertical) {
         for(let s=0; s<holes; s++) {
           const sy = y + (s * (imgH/holes)) + 10;
           ctx.beginPath(); ctx.roundRect(margin/4, sy, holeW, holeH, 6); ctx.fill();
           ctx.beginPath(); ctx.roundRect(canvas.width - margin/4 - holeW, sy, holeW, holeH, 6); ctx.fill();
         }
       } else {
          for(let s=0; s<holes; s++) {
            const sx = x + (s * (imgW/holes)) + 10;
            ctx.beginPath(); ctx.roundRect(sx, margin/4, holeW, holeH, 6); ctx.fill();
            ctx.beginPath(); ctx.roundRect(sx, canvas.height - margin/4 - holeH, holeW, holeH, 6); ctx.fill();
          }
       }
    } else if (config.style === 'RETRO_80S') {
       // Random doodles
       ctx.strokeStyle = '#ff77aa'; ctx.lineWidth = 5; ctx.globalAlpha = 0.6;
       if (i % 2 === 0) {
         // Star
         ctx.beginPath(); ctx.moveTo(x+30, y+30); ctx.lineTo(x+50, y+80); ctx.lineTo(x+10, y+50); ctx.lineTo(x+60, y+50); ctx.lineTo(x+20, y+80); ctx.closePath(); ctx.stroke();
       } else {
         // Heart
         ctx.beginPath(); ctx.moveTo(x+imgW-50, y+50); ctx.bezierCurveTo(x+imgW-50, y+47, x+imgW-55, y+35, x+imgW-75, y+35); ctx.bezierCurveTo(x+imgW-95, y+35, x+imgW-95, y+62, x+imgW-95, y+62); ctx.bezierCurveTo(x+imgW-95, y+80, x+imgW-75, y+102, x+imgW-50, y+120); ctx.stroke();
       }
       ctx.globalAlpha = 1.0;
    } else if (config.style === 'CAMERA_FRAME') {
       // Viewfinder UI
       ctx.strokeStyle = '#fff'; ctx.lineWidth = 2; ctx.globalAlpha = 0.4;
       ctx.strokeRect(x+50, y+50, 100, 100); // Focus box
       ctx.fillStyle = '#fff'; ctx.font = '20px Arial'; ctx.fillText('REC', x+70, y+40);
       ctx.globalAlpha = 1.0;
    }
  });

  // 4. Global Overlays (Whole Strip)
  if (config.style === 'MOVIE_TICKET') {
    // Ticket Serrations
    const holeSize = 25;
    if (isVertical) {
       drawSerratedLine(ctx, 0, 0, 0, canvas.height, holeSize);
       drawSerratedLine(ctx, canvas.width, 0, canvas.width, canvas.height, holeSize);
       // Internal dividers
       images.forEach((_, i) => {
         if (i < 3) {
           const dy = margin + (i + 1) * (imgH + spacing) - (spacing/2);
           ctx.setLineDash([15, 15]); ctx.strokeStyle = '#aa2211'; ctx.lineWidth = 4;
           ctx.beginPath(); ctx.moveTo(50, dy); ctx.lineTo(canvas.width - 50, dy); ctx.stroke();
           ctx.setLineDash([]);
         }
       });
    } else {
       drawSerratedLine(ctx, 0, 0, canvas.width, 0, holeSize);
       drawSerratedLine(ctx, 0, canvas.height, canvas.width, canvas.height, holeSize);
    }
    // Typography
    ctx.fillStyle = '#ffdd99'; ctx.font = 'bold 40px "Special Elite"'; ctx.textAlign = 'center';
    if(isVertical) ctx.fillText('ADMIT ONE • PHOTOGRAPHE', canvas.width/2, canvas.height - 40);
  } else if (config.style === 'POSTCARD') {
    // Stamp and branding
    ctx.fillStyle = '#443322'; ctx.font = '30px "Special Elite"'; ctx.globalAlpha = 0.5;
    const cornerX = canvas.width - 150; const cornerY = canvas.height - 150;
    ctx.strokeRect(cornerX, cornerY, 100, 120);
    ctx.fillText('STAMP', cornerX + 50, cornerY + 70);
    ctx.globalAlpha = 1.0;
  }

  // Final Film Grain
  applyGrain(ctx, canvas.width, canvas.height, config.style === 'ANALOG_STRIP' ? 12 : 20);
};
