import { useEffect, useState } from 'react';
import styled from 'styled-components';
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
  const [sparkles, setSparkles] = useState<
    Array<{
      id: number | string;
      x: number;
      y: number;
      data: string;
      targetX: number;
      targetY: number;
    }>
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
  const getNextPosition = (
    currentX: number,
    currentY: number,
    targetX: number,
    targetY: number
  ) => {
    const step = 5;
    const deltaX = targetX - currentX;
    const deltaY = targetY - currentY;

    // 목표 위치에 가까워지면 step 값을 줄임
    const newX =
      Math.abs(deltaX) < step ? targetX : currentX + step * Math.sign(deltaX);
    const newY =
      Math.abs(deltaY) < step ? targetY : currentY + step * Math.sign(deltaY);
    return [newX, newY];
  };
  const updatePositions = () => {
    setSparkles((prev) =>
      prev.map((sparkle) => {
        const [newX, newY] = getNextPosition(
          sparkle.x,
          sparkle.y,
          sparkle.targetX,
          sparkle.targetY
        );
        console.log('newX,newY', newX, newY);
        console.log('x y', sparkle.x, sparkle.y);

        if(newX === sparkle.x && newY === sparkle.y){
          // 진행해도 의미없음
        }
        return {
          ...sparkle,
          x: newX,
          y: newY,
        };
      })
    );
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setSparkles((prev) =>
        prev.map((sparkle, index) => {
          return {
            ...sparkle,
            targetX: 20 + e.clientX + index * 20,
            targetY: e.clientY,
          };
        })
      );
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useEffect(() => {
    requestAnimationFrame(updatePositions);
  }, [sparkles]);

  // 1초 후에 반짝이 제거
  useEffect(() => {
    const date = new Date();
    // const currentTime = Date.now();
    const day = date.getDay();

    setSparkles(() => [
      ...theDays[day].split('').map((data, index) => ({
        id: `day-${data}-${index}`,
        x: document.body?.getBoundingClientRect().width + index * 20,
        y: document.body?.getBoundingClientRect().height / 2,
        targetX: document.body?.getBoundingClientRect().width + index * 20,
        targetY: document.body?.getBoundingClientRect().height / 2,
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
