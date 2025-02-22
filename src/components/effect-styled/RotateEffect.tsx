import { keyframes } from 'styled-components';

const rotateEffect = keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`;

export default rotateEffect;
