import { FrameOption } from '../types';

export const PHOTO_FRAMES: FrameOption[] = [
  {
    id: 'none',
    name: 'No Frame',
    mode: 'photo',
    description: 'Clean capture without border or overlays',
  },
  {
    id: 'photo-polaroid',
    name: 'Classic Polaroid',
    mode: 'photo',
    description: 'Vintage instant photo white border with wide signature bottom',
    accentColor: '#f5f5f0',
  },
  {
    id: 'photo-gold',
    name: 'Golden Filigree',
    mode: 'photo',
    description: 'Luxury gold double rim with ornate corner brackets',
    accentColor: '#d4af37',
  },
  {
    id: 'photo-film',
    name: '35mm Filmstrip',
    mode: 'photo',
    description: 'Analogue 35mm negative border with sprockets & frame numbers',
    accentColor: '#1a1a1a',
  },
  {
    id: 'photo-cyber',
    name: 'Cyberpunk Neon',
    mode: 'photo',
    description: 'High-tech cyan & magenta targeting brackets and grid matrix',
    accentColor: '#00f0ff',
  },
  {
    id: 'photo-wood',
    name: 'Walnut Wood',
    mode: 'photo',
    description: 'Warm natural polished wood grain border with inner depth shadow',
    accentColor: '#5c3a21',
  },
  {
    id: 'photo-stamp',
    name: 'Postage Stamp',
    mode: 'photo',
    description: 'Scalloped stamp perforations with authentic postal stamp mark',
    accentColor: '#e2d7c3',
  },
];

export const VIDEO_FRAMES: FrameOption[] = [
  {
    id: 'none',
    name: 'Standard Video',
    mode: 'video',
    description: 'Clean high-definition stream without overlays',
  },
  {
    id: 'video-rec-hud',
    name: 'Broadcast REC HUD',
    mode: 'video',
    description: 'Studio camera viewfinder with blinking red REC, ISO 800 & safe zone',
    accentColor: '#ef4444',
  },
  {
    id: 'video-cinematic',
    name: 'Cinematic 2.39:1',
    mode: 'video',
    description: 'Anamorphic theatrical widescreen letterbox with warm lens tint',
    accentColor: '#000000',
  },
  {
    id: 'video-vhs',
    name: 'VHS Camcorder 1998',
    mode: 'video',
    description: 'Retro home video timestamp, SP mode indicator & subtle tracking glow',
    accentColor: '#38bdf8',
  },
  {
    id: 'video-news',
    name: 'Live News Broadcast',
    mode: 'video',
    description: 'Breaking news lower-third banner with live stream indicator',
    accentColor: '#dc2626',
  },
  {
    id: 'video-sports',
    name: 'Sports Action HUD',
    mode: 'video',
    description: 'Extreme telemetry speedometer, altitude indicator & GPS compass',
    accentColor: '#10b981',
  },
];

/**
 * Draw frame overlay directly onto Canvas 2D Context
 * for baking frames into captured pictures or video frames
 */
export function drawFrameOnCanvas(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  frameId: string,
  mode: 'photo' | 'video',
  timeSeconds = 0
) {
  if (!frameId || frameId === 'none') return;

  ctx.save();

  if (mode === 'photo') {
    switch (frameId) {
      case 'photo-polaroid': {
        const borderSide = Math.max(16, Math.round(width * 0.04));
        const borderTop = Math.max(16, Math.round(height * 0.04));
        const borderBottom = Math.max(50, Math.round(height * 0.16));

        ctx.fillStyle = '#f8f8f4';
        // Top
        ctx.fillRect(0, 0, width, borderTop);
        // Bottom
        ctx.fillRect(0, height - borderBottom, width, borderBottom);
        // Left
        ctx.fillRect(0, 0, borderSide, height);
        // Right
        ctx.fillRect(width - borderSide, 0, borderSide, height);

        // Polaroid shadow line
        ctx.strokeStyle = '#e0dfd5';
        ctx.lineWidth = 2;
        ctx.strokeRect(borderSide, borderTop, width - borderSide * 2, height - borderTop - borderBottom);

        // Date imprint
        ctx.fillStyle = '#6b7280';
        ctx.font = `${Math.max(14, Math.round(height * 0.024))}px sans-serif`;
        ctx.textAlign = 'center';
        const dateStr = new Date().toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'short',
          day: 'numeric',
        });
        ctx.fillText(`LIVE SHARE • ${dateStr}`, width / 2, height - borderBottom / 2 + 5);
        break;
      }

      case 'photo-gold': {
        const inset = Math.max(18, Math.round(Math.min(width, height) * 0.035));
        ctx.strokeStyle = '#d4af37';
        ctx.lineWidth = Math.max(3, Math.round(Math.min(width, height) * 0.008));
        ctx.strokeRect(inset, inset, width - inset * 2, height - inset * 2);

        // Inner thin line
        const innerInset = inset + 8;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#f5e08b';
        ctx.strokeRect(innerInset, innerInset, width - innerInset * 2, height - innerInset * 2);

        // Ornate corner brackets
        const cornerSize = Math.max(24, Math.round(Math.min(width, height) * 0.05));
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#b8860b';

        // TL
        ctx.beginPath();
        ctx.moveTo(inset, inset + cornerSize);
        ctx.lineTo(inset, inset);
        ctx.lineTo(inset + cornerSize, inset);
        ctx.stroke();

        // TR
        ctx.beginPath();
        ctx.moveTo(width - inset - cornerSize, inset);
        ctx.lineTo(width - inset, inset);
        ctx.lineTo(width - inset, inset + cornerSize);
        ctx.stroke();

        // BL
        ctx.beginPath();
        ctx.moveTo(inset, height - inset - cornerSize);
        ctx.lineTo(inset, height - inset);
        ctx.lineTo(inset + cornerSize, height - inset);
        ctx.stroke();

        // BR
        ctx.beginPath();
        ctx.moveTo(width - inset - cornerSize, height - inset);
        ctx.lineTo(width - inset, height - inset);
        ctx.lineTo(width - inset, height - inset - cornerSize);
        ctx.stroke();
        break;
      }

      case 'photo-film': {
        const stripHeight = Math.max(28, Math.round(height * 0.08));
        ctx.fillStyle = '#111827';
        ctx.fillRect(0, 0, width, stripHeight);
        ctx.fillRect(0, height - stripHeight, width, stripHeight);

        // Sprocket holes
        const holeWidth = Math.max(10, Math.round(width * 0.02));
        const holeHeight = Math.max(12, Math.round(stripHeight * 0.45));
        const gap = holeWidth * 1.8;
        ctx.fillStyle = '#ffffff';

        for (let x = 12; x < width - 12; x += gap) {
          // Top sprockets
          ctx.beginPath();
          ctx.roundRect(x, (stripHeight - holeHeight) / 2, holeWidth, holeHeight, 2);
          ctx.fill();

          // Bottom sprockets
          ctx.beginPath();
          ctx.roundRect(x, height - stripHeight + (stripHeight - holeHeight) / 2, holeWidth, holeHeight, 2);
          ctx.fill();
        }

        // Film marking
        ctx.fillStyle = '#eab308';
        ctx.font = `bold ${Math.max(10, Math.round(stripHeight * 0.3))}px monospace`;
        ctx.fillText('KODAK 400 • LIVE 35MM', 20, stripHeight - 4);
        ctx.fillText('EXP 24A • ISO 400', width - 180, height - 8);
        break;
      }

      case 'photo-cyber': {
        const pad = Math.max(20, Math.round(Math.min(width, height) * 0.04));
        const bracketLen = Math.max(35, Math.round(Math.min(width, height) * 0.08));

        ctx.strokeStyle = '#00f0ff';
        ctx.lineWidth = 3;
        ctx.shadowColor = '#00f0ff';
        ctx.shadowBlur = 10;

        // Corners
        ctx.beginPath();
        ctx.moveTo(pad, pad + bracketLen);
        ctx.lineTo(pad, pad);
        ctx.lineTo(pad + bracketLen, pad);

        ctx.moveTo(width - pad - bracketLen, pad);
        ctx.lineTo(width - pad, pad);
        ctx.lineTo(width - pad, pad + bracketLen);

        ctx.moveTo(pad, height - pad - bracketLen);
        ctx.lineTo(pad, height - pad);
        ctx.lineTo(pad + bracketLen, height - pad);

        ctx.moveTo(width - pad - bracketLen, height - pad);
        ctx.lineTo(width - pad, height - pad);
        ctx.lineTo(width - pad, height - pad - bracketLen);
        ctx.stroke();

        // Crosshair center
        ctx.strokeStyle = 'rgba(0, 240, 255, 0.6)';
        ctx.lineWidth = 1.5;
        const cx = width / 2;
        const cy = height / 2;
        ctx.beginPath();
        ctx.arc(cx, cy, 25, 0, Math.PI * 2);
        ctx.moveTo(cx - 35, cy);
        ctx.lineTo(cx + 35, cy);
        ctx.moveTo(cx, cy - 35);
        ctx.lineTo(cx, cy + 35);
        ctx.stroke();

        ctx.fillStyle = '#00f0ff';
        ctx.font = '12px monospace';
        ctx.fillText('LIVE TARGET // 4K LOCK', pad + 4, pad - 6);
        ctx.fillText('REC-SHARE READY', width - pad - 120, height - pad + 15);
        break;
      }

      case 'photo-wood': {
        const border = Math.max(20, Math.round(Math.min(width, height) * 0.045));
        ctx.fillStyle = '#4a2c16';
        ctx.fillRect(0, 0, width, border);
        ctx.fillRect(0, height - border, width, border);
        ctx.fillRect(0, 0, border, height);
        ctx.fillRect(width - border, 0, border, height);

        // Inner bevel
        ctx.strokeStyle = '#6e4324';
        ctx.lineWidth = 3;
        ctx.strokeRect(border - 2, border - 2, width - border * 2 + 4, height - border * 2 + 4);

        ctx.strokeStyle = '#2d180a';
        ctx.lineWidth = 2;
        ctx.strokeRect(border, border, width - border * 2, height - border * 2);
        break;
      }

      case 'photo-stamp': {
        const border = Math.max(22, Math.round(Math.min(width, height) * 0.04));
        ctx.fillStyle = '#fdfbf7';
        ctx.fillRect(0, 0, width, border);
        ctx.fillRect(0, height - border, width, border);
        ctx.fillRect(0, 0, border, height);
        ctx.fillRect(width - border, 0, border, height);

        // Postal cancellation circle
        ctx.strokeStyle = 'rgba(180, 50, 50, 0.7)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(width - 70, 70, 42, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(width - 70, 70, 36, 0, Math.PI * 2);
        ctx.stroke();

        ctx.fillStyle = 'rgba(180, 50, 50, 0.8)';
        ctx.font = 'bold 9px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('AIR MAIL • LIVE SHARE', width - 70, 66);
        ctx.fillText('OFFICIAL CAPTURE', width - 70, 78);
        break;
      }
    }
  } else {
    // Video frames
    switch (frameId) {
      case 'video-rec-hud': {
        const pad = 24;
        // Blinking red dot
        const blink = Math.floor(Date.now() / 500) % 2 === 0;
        if (blink) {
          ctx.fillStyle = '#ef4444';
          ctx.beginPath();
          ctx.arc(pad + 10, pad + 10, 8, 0, Math.PI * 2);
          ctx.fill();
        }

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.fillText('REC', pad + 26, pad + 16);

        // Timecode
        const mins = Math.floor(timeSeconds / 60).toString().padStart(2, '0');
        const secs = (timeSeconds % 60).toString().padStart(2, '0');
        const ms = (Math.floor((Date.now() % 1000) / 10)).toString().padStart(2, '0');
        ctx.fillText(`TC 00:${mins}:${secs}:${ms}`, pad + 80, pad + 16);

        // Top right telemetry
        ctx.textAlign = 'right';
        ctx.fillText('4K 60FPS • ISO 400', width - pad, pad + 16);

        // Center safe crosshair
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.lineWidth = 1;
        const cx = width / 2;
        const cy = height / 2;
        ctx.beginPath();
        ctx.moveTo(cx - 20, cy);
        ctx.lineTo(cx + 20, cy);
        ctx.moveTo(cx, cy - 20);
        ctx.lineTo(cx, cy + 20);
        ctx.stroke();

        // Audio level meter on bottom right
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(width - pad - 120, height - pad - 24, 120, 16);
        ctx.fillStyle = '#22c55e';
        const level = 40 + Math.random() * 60;
        ctx.fillRect(width - pad - 118, height - pad - 22, level, 12);
        ctx.fillStyle = '#ffffff';
        ctx.font = '10px monospace';
        ctx.textAlign = 'left';
        ctx.fillText('CH1 L/R', width - pad - 116, height - pad - 12);
        break;
      }

      case 'video-cinematic': {
        const barHeight = Math.round(height * 0.12);
        ctx.fillStyle = '#050505';
        ctx.fillRect(0, 0, width, barHeight);
        ctx.fillRect(0, height - barHeight, width, barHeight);

        // Thin golden highlight
        ctx.strokeStyle = 'rgba(212, 175, 55, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(0, barHeight);
        ctx.lineTo(width, barHeight);
        ctx.moveTo(0, height - barHeight);
        ctx.lineTo(width, height - barHeight);
        ctx.stroke();

        ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
        ctx.font = '11px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('ANAMORPHIC 2.39:1 • LIVE SHARE CINEMA', 20, barHeight - 8);
        break;
      }

      case 'video-vhs': {
        ctx.fillStyle = '#38bdf8';
        ctx.font = 'bold 20px monospace';
        ctx.shadowColor = '#0284c7';
        ctx.shadowBlur = 6;
        ctx.fillText('SP PLAY', 30, 45);

        // Retro VHS Time & Date bottom left
        ctx.fillStyle = '#facc15';
        const now = new Date();
        const vhsDate = `${now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase()} ${now.getDate().toString().padStart(2, '0')} 1998`;
        const vhsTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
        ctx.fillText(`${vhsDate}  ${vhsTime}`, 30, height - 35);

        // Tracking mark bottom right
        ctx.textAlign = 'right';
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px monospace';
        ctx.fillText('TRK AUTO • CH 03', width - 30, height - 35);
        break;
      }

      case 'video-news': {
        const bannerHeight = Math.max(54, Math.round(height * 0.1));
        const y = height - bannerHeight;

        // Red LIVE box
        ctx.fillStyle = '#dc2626';
        ctx.fillRect(0, y, 110, bannerHeight);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 18px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText('LIVE', 55, y + bannerHeight * 0.62);

        // Blue news header
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(110, y, width - 110, bannerHeight * 0.55);
        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 14px sans-serif';
        ctx.textAlign = 'left';
        ctx.fillText('BREAKING: LIVE CAMERA STREAM BROADCAST', 125, y + bannerHeight * 0.38);

        // Yellow ticker line
        ctx.fillStyle = '#fbbf24';
        ctx.fillRect(110, y + bannerHeight * 0.55, width - 110, bannerHeight * 0.45);
        ctx.fillStyle = '#0f172a';
        ctx.font = 'bold 12px sans-serif';
        ctx.fillText('TRANSMITTING LIVE VIDEO OVER REAL-TIME PROTOCOL...', 125, y + bannerHeight * 0.88);
        break;
      }

      case 'video-sports': {
        // Top right speedometer HUD
        const pad = 24;
        ctx.strokeStyle = '#10b981';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(width - pad - 40, pad + 40, 32, 0.7 * Math.PI, 2.3 * Math.PI);
        ctx.stroke();

        ctx.fillStyle = '#ffffff';
        ctx.font = 'bold 16px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('42', width - pad - 40, pad + 40);
        ctx.font = '9px sans-serif';
        ctx.fillStyle = '#10b981';
        ctx.fillText('KM/H', width - pad - 40, pad + 54);

        // Bottom left telemetry
        ctx.textAlign = 'left';
        ctx.fillStyle = '#ffffff';
        ctx.font = '12px monospace';
        ctx.fillText('ALT: 842M  •  HR: 138 BPM', pad, height - pad - 12);
        ctx.fillText('LAT: 37.7749° N  •  LON: 122.4194° W', pad, height - pad + 6);
        break;
      }
    }
  }

  ctx.restore();
}
