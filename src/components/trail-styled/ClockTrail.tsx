import { useEffect, useState } from 'react';
import styled, { keyframes } from 'styled-components';
import { PreviewTrailProps } from './interfaces';


const Sparkle = styled.div<{ size: string; color: string }>`
  position: absolute;
  pointer-events: none;
  width: ${(props) => props.size};
  height: ${(props) => props.size};
`;

const ClockTrail = ({
  size = '10px',
  color = 'rgba(255, 255, 255, 0.8)',
}: PreviewTrailProps) => {
  let sparkleId = 0;
  const [sparkles, setSparkles] = useState<
    Array<{ id: number; x: number; y: number; data: string }>
  >([]);

  const theDays = [
    'SUNDAY',
    'MONDAY',
    'TUESDAY',
    'WEDNESDAY',
    'THURSDAY',
    'FRIDAY',
    'SATURDAY',
  ];

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const date = new Date();
      // const currentTime = Date.now();
      const day = date.getDay();
      setSparkles(() => [
        ...theDays[day].split('').map((data, index) => ({
          id: sparkleId++,
          x: e.clientX + index * 20 + 20,
          y: e.clientY,
          data: data,
        })),
      ]);
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  // 1초 후에 반짝이 제거
  useEffect(() => {
    const date = new Date();
    // const currentTime = Date.now();
    const day = date.getDay();

    setSparkles(() => [
      ...theDays[day].split('').map((data, index) => ({
        id: sparkleId++,
        x: document.body?.getBoundingClientRect().width + index * 20,
        y: document.body?.getBoundingClientRect().height / 2,
        data: data,
      })),
    ]);
  }, []);
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
        >
          {sparkle.data}
        </Sparkle>
      ))}
    </>
  );
};

export default ClockTrail;
