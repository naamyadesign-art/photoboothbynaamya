
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
      bgColor = '#2a1a0a'; 
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
      bgColor = '#0f0f0f';
      margin = 320; 
      spacing = 160;
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
    // Only add extra room for annotations if enabled
    if (config.style === 'FILM_ROLL' && config.enableAnnotations) canvas.height += 400;
    if (config.style === 'VINTAGE_TV') canvas.height += 200;
  } else {
    canvas.width = (imgW * 4) + (spacing * 3) + (margin * 2);
    canvas.height = imgH + (margin * 2);
    if (config.style === 'VINTAGE_TV') canvas.width += 400;
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
      case 'VINTAGE_TV': ctx.filter = 'saturate(0.4) contrast(1.1) brightness(0.95)'; break;
    }

    // FRAMES
    if (config.style === 'VINTAGE_TV') {
      const bodyColor = i % 2 === 0 ? '#5a4638' : '#3d3025';
      ctx.fillStyle = bodyColor;
      ctx.beginPath();
      ctx.roundRect(x - 100, y - 80, imgW + 280, imgH + 160, 50);
      ctx.fill();
      ctx.strokeStyle = '#111'; ctx.lineWidth = 15; ctx.stroke();
      
      ctx.fillStyle = '#080808';
      ctx.beginPath();
      ctx.roundRect(x - 20, y - 20, imgW + 40, imgH + 40, 25);
      ctx.fill();
      
      ctx.fillStyle = '#151515';
      ctx.fillRect(x + imgW + 30, y - 50, 130, imgH + 100);
      
      ctx.fillStyle = '#777';
      ctx.beginPath(); ctx.arc(x + imgW + 95, y + 100, 40, 0, Math.PI*2); ctx.fill();
      ctx.strokeStyle = '#333'; ctx.lineWidth = 4; ctx.stroke();
      
      ctx.beginPath(); ctx.arc(x + imgW + 95, y + 250, 30, 0, Math.PI*2); ctx.fill();
      ctx.stroke();
      
      ctx.strokeStyle = '#222'; ctx.lineWidth = 4;
      for (let gy = y + 340; gy < y + imgH + 20; gy += 15) {
        ctx.beginPath(); ctx.moveTo(x + imgW + 45, gy); ctx.lineTo(x + imgW + 145, gy); ctx.stroke();
      }
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
      for (let sy = y - 10; sy < y + imgH + 10; sy += (hh + hg)) {
        ctx.beginPath(); ctx.roundRect(40, sy, hw, hh, 8); ctx.fill();
        ctx.beginPath(); ctx.roundRect(canvas.width - 40 - hw, sy, hw, hh, 8); ctx.fill();
      }
      ctx.fillStyle = '#facc15';
      ctx.font = 'bold 30px Arial';
      ctx.fillText((3 + i).toString(), 110, y + 40);
      ctx.fillText((3 + i) + 'A', 110, y + imgH - 10);
      ctx.beginPath();
      ctx.moveTo(110, y + imgH - 50); ctx.lineTo(130, y + imgH - 40); ctx.lineTo(110, y + imgH - 30); ctx.fill();
    } else if (config.style === 'MOVIE_TICKET') {
      ctx.fillStyle = '#000';
      ctx.font = 'bold 35px "Special Elite"';
      ctx.fillText('ONE WAY TICKET', x, y - 25);
      ctx.font = '35px "Special Elite"';
      ctx.fillText('back', x + 310, y - 25);
      
      ctx.textAlign = 'right';
      ctx.font = '35px "Special Elite"';
      ctx.fillText('to the', x + imgW + 200, y - 50);
      ctx.fillText('childhood', x + imgW + 200, y - 15);
      
      ctx.textAlign = 'left';
      ctx.font = '22px Arial';
      ctx.fillText('ADMISSION ________ $ 138', x + imgW + 20, y + 100);
      ctx.fillText('THURSDAY ____ 20/01/25', x + imgW + 20, y + 150);
      ctx.fillText('CARNIVAL ____ RUSSIA', x + imgW + 20, y + 200);

      ctx.save();
      ctx.translate(x + imgW + 250, y + 10);
      ctx.rotate(Math.PI/2);
      ctx.fillRect(0, 0, 300, 10); ctx.fillRect(0, 20, 300, 5); ctx.fillRect(0, 35, 300, 15);
      ctx.fillRect(0, 60, 300, 5); ctx.fillRect(0, 75, 300, 10); ctx.fillRect(0, 95, 300, 20);
      ctx.font = '14px Arial'; ctx.fillText('932489100034 KLD', 10, 115);
      ctx.restore();
      
      ctx.setLineDash([10, 10]);
      ctx.beginPath(); ctx.moveTo(x + imgW + 5, y - 80); ctx.lineTo(x + imgW + 5, y + imgH + 80); ctx.stroke();
      ctx.setLineDash([]);
    }
  });

  // STRIP FOOTERS
  if (config.style === 'FILM_ROLL' && isVertical && config.enableAnnotations) {
    const fy = margin + (4 * (imgH + spacing)) + 50;
    ctx.fillStyle = '#fff'; ctx.textAlign = 'center';
    
    // Custom Annotation 1
    ctx.font = '80px "Playfair Display"'; 
    ctx.fillText(config.annotation1 || 'NAME ONE', canvas.width/2, fy + 100);
    
    ctx.font = '40px serif'; 
    ctx.fillText('+', canvas.width/2, fy + 170);
    
    // Custom Annotation 2
    ctx.font = '80px "Playfair Display"'; 
    ctx.fillText(config.annotation2 || 'NAME TWO', canvas.width/2, fy + 260);
    
    // Custom Date
    ctx.font = '30px monospace'; 
    ctx.fillText(config.date || '01.01.25', canvas.width/2, fy + 330);
  } else if (config.style === 'POSTCARD') {
    const sx = canvas.width - 250, sy = 100;
    ctx.strokeStyle = '#444'; ctx.lineWidth = 3; ctx.strokeRect(sx, sy, 150, 180);
    ctx.fillStyle = '#444'; ctx.font = 'bold 30px "Special Elite"'; ctx.fillText('STAMP', sx + 30, sy + 100);
    ctx.beginPath(); ctx.moveTo(canvas.width/2, canvas.height - 250); ctx.lineTo(canvas.width - 100, canvas.height - 250); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(canvas.width/2, canvas.height - 180); ctx.lineTo(canvas.width - 100, canvas.height - 180); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(canvas.width/2, canvas.height - 110); ctx.lineTo(canvas.width - 100, canvas.height - 110); ctx.stroke();
  }

  applyGrain(ctx, canvas.width, canvas.height, 25);
};
