
import React, { useRef, useEffect, useState } from 'react';
import { ISLANDS } from '../constants';
import { GameState } from '../types';

interface MapCanvasProps {
  gameState: GameState;
  onIslandClick: (index: number) => void;
}

const MapCanvas: React.FC<MapCanvasProps> = ({ gameState, onIslandClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Constants for original design size
  const DESIGN_WIDTH = 1200;
  const DESIGN_HEIGHT = 700;

  const getMappedCoords = (clientX: number, clientY: number) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };
    const rect = canvas.getBoundingClientRect();
    
    // Calculate scale factors between display size and internal canvas size
    const scaleX = DESIGN_WIDTH / rect.width;
    const scaleY = DESIGN_HEIGHT / rect.height;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      ctx.clearRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

      // Draw Ocean Gradient
      const gradient = ctx.createRadialGradient(
        DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2, 50,
        DESIGN_WIDTH / 2, DESIGN_HEIGHT / 2, DESIGN_WIDTH / 1.2
      );
      gradient.addColorStop(0, '#0ea5e9'); // sky-500
      gradient.addColorStop(1, '#075985'); // sky-800
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, DESIGN_WIDTH, DESIGN_HEIGHT);

      // Draw subtle waves
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
      ctx.lineWidth = 2;
      for (let i = 0; i < 20; i++) {
        ctx.beginPath();
        const yBase = (i * 40) + 20;
        ctx.moveTo(0, yBase);
        for (let x = 0; x < DESIGN_WIDTH; x += 40) {
          ctx.quadraticCurveTo(x + 20, yBase + 10, x + 40, yBase);
        }
        ctx.stroke();
      }

      // Draw Paths
      ctx.setLineDash([10, 10]);
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ISLANDS.forEach((island, i) => {
        if (i === 0) ctx.moveTo(island.x, island.y);
        else ctx.lineTo(island.x, island.y);
      });
      ctx.stroke();
      ctx.setLineDash([]);

      // Draw Islands
      ISLANDS.forEach((island, i) => {
        const isUnlocked = i <= gameState.unlockedIslands;
        const isCompleted = i < gameState.unlockedIslands;
        const isHovered = hoveredIndex === i && isUnlocked && !gameState.isMoving;
        
        // Dynamic scale and glow if hovered
        const islandRadius = isHovered ? 48 : 40;
        
        ctx.save();
        
        if (isHovered) {
          ctx.shadowBlur = 20;
          ctx.shadowColor = '#fff';
        }

        // Island shadow
        ctx.beginPath();
        ctx.ellipse(island.x, island.y + 5, islandRadius + 5, islandRadius + 5, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fill();

        // Main Island Circle
        ctx.beginPath();
        ctx.arc(island.x, island.y, islandRadius, 0, Math.PI * 2);
        ctx.fillStyle = isUnlocked ? (isCompleted ? '#4ade80' : '#facc15') : '#94a3b8';
        ctx.fill();
        ctx.strokeStyle = isHovered ? '#fff' : '#1e293b';
        ctx.lineWidth = isHovered ? 5 : 3;
        ctx.stroke();
        
        ctx.restore();

        // Draw Island Name with background
        const nameWidth = ctx.measureText(island.name).width;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.fillRect(island.x - (nameWidth / 2) - 5, island.y + 55, nameWidth + 10, 20);
        
        ctx.fillStyle = '#0f172a';
        ctx.font = isHovered ? 'bold 16px Quicksand' : 'bold 14px Quicksand';
        ctx.textAlign = 'center';
        ctx.fillText(island.name, island.x, island.y + 70);

        // Draw Icon
        ctx.font = isHovered ? '40px serif' : '30px serif';
        ctx.fillText(island.icon, island.x, island.y + 10);
      });

      // Draw Player
      const pX = gameState.playerPos.x;
      const pY = gameState.playerPos.y;
      
      ctx.beginPath();
      ctx.arc(pX, pY + 5, 12, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(0,0,0,0.3)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(pX, pY, 15, 0, Math.PI * 2);
      ctx.fillStyle = '#22c55e';
      ctx.fill();
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.stroke();
      
      ctx.beginPath();
      ctx.moveTo(pX, pY - 15);
      ctx.lineTo(pX + 10, pY - 30);
      ctx.strokeStyle = '#ef4444';
      ctx.lineWidth = 3;
      ctx.stroke();

      ctx.fillStyle = 'white';
      ctx.beginPath();
      ctx.arc(pX - 5, pY - 3, 3, 0, Math.PI * 2);
      ctx.arc(pX + 5, pY - 3, 3, 0, Math.PI * 2);
      ctx.fill();
    };

    const frame = requestAnimationFrame(draw);
    return () => cancelAnimationFrame(frame);
  }, [gameState, hoveredIndex]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.isMoving) return;
    const { x, y } = getMappedCoords(e.clientX, e.clientY);

    ISLANDS.forEach((island, i) => {
      const dist = Math.sqrt((x - island.x) ** 2 + (y - island.y) ** 2);
      if (dist < 50) {
        onIslandClick(i);
      }
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (gameState.isMoving) return;
    const { x, y } = getMappedCoords(e.clientX, e.clientY);
    let found = null;
    ISLANDS.forEach((island, i) => {
      const dist = Math.sqrt((x - island.x) ** 2 + (y - island.y) ** 2);
      if (dist < 50) {
        found = i;
      }
    });
    setHoveredIndex(found);
  };

  return (
    <div className="w-full h-full flex items-center justify-center p-2">
      <div className="relative w-full max-w-[1200px] aspect-[1200/700] rounded-xl shadow-2xl overflow-hidden bg-sky-900">
        <canvas
          ref={canvasRef}
          width={DESIGN_WIDTH}
          height={DESIGN_HEIGHT}
          className="w-full h-full cursor-pointer touch-none"
          onClick={handleClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={() => setHoveredIndex(null)}
        />
      </div>
    </div>
  );
};

export default MapCanvas;
