import { useEffect, useRef } from 'react';
import { TrailProps } from './interfaces';

interface FireParticle {
  x: number;
  y: number;
  radius: number;
  color: string;
  velocity: { x: number; y: number };
  life: number;
  maxLife: number;
}

const FireTrail = ({ useInfinity }: TrailProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particles = useRef<FireParticle[]>([]);
  const mousePos = useRef({ x: 0, y: 0 });
  const animationFrameId = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas to full window size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    updateCanvasSize();
    window.addEventListener('resize', updateCanvasSize);

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };
      // Add new particles on mouse move
      createParticles(5);
    };

    document.addEventListener('mousemove', handleMouseMove);

    // Generate fire particle colors
    const getFireColor = () => {
      const colors = [
        '#FF5500', // Orange
        '#FF3300', // Red-orange
        '#FF0000', // Red
        '#FFAA00', // Yellow-orange
        '#FFCC00', // Yellow
      ];
      return colors[Math.floor(Math.random() * colors.length)];
    };

    // Create new particles
    const createParticles = (count: number) => {
      for (let i = 0; i < count; i++) {
        particles.current.push({
          x: mousePos.current.x,
          y: mousePos.current.y,
          radius: Math.random() * 3 + 2,
          color: getFireColor(),
          velocity: {
            x: (Math.random() - 0.5) * 2,
            y: Math.random() * -3 - 1, // Always move upward
          },
          life: 0,
          maxLife: Math.random() * 50 + 20,
        });
      }
    };

    // Animation function
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      // Update and draw particles
      particles.current.forEach((particle, index) => {
        // Update position
        particle.x += particle.velocity.x;
        particle.y += particle.velocity.y;
        
        // Increase life
        particle.life++;
        
        // Calculate opacity based on life
        const opacity = 1 - particle.life / particle.maxLife;
        
        // Draw particle
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
        ctx.fillStyle = particle.color + Math.floor(opacity * 255).toString(16).padStart(2, '0');
        ctx.fill();
        
        // Remove dead particles
        if (particle.life >= particle.maxLife) {
          particles.current.splice(index, 1);
        }
      });

      // Continue animation loop
      animationFrameId.current = requestAnimationFrame(animate);
    };

    // Start animation
    animate();

    // Clean up
    return () => {
      window.removeEventListener('resize', updateCanvasSize);
      document.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
    };
  }, [useInfinity]);

  return (
    <canvas 
      ref={canvasRef} 
      style={{ 
        position: 'fixed', 
        top: 0, 
        left: 0, 
        pointerEvents: 'none',
        zIndex: 9999 
      }} 
    />
  );
};

export default FireTrail; 