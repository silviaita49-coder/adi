import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';

interface StoreSignatureProps {
  className?: string;
  width?: number; // width in px, default 135
  height?: number; // height in px, default 65
}

/**
 * Generate clean transparent PNG for the official signature uploaded by the user.
 * Using Canvas PNG guarantees zero SVG rendering issues across all PDF engines and printers.
 */
function generateSignaturePng(): string {
  if (typeof document === 'undefined') return '';

  const canvas = document.createElement('canvas');
  canvas.width = 300;
  canvas.height = 140;
  const ctx = canvas.getContext('2d');
  if (!ctx) return '';

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Ballpoint pen ink styling
  ctx.strokeStyle = '#111827'; // Dark charcoal / ink black
  ctx.fillStyle = '#111827';
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // 1. Long underline / baseline slash stroke (starts left, slightly slanting down-right)
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(25, 78);
  ctx.bezierCurveTo(70, 86, 150, 102, 260, 122);
  ctx.stroke();

  // 2. Main upward stroke & top loop (signature body)
  ctx.lineWidth = 3.6;
  ctx.beginPath();
  // Starts near baseline
  ctx.moveTo(85, 96);
  // Ascends up towards top loop
  ctx.bezierCurveTo(110, 72, 130, 35, 142, 14);
  // Loop at the top
  ctx.bezierCurveTo(147, 4, 156, 6, 152, 18);
  ctx.bezierCurveTo(148, 28, 134, 46, 122, 68);
  ctx.stroke();

  // 3. Diagonal crossing down and horizontal right loop
  ctx.lineWidth = 3.4;
  ctx.beginPath();
  ctx.moveTo(122, 68);
  // Crosses down toward baseline
  ctx.bezierCurveTo(116, 76, 110, 84, 104, 94);
  // Swoops up and extends into rightward horizontal loop
  ctx.bezierCurveTo(115, 75, 150, 58, 205, 60);
  ctx.bezierCurveTo(225, 62, 230, 72, 218, 76);
  ctx.bezierCurveTo(195, 78, 160, 78, 140, 76);
  ctx.stroke();

  // 4. Subtle wave / 'u' or 's' flourish under the horizontal loop
  ctx.lineWidth = 3.0;
  ctx.beginPath();
  ctx.moveTo(148, 88);
  ctx.bezierCurveTo(154, 98, 168, 98, 178, 88);
  ctx.bezierCurveTo(185, 82, 192, 85, 198, 92);
  ctx.stroke();

  return canvas.toDataURL('image/png');
}

export const StoreSignature: React.FC<StoreSignatureProps> = ({
  className = '',
  width = 140,
  height = 68,
}) => {
  const { myStore } = useApp();

  if (!myStore.tampilkanTtd) {
    return null;
  }

  // If user uploaded their own custom signature image
  if (myStore.customTtdUrl) {
    return (
      <div
        className={`pointer-events-none select-none inline-block ${className}`}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          mixBlendMode: 'multiply',
        }}
      >
        <img
          src={myStore.customTtdUrl}
          alt="Tanda Tangan Pemilik Toko"
          className="w-full h-full object-contain filter contrast-125"
        />
      </div>
    );
  }

  const signatureDataUrl = useMemo(() => {
    return generateSignaturePng();
  }, []);

  if (!signatureDataUrl) return null;

  return (
    <div
      className={`pointer-events-none select-none inline-block ${className}`}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        mixBlendMode: 'multiply',
      }}
    >
      <img
        src={signatureDataUrl}
        alt="Tanda Tangan Pemilik Toko"
        className="w-full h-full object-contain"
        loading="eager"
      />
    </div>
  );
};
