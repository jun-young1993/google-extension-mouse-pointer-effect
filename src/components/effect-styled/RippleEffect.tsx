import { keyframes } from 'styled-components';

const RippleEffect = keyframes`
  from {
    transform: scale(0);
    opacity: 1;
  }
  to {
    transform: scale(5);
    opacity: 0;
  }
`;

export default RippleEffect;
