import styled from 'styled-components';
import { useRef } from 'react';
import SparkleTrail from './SparkleTrail';
import { ContainerProps, TrailProps } from './interfaces';
import ClockTrail from './ClockTrail';

export const TrailType = {
  sparkle: 'sparkle',
  clock: 'clock',
} as const;
export type TrailTypes = keyof typeof TrailType;
export const trailTypes = Object.keys(TrailType) as TrailTypes[];

const TrailContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

const PreviewContainer = styled.div`
  position: relative;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 9999;
`;

const Trail = (props: TrailProps & ContainerProps) => {
  const { usePreview = false, trailType } = props;

  const containerRef = useRef<HTMLDivElement>(null);

  const Container = usePreview ? PreviewContainer : TrailContainer;

  return (
    <Container ref={containerRef}>
      {TrailType.sparkle === trailType && (
        <SparkleTrail {...props} containerRef={containerRef} />
      )}
      {TrailType.clock === trailType && (
        <ClockTrail {...props} containerRef={containerRef} />
      )}
    </Container>
  );
};

export default Trail;
