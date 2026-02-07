
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

function pathHeart(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  // Enhanced heart path: more bulbous and fills the bounding square better
  ctx.beginPath();
  const topCenter = { x: x + w / 2, y: y + h * 0.28 };
  ctx.moveTo(topCenter.x, topCenter.y);
  
  // Left curve
  ctx.bezierCurveTo(
    x + w * 0.15, y - h * 0.05, 
    x - w * 0.15, y + h * 0.35, 
    x + w / 2, y + h * 0.98     
  );
  
  // Right curve
  ctx.bezierCurveTo(
    x + w * 1.15, y + h * 0.35, 
    x + w * 0.85, y - h * 0.05, 
    topCenter.x, topCenter.y     
  );
  ctx.closePath();
}

function pathOval(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.ellipse(x + w / 2, y + h / 2, w / 2, h * 0.45, 0, 0, Math.PI * 2);
  ctx.closePath();
}

function pathCircle(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.beginPath();
  ctx.arc(x + w / 2, y + h / 2, Math.min(w, h) / 2.05, 0, Math.PI * 2);
  ctx.closePath();
}

function drawScallopedBorder(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, color: string, type: 'HEART' | 'CIRCLE' | 'OVAL') {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = 18;
  ctx.setLineDash([15, 12]);
  ctx.lineCap = 'round';
  if (type === 'HEART') pathHeart(ctx, x, y, w, h);
  else if (type === 'OVAL') pathOval(ctx, x, y, w, h);
  else pathCircle(ctx, x, y, w, h);
  ctx.stroke();
  
  ctx.lineWidth = 2;
  ctx.setLineDash([]);
  ctx.globalAlpha = 0.5;
  if (type === 'HEART') pathHeart(ctx, x, y, w, h);
  else if (type === 'OVAL') pathOval(ctx, x, y, w, h);
  else pathCircle(ctx, x, y, w, h);
  ctx.stroke();
  ctx.restore();
}

function drawCherry(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#ff1d58';
  ctx.beginPath(); ctx.arc(x, y, 12, 0, Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(x + 15, y + 5, 12, 0, Math.PI*2); ctx.fill();
  
  ctx.strokeStyle = '#4ade80'; ctx.lineWidth = 3;
  ctx.beginPath(); ctx.moveTo(x, y-5); ctx.quadraticCurveTo(x + 8, y - 30, x + 10, y - 35); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 15, y-1); ctx.quadraticCurveTo(x + 12, y - 30, x + 10, y - 35); ctx.stroke();
  
  ctx.fillStyle = 'white'; ctx.globalAlpha = 0.4;
  ctx.beginPath(); ctx.arc(x-3, y-3, 3, 0, Math.PI*2); ctx.fill();
  ctx.restore();
}

function drawLipPrint(ctx: CanvasRenderingContext2D, x: number, y: number, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = '#ff4d6d';
  ctx.beginPath();
  ctx.ellipse(0, -5, 20, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath();
  ctx.ellipse(0, 5, 20, 10, 0, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawRibbonBow(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, scale = 1) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.fillStyle = color;
  // Left loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(-60, -40, -60, 40, 0, 0);
  ctx.fill();
  // Right loop
  ctx.beginPath();
  ctx.moveTo(0, 0);
  ctx.bezierCurveTo(60, -40, 60, 40, 0, 0);
  ctx.fill();
  // Center knot
  ctx.fillRect(-10, -10, 20, 20);
  ctx.restore();
}

function drawImageCover(ctx: CanvasRenderingContext2D, img: HTMLImageElement, x: number, y: number, w: number, h: number, shape: 'RECT' | 'HEART' | 'CIRCLE' | 'OVAL' = 'RECT') {
  const imgRatio = img.width / img.height;
  const targetRatio = w / h;
  let sWidth, sHeight, sx, sy;
  
  if (imgRatio > targetRatio) {
    sHeight = img.height; sWidth = img.height * targetRatio;
    sx = (img.width - sWidth) / 2; sy = 0;
  } else {
    sWidth = img.width; sHeight = img.width / targetRatio;
    sx = 0; sy = (img.height - sHeight) / 2;
  }
  
  ctx.save();
  if (shape === 'HEART') pathHeart(ctx, x, y, w, h);
  else if (shape === 'CIRCLE') pathCircle(ctx, x, y, w, h);
  else if (shape === 'OVAL') pathOval(ctx, x, y, w, h);
  
  if (shape !== 'RECT') ctx.clip();
  ctx.drawImage(img, sx, sy, sWidth, sHeight, x, y, w, h);
  ctx.restore();
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

  let imgW = 800; let imgH = 600;
  let margin = 120; let spacing = 60;
  let bgColor = '#000';
  const isVal = config.style.startsWith('VAL');

  switch (config.style) {
    case 'FILM_ROLL': bgColor = '#0a0a0a'; margin = 150; spacing = 40; break;
    case 'VAL_BE_MINE': bgColor = '#fff1f2'; margin = 180; spacing = 80; imgW = 850; imgH = 850; break;
    case 'VAL_HAPPY_CHERRY': bgColor = '#fff5f5'; margin = 180; spacing = 80; imgW = 850; imgH = 850; break;
    case 'VAL_BOWS': bgColor = '#fff0f3'; margin = 200; spacing = 100; imgW = 800; imgH = 600; break;
    case 'VAL_KISSES': bgColor = '#fff'; margin = 180; spacing = 90; imgW = 850; imgH = 650; break;
    case 'VAL_RIBBON': bgColor = '#ff1d58'; margin = 220; spacing = 60; imgW = 800; imgH = 600; break;
    default: bgColor = '#000'; margin = 120; spacing = 60; break;
  }

  if (isVertical) {
    canvas.width = imgW + (margin * 2);
    canvas.height = (imgH * 4) + (spacing * 3) + (margin * 2) + 400;
  } else {
    canvas.width = (imgW * 4) + (spacing * 3) + (margin * 2);
    canvas.height = imgH + (margin * 2) + 250;
  }

  ctx.fillStyle = bgColor; ctx.fillRect(0, 0, canvas.width, canvas.height);

  // Background patterns for Valentine
  if (isVal) {
    ctx.save();
    if (config.style === 'VAL_KISSES') {
      for (let i = 0; i < 60; i++) {
        ctx.globalAlpha = 0.1;
        drawLipPrint(ctx, Math.random() * canvas.width, Math.random() * canvas.height, 0.5 + Math.random());
      }
    } else if (config.style === 'VAL_BE_MINE' || config.style === 'VAL_HAPPY_CHERRY') {
      for (let i = 0; i < 40; i++) {
        ctx.globalAlpha = 0.15;
        drawCherry(ctx, Math.random() * canvas.width, Math.random() * canvas.height);
      }
    } else if (config.style === 'VAL_BOWS') {
        for (let i = 0; i < 30; i++) {
            ctx.globalAlpha = 0.1;
            drawRibbonBow(ctx, Math.random() * canvas.width, Math.random() * canvas.height, '#ffb7c5', 0.4);
        }
    }
    ctx.restore();
  }

  images.forEach((img, i) => {
    let x, y;
    if (isVertical) { x = margin; y = margin + (i * (imgH + spacing)); }
    else { x = margin + (i * (imgW + spacing)); y = margin; }

    ctx.save();
    if (isVal) ctx.filter = 'contrast(1.08) brightness(1.02) saturate(1.15)';

    let shape: 'RECT' | 'HEART' | 'CIRCLE' | 'OVAL' = 'RECT';
    if (config.style === 'VAL_BE_MINE') shape = 'CIRCLE';
    else if (config.style === 'VAL_HAPPY_CHERRY') shape = 'HEART';
    else if (config.style === 'VAL_KISSES') shape = 'OVAL';

    if (shape === 'HEART') drawScallopedBorder(ctx, x, y, imgW, imgH, '#ff4d6d', 'HEART');
    if (shape === 'CIRCLE') drawScallopedBorder(ctx, x, y, imgW, imgH, '#ff85a2', 'CIRCLE');
    if (shape === 'OVAL') drawScallopedBorder(ctx, x, y, imgW, imgH, '#ff4d6d', 'OVAL');

    drawImageCover(ctx, img, x, y, imgW, imgH, shape);
    ctx.restore();
    
    // Per frame decorations
    if (config.style === 'VAL_BE_MINE') drawCherry(ctx, x + imgW - 40, y + 40);
    if (config.style === 'VAL_HAPPY_CHERRY') drawCherry(ctx, x + 40, y + 40);
    if (config.style === 'VAL_KISSES') drawLipPrint(ctx, x + imgW - 50, y + 50, 0.8);
  });

  // Header / Decorative elements
  if (isVertical && isVal) {
    ctx.textAlign = 'center';
    ctx.fillStyle = config.style === 'VAL_RIBBON' ? 'white' : '#ff4d6d';
    
    if (config.style === 'VAL_BE_MINE') {
      ctx.font = 'bold 90px "Pacifico"';
      ctx.fillText('Be Mine', canvas.width/2, margin - 60);
    } else if (config.style === 'VAL_HAPPY_CHERRY') {
      ctx.font = 'bold 70px "Pacifico"';
      ctx.fillText('Happy', canvas.width/2, margin - 100);
      ctx.font = 'bold 90px "Bungee Shade"';
      ctx.fillText('VALENTINES', canvas.width/2, margin - 30);
    } else if (config.style === 'VAL_RIBBON') {
      drawRibbonBow(ctx, canvas.width/2, margin - 120, 'white', 1.5);
      ctx.font = 'bold 100px "Bungee Shade"';
      ctx.fillText('VALENTINES', canvas.width/2, margin - 30);
    } else if (config.style === 'VAL_BOWS') {
        drawRibbonBow(ctx, canvas.width/2, margin - 110, '#ff4d6d', 1.8);
    } else if (config.style === 'VAL_KISSES') {
        ctx.font = 'bold 85px "Pacifico"';
        ctx.fillText('Valentine\'s Day', canvas.width/2, margin - 50);
    }
  }

  // Footer Signature
  if (config.enableAnnotations && isVertical) {
    const fy = (imgH * 4) + (spacing * 3) + margin + 140;
    ctx.fillStyle = (isVal && config.style !== 'VAL_RIBBON') ? '#ff4d6d' : (config.style === 'VAL_RIBBON' ? 'white' : '#fff');
    const sigFont = config.annotationFont || (isVal ? 'Pacifico' : 'Playfair Display');
    
    ctx.font = `bold 110px "${sigFont}"`;
    ctx.fillText(config.annotation1 || 'STUDIO', canvas.width/2, fy);
    
    ctx.font = `bold 45px "Special Elite"`;
    ctx.fillText('&', canvas.width/2, fy + 70);
    
    ctx.font = `bold 110px "${sigFont}"`;
    ctx.fillText(config.annotation2 || 'LOVER', canvas.width/2, fy + 160);
    
    ctx.font = '35px monospace';
    ctx.globalAlpha = 0.6;
    ctx.fillText(config.date, canvas.width/2, fy + 240);
    ctx.globalAlpha = 1.0;
  }

  applyGrain(ctx, canvas.width, canvas.height, 18);
};
