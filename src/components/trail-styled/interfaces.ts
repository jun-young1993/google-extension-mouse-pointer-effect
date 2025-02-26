import { TrailTypes } from './Trail';

export interface ContainerProps {
  trailType: TrailTypes;
}
export interface PreviewContainerProps {
  containerRef: React.RefObject<HTMLDivElement>;
}
export interface TrailProps {
  size?: string;
  color?: string;
  maxParticles?: number;
  usePreview?: boolean;
  effectType: string;
  useInfinity: boolean;
}

export type PreviewTrailProps = TrailProps & PreviewContainerProps;

export interface EffectSettings {
  effectType: string;
  useInfinity: boolean;
}
