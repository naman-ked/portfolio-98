import React, { useEffect, useRef, useState } from 'react';
import { playClick, playChord } from '../sound';

interface SpinWheelProps {
  onClose: () => void;
}

const SEGMENTS = [
  { label: 'Vite 6 ESM', color: '#000080', text: '#ffffff' },
  { label: 'Sentry Telemetry', color: '#800080', text: '#ffffff' },
  { label: 'Micro-Frontends', color: '#008080', text: '#ffffff' },
  { label: 'Fastify API', color: '#b22222', text: '#ffffff' },
  { label: 'WebXR 3D', color: '#2e8b57', text: '#ffffff' },
  { label: 'HCI Ergonomics', color: '#d2691e', text: '#ffffff' },
  { label: 'CI/CD Automation', color: '#4b0082', text: '#ffffff' },
  { label: 'Zero-Waste Code', color: '#006400', text: '#ffffff' },
];

export const SpinWheelDemo: React.FC<SpinWheelProps> = ({ onClose }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isSpinning, setIsSpinning] = useState(false);
  const [winner, setWinner] = useState<string | null>(null);
  const angleRef = useRef(0);
  const velocityRef = useRef(0);
  const animFrameRef = useRef<number | null>(null);

  const drawWheel = (angle: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(centerX, centerY) - 15;
    const numSegments = SEGMENTS.length;
    const arc = (2 * Math.PI) / numSegments;

    ctx.clearRect(0, 0, width, height);

    // Draw outer bezel
    ctx.save();
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius + 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#808080';
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#ffffff';
    ctx.stroke();
    ctx.restore();

    // Draw slices
    SEGMENTS.forEach((seg, i) => {
      const startAngle = angle + i * arc;
      const endAngle = startAngle + arc;

      ctx.beginPath();
      ctx.moveTo(centerX, centerY);
      ctx.arc(centerX, centerY, radius, startAngle, endAngle);
      ctx.closePath();
      ctx.fillStyle = seg.color;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = '#dfdfdf';
      ctx.stroke();

      // Draw text
      ctx.save();
      ctx.translate(centerX, centerY);
      ctx.rotate(startAngle + arc / 2);
      ctx.textAlign = 'right';
      ctx.fillStyle = seg.text;
      ctx.font = 'bold 11px Tahoma, sans-serif';
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 2;
      ctx.fillText(seg.label, radius - 15, 4);
      ctx.restore();
    });

    // Draw center hub
    ctx.beginPath();
    ctx.arc(centerX, centerY, 22, 0, 2 * Math.PI);
    ctx.fillStyle = '#c0c0c0';
    ctx.fill();
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#000000';
    ctx.stroke();

    ctx.beginPath();
    ctx.arc(centerX, centerY, 8, 0, 2 * Math.PI);
    ctx.fillStyle = '#000080';
    ctx.fill();

    // Draw pointer on the right
    ctx.save();
    ctx.beginPath();
    ctx.moveTo(centerX + radius + 12, centerY);
    ctx.lineTo(centerX + radius - 4, centerY - 10);
    ctx.lineTo(centerX + radius - 4, centerY + 10);
    ctx.closePath();
    ctx.fillStyle = '#ff0000';
    ctx.fill();
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = '#000000';
    ctx.stroke();
    ctx.restore();
  };

  useEffect(() => {
    drawWheel(angleRef.current);
  }, []);

  const spin = () => {
    if (isSpinning) return;
    playClick();
    setIsSpinning(true);
    setWinner(null);

    // Initial random velocity
    velocityRef.current = 0.25 + Math.random() * 0.25;

    const animate = () => {
      angleRef.current = (angleRef.current + velocityRef.current) % (2 * Math.PI);
      velocityRef.current *= 0.985; // friction deceleration

      drawWheel(angleRef.current);

      if (velocityRef.current > 0.002) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        setIsSpinning(false);
        // Calculate winning segment at pointer (angle 0 on right side)
        const numSegments = SEGMENTS.length;
        const arc = (2 * Math.PI) / numSegments;
        let normalizedAngle = (2 * Math.PI - (angleRef.current % (2 * Math.PI))) % (2 * Math.PI);
        const winningIndex = Math.floor(normalizedAngle / arc) % numSegments;
        const selected = SEGMENTS[winningIndex].label;
        setWinner(selected);
        playChord();
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="win-outset w-full max-w-md p-1 shadow-2xl">
        <div className="win-titlebar px-2 py-1 flex items-center justify-between text-xs select-none">
          <div className="flex items-center gap-1.5">
            <span className="material-symbols-outlined text-sm">rotate_right</span>
            <span>SPINWHEEL.JS — Canvas 2D Physics Demo</span>
          </div>
          <button
            onClick={() => {
              playClick();
              onClose();
            }}
            className="win-btn w-4 h-4 leading-none flex items-center justify-center text-[10px] font-bold p-0 text-black"
          >
            ✕
          </button>
        </div>

        <div className="p-3 bg-[#c0c0c0]">
          <div className="win-inset bg-[#e8e8e8] p-3 text-center mb-3">
            <div className="text-xs font-bold text-[#000080] mb-1 font-mono">
              @ked27/spinwheel • Real-time Physics Engine
            </div>
            <div className="text-[11px] text-gray-700 mb-2">
              Standalone HTML5 Canvas wheel with momentum equations & angular deceleration.
            </div>

            <div className="flex justify-center my-2">
              <canvas
                ref={canvasRef}
                width={280}
                height={280}
                className="win-inset bg-white rounded-full shadow-inner cursor-pointer"
                onClick={spin}
              />
            </div>

            {winner && (
              <div className="win-inset bg-yellow-50 border border-yellow-600 p-2 my-2 animate-bounce">
                <span className="text-xs font-bold text-black">🎯 SELECTED TECH: </span>
                <span className="text-xs font-mono font-extrabold text-[#000080]">{winner}</span>
              </div>
            )}

            <div className="flex justify-center gap-2 mt-3">
              <button
                onClick={spin}
                disabled={isSpinning}
                className="win-btn px-6 py-1.5 font-bold text-xs bg-[#000080] text-white"
              >
                {isSpinning ? 'SPINNING...' : '▶ SPIN WHEEL'}
              </button>
              <button
                onClick={() => {
                  playClick();
                  onClose();
                }}
                className="win-btn px-4 py-1.5 text-xs"
              >
                Close
              </button>
            </div>
          </div>

          <div className="win-inset-gray p-2 text-[10px] font-mono text-gray-700 flex justify-between">
            <span>FPS: 60 • Zero External Deps</span>
            <span>Physics: Friction Coefficient 0.985</span>
          </div>
        </div>
      </div>
    </div>
  );
};
