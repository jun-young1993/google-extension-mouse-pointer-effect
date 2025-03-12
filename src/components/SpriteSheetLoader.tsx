import { useEffect, useRef, useState } from 'react';

interface SpriteSheetLoaderProps {
  src: string; // 스프라이트시트 이미지 경로
  frameWidth: number; // 각 프레임의 너비
  frameHeight: number; // 각 프레임의 높이
  frameCount: number; // 총 프레임 수
  fps?: number; // 애니메이션 프레임 속도 (선택적)
  autoPlay?: boolean; // 자동 재생 여부 (선택적)
  loop?: boolean; // 반복 재생 여부 (선택적)
  startFrame?: number; // 시작 프레임 (선택적)
  scale?: number; // 렌더링 크기 배율 (선택적)
  onLoad?: () => void; // 로드 완료 콜백 (선택적)
  onAnimationComplete?: () => void; // 애니메이션 완료 콜백 (선택적)
  className?: string; // 추가 CSS 클래스 (선택적)
}

export function SpriteSheetLoader({
  src,
  frameWidth,
  frameHeight,
  frameCount,
  fps = 24,
  autoPlay = true,
  loop = true,
  startFrame = 0,
  scale = 1,
  onLoad,
  onAnimationComplete,
  className,
}: SpriteSheetLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [currentFrame, setCurrentFrame] = useState<number>(startFrame);
  const [isPlaying, setIsPlaying] = useState<boolean>(autoPlay);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const lastFrameTimeRef = useRef<number>(0);

  // 이미지 로드
  useEffect(() => {
    const image = new Image();
    image.src = src;
    image.onload = () => {
      imageRef.current = image;
      setIsLoaded(true);
      onLoad?.();
      renderFrame(currentFrame);
    };

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [src]);

  // 프레임 렌더링 함수
  const renderFrame = (frameIndex: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    const image = imageRef.current;

    if (!canvas || !ctx || !image) return;

    // 캔버스 크기 설정
    canvas.width = frameWidth * scale;
    canvas.height = frameHeight * scale;

    // 캔버스 초기화
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 프레임 계산 (가로 방향 스프라이트시트 가정)
    const framesPerRow = Math.floor(image.width / frameWidth);
    const row = Math.floor(frameIndex / framesPerRow);
    const col = frameIndex % framesPerRow;

    const sx = col * frameWidth;
    const sy = row * frameHeight;

    // 프레임 그리기
    ctx.drawImage(
      image,
      sx,
      sy,
      frameWidth,
      frameHeight,
      0,
      0,
      frameWidth * scale,
      frameHeight * scale
    );
  };

  // 애니메이션 로직
  useEffect(() => {
    if (!isLoaded || !isPlaying) return;

    const updateAnimation = (timestamp: number) => {
      if (!lastFrameTimeRef.current) {
        lastFrameTimeRef.current = timestamp;
      }

      const elapsed = timestamp - lastFrameTimeRef.current;
      const frameTime = 1000 / fps;

      if (elapsed >= frameTime) {
        lastFrameTimeRef.current = timestamp;
        setCurrentFrame((prev) => {
          const nextFrame = prev + 1;

          if (nextFrame >= frameCount) {
            if (!loop) {
              setIsPlaying(false);
              onAnimationComplete?.();
              return prev;
            }
            return 0;
          }

          return nextFrame;
        });
      }

      animationRef.current = requestAnimationFrame(updateAnimation);
    };

    animationRef.current = requestAnimationFrame(updateAnimation);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, [isLoaded, isPlaying, frameCount, fps, loop]);

  // 현재 프레임 변경 시 렌더링
  useEffect(() => {
    if (isLoaded) {
      renderFrame(currentFrame);
    }
  }, [currentFrame, isLoaded]);

  //   // 컨트롤 함수들
  //   const play = () => setIsPlaying(true);
  //   const pause = () => setIsPlaying(false);
  //   const stop = () => {
  //     setIsPlaying(false);
  //     setCurrentFrame(startFrame);
  //   };
  //   const goToFrame = (frame: number) => {
  //     if (frame >= 0 && frame < frameCount) {
  //       setCurrentFrame(frame);
  //     }
  //   };

  return (
    <div
      className={`sprite-sheet-container ${className || ''}`}
      style={{ width: frameWidth * scale, height: frameHeight * scale }}
    >
      <canvas ref={canvasRef} />

      {/* 필요한 경우 컨트롤 버튼을 추가할 수 있습니다 */}
      {/* 
      <div className="sprite-controls">
        <button onClick={play} disabled={isPlaying}>Play</button>
        <button onClick={pause} disabled={!isPlaying}>Pause</button>
        <button onClick={stop}>Stop</button>
      </div>
      */}
    </div>
  );
}

// 외부에서 사용할 수 있는 타입 익스포트
export type { SpriteSheetLoaderProps };
