document.addEventListener('click', function (e) {
  const ripple = document.createElement('div');
  ripple.classList.add('ripple');
  document.body.appendChild(ripple);

  ripple.style.left = `${e.clientX - 10}px`;
  ripple.style.top = `${e.clientY - 10}px`;

  setTimeout(() => {
    ripple.remove();
  }, 500);
});
