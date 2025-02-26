import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { PreviewTrailProps } from './interfaces';

const fadeOut = keyframes`
  0% {
    opacity: 1;
    transform: scale(1);
  }
  100% {
    opacity: 0;
    transform: scale(0);
  }
`;

const Sparkle = styled.div<{ size: string; color: string }>`
  position: absolute;
  pointer-events: none;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  background-color: ${(props) => props.color};
  border-radius: 50%;
  animation: ${fadeOut} 1s ease-out forwards;
`;

const SparkleTrail = ({
  size = '10px',
  color = 'rgba(255, 255, 255, 0.8)',
  maxParticles = 20,
  usePreview,
  containerRef,
}: PreviewTrailProps) => {
  let lastSparkleTime = 0;
  let sparkleId = 0;
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number }>
  >([]);

  useEffect(() => {
    if (!usePreview) {
      const handleMouseMove = (e: MouseEvent) => {
        const currentTime = Date.now();

        if (currentTime - lastSparkleTime > 50) {
          // 50ms마다 새로운 반짝이 생성
          lastSparkleTime = currentTime;
          sparkleId++;

          setSparkles((prev) => [
            ...prev.slice(-maxParticles + 1), // 최대 개수 유지
            { id: sparkleId, x: e.clientX, y: e.clientY },
          ]);
        }
      };

      window.addEventListener('mousemove', handleMouseMove);
      return () => window.removeEventListener('mousemove', handleMouseMove);
    } else {
      // Preview 모드에서의 원형 움직임
      let angle = 0;
      const radius = 15; // 원의 반지름
      const interval = setInterval(() => {
        if (containerRef.current) {
          const rect = containerRef.current.getBoundingClientRect();
          const centerX = rect.width / 2;
          const centerY = rect.height / 2;

          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;

          sparkleId++;
          setSparkles((prev) => [
            ...prev.slice(-maxParticles + 1),
            { id: sparkleId, x, y },
          ]);

          angle += 0.5; // 회전 속도 조절
        }
      }, 50);

      return () => clearInterval(interval);
    }
  }, [usePreview, maxParticles]);
  // 1초 후에 반짝이 제거
  useEffect(() => {
    const timer = setInterval(() => {
      setSparkles((prev) =>
        prev.filter((sparkle) => sparkle.id > sparkleId - maxParticles)
      );
    }, 1000);

    return () => clearInterval(timer);
  }, [maxParticles]);
  return (
    <>
      {sparkles.map((sparkle) => (
        <Sparkle
          key={sparkle.id}
          size={size}
          color={color}
          style={{
            left: `${sparkle.x}px`,
            top: `${sparkle.y}px`,
          }}
        />
      ))}
    </>
  );
};

export default SparkleTrail;
