import styled from 'styled-components';
import RippleEffect from './RippleEffect';
import PulseEffect from './PulseEffect';
import FadeEffect from './FadeEffect';
import BounceEffect from './BounceEffect';
import RotateEffect from './RotateEffect';

export const EffectType = {
  pulse: 'pulse',
  fade: 'fade',
  ripple: 'ripple',
  bounce: 'bounce',
  rotate: 'rotate',
} as const;

export type EffectTypes = keyof typeof EffectType;
export const effectTypes = Object.keys(EffectType) as EffectTypes[];

interface EffectProps {
  size: string;
  color: string;
  duration?: string;
  effectType: EffectTypes;
  useInfinity?: boolean;
  radius: string;
}

const Effect = styled.div<EffectProps>`
  width: ${(props) => props.size};
  height: ${(props) => props.size};
  background: ${(props) => props.color};
  border-radius: ${(props) => props.radius};
  animation: ${({ effectType }) => {
      switch (effectType) {
        case 'pulse':
          return PulseEffect;
        case 'fade':
          return FadeEffect;
        case 'ripple':
          return RippleEffect;
        case 'bounce':
          return BounceEffect;
        case 'rotate':
          return RotateEffect;
        default:
          return RippleEffect;
      }
    }}
    0.5s linear ${(props) => (props.useInfinity ? 'infinite' : '1')};
`;

export default Effect;
