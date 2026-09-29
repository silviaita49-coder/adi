import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

interface StoreStampProps {
  className?: string;
  size?: number; // size in px, default 82
}

/**
 * Generate a standalone PNG Data URL for the official circular store stamp.
 * Using a pure Canvas PNG guarantees:
 * 1. 100% compatibility with html2canvas (zero SVG <textPath> crashes)
 * 2. 100% compatibility with jsPDF
 * 3. 100% compatibility with window.print() and paper printing
 */
function generateStampPng(topText: string, bottomText: string, initialLetter: string): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  const size = 320;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  const cx = size / 2;
  const cy = size / 2;

  // Clear
  ctx.clearRect(0, 0, size, size);

  // Outer Blue Rim - slightly softer ink tone for realistic stamping
  ctx.beginPath();
  ctx.arc(cx, cy, 150, 0, Math.PI * 2);
  ctx.fillStyle = '#1d4ed8';
  ctx.fill();

  // White separator
  ctx.beginPath();
  ctx.arc(cx, cy, 142, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();

  // Second Blue line
  ctx.beginPath();
  ctx.arc(cx, cy, 137, 0, Math.PI * 2);
  ctx.fillStyle = '#1d4ed8';
  ctx.fill();

  // Yellow Badge Background - softer pastel yellow
  ctx.beginPath();
  ctx.arc(cx, cy, 130, 0, Math.PI * 2);
  ctx.fillStyle = '#fde047';
  ctx.fill();

  // Inner thin ring
  ctx.beginPath();
  ctx.arc(cx, cy, 126, 0, Math.PI * 2);
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Center White Circle
  ctx.beginPath();
  ctx.arc(cx, cy, 75, 0, Math.PI * 2);
  ctx.fillStyle = '#ffffff';
  ctx.fill();
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 4.5;
  ctx.stroke();

  // Draw Top Curved Text
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 4;
  ctx.font = '900 24px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cleanTop = topText.toUpperCase();
  const topRadius = 104;
  const topTotalAngle = Math.PI * 0.72;
  const topStep = topTotalAngle / Math.max(cleanTop.length - 1, 1);
  const topStartAngle = -Math.PI / 2 - topTotalAngle / 2;

  for (let i = 0; i < cleanTop.length; i++) {
    const char = cleanTop[i];
    const angle = topStartAngle + i * topStep;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * topRadius, cy + Math.sin(angle) * topRadius);
    ctx.rotate(angle + Math.PI / 2);
    ctx.strokeText(char, 0, 0);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // Stars on left and right
  ctx.save();
  ctx.fillStyle = '#ffffff';
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 2;
  ctx.font = 'bold 24px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.strokeText('★', cx - 110, cy + 4);
  ctx.fillText('★', cx - 110, cy + 4);
  ctx.strokeText('★', cx + 110, cy + 4);
  ctx.fillText('★', cx + 110, cy + 4);
  ctx.restore();

  // Draw Bottom Curved Text
  ctx.save();
  ctx.fillStyle = '#1d4ed8';
  ctx.font = '900 13px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  const cleanBottom = bottomText.toUpperCase();
  const botRadius = 106;
  const botTotalAngle = Math.PI * 0.78;
  const botStep = botTotalAngle / Math.max(cleanBottom.length - 1, 1);
  const botStartAngle = Math.PI / 2 - botTotalAngle / 2;

  for (let i = 0; i < cleanBottom.length; i++) {
    const char = cleanBottom[i];
    const angle = botStartAngle + i * botStep;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * botRadius, cy + Math.sin(angle) * botRadius);
    ctx.rotate(angle - Math.PI / 2);
    ctx.fillText(char, 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // Draw Center Speed Streaks & Shopping Cart
  ctx.save();
  ctx.fillStyle = '#fde047';
  ctx.beginPath();
  ctx.moveTo(cx - 48, cy - 8);
  ctx.lineTo(cx - 24, cy - 14);
  ctx.lineTo(cx - 26, cy - 4);
  ctx.closePath();
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(cx - 42, cy + 6);
  ctx.lineTo(cx - 18, cy + 0);
  ctx.lineTo(cx - 20, cy + 10);
  ctx.closePath();
  ctx.fill();

  // Shopping Cart basket
  ctx.strokeStyle = '#1d4ed8';
  ctx.lineWidth = 5.5;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';
  ctx.beginPath();
  ctx.moveTo(cx - 38, cy - 28);
  ctx.lineTo(cx - 20, cy - 28);
  ctx.lineTo(cx - 8, cy + 22);
  ctx.lineTo(cx + 36, cy + 22);
  ctx.lineTo(cx + 48, cy - 18);
  ctx.lineTo(cx - 16, cy - 18);
  ctx.stroke();

  // Wheels
  ctx.fillStyle = '#1d4ed8';
  ctx.beginPath();
  ctx.arc(cx - 2, cy + 34, 8, 0, Math.PI * 2);
  ctx.arc(cx + 30, cy + 34, 8, 0, Math.PI * 2);
  ctx.fill();

  // Initial letter inside cart
  ctx.fillStyle = '#1d4ed8';
  ctx.font = 'italic 900 36px system-ui, -apple-system, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(initialLetter, cx + 12, cy + 3);
  ctx.restore();

  return canvas.toDataURL('image/png');
}

export const StoreStamp: React.FC<StoreStampProps> = ({
  className = '',
  size = 82,
}) => {
  const { myStore } = useApp();

  if (!myStore.tampilkanStempel) {
    return null;
  }

  // Opacity: default 'samar' sesuai permintaan user ("jangan terlalu terang agak samar-samar")
  let stampOpacity = 0.45;
  if (myStore.kepekatanStempel === 'sedang') {
    stampOpacity = 0.65;
  } else if (myStore.kepekatanStempel === 'jelas') {
    stampOpacity = 0.88;
  }

  // If custom uploaded image is selected
  if (myStore.stempelType === 'custom_upload' && myStore.customStempelUrl) {
    return (
      <div
        className={`pointer-events-none select-none inline-block ${className}`}
        style={{
          width: `${size}px`,
          height: `${size}px`,
          transform: 'rotate(-7deg)',
          opacity: stampOpacity,
          mixBlendMode: 'multiply',
        }}
      >
        <img
          src={myStore.customStempelUrl}
          alt="Stempel Toko"
          className="w-full h-full object-contain"
        />
      </div>
    );
  }

  const topText =
    myStore.stempelType === 'auto_nama'
      ? (myStore.namaToko || 'TOKO KITA').toUpperCase()
      : 'TOKO KITA';
  const bottomText =
    myStore.stempelType === 'auto_nama'
      ? 'BELANJA MUDAH • HARGA BERSAHABAT'
      : 'BELANJA MUDAH, HARGA BERSAHABAT';

  const initialLetter = (topText.replace(/TOKO|CV|PT|UD/gi, '').trim()[0] || 'K').toUpperCase();

  const stampPngUrl = useMemo(() => {
    return generateStampPng(topText, bottomText, initialLetter);
  }, [topText, bottomText, initialLetter]);

  if (!stampPngUrl) return null;

  return (
    <div
      className={`pointer-events-none select-none inline-block ${className}`}
      style={{
        width: `${size}px`,
        height: `${size}px`,
        transform: 'rotate(-7deg)',
        opacity: stampOpacity,
        mixBlendMode: 'multiply',
      }}
    >
      <img
        src={stampPngUrl}
        alt="Stempel Toko"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};
