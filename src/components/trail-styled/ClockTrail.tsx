import React, { useEffect, useRef } from 'react';
// src/components/trail-styled/Clock.tsx
interface ClockCursorOptions {
  containerRef?: React.RefObject<HTMLElement>;
  dateColor?: string;
  faceColor?: string;
  secondsColor?: string;
  minutesColor?: string;
  hoursColor?: string;
  theDays?: string[];
  theMonths?: string[];
}

interface Particle {
  color: string;
  value: string;
  x?: number;
  y?: number;
}

const ClockTrail: React.FC<ClockCursorOptions> = (options) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>();
  const cursor = useRef({
    x: window.innerWidth / 2,
    y: window.innerHeight / 2,
  });
  const {
    dateColor = 'blue',
    faceColor = 'black',
    secondsColor = 'red',
    minutesColor = 'black',
    hoursColor = 'black',
    theDays = [
      'SUNDAY',
      'MONDAY',
      'TUESDAY',
      'WEDNESDAY',
      'THURSDAY',
      'FRIDAY',
      'SATURDAY',
    ],
    theMonths = [
      'JANUARY',
      'FEBRUARY',
      'MARCH',
      'APRIL',
      'MAY',
      'JUNE',
      'JULY',
      'AUGUST',
      'SEPTEMBER',
      'OCTOBER',
      'NOVEMBER',
      'DECEMBER',
    ],
    containerRef,
  } = options;
  const element = containerRef?.current ?? document.body;
  let width = window.innerWidth;
  let height = window.innerHeight;

  const del = 0.4;

  const date = new Date();
  const day = date.getDate();
  const year = date.getFullYear();

  const dateInWords =
    ` ${theDays[date.getDay()]} ${day} ${theMonths[date.getMonth()]} ${year}`.split(
      ''
    );

  const clockNumbers = [
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9',
    '10',
    '11',
    '12',
    '1',
    '2',
  ];
  const F = clockNumbers.length;

  const hourHand = ['•', '•', '•'];
  const minuteHand = ['•', '•', '•', '•'];
  const secondHand = ['•', '•', '•', '•', '•'];

  const siz = 45;
  const eqf = 360 / F;
  const eqd = 360 / dateInWords.length;
  const han = siz / 6.5;

  const dy: number[] = [];
  const dx: number[] = [];
  const zy: number[] = [];
  const zx: number[] = [];

  const tmps: Particle[] = [];
  const tmpm: Particle[] = [];
  const tmph: Particle[] = [];
  const tmpf: Particle[] = [];
  const tmpd: Particle[] = [];

  const sum =
    dateInWords.length +
    F +
    hourHand.length +
    minuteHand.length +
    secondHand.length +
    1;

  useEffect(() => {
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d')!;
    canvasRef.current = canvas;

    canvas.style.position = 'fixed';
    element.appendChild(canvas);
    canvas.width = width;
    canvas.height = height;

    context.font = '10px sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';

    for (let i = 0; i < sum; i++) {
      dy[i] = 0;
      dx[i] = 0;
      zy[i] = 0;
      zx[i] = 0;
    }

    dateInWords.forEach((value, i) => {
      tmpd[i] = { color: dateColor, value };
    });

    clockNumbers.forEach((value, i) => {
      tmpf[i] = { color: faceColor, value };
    });

    hourHand.forEach((value, i) => {
      tmph[i] = { color: hoursColor, value };
    });

    minuteHand.forEach((value, i) => {
      tmpm[i] = { color: minutesColor, value };
    });

    secondHand.forEach((value, i) => {
      tmps[i] = { color: secondsColor, value };
    });

    bindEvents();
    loop();

    return () => {
      destroy();
    };
  }, [element, width, height]);

  function bindEvents() {
    element.addEventListener('mousemove', onMouseMove);
    element.addEventListener('touchmove', onTouchMove, { passive: true });
    element.addEventListener('touchstart', onTouchMove, { passive: true });
    window.addEventListener('resize', onWindowResize);
  }

  function onWindowResize() {
    width = window.innerWidth;
    height = window.innerHeight;

    canvasRef.current!.width = width;
    canvasRef.current!.height = height;
  }

  function onTouchMove(e: TouchEvent) {
    if (e.touches.length > 0) {
      const boundingRect = containerRef?.current?.getBoundingClientRect() || { left: 0, top: 0 };
      cursor.current.x = e.touches[0].clientX - boundingRect.left;
      cursor.current.y = e.touches[0].clientY - boundingRect.top;
    }
  }

  function onMouseMove(e: MouseEvent) {
    const boundingRect = containerRef?.current?.getBoundingClientRect() || {
      left: 0,
      top: 0,
    };
    cursor.current.x = e.clientX - boundingRect.left;
    cursor.current.y = e.clientY - boundingRect.top;
  }

  function updatePositions() {
    const widthBuffer = 80;

    zy[0] = Math.round((dy[0] += (cursor.current.y - dy[0]) * del));
    zx[0] = Math.round((dx[0] += (cursor.current.x - dx[0]) * del));
    for (let i = 1; i < sum; i++) {
      zy[i] = Math.round((dy[i] += (zy[i - 1] - dy[i]) * del));
      zx[i] = Math.round((dx[i] += (zx[i - 1] - dx[i]) * del));
      if (dy[i - 1] >= height - 80) dy[i - 1] = height - 80;
      if (dx[i - 1] >= width - widthBuffer) dx[i - 1] = width - widthBuffer;
    }
  }

  function updateParticles() {
    const context = canvasRef.current!.getContext('2d')!;
    context.clearRect(0, 0, width, height);

    const time = new Date();
    const secs = time.getSeconds();
    const sec = (Math.PI * (secs - 15)) / 30;
    const mins = time.getMinutes();
    const min = (Math.PI * (mins - 15)) / 30;
    const hrs = time.getHours();
    const hr = (Math.PI * (hrs - 3)) / 6 + (Math.PI * mins) / 360;

    drawParticles(tmpd, eqd, sec, siz * 1.5);
    drawParticles(tmpf, eqf, 0, siz);
    drawHandParticles(tmph, hr);
    drawHandParticles(tmpm, min);
    drawHandParticles(tmps, sec);
  }

  function drawParticles(
    particles: Particle[],
    eq: number,
    angleOffset: number,
    size: number
  ) {
    const context = canvasRef.current!.getContext('2d')!;
    particles.forEach((particle, i) => {
      particle.y =
        dy[i] + size * Math.sin(-angleOffset + (i * eq * Math.PI) / 180);
      particle.x =
        dx[i] + size * Math.cos(-angleOffset + (i * eq * Math.PI) / 180);

      context.fillStyle = particle.color;
      context.fillText(particle.value, particle.x!, particle.y!);
    });
  }

  function drawHandParticles(particles: Particle[], angle: number) {
    const context = canvasRef.current!.getContext('2d')!;
    particles.forEach((particle, i) => {
      particle.y = dy[tmpd.length + F + i] + i * han * Math.sin(angle);
      particle.x = dx[tmpd.length + F + i] + i * han * Math.cos(angle);

      context.fillStyle = particle.color;
      context.fillText(particle.value, particle.x!, particle.y!);
    });
  }

  function loop() {
    updatePositions();
    updateParticles();
    animationFrameRef.current = requestAnimationFrame(loop);
  }

  function destroy() {
    if (canvasRef.current) {
      canvasRef.current.remove();
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    element.removeEventListener('mousemove', onMouseMove);
    element.removeEventListener('touchmove', onTouchMove);
    element.removeEventListener('touchstart', onTouchMove);
    window.removeEventListener('resize', onWindowResize);
  }

  return null;
};

export default ClockTrail;
