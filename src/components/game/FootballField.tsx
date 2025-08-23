'use client';

import { useRef, useEffect } from 'react';

interface FootballFieldProps {
  width: number;
  height: number;
}

export default function FootballField({ width, height }: FootballFieldProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    // Draw field background
    const gradient = ctx.createLinearGradient(0, 0, 0, height);
    gradient.addColorStop(0, '#2d5a2d');
    gradient.addColorStop(1, '#1a4d1a');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);

    // Field dimensions
    const fieldMargin = 40;
    const fieldWidth = width - (fieldMargin * 2);
    const fieldHeight = height - (fieldMargin * 2);
    const yardLineSpacing = fieldWidth / 10;

    // Draw field border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.strokeRect(fieldMargin, fieldMargin, fieldWidth, fieldHeight);

    // Draw yard lines (every 10 yards)
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    for (let i = 1; i < 10; i++) {
      const x = fieldMargin + (i * yardLineSpacing);
      ctx.beginPath();
      ctx.moveTo(x, fieldMargin);
      ctx.lineTo(x, fieldMargin + fieldHeight);
      ctx.stroke();
    }

    // Draw 50-yard line (thicker)
    ctx.lineWidth = 4;
    const fiftyYardLine = fieldMargin + (5 * yardLineSpacing);
    ctx.beginPath();
    ctx.moveTo(fiftyYardLine, fieldMargin);
    ctx.lineTo(fiftyYardLine, fieldMargin + fieldHeight);
    ctx.stroke();

    // Draw hash marks
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    const hashMarkLength = 20;
    const hashMarkSpacing = yardLineSpacing / 5; // Every 2 yards

    for (let i = 0; i <= 50; i++) {
      const x = fieldMargin + (i * hashMarkSpacing);
      
      // Top hash marks
      ctx.beginPath();
      ctx.moveTo(x, fieldMargin + fieldHeight * 0.3);
      ctx.lineTo(x, fieldMargin + fieldHeight * 0.3 + hashMarkLength);
      ctx.stroke();

      // Bottom hash marks
      ctx.beginPath();
      ctx.moveTo(x, fieldMargin + fieldHeight * 0.7 - hashMarkLength);
      ctx.lineTo(x, fieldMargin + fieldHeight * 0.7);
      ctx.stroke();
    }

    // Draw end zones
    ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    ctx.fillRect(0, fieldMargin, fieldMargin, fieldHeight);
    ctx.fillRect(width - fieldMargin, fieldMargin, fieldMargin, fieldHeight);

    // Draw yard numbers
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    
    const yardNumbers = [10, 20, 30, 40, 50, 40, 30, 20, 10];
    yardNumbers.forEach((number, index) => {
      const x = fieldMargin + ((index + 1) * yardLineSpacing);
      ctx.fillText(number.toString(), x, fieldMargin + fieldHeight * 0.15);
      ctx.fillText(number.toString(), x, fieldMargin + fieldHeight * 0.85);
    });

    // Draw goal posts
    ctx.strokeStyle = '#ffff00';
    ctx.lineWidth = 3;
    
    // Left goal post
    ctx.beginPath();
    ctx.moveTo(fieldMargin - 20, fieldMargin + fieldHeight * 0.4);
    ctx.lineTo(fieldMargin - 20, fieldMargin + fieldHeight * 0.6);
    ctx.moveTo(fieldMargin - 25, fieldMargin + fieldHeight * 0.4);
    ctx.lineTo(fieldMargin - 15, fieldMargin + fieldHeight * 0.4);
    ctx.moveTo(fieldMargin - 25, fieldMargin + fieldHeight * 0.6);
    ctx.lineTo(fieldMargin - 15, fieldMargin + fieldHeight * 0.6);
    ctx.stroke();

    // Right goal post
    ctx.beginPath();
    ctx.moveTo(width - fieldMargin + 20, fieldMargin + fieldHeight * 0.4);
    ctx.lineTo(width - fieldMargin + 20, fieldMargin + fieldHeight * 0.6);
    ctx.moveTo(width - fieldMargin + 15, fieldMargin + fieldHeight * 0.4);
    ctx.lineTo(width - fieldMargin + 25, fieldMargin + fieldHeight * 0.4);
    ctx.moveTo(width - fieldMargin + 15, fieldMargin + fieldHeight * 0.6);
    ctx.lineTo(width - fieldMargin + 25, fieldMargin + fieldHeight * 0.6);
    ctx.stroke();

  }, [width, height]);

  return (
    <canvas
      ref={canvasRef}
      className="border border-gray-300 rounded-lg shadow-lg"
      style={{ maxWidth: '100%', height: 'auto' }}
    />
  );
}