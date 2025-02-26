// src/components/trail-styled/Clock.tsx
import { useRef, useEffect, useState } from 'react';
import { ContainerProps } from './interfaces';

interface MousePosition {
  x: number;
  y: number;
}

const ClockTrail = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [mousePosition, setMousePosition] = useState<MousePosition>({
    x: 0,
    y: 0,
  });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      setMousePosition({ x: event.clientX, y: event.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  const drawClock = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { x, y } = mousePosition;
    const radius = 50; // Radius of the clock

    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw clock face
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, 2 * Math.PI);
    ctx.fillStyle = 'white';
    ctx.fill();
    ctx.strokeStyle = 'black';
    ctx.stroke();

    // Get current time
    const now = new Date();
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Draw hour hand
    const hourAngle = ((hours + minutes / 60) * Math.PI) / 6;
    drawHand(ctx, x, y, hourAngle, radius * 0.5, 6);

    // Draw minute hand
    const minuteAngle = ((minutes + seconds / 60) * Math.PI) / 30;
    drawHand(ctx, x, y, minuteAngle, radius * 0.8, 4);

    // Draw second hand
    const secondAngle = (seconds * Math.PI) / 30;
    drawHand(ctx, x, y, secondAngle, radius * 0.9, 2, 'red');
  };

  const drawHand = (
    ctx: CanvasRenderingContext2D,
    x: number,
    y: number,
    angle: number,
    length: number,
    width: number,
    color: string = 'black'
  ) => {
    ctx.beginPath();
    ctx.lineWidth = width;
    ctx.strokeStyle = color;
    ctx.moveTo(x, y);
    ctx.lineTo(
      x + length * Math.cos(angle - Math.PI / 2),
      y + length * Math.sin(angle - Math.PI / 2)
    );
    ctx.stroke();
  };

  useEffect(() => {
    drawClock();
  }, [mousePosition]);

  return <canvas ref={canvasRef} />;
};

export default ClockTrail;
