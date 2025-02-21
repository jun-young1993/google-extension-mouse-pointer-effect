document.addEventListener(
  'click',
  function (e) {
    // Check if click target is not a ripple element
    if (!(e.target as HTMLElement).classList.contains('ripple')) {
      const ripple = document.createElement('div');
      ripple.classList.add('ripple');
      document.body.appendChild(ripple);

      ripple.style.left = `${e.clientX - 10}px`;
      ripple.style.top = `${e.clientY - 10}px`;

      // Use pointer-events: none to prevent ripple from blocking other clicks
      ripple.style.pointerEvents = 'none';

      setTimeout(() => {
        ripple.remove();
      }, 500);
    }
  },
  { capture: true }
); // Use capture phase to handle event before other listeners
