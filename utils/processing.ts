
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

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number) {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  
  let sWidth, sHeight, sx, sy;

  if (imgRatio > targetRatio) {
    sHeight = img.height;
    sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2;
    sy = 0;
  } else {
    sWidth = img.width;
    sHeight = img.width / targetRatio;
    sx = 0;
    sy = (img.height - sHeight) / 2;
  }

  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
}

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

export const generateProcessedStrip = async (canvas: HTMLCanvasElement, photos: string[], config: BoothConfig) => {
  const images = await Promise.all(photos.map(loadImage));
  const isVertical = config.orientation === 'VERTICAL';
  const ctx = canvas.getContext('2d')!;

  // Layout Constants
  let imgW = 800;
  let imgH = 600;
  let margin = 120;
  let spacing = 60;
  let bgColor = '#000';

  // Override by Style
  switch (config.style) {
    case 'FILM_ROLL':
      bgColor = '#0a0a0a';
      margin = 150;
      spacing = 40;
      break;
    case 'ANALOG_STRIP':
      bgColor = '#2a1a0a'; // Dark brownish/sepia theme
      margin = 80;
      spacing = 20;
      break;
    case 'MOVIE_TICKET':
      bgColor = '#ffffff';
      imgW = 600;
      imgH = 450;
      margin = 100;
      spacing = 150;
      break;
    case 'VINTAGE_TV':
      bgColor = '#222';
      margin = 100;
      spacing = 80;
      break;
    case 'POSTCARD':
      bgColor = '#fcf3e0';
      margin = 100;
      spacing = 60;
      break;
  }

  // Canvas Sizing
  if (isVertical) {
    canvas.width = imgW + (margin * 2);
    canvas.height = (imgH * 4) + (spacing * 3) + (margin * 2);
    if (config.style === 'FILM_ROLL') canvas.height += 400; // room for footer
  } else {
    canvas.width = (imgW * 4) + (spacing * 3) + (margin * 2);
    canvas.height = imgH + (margin * 2);
  }

  // Background
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Global Textures
  if (config.style === 'POSTCARD') {
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    for(let i=0; i<canvas.height; i+=40) {
      ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(canvas.width, i); ctx.stroke();
    }
  }

  images.forEach((img, i) => {
    let x, y;
    if (isVertical) {
      x = margin;
      y = margin + (i * (imgH + spacing));
    } else {
      x = margin + (i * (imgW + spacing));
      y = margin;
    }

    ctx.save();

    // FILTERS
    switch (config.style) {
      case 'ANALOG_STRIP': ctx.filter = 'sepia(0.5) contrast(1.1) brightness(0.9)'; break;
      case 'FILM_ROLL': ctx.filter = 'grayscale(1) contrast(1.2) brightness(1.1)'; break;
      case 'MOVIE_TICKET': ctx.filter = 'grayscale(1) contrast(1.3) brightness(1.05)'; break;
      case 'POSTCARD': ctx.filter = 'sepia(0.4) contrast(0.9) brightness(1.05)'; break;
      case 'VINTAGE_TV': ctx.filter = 'saturate(0.5) contrast(1.1) brightness(0.9)'; break;
    }

    // FRAMES
    if (config.style === 'VINTAGE_TV') {
      // Draw TV Body
      ctx.fillStyle = '#4a3a2a';
      ctx.beginPath();
      ctx.roundRect(x - 40, y - 40, imgW + 200, imgH + 80, 40);
      ctx.fill();
      ctx.strokeStyle = '#222'; ctx.lineWidth = 10; ctx.stroke();
      
      // Screen inset
      ctx.fillStyle = '#000';
      ctx.beginPath();
      ctx.roundRect(x - 10, y - 10, imgW + 20, imgH + 20, 30);
      ctx.fill();
      
      // Knobs area
      ctx.fillStyle = '#333';
      ctx.fillRect(x + imgW + 15, y - 20, 130, imgH + 40);
      // Knobs
      ctx.fillStyle = '#666';
      ctx.beginPath(); ctx.arc(x + imgW + 80, y + 80, 30, 0, Math.PI*2); ctx.fill();
      ctx.beginPath(); ctx.arc(x + imgW + 80, y + 200, 25, 0, Math.PI*2); ctx.fill();
    } else if (config.style === 'MOVIE_TICKET') {
      ctx.strokeStyle = '#000';
      ctx.lineWidth = 2;
      ctx.strokeRect(x, y, imgW, imgH);
    }

    // DRAW THE IMAGE
    drawImageCover(ctx, img, x, y, imgW, imgH);

    ctx.restore();

    // PER-FRAME OVERLAYS
    if (config.style === 'FILM_ROLL') {
      ctx.fillStyle = '#fff';
      const hw = 60, hh = 45, hg = 30;
      // White sprocket holes
      for (let sy = y - 10; sy < y + imgH + 10; sy += (hh + hg)) {
        ctx.beginPath(); ctx.roundRect(40, sy, hw, hh, 8); ctx.fill();
        ctx.beginPath(); ctx.roundRect(canvas.width - 40 - hw, sy, hw, hh, 8); ctx.fill();
      }
      // Yellow markers
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 30px Arial';
      ctx.fillText((3 + i).toString(), 110, y + 40);
      ctx.fillText((3 + i) + 'A', 110, y + imgH - 10);
      ctx.beginPath();
      ctx.moveTo(110, y + imgH - 50); ctx.lineTo(130, y + imgH - 40); ctx.lineTo(110, y + imgH - 30); ctx.fill();
    } else if (config.style === 'MOVIE_TICKET') {
      // Ticket Text
      ctx.fillStyle = '#000';
      ctx.font = 'bold 35px "Special Elite"';
      ctx.fillText('ONE WAY TICKET', x, y - 25);
      ctx.font = '35px "Special Elite"';
      ctx.fillText('back', x + 310, y - 25);
      
      ctx.textAlign = 'right';
      ctx.font = '35px "Special Elite"';
      ctx.fillText('to the', x + imgW + 200, y - 50);
      ctx.fillText('childhood', x + imgW + 200, y - 15);
      
      // Metadata
      ctx.textAlign = 'left';
      ctx.font = '22px Arial';
      ctx.fillText('ADMISSION ________ $ 138', x + imgW + 20, y + 100);
      ctx.fillText('THURSDAY ____ 20/01/25', x + imgW + 20, y + 150);
      ctx.fillText('CARNIVAL ____ RUSSIA', x + imgW + 20, y + 200);

      // Barcode
      ctx.save();
      ctx.translate(x + imgW + 250, y + 10);
      ctx.rotate(Math.PI/2);
      ctx.fillRect(0, 0, 300, 10); ctx.fillRect(0, 20, 300, 5); ctx.fillRect(0, 35, 300, 15);
      ctx.fillRect(0, 60, 300, 5); ctx.fillRect(0, 75, 300, 10); ctx.fillRect(0, 95, 300, 20);
      ctx.font = '14px Arial'; ctx.fillText('932489100034 KLD', 10, 115);
      ctx.restore();
      
      // Serrated line
      ctx.setLineDash([10, 10]);
      ctx.beginPath(); ctx.moveTo(x + imgW + 5, y - 80); ctx.lineTo(x + imgW + 5, y + imgH + 80); ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // STRIP FOOTERS
  if (config.style === 'FILM_ROLL' && isVertical) {
    const fy = margin + (4 * (imgH + spacing)) + 50;
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    ctx.font = '80px "Playfair Display"'; ctx.fillText('OLIVIA', canvas.width/2, fy + 100);
    ctx.font = '40px serif'; ctx.fillText('+', canvas.width/2, fy + 170);
    ctx.font = '80px "Playfair Display"'; ctx.fillText('ETHAN', canvas.width/2, fy + 260);
    ctx.font = '30px monospace'; ctx.fillText('01.01.25', canvas.width/2, fy + 330);
  } else if (config.style === 'POSTCARD') {
    const sx = canvas.width - 250, sy = 100;
    ctx.strokeStyle = '#444'; ctx.lineWidth = 3; ctx.strokeRect(sx, sy, 150, 180);
    ctx.fillStyle = '#444'; ctx.font = 'bold 30px "Special Elite"'; ctx.fillText('STAMP', sx + 30, sy + 100);
    // address lines
    ctx.beginPath(); ctx.moveTo(canvas.width/2, canvas.height - 250); ctx.lineTo(canvas.width - 100, canvas.height - 250); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(canvas.width/2, canvas.height - 180); ctx.lineTo(canvas.width - 100, canvas.height - 180); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(canvas.width/2, canvas.height - 110); ctx.lineTo(canvas.width - 100, canvas.height - 110); ctx.stroke();
  }

  applyGrain(ctx, canvas.width, canvas.height, 25);
};
